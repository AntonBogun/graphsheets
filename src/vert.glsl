#version 300 es
in vec2 a_position;
uniform mat4 view;
uniform mat4 perspective;
void main() {
    gl_Position = perspective * view * vec4(a_position, 0.0, 1.0);
}