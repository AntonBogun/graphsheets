
# 3x5 digit bitmaps (1 = on, 0 = off)
digits = {
    0: [[1,1,1], [1,0,1], [1,0,1], [1,0,1], [1,1,1]],
    1: [[0,1,0], [1,1,0], [0,1,0], [0,1,0], [1,1,1]],
    2: [[1,1,1], [0,0,1], [1,1,1], [1,0,0], [1,1,1]],
    3: [[1,1,1], [0,0,1], [1,1,1], [0,0,1], [1,1,1]],
    4: [[1,0,1], [1,0,1], [1,1,1], [0,0,1], [0,0,1]],
    5: [[1,1,1], [1,0,0], [1,1,1], [0,0,1], [1,1,1]],
    6: [[1,1,1], [1,0,0], [1,1,1], [1,0,1], [1,1,1]],
    7: [[1,1,1], [0,0,1], [0,1,0], [0,1,0], [0,1,0]],
    8: [[1,1,1], [1,0,1], [1,1,1], [1,0,1], [1,1,1]],
    9: [[1,1,1], [1,0,1], [1,1,1], [0,0,1], [1,1,1]]
}
def print_digit(d):
    """Print a digit's bitmap in a readable format."""
    for row in digits[d]:
        print(''.join(['#' if pixel else '.' for pixel in row]))
    print()
# print_digit(0)
[print_digit(d) for d in range(10)] and None

# Which pixels are on for each digit
pixel_usage = {}
for digit, bitmap in digits.items():
    pixels = []
    for row in range(5):
        for col in range(3):
            if bitmap[row][col]:
                pixels.append((row, col))
    pixel_usage[digit] = pixels

print("Pixel usage by digit:")
for digit, pixels in pixel_usage.items():
    print(f"{digit}: {pixels}")

# WebGL texture data (flattened array for each digit)
webgl_data = {}
for digit, bitmap in digits.items():
    flat = [pixel for row in bitmap for pixel in row]  # flatten to 1D
    webgl_data[digit] = flat

print("\nWebGL texture arrays:")
for digit, data in webgl_data.items():
    print(f"{digit}: {data}")


# Pack each digit into a single integer
packed_digits = {}
for digit, bitmap in digits.items():
    value = 0
    for row in range(5):
        for col in range(3):
            bit_pos = row * 3 + col
            if bitmap[row][col]:
                value |= (1 << bit_pos)
    packed_digits[digit] = value

print("Packed digits (as integers):")
for digit, packed in packed_digits.items():
    print(f"{digit}: {packed} (0b{packed:015b})")



# Verify unpacking works
print("\nVerification - unpacking digit 8:")
packed_8 = packed_digits[8]
print(f"Packed value: {packed_8}")
for row in range(5):
    for col in range(3):
        bit_pos = row * 3 + col
        bit = (packed_8 >> bit_pos) & 1
        print(bit, end=' ')
    print()


# 0: 31599 (0b111101101101111)
# 1: 29850 (0b111010010011010)
# 2: 29671 (0b111001111100111)
# 3: 31207 (0b111100111100111)
# 4: 18925 (0b100100111101101)
# 5: 31183 (0b111100111001111)
# 6: 31695 (0b111101111001111)
# 7: 9383 (0b010010010100111)
# 8: 31727 (0b111101111101111)
# 9: 31215 (0b111100111101111)
# 31599
# 29850
# 29671
# 31207
# 18925
# 31183
# 31695
# 9383
# 31727
# 31215


webgl_shader = f'''
// Ultra-compact WebGL shader function
float getDigitPixel(int digit, int x, int y) {{
    int patterns[10] = int[]({', '.join(str(v) for v in packed_digits.values())});
    int bitPos = y * 3 + x;
    return float((patterns[digit] >> bitPos) & 1);
}}

// Usage in fragment shader:
// float pixel = getDigitPixel(5, 1, 2); // get pixel at (1,2) of digit 5
'''

print(f"\n{webgl_shader}")