#version 300 es
precision highp float;
in vec2 vTexCoord;
uniform sampler2D sampler;
in float fisSelected;
out vec4 fragColor;
void main() {
    if(fisSelected>0.5){
        if(abs(vTexCoord.x - 0.5) < 0.4 && abs(vTexCoord.y - 0.5) < 0.4){
            fragColor = texture(sampler, vTexCoord);
        } else {
            fragColor = vec4(0,0.5,0.5,1.0);
        }
    } else {
        fragColor = texture(sampler, vTexCoord);
    }
}