#include <iostream>
#include <vector>
#include <cstdint>
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <cstdlib>

using namespace emscripten;

// emcc -lembind -o index.html main.cpp -O3 --shell-file html_template\shell_minimal.html
// python -m http.server    
int main(){
    std::cout << "test" << std::endl;
    return 0;
}

// extern "C" {

    // int int_sqrt(int x) {
    //     return sqrt(x);
    // }

val getPixelData() {
    std::vector<uint8_t> pixelData(256*256*4);
    for (int i = 0; i < 256*256; i++)
    {
        pixelData[4*i] = 255 * (rand() % 2);
        pixelData[4*i+1] = 255 * (rand() % 2);
        pixelData[4*i+2] = 255 * (rand() % 2);
        pixelData[4*i+3] = 255;
    }
    
    return val(typed_memory_view(pixelData.size(), pixelData.data()));
}

// }

EMSCRIPTEN_BINDINGS(my_module){
    // register_vector<uint8_t>("Uint8Array");

    function("getPixelData", &getPixelData);
}

