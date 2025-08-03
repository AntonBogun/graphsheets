#version 300 es
layout (location=0) in vec2 a_position;
layout (location=1) in vec2 aTexCoord;
uniform mat4 transform;
uniform float isSelected;
out float fisSelected;
out vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    if(isSelected > 0.5) {
        gl_Position = 1.1 * transform * vec4(a_position, 0.0, 1.0);
    } else {
        gl_Position = transform * vec4(a_position, 0.0, 1.0);
    }
    fisSelected = isSelected;
}