#version 300 es
precision highp float;
in vec2 vTexCoord;
out vec4 fragColor;
void main() {
    if(!(abs(vTexCoord.x - 0.5) < 0.4 && abs(vTexCoord.y - 0.5) < 0.4)){
        fragColor = vec4(0,0.5,0.5,1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}