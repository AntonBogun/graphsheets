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

using namespace emscripten;

//MARK: Structs
struct point {
    int x;
    int y;
    point(int x = 0, int y = 0) : x(x), y(y) {}
    point operator+(const point& other) const {
        return point(x + other.x, y + other.y);
    }
    point operator-(const point& other) const{
        return point(x - other.x, y - other.y);
    }

};
struct box {
    int x;
    int y;
    int width;
    int height;
    box(int x = 0, int y = 0, int width = 100, int height = 100) : x(x), y(y), width(width), height(height) {}
};
struct color {
    uint8_t r;
    uint8_t g;
    uint8_t b;
    uint8_t a;
    color(uint8_t r = 0, uint8_t g = 0, uint8_t b = 0, uint8_t a = 255) : r(r), g(g), b(b), a(a) {}
};

//MARK: Globals
int canvas_width = 0;
int canvas_height = 0;
int canvas_len=0;



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
void set_col(std::vector<color>&pixelData,int x, int y, color& col){
    int p = x + y * canvas_width;
    if(p >= 0 && p < canvas_len) {
        pixelData[p] = col;
    }
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

void drawLine(std::vector<color>& pixelData, color col, point x, point y) {
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

point rotatePoint(point p, point origin, double angle) {
    point op = p - origin;
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
    point origin = point(box.x + width/2, box.y + height/2);

    point x1 = rotatePoint(point(box.x, box.y), origin, angle);
    point x2 = rotatePoint(point(box.x + width, box.y), origin, angle);
    point x3 = rotatePoint(point(box.x + width, box.y + height), origin, angle);
    point x4 = rotatePoint(point(box.x, box.y + height), origin, angle);

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
        drawRotatedBox(pixel_data, color{0, 0, 0, 255}, box{(i*17)%canvas_width, 50 + (i*443)%canvas_height, 100, 100}, t/60.0);
        // drawRotatedBox(pixel_data, color{0, 0, 0, 255}, randBox(), i*t/60.0);
    }

    return val(typed_memory_view(pixel_data.size()*4, reinterpret_cast<uint8_t*>(pixel_data.data())));
}


EMSCRIPTEN_BINDINGS(my_module){
    // register_vector<uint8_t>("Uint8Array");
    function("setViewportData", &setViewportData);
    function("getPixelData", &getPixelData);
}