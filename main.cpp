//MARK: Includes
#include <iostream>
#include <vector>
#include <cstdint>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <cstdlib>
#include <math.h>
#include <cmath>

using u8 = uint8_t;

using namespace emscripten;

//MARK: Globals
int canvas_width = 0;
int canvas_height = 0;
int canvas_len=0;

//MARK: Structs
struct pointd;
struct pointi;

struct pointi {
    int x;
    int y;
    pointi(int x = 0, int y = 0) : x(x), y(y) {}
    pointi operator+(const pointi& other) const {
        return pointi(x + other.x, y + other.y);
    }
    pointi operator-(const pointi& other) const{
        return pointi(x - other.x, y - other.y);
    }
    pointd to_double() const;
};


struct pointd{
    double x,y;
    pointd(int x = 0, int y = 0) : x(x), y(y) {}
    pointd operator+(const pointd& other) const {
        return pointd(x + other.x, y + other.y);
    }
    pointd operator-(const pointd& other) const{
        return pointd(x - other.x, y - other.y);
    }
    pointi to_int() const;
};
pointd pointi::to_double() const {
    return pointd(double(x), double(y));
}
pointi pointd::to_int() const {
    return pointi(int(x), int(y));
}


struct box {
    int x;
    int y;
    int width;
    int height;
    box(int x = 0, int y = 0, int width = 100, int height = 100) : x(x), y(y), width(width), height(height) {}
};

struct color {
    u8 r;
    u8 g;
    u8 b;
    u8 a;
    color(u8 r = 0, u8 g = 0, u8 b = 0, u8 a = 255) : r(r), g(g), b(b), a(a) {}
};

//does a full circle between 0.0 and 1.0
color from_hue(double hue) {
    hue = fmod(hue, 1.0);
    if (hue < 0) hue += 1.0;
    int i = int(hue * 6);
    double f = hue * 6 - i;
    double p = 0.0;
    double q = 1.0 - f;
    double t = f;

    switch (i % 6) {
        case 0: return color(255, t * 255, p * 255);
        case 1: return color(q * 255, 255, p * 255);
        case 2: return color(p * 255, 255, t * 255);
        case 3: return color(p * 255, q * 255, 255);
        case 4: return color(t * 255, p * 255, 255);
        case 5: return color(255, p * 255, q * 255);
        default: return color(0, 0, 0);
    }
}

struct trans2d {
    double px,py, ax, ay, bx, by;
    trans2d(double px = 0, double py = 0, double ax = 1, double ay = 0, double bx = 0, double by = 1) 
        : px(px), py(py), ax(ax), ay(ay), bx(bx), by(by) {}
    static trans2d identity() {
        return trans2d(0, 0, 1, 0, 0, 1);
    }
    static trans2d rot(double angle) {
        double c = cos(angle);
        double s = sin(angle);
        return trans2d(0, 0, c, -s, s, c);
    }
    void set_origin(double x, double y) {
        px = x;
        py = y;
    }
    void set_origin(pointd p) {
        px = p.x;
        py = p.y;
    }
    void mul_scale(double sx, double sy) {
        ax *= sx;
        ay *= sy;
        bx *= sx;
        by *= sy;
    }
    pointi apply(pointi p) const {
        return pointi(px + ax * double(p.x) + bx * double(p.y), py + ay * double(p.x) + by * double(p.y));
    }
    pointd apply(pointd p) const {
        return pointd(px + ax * p.x + bx * p.y, py + ay * p.x + by * p.y);
    }
};

box randBox(){
    box b;
    b.x = rand() % canvas_width;
    b.y = rand() % canvas_height;
    b.width = rand() % (canvas_width - b.x) + 1;
    b.height = rand() % (canvas_height - b.y) + 1;
    return b;
}

void setViewportData(int _width, int _height) {
    canvas_width = _width;
    canvas_height = _height;
    canvas_len = canvas_width * canvas_height;
}

inline void set_col(std::vector<color>&pixelData,int x, int y, color& col){
    int p = x + y * canvas_width;
    if(p >= 0 && p < canvas_len) {
        pixelData[p] = col;
    }
}

inline void set_col(std::vector<color>&pixelData,pointi p, color& col){
    set_col(pixelData, p.x, p.y, col);
}


