function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */

function translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}

var GL = /*#__PURE__*/function () {
  function GL(canvas) {
    _classCallCheck(this, GL);

    _defineProperty(this, "gl", null);

    this.canvas = canvas;
    this.gl = this.getGLContext();
    this.initShaders(this.getShaders());
  }

  _createClass(GL, [{
    key: "getGLContext",
    value: function getGLContext() {
      var canvas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.canvas;
      var gl = null;
      var glContextNames = ['webgl', 'experimental-webgl'];

      for (var i = 0; i < glContextNames.length; i++) {
        try {
          gl = canvas.getContext(glContextNames[i]);
        } catch (e) {}

        if (gl) {
          gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.viewport(0, 0, canvas.width, canvas.height);
          break;
        }
      }

      return gl;
    }
  }, {
    key: "getShaders",
    value: function getShaders() {
      return {
        vs_source: '',
        fs_source: ''
      };
    }
  }, {
    key: "initShaders",
    value: function initShaders(_ref) {
      var _ref$gl = _ref.gl,
          gl = _ref$gl === void 0 ? this.gl : _ref$gl,
          vs_source = _ref.vs_source,
          fs_source = _ref.fs_source;
      // compile shaders
      vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
      fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER); // create program

      var glProgram = this.glProgram = gl.createProgram(); // attach and link shaders to the program

      gl.attachShader(glProgram, vertexShader);
      gl.attachShader(glProgram, fragmentShader);
      gl.linkProgram(glProgram);

      if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program.');
      } // use program


      gl.useProgram(glProgram);
    }
  }, {
    key: "setupVertBuffer",
    value: function setupVertBuffer(vertex) {
      var gl = this.gl;
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
      var aVertexPosition = gl.getAttribLocation(glProgram, 'aPos');
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);
    }
  }]);

  return GL;
}();

function makeShader(gl, src, type) {
  // compile the vertex shader
  var shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
  }

  return shader;
}

var vertShader = "attribute vec3 aPos;attribute vec3 aColor;varying vec3 vColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;void main(void){gl_Position=uPMatrix*uMVMatrix*vec4(aPos,1);vColor=aColor;}";

var fragShader = "precision highp float;varying vec3 vColor;void main(void){gl_FragColor=vec4(vColor.rgb,1);}";

var Perspective = /*#__PURE__*/function (_GL) {
  _inherits(Perspective, _GL);

  var _super = _createSuper(Perspective);

  function Perspective(canvas) {
    _classCallCheck(this, Perspective);

    return _super.call(this, canvas);
  }

  _createClass(Perspective, [{
    key: "getShaders",
    value: function getShaders() {
      return {
        vs_source: vertShader,
        fs_source: fragShader
      };
    }
  }, {
    key: "setupBuffer",
    value: function setupBuffer() {
      var gl = this.gl;
      var glProgram = this.glProgram;
      var cubicVertex = [// front vertex
      -10, 0, 10, 10, 0, 10, 10, 20, 10, -10, 20, 10, // back vertex
      -10, 0, -10, 10, 0, -10, 10, 20, -10, -10, 20, -10];
      var vertexColor = [0.9, 0.5, 0.1, 0.4, 0.3, 0.1, 0.1, 0.3, 0.2, 0.4, 0.5, 0.7, 0.4, 0.9, 0.1, 0.2, 0.5, 0.5, 0.4, 0.6, 0.1, 0.4, 0.5, 0.8];
      var vertexIndex = this.vertexIndex = [// front face
      0, 1, 2, 0, 2, 3, // right face
      1, 5, 6, 1, 6, 2, // back face
      5, 4, 7, 5, 7, 6, // left face
      4, 0, 3, 4, 3, 7, // top face
      3, 2, 6, 3, 6, 7, // bottom face
      4, 5, 1, 4, 1, 0];
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubicVertex), gl.STATIC_DRAW);
      var indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndex), gl.STATIC_DRAW);
      var aVertexPosition = gl.getAttribLocation(glProgram, 'aPos');
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
      var aColorPosition = gl.getAttribLocation(glProgram, 'aColor');
      gl.vertexAttribPointer(aColorPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aColorPosition);
    }
  }, {
    key: "render",
    value: function render() {
      var glProgram = this.glProgram;
      var gl = this.gl;
      glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, 'uPMatrix');
      glProgram.mvMatrixUniform = gl.getUniformLocation(glProgram, 'uMVMatrix');
      var pMatrix = create();
      var mvMatrix = create();
      var _this$canvas = this.canvas,
          width = _this$canvas.width,
          height = _this$canvas.height;
      var widthHeightRatio = width / height;
      var fovy = 40;
      var near = 10;
      var far = 100;
      perspective(pMatrix, toRadian(fovy), widthHeightRatio, near, far);
      identity(mvMatrix);
      translate(mvMatrix, mvMatrix, [0, -5, -70]);
      rotate(mvMatrix, mvMatrix, toRadian(45), [0, 1, 0]);
      gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(glProgram.mvMatrixUniform, false, mvMatrix);
      this.setupBuffer();
      gl.drawElements(gl.TRIANGLES, this.vertexIndex.length, gl.UNSIGNED_SHORT, 0);
    }
  }]);

  return Perspective;
}(GL);

function toRadian(angle) {
  return angle * Math.PI / 180;
}

var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var layer = new Perspective(canvas);
layer.render();
