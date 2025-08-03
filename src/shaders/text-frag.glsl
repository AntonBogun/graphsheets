#version 300 es
precision highp float;
in vec2 vTexCoord;
uniform sampler2D u_texture;
uniform vec3 u_color;
uniform float u_distanceRange;
uniform float u_fontWeight;
uniform float u_fontSmoothing;
out vec4 fragColor;

float median(vec3 v) {
    return max(min(v.x, v.y), min(max(v.x, v.y), v.z));
}

void main() {
    //"sample" is a reserved keyword
    // fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    // return;
    vec3 _sample = texture(u_texture, vTexCoord).rgb;
    float dist = u_distanceRange * (median(_sample) - 0.5) + (u_fontWeight - 1.0);
    float weight = min(1.0, 0.325 * u_distanceRange) * u_fontSmoothing;
    float alpha = smoothstep(-weight, +weight, dist);
    
    if (alpha < 0.015625) discard;
    fragColor = vec4(u_color, alpha);
}