void drawLine(std::vector<color>& pixelData, color col, int xi, int yi, int xf, int yf) {
    if(abs(xf - xi) >= abs(yi - yf)){
        if(xi > xf) {
            std::swap(xi, xf);
            std::swap(yi, yf);
        }   
        if(xf - xi == 0){
            for(int cury = yi; cury < yf; cury++){
                set_col(pixelData, xi, cury, col);
            }
        }
        double slope = (double(yf)-double(yi))/(double(xf)-double(xi));
        for(int i = 0; xi + i < xf; i++){
            int curx = xi + i;
            int cury = yi + i*slope;
            set_col(pixelData, curx, cury, col);
        }

    }else{
        if(yi > yf) {
            std::swap(yi, yf);
            std::swap(xi, xf);
        }
        if(yf - yi == 0){
            for(int curx = xi; curx < xf; curx++){
                set_col(pixelData, curx, yi, col);
            }
        }
        double slope = (double(xf)-double(xi))/(double(yf)-double(yi));
        for(int i = 0; yi + i < yf; i++){
            int curx = xi + i*slope;
            int cury = yi + i;
            set_col(pixelData, curx, cury, col);
        }
    }
}

void drawLine(std::vector<color>& pixelData, color col, pointi x, pointi y) {
    int xi = x.x;
    int yi = x.y;
    int xf = y.x;
    int yf = y.y;
    drawLine(pixelData, col, xi, yi, xf, yf);
}

void drawBox(std::vector<color>& pixel_data, color col, box box){
    int width = box.width;
    int height = box.height;
    drawLine(pixel_data, col, box.x, box.y, box.x, box.y+height);
    drawLine(pixel_data, col, box.x, box.y, box.x+height, box.y);
    drawLine(pixel_data, col, box.x+width, box.y, box.x+width, box.y+height);
    drawLine(pixel_data, col, box.x, box.y+height, box.x+width, box.y+height);
}

void drawFilledBox(std::vector<color>& pixel_data, color col, box box){
    for(int y = box.y; y < box.y + box.height; y++) {
        for(int x = box.x; x < box.x + box.width; x++) {
            set_col(pixel_data, x, y, col);
        }
    }    
}

void drawFilledRotatedBox(std::vector<color>& pixel_data, color col, box box, double angle) {
    //rotate around center
    trans2d t = trans2d::rot(angle);
    pointd center = pointd(double(box.x) + double(box.width) / 2.0, box.y + double(box.height) / 2.0);
    t.set_origin(center);
    
    for(double y = box.y; y < box.y + box.height; y++) {
        for(double x = box.x; x < box.x + box.width; x++) {
            pointi p = t.apply(pointd(x, y)-center).to_int();
            set_col(pixel_data, p, col);
        }
    }
}

pointi rotatepointi(pointi p, pointi origin, double angle) {
    pointi op = p - origin;
    double x = op.x;
    double y = op.y;
    double c= cos(angle);
    double s = sin(angle);
    op.x = c*x - s*y;
    op.y = s*x + c*y;
    return origin+op;
}

void drawRotatedBox(std::vector<color>& pixel_data, color col, box box, double angle) {
    int width = box.width;
    int height = box.height;
    pointi origin = pointi(box.x + width/2, box.y + height/2);

    pointi x1 = rotatepointi(pointi(box.x, box.y), origin, angle);
    pointi x2 = rotatepointi(pointi(box.x + width, box.y), origin, angle);
    pointi x3 = rotatepointi(pointi(box.x + width, box.y + height), origin, angle);
    pointi x4 = rotatepointi(pointi(box.x, box.y + height), origin, angle);

    drawLine(pixel_data, col, x1, x2);
    drawLine(pixel_data, col, x2, x3);
    drawLine(pixel_data, col, x3, x4);
    drawLine(pixel_data, col, x4, x1);
}

double t = 0;
val getPixelData() {
    t++;
    std::vector<color> pixel_data(canvas_width*canvas_height, color{255, 255, 255, 255});
    for(int i = 0;i < t;i++){
        drawFilledRotatedBox(pixel_data,
            // color{
            //     u8((i*17)%255), u8((i*443)%255), u8((i*13)%255), 255},
            from_hue(((i*61)%17)/17.),
            box{(i*17)%canvas_width, 50 + (i*443)%canvas_height, 100, 100}, 0*double(i)*double(t)/60.0);
        // drawRotatedBox(pixel_data, color{0, 0, 0, 255}, randBox(), i*t/60.0);
    }

    return val(typed_memory_view(pixel_data.size()*4, reinterpret_cast<u8*>(pixel_data.data())));
}


EMSCRIPTEN_BINDINGS(my_module){
    // register_vector<u8>("Uint8Array");
    function("setViewportData", &setViewportData);
    function("getPixelData", &getPixelData);
}