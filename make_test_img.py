import numpy as np
from PIL import Image

w, h = 256, 256
rgb = np.zeros((h, w, 3), dtype=np.uint8)
for i in range(h):
    for j in range(w):
        idx = i * w + j
        a=[255 if i%3==k else 0 for k in range(3)]
        b=[255 if j%3==k else 0 for k in range(3)]
        # print(a,b)
        # rgb[i,j] = [(idx // 1) % 256, (idx // 256) % 256, (idx // 65536) % 256]
        rgb[i, j] = [255*((i+j)%2) if a[k] + b[k]>255 else a[k] + b[k]  for k in range(3)]
Image.fromarray(rgb).save('test_img.png')