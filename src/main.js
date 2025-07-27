"use strict";
let openFile = function (filename) {
    return fetch(filename).then((result) => {
        return result.text().then((result) => {
            return result;
        });
    });
};
function crossProduct(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
function normalize(v) {
    const len = Math.hypot(v[0], v[1], v[2]);
    return len > 0 ? v.map(x => x / len) : [0, 0, 1];
}
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function lookAt(eye, target, up) {
    const zAxis = normalize([
        eye[0] - target[0],
        eye[1] - target[1],
        eye[2] - target[2]
    ]);
    const xAxis = normalize(crossProduct(up, zAxis));
    const yAxis = crossProduct(zAxis, xAxis);
    return new Float32Array([
        xAxis[0], yAxis[0], zAxis[0], 0,
        xAxis[1], yAxis[1], zAxis[1], 0,
        xAxis[2], yAxis[2], zAxis[2], 0,
        -dot(xAxis, eye), -dot(yAxis, eye), -dot(zAxis, eye), 1
    ]);
}
function perspective(fov, aspectRatio, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1 / (near - far);
    return [
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0,
    ];
}
let z_value = 1.0;
let last_position = { x: 0, y: 0 };
let position = { x: 0, y: 0 };
let initial_position = { x: 0, y: 0 };
let is_dragging = false;
document.onmousedown = (event) => {
    is_dragging = true;
    initial_position = { x: event.pageX, y: event.pageY };
};
document.onmousemove = (event) => {
    if (!is_dragging)
        return;
    position.x = last_position.x + (z_value * 2) * (event.pageX - initial_position.x) / window.innerHeight;
    position.y = last_position.y + (z_value * 2) * -(event.pageY - initial_position.y) / window.innerHeight;
};
document.onmouseup = (event) => {
    last_position.x += (z_value * 2) * (event.pageX - initial_position.x) / window.innerHeight;
    last_position.y += (z_value * 2) * -(event.pageY - initial_position.y) / window.innerHeight;
    is_dragging = false;
};
document.onkeydown = (event) => {
    if (event.key == "+") {
        z_value /= 2;
    }
    else if (event.key == "-") {
        z_value *= 2;
    }
};
window.onload = () => {
    Promise.all([openFile("src/vert.glsl"), openFile("src/frag.glsl")]).then(([vertexShaderSource, fragmentShaderSource]) => {
        const canvas = document.getElementById('glCanvas');
        const gl = canvas.getContext('webgl2');
        if (!gl)
            throw new Error('WebGL not supported');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        window.onresize = () => {
            requestAnimationFrame(redraw);
        };
        function redraw() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, window.innerWidth, window.innerHeight);
            let eye = [position.x, position.y, z_value];
            let target = [position.x, position.y, -1];
            let up = [0, 1, 0];
            let vMatrix = lookAt(eye, target, up);
            const viewLocation = gl.getUniformLocation(program, "view");
            gl.uniformMatrix4fv(viewLocation, false, vMatrix);
            let pMatrix = perspective(1.5 * Math.PI, window.innerWidth / window.innerHeight, 0.0, 1000000);
            const perspectiveLocation = gl.getUniformLocation(program, "perspective");
            gl.uniformMatrix4fv(perspectiveLocation, false, pMatrix);
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_INT, 0);
            requestAnimationFrame(redraw);
        }
        let program = gl.createProgram();
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(vertexShader));
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            console.log(gl.getShaderInfoLog(fragmentShader));
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        const vertices = new Float32Array([
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ]);
        const indices = new Uint32Array([
            0, 1, 3,
            3, 2, 4
        ]);
        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);
        const VBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const EBO = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        redraw();
    });
};
