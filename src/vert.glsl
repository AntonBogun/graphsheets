#version 300 es
layout (location=0) in vec2 a_position;
layout (location=1) in vec2 aTexCoord;
uniform mat4 view;
uniform mat4 perspective;
out vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    gl_Position = perspective * view * vec4(a_position, 0.0, 1.0);
}