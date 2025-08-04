#version 300 es
layout (location=0) in vec2 a_position;
layout (location=1) in vec2 aTexCoord;
uniform mat4 transform;
out vec2 vTexCoord;
out vec2 scale;
void main() {
    vTexCoord = aTexCoord;
    gl_Position = transform * vec4(a_position, 0.0, 1.0);
    scale = vec2(transform[0][0], transform[1][1]);
}