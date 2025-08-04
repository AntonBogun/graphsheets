#version 300 es
layout (location=0) in vec2 a_position;
layout (location=1) in vec2 aTexCoord;
uniform mat4 transform;
uniform float isSelected;
uniform float aspectRatio;
out float fisSelected;
out vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    if(isSelected > 0.5) {
        gl_Position = 1.1 * vec4(((a_position.x+1.0)*aspectRatio)-1.0, a_position.y, 0.0, 1.0);
    } else {
        gl_Position = vec4(((a_position.x+1.0)*aspectRatio)-1.0, a_position.y, 0.0, 1.0);
    }
    fisSelected = isSelected;
}