#version 300 es
precision highp float;
in vec2 vTexCoord;
in vec2 scale;
uniform sampler2D sampler;
out vec4 fragColor;
vec3 contrast(vec3 rgb) {
    float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
    return luma > 0.5 ? vec3(0.0) : vec3(1.0);  // black or white
}
void main() {
    vec2 imgSize = vec2(textureSize(sampler, 0));
    vec2 imgPos = vTexCoord * imgSize;
    vec3 texRgb = texture(sampler, vTexCoord).xyz;
    // a=[255 if i%3==k else 0 for k in range(3)]
    // b=[255 if j%3==k else 0 for k in range(3)]
    // rgb[i, j] = [255*((i+j)%2) if a[k] + b[k]>255 else a[k] + b[k]  for k in range(3)]
    
    // vec3 rgb = vec3(0.0,0.0,0.0);
    // float i = floor(imgPos.x);
    // float j = floor(imgPos.y);
    // for (int k = 0; k < 3; ++k) {
    //     rgb[k] = float((int(int(i) % 3 == k) + int(int(j) % 3 == k))*255);
    //     if (rgb[k] > 255.0) {
    //         rgb[k] = 255.0*float((int(i) + int(j)) % 2);
    //     }
    // }
    // rgb /= 256.0;
    

    // vec3 rgb_XOR = vec3(int(rgb[0]*255.0) ^ int(texRgb[0]*255.0),
    //                     int(rgb[1]*255.0) ^ int(texRgb[1]*255.0),
    //                     int(rgb[2]*255.0) ^ int(texRgb[2]*255.0))/255.0;
    // fragColor = vec4(rgb_XOR, 1.0);
    if(scale.x<10.0){
        fragColor = vec4(texRgb, 1.0);
        return;
    }
    // rgb /= 255.0;
    // fragColor = vec4(0.0,0.0,0.0, 1.0);
    vec4 numCol = vec4(contrast(texRgb), 1.0);
    int numPosx = int(vTexCoord.x*imgSize*19.0)% 19;
    int numPosy = int(vTexCoord.y*imgSize*19.0)% 19;
    //check if dot
    if (numPosx==13 && (numPosy%6 == 5)){
        fragColor = numCol;
        return;
    }
    if (numPosx<12 || numPosx>14){
        if (numPosx>=14) numPosx-=2;//aligns digit 3 (4th)
        float num=0.0;
        //select the number
        if (numPosy < 6) {
            num = texRgb.x*255.0;
            // num = scale.x;
        } else if (numPosy < 12) {
            num = texRgb.y*255.0;
            // num = scale.y;
        } else {
            num = texRgb.z*255.0;
        }
        numPosy=numPosy%6;
        if (numPosy > 0){
            numPosy -=1;
            int digit = numPosx/4;//0-3
            numPosx = numPosx%4;
            if(numPosx > 0){
                numPosx -= 1;
                int lookupIdx= numPosx + numPosy*3;
                //extract the digit
                if(digit==0){
                    num/= 100.0;
                }else if(digit==1){
                    num/= 10.0;
                }else if(digit==2){
                    num/= 1.0;
                }else{
                    num/= 0.1;
                }
                int numint = int(num)%10;
                int bitmask = int[](31599, 29850, 29671, 31207, 18925, 31183, 31695, 9383, 31727, 31215)[numint];
                if((bitmask & (1 << lookupIdx)) != 0){
                    fragColor = numCol;
                    return;
                }
            }
        }
    }
    fragColor = vec4(texRgb, 1.0);//texcol
}