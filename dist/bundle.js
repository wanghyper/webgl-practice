var YUE = (function (exports) {
  'use strict';

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

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

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
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

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
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

  function getGLContext(canvas) {
    var gl = null;
    var glContextNames = ['webgl', 'experimental-webgl'];

    for (var i = 0; i < glContextNames.length; i++) {
      try {
        gl = canvas.getContext(glContextNames[i], {
          antialias: false
        });
      } catch (e) {
        console.error('get gl context failed', e);
      }

      if (gl) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);
        break;
      }
    }

    return gl;
  }
  function getProgram(gl, vs_source, fs_source) {
    // compile shaders
    var vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
    return createProgram(gl, vertexShader, fragmentShader);
  } // 创建着色器 参数：gl上下文，着色器内容，类型

  function createShader(gl, src, type) {
    // compile the vertex shader
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Error compiling shader: ' + gl.getShaderInfoLog(shader));
    }

    return shader;
  } // 创建着色器程序，链接着色器

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (success) {
      return program;
    }

    var errInfo = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(errInfo);
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
   * Generates a orthogonal projection matrix with the given bounds
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} left Left bound of the frustum
   * @param {number} right Right bound of the frustum
   * @param {number} bottom Bottom bound of the frustum
   * @param {number} top Top bound of the frustum
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum
   * @returns {mat4} out
   */

  function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }

  var BaseLayer = /*#__PURE__*/function () {
    function BaseLayer(options) {
      _classCallCheck(this, BaseLayer);

      _defineProperty(this, "setDataTimer", null);

      _defineProperty(this, "gl", null);

      _defineProperty(this, "opts", {});

      _defineProperty(this, "canvas", null);

      _defineProperty(this, "data", []);

      _defineProperty(this, "bufferData", []);

      this.opts = options || {};
    }

    _createClass(BaseLayer, [{
      key: "initialize",
      value: function initialize(canvas, gl) {
        this.canvas = canvas;
        this.gl = gl;
        this.glProgram = getProgram(gl, this.vertText, this.fragText);
        this.buffer = gl.createBuffer();
        var matrix = create();
        this.projectionMatrix = ortho(matrix, 0, this.canvas.clientWidth, this.canvas.clientHeight, 0, 100, -100);
        rotate(matrix, matrix, 20 / 180 * Math.PI, [0, 1, 0]);
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
      key: "update",
      value: function update() {
        var _this = this;

        window.cancelAnimationFrame(this.setDataTimer);
        this.setDataTimer = window.requestAnimationFrame(function () {
          _this.processData();

          _this.render();
        });
      }
    }, {
      key: "setData",
      value: function setData(data) {
        if (!Array.isArray(data)) {
          data = [data];
        }

        this.data = data;
        this.update();
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "setBuffersAndAttributes",
      value: function setBuffersAndAttributes() {
        var _this2 = this;

        var gl = this.gl;
        this.bufferData.forEach(function (item) {
          var buffer = item.buffer,
              attributes = item.attributes;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          attributes.forEach(function (item) {
            var name = item.name,
                _item$size = item.size,
                size = _item$size === void 0 ? 2 : _item$size,
                _item$type = item.type,
                type = _item$type === void 0 ? gl.FLOAT : _item$type,
                _item$normalize = item.normalize,
                normalize = _item$normalize === void 0 ? false : _item$normalize,
                _item$stride = item.stride,
                stride = _item$stride === void 0 ? 0 : _item$stride,
                _item$offset = item.offset,
                offset = _item$offset === void 0 ? 0 : _item$offset;
            var position = gl.getAttribLocation(_this2.glProgram, name);
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, size, type, normalize, stride, offset);
          });
        });
      }
    }, {
      key: "render",
      value: function render() {
        var gl = this.gl;
        gl.useProgram(this.glProgram);
        this.setBuffersAndAttributes();
        var matrixUniformLocation = gl.getUniformLocation(this.glProgram, 'u_matrix');
        gl.uniformMatrix4fv(matrixUniformLocation, false, this.projectionMatrix); // gl.clear(gl.COLOR_BUFFER_BIT);

        this.draw();
      }
    }]);

    return BaseLayer;
  }();

  var vertShader$2 = "attribute vec3 aPos;attribute float aSize;attribute vec4 aColor;attribute float aStyle;varying vec4 vColor;varying float vStyle;uniform mat4 u_matrix;void main(void){gl_Position=u_matrix*vec4(aPos,1.0);gl_PointSize=aSize;vStyle=aStyle;vColor=aColor;}";

  var fragShader$2 = "precision mediump float;varying vec4 vColor;varying float vStyle;void main(){if(vStyle!=1.0){if(distance(gl_PointCoord,vec2(0.5,0.5))>0.5){discard;}}gl_FragColor=vColor;}";

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var colorName$1 = {
  	"aliceblue": [240, 248, 255],
  	"antiquewhite": [250, 235, 215],
  	"aqua": [0, 255, 255],
  	"aquamarine": [127, 255, 212],
  	"azure": [240, 255, 255],
  	"beige": [245, 245, 220],
  	"bisque": [255, 228, 196],
  	"black": [0, 0, 0],
  	"blanchedalmond": [255, 235, 205],
  	"blue": [0, 0, 255],
  	"blueviolet": [138, 43, 226],
  	"brown": [165, 42, 42],
  	"burlywood": [222, 184, 135],
  	"cadetblue": [95, 158, 160],
  	"chartreuse": [127, 255, 0],
  	"chocolate": [210, 105, 30],
  	"coral": [255, 127, 80],
  	"cornflowerblue": [100, 149, 237],
  	"cornsilk": [255, 248, 220],
  	"crimson": [220, 20, 60],
  	"cyan": [0, 255, 255],
  	"darkblue": [0, 0, 139],
  	"darkcyan": [0, 139, 139],
  	"darkgoldenrod": [184, 134, 11],
  	"darkgray": [169, 169, 169],
  	"darkgreen": [0, 100, 0],
  	"darkgrey": [169, 169, 169],
  	"darkkhaki": [189, 183, 107],
  	"darkmagenta": [139, 0, 139],
  	"darkolivegreen": [85, 107, 47],
  	"darkorange": [255, 140, 0],
  	"darkorchid": [153, 50, 204],
  	"darkred": [139, 0, 0],
  	"darksalmon": [233, 150, 122],
  	"darkseagreen": [143, 188, 143],
  	"darkslateblue": [72, 61, 139],
  	"darkslategray": [47, 79, 79],
  	"darkslategrey": [47, 79, 79],
  	"darkturquoise": [0, 206, 209],
  	"darkviolet": [148, 0, 211],
  	"deeppink": [255, 20, 147],
  	"deepskyblue": [0, 191, 255],
  	"dimgray": [105, 105, 105],
  	"dimgrey": [105, 105, 105],
  	"dodgerblue": [30, 144, 255],
  	"firebrick": [178, 34, 34],
  	"floralwhite": [255, 250, 240],
  	"forestgreen": [34, 139, 34],
  	"fuchsia": [255, 0, 255],
  	"gainsboro": [220, 220, 220],
  	"ghostwhite": [248, 248, 255],
  	"gold": [255, 215, 0],
  	"goldenrod": [218, 165, 32],
  	"gray": [128, 128, 128],
  	"green": [0, 128, 0],
  	"greenyellow": [173, 255, 47],
  	"grey": [128, 128, 128],
  	"honeydew": [240, 255, 240],
  	"hotpink": [255, 105, 180],
  	"indianred": [205, 92, 92],
  	"indigo": [75, 0, 130],
  	"ivory": [255, 255, 240],
  	"khaki": [240, 230, 140],
  	"lavender": [230, 230, 250],
  	"lavenderblush": [255, 240, 245],
  	"lawngreen": [124, 252, 0],
  	"lemonchiffon": [255, 250, 205],
  	"lightblue": [173, 216, 230],
  	"lightcoral": [240, 128, 128],
  	"lightcyan": [224, 255, 255],
  	"lightgoldenrodyellow": [250, 250, 210],
  	"lightgray": [211, 211, 211],
  	"lightgreen": [144, 238, 144],
  	"lightgrey": [211, 211, 211],
  	"lightpink": [255, 182, 193],
  	"lightsalmon": [255, 160, 122],
  	"lightseagreen": [32, 178, 170],
  	"lightskyblue": [135, 206, 250],
  	"lightslategray": [119, 136, 153],
  	"lightslategrey": [119, 136, 153],
  	"lightsteelblue": [176, 196, 222],
  	"lightyellow": [255, 255, 224],
  	"lime": [0, 255, 0],
  	"limegreen": [50, 205, 50],
  	"linen": [250, 240, 230],
  	"magenta": [255, 0, 255],
  	"maroon": [128, 0, 0],
  	"mediumaquamarine": [102, 205, 170],
  	"mediumblue": [0, 0, 205],
  	"mediumorchid": [186, 85, 211],
  	"mediumpurple": [147, 112, 219],
  	"mediumseagreen": [60, 179, 113],
  	"mediumslateblue": [123, 104, 238],
  	"mediumspringgreen": [0, 250, 154],
  	"mediumturquoise": [72, 209, 204],
  	"mediumvioletred": [199, 21, 133],
  	"midnightblue": [25, 25, 112],
  	"mintcream": [245, 255, 250],
  	"mistyrose": [255, 228, 225],
  	"moccasin": [255, 228, 181],
  	"navajowhite": [255, 222, 173],
  	"navy": [0, 0, 128],
  	"oldlace": [253, 245, 230],
  	"olive": [128, 128, 0],
  	"olivedrab": [107, 142, 35],
  	"orange": [255, 165, 0],
  	"orangered": [255, 69, 0],
  	"orchid": [218, 112, 214],
  	"palegoldenrod": [238, 232, 170],
  	"palegreen": [152, 251, 152],
  	"paleturquoise": [175, 238, 238],
  	"palevioletred": [219, 112, 147],
  	"papayawhip": [255, 239, 213],
  	"peachpuff": [255, 218, 185],
  	"peru": [205, 133, 63],
  	"pink": [255, 192, 203],
  	"plum": [221, 160, 221],
  	"powderblue": [176, 224, 230],
  	"purple": [128, 0, 128],
  	"rebeccapurple": [102, 51, 153],
  	"red": [255, 0, 0],
  	"rosybrown": [188, 143, 143],
  	"royalblue": [65, 105, 225],
  	"saddlebrown": [139, 69, 19],
  	"salmon": [250, 128, 114],
  	"sandybrown": [244, 164, 96],
  	"seagreen": [46, 139, 87],
  	"seashell": [255, 245, 238],
  	"sienna": [160, 82, 45],
  	"silver": [192, 192, 192],
  	"skyblue": [135, 206, 235],
  	"slateblue": [106, 90, 205],
  	"slategray": [112, 128, 144],
  	"slategrey": [112, 128, 144],
  	"snow": [255, 250, 250],
  	"springgreen": [0, 255, 127],
  	"steelblue": [70, 130, 180],
  	"tan": [210, 180, 140],
  	"teal": [0, 128, 128],
  	"thistle": [216, 191, 216],
  	"tomato": [255, 99, 71],
  	"turquoise": [64, 224, 208],
  	"violet": [238, 130, 238],
  	"wheat": [245, 222, 179],
  	"white": [255, 255, 255],
  	"whitesmoke": [245, 245, 245],
  	"yellow": [255, 255, 0],
  	"yellowgreen": [154, 205, 50]
  };

  var isArrayish = function isArrayish(obj) {
  	if (!obj || typeof obj === 'string') {
  		return false;
  	}

  	return obj instanceof Array || Array.isArray(obj) ||
  		(obj.length >= 0 && (obj.splice instanceof Function ||
  			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
  };

  var simpleSwizzle = createCommonjsModule(function (module) {



  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  var swizzle = module.exports = function swizzle(args) {
  	var results = [];

  	for (var i = 0, len = args.length; i < len; i++) {
  		var arg = args[i];

  		if (isArrayish(arg)) {
  			// http://jsperf.com/javascript-array-concat-vs-push/98
  			results = concat.call(results, slice.call(arg));
  		} else {
  			results.push(arg);
  		}
  	}

  	return results;
  };

  swizzle.wrap = function (fn) {
  	return function () {
  		return fn(swizzle(arguments));
  	};
  };
  });

  var colorString = createCommonjsModule(function (module) {
  /* MIT license */


  var hasOwnProperty = Object.hasOwnProperty;

  var reverseNames = {};

  // create a list of reverse color names
  for (var name in colorName$1) {
  	if (hasOwnProperty.call(colorName$1, name)) {
  		reverseNames[colorName$1[name]] = name;
  	}
  }

  var cs = module.exports = {
  	to: {},
  	get: {}
  };

  cs.get = function (string) {
  	var prefix = string.substring(0, 3).toLowerCase();
  	var val;
  	var model;
  	switch (prefix) {
  		case 'hsl':
  			val = cs.get.hsl(string);
  			model = 'hsl';
  			break;
  		case 'hwb':
  			val = cs.get.hwb(string);
  			model = 'hwb';
  			break;
  		default:
  			val = cs.get.rgb(string);
  			model = 'rgb';
  			break;
  	}

  	if (!val) {
  		return null;
  	}

  	return {model: model, value: val};
  };

  cs.get.rgb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var abbr = /^#([a-f0-9]{3,4})$/i;
  	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
  	var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
  	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
  	var keyword = /^(\w+)$/;

  	var rgb = [0, 0, 0, 1];
  	var match;
  	var i;
  	var hexAlpha;

  	if (match = string.match(hex)) {
  		hexAlpha = match[2];
  		match = match[1];

  		for (i = 0; i < 3; i++) {
  			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
  			var i2 = i * 2;
  			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = parseInt(hexAlpha, 16) / 255;
  		}
  	} else if (match = string.match(abbr)) {
  		match = match[1];
  		hexAlpha = match[3];

  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i] + match[i], 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
  		}
  	} else if (match = string.match(rgba)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i + 1], 0);
  		}

  		if (match[4]) {
  			if (match[5]) {
  				rgb[3] = parseFloat(match[4]) * 0.01;
  			} else {
  				rgb[3] = parseFloat(match[4]);
  			}
  		}
  	} else if (match = string.match(per)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
  		}

  		if (match[4]) {
  			if (match[5]) {
  				rgb[3] = parseFloat(match[4]) * 0.01;
  			} else {
  				rgb[3] = parseFloat(match[4]);
  			}
  		}
  	} else if (match = string.match(keyword)) {
  		if (match[1] === 'transparent') {
  			return [0, 0, 0, 0];
  		}

  		if (!hasOwnProperty.call(colorName$1, match[1])) {
  			return null;
  		}

  		rgb = colorName$1[match[1]];
  		rgb[3] = 1;

  		return rgb;
  	} else {
  		return null;
  	}

  	for (i = 0; i < 3; i++) {
  		rgb[i] = clamp(rgb[i], 0, 255);
  	}
  	rgb[3] = clamp(rgb[3], 0, 1);

  	return rgb;
  };

  cs.get.hsl = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
  	var match = string.match(hsl);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
  		var s = clamp(parseFloat(match[2]), 0, 100);
  		var l = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

  		return [h, s, l, a];
  	}

  	return null;
  };

  cs.get.hwb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
  	var match = string.match(hwb);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
  		var w = clamp(parseFloat(match[2]), 0, 100);
  		var b = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
  		return [h, w, b, a];
  	}

  	return null;
  };

  cs.to.hex = function () {
  	var rgba = simpleSwizzle(arguments);

  	return (
  		'#' +
  		hexDouble(rgba[0]) +
  		hexDouble(rgba[1]) +
  		hexDouble(rgba[2]) +
  		(rgba[3] < 1
  			? (hexDouble(Math.round(rgba[3] * 255)))
  			: '')
  	);
  };

  cs.to.rgb = function () {
  	var rgba = simpleSwizzle(arguments);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
  		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
  };

  cs.to.rgb.percent = function () {
  	var rgba = simpleSwizzle(arguments);

  	var r = Math.round(rgba[0] / 255 * 100);
  	var g = Math.round(rgba[1] / 255 * 100);
  	var b = Math.round(rgba[2] / 255 * 100);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
  		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
  };

  cs.to.hsl = function () {
  	var hsla = simpleSwizzle(arguments);
  	return hsla.length < 4 || hsla[3] === 1
  		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
  		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
  };

  // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
  // (hwb have alpha optional & 1 is default value)
  cs.to.hwb = function () {
  	var hwba = simpleSwizzle(arguments);

  	var a = '';
  	if (hwba.length >= 4 && hwba[3] !== 1) {
  		a = ', ' + hwba[3];
  	}

  	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
  };

  cs.to.keyword = function (rgb) {
  	return reverseNames[rgb.slice(0, 3)];
  };

  // helpers
  function clamp(num, min, max) {
  	return Math.min(Math.max(min, num), max);
  }

  function hexDouble(num) {
  	var str = Math.round(num).toString(16).toUpperCase();
  	return (str.length < 2) ? '0' + str : str;
  }
  });
  colorString.to;
  colorString.get;

  var colorName = {
  	"aliceblue": [240, 248, 255],
  	"antiquewhite": [250, 235, 215],
  	"aqua": [0, 255, 255],
  	"aquamarine": [127, 255, 212],
  	"azure": [240, 255, 255],
  	"beige": [245, 245, 220],
  	"bisque": [255, 228, 196],
  	"black": [0, 0, 0],
  	"blanchedalmond": [255, 235, 205],
  	"blue": [0, 0, 255],
  	"blueviolet": [138, 43, 226],
  	"brown": [165, 42, 42],
  	"burlywood": [222, 184, 135],
  	"cadetblue": [95, 158, 160],
  	"chartreuse": [127, 255, 0],
  	"chocolate": [210, 105, 30],
  	"coral": [255, 127, 80],
  	"cornflowerblue": [100, 149, 237],
  	"cornsilk": [255, 248, 220],
  	"crimson": [220, 20, 60],
  	"cyan": [0, 255, 255],
  	"darkblue": [0, 0, 139],
  	"darkcyan": [0, 139, 139],
  	"darkgoldenrod": [184, 134, 11],
  	"darkgray": [169, 169, 169],
  	"darkgreen": [0, 100, 0],
  	"darkgrey": [169, 169, 169],
  	"darkkhaki": [189, 183, 107],
  	"darkmagenta": [139, 0, 139],
  	"darkolivegreen": [85, 107, 47],
  	"darkorange": [255, 140, 0],
  	"darkorchid": [153, 50, 204],
  	"darkred": [139, 0, 0],
  	"darksalmon": [233, 150, 122],
  	"darkseagreen": [143, 188, 143],
  	"darkslateblue": [72, 61, 139],
  	"darkslategray": [47, 79, 79],
  	"darkslategrey": [47, 79, 79],
  	"darkturquoise": [0, 206, 209],
  	"darkviolet": [148, 0, 211],
  	"deeppink": [255, 20, 147],
  	"deepskyblue": [0, 191, 255],
  	"dimgray": [105, 105, 105],
  	"dimgrey": [105, 105, 105],
  	"dodgerblue": [30, 144, 255],
  	"firebrick": [178, 34, 34],
  	"floralwhite": [255, 250, 240],
  	"forestgreen": [34, 139, 34],
  	"fuchsia": [255, 0, 255],
  	"gainsboro": [220, 220, 220],
  	"ghostwhite": [248, 248, 255],
  	"gold": [255, 215, 0],
  	"goldenrod": [218, 165, 32],
  	"gray": [128, 128, 128],
  	"green": [0, 128, 0],
  	"greenyellow": [173, 255, 47],
  	"grey": [128, 128, 128],
  	"honeydew": [240, 255, 240],
  	"hotpink": [255, 105, 180],
  	"indianred": [205, 92, 92],
  	"indigo": [75, 0, 130],
  	"ivory": [255, 255, 240],
  	"khaki": [240, 230, 140],
  	"lavender": [230, 230, 250],
  	"lavenderblush": [255, 240, 245],
  	"lawngreen": [124, 252, 0],
  	"lemonchiffon": [255, 250, 205],
  	"lightblue": [173, 216, 230],
  	"lightcoral": [240, 128, 128],
  	"lightcyan": [224, 255, 255],
  	"lightgoldenrodyellow": [250, 250, 210],
  	"lightgray": [211, 211, 211],
  	"lightgreen": [144, 238, 144],
  	"lightgrey": [211, 211, 211],
  	"lightpink": [255, 182, 193],
  	"lightsalmon": [255, 160, 122],
  	"lightseagreen": [32, 178, 170],
  	"lightskyblue": [135, 206, 250],
  	"lightslategray": [119, 136, 153],
  	"lightslategrey": [119, 136, 153],
  	"lightsteelblue": [176, 196, 222],
  	"lightyellow": [255, 255, 224],
  	"lime": [0, 255, 0],
  	"limegreen": [50, 205, 50],
  	"linen": [250, 240, 230],
  	"magenta": [255, 0, 255],
  	"maroon": [128, 0, 0],
  	"mediumaquamarine": [102, 205, 170],
  	"mediumblue": [0, 0, 205],
  	"mediumorchid": [186, 85, 211],
  	"mediumpurple": [147, 112, 219],
  	"mediumseagreen": [60, 179, 113],
  	"mediumslateblue": [123, 104, 238],
  	"mediumspringgreen": [0, 250, 154],
  	"mediumturquoise": [72, 209, 204],
  	"mediumvioletred": [199, 21, 133],
  	"midnightblue": [25, 25, 112],
  	"mintcream": [245, 255, 250],
  	"mistyrose": [255, 228, 225],
  	"moccasin": [255, 228, 181],
  	"navajowhite": [255, 222, 173],
  	"navy": [0, 0, 128],
  	"oldlace": [253, 245, 230],
  	"olive": [128, 128, 0],
  	"olivedrab": [107, 142, 35],
  	"orange": [255, 165, 0],
  	"orangered": [255, 69, 0],
  	"orchid": [218, 112, 214],
  	"palegoldenrod": [238, 232, 170],
  	"palegreen": [152, 251, 152],
  	"paleturquoise": [175, 238, 238],
  	"palevioletred": [219, 112, 147],
  	"papayawhip": [255, 239, 213],
  	"peachpuff": [255, 218, 185],
  	"peru": [205, 133, 63],
  	"pink": [255, 192, 203],
  	"plum": [221, 160, 221],
  	"powderblue": [176, 224, 230],
  	"purple": [128, 0, 128],
  	"rebeccapurple": [102, 51, 153],
  	"red": [255, 0, 0],
  	"rosybrown": [188, 143, 143],
  	"royalblue": [65, 105, 225],
  	"saddlebrown": [139, 69, 19],
  	"salmon": [250, 128, 114],
  	"sandybrown": [244, 164, 96],
  	"seagreen": [46, 139, 87],
  	"seashell": [255, 245, 238],
  	"sienna": [160, 82, 45],
  	"silver": [192, 192, 192],
  	"skyblue": [135, 206, 235],
  	"slateblue": [106, 90, 205],
  	"slategray": [112, 128, 144],
  	"slategrey": [112, 128, 144],
  	"snow": [255, 250, 250],
  	"springgreen": [0, 255, 127],
  	"steelblue": [70, 130, 180],
  	"tan": [210, 180, 140],
  	"teal": [0, 128, 128],
  	"thistle": [216, 191, 216],
  	"tomato": [255, 99, 71],
  	"turquoise": [64, 224, 208],
  	"violet": [238, 130, 238],
  	"wheat": [245, 222, 179],
  	"white": [255, 255, 255],
  	"whitesmoke": [245, 245, 245],
  	"yellow": [255, 255, 0],
  	"yellowgreen": [154, 205, 50]
  };

  /* MIT license */
  /* eslint-disable no-mixed-operators */


  // NOTE: conversions should only return primitive values (i.e. arrays, or
  //       values that give correct `typeof` results).
  //       do not use box values types (i.e. Number(), String(), etc.)

  const reverseKeywords = {};
  for (const key of Object.keys(colorName)) {
  	reverseKeywords[colorName[key]] = key;
  }

  const convert$1 = {
  	rgb: {channels: 3, labels: 'rgb'},
  	hsl: {channels: 3, labels: 'hsl'},
  	hsv: {channels: 3, labels: 'hsv'},
  	hwb: {channels: 3, labels: 'hwb'},
  	cmyk: {channels: 4, labels: 'cmyk'},
  	xyz: {channels: 3, labels: 'xyz'},
  	lab: {channels: 3, labels: 'lab'},
  	lch: {channels: 3, labels: 'lch'},
  	hex: {channels: 1, labels: ['hex']},
  	keyword: {channels: 1, labels: ['keyword']},
  	ansi16: {channels: 1, labels: ['ansi16']},
  	ansi256: {channels: 1, labels: ['ansi256']},
  	hcg: {channels: 3, labels: ['h', 'c', 'g']},
  	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
  	gray: {channels: 1, labels: ['gray']}
  };

  var conversions = convert$1;

  // Hide .channels and .labels properties
  for (const model of Object.keys(convert$1)) {
  	if (!('channels' in convert$1[model])) {
  		throw new Error('missing channels property: ' + model);
  	}

  	if (!('labels' in convert$1[model])) {
  		throw new Error('missing channel labels property: ' + model);
  	}

  	if (convert$1[model].labels.length !== convert$1[model].channels) {
  		throw new Error('channel and label counts mismatch: ' + model);
  	}

  	const {channels, labels} = convert$1[model];
  	delete convert$1[model].channels;
  	delete convert$1[model].labels;
  	Object.defineProperty(convert$1[model], 'channels', {value: channels});
  	Object.defineProperty(convert$1[model], 'labels', {value: labels});
  }

  convert$1.rgb.hsl = function (rgb) {
  	const r = rgb[0] / 255;
  	const g = rgb[1] / 255;
  	const b = rgb[2] / 255;
  	const min = Math.min(r, g, b);
  	const max = Math.max(r, g, b);
  	const delta = max - min;
  	let h;
  	let s;

  	if (max === min) {
  		h = 0;
  	} else if (r === max) {
  		h = (g - b) / delta;
  	} else if (g === max) {
  		h = 2 + (b - r) / delta;
  	} else if (b === max) {
  		h = 4 + (r - g) / delta;
  	}

  	h = Math.min(h * 60, 360);

  	if (h < 0) {
  		h += 360;
  	}

  	const l = (min + max) / 2;

  	if (max === min) {
  		s = 0;
  	} else if (l <= 0.5) {
  		s = delta / (max + min);
  	} else {
  		s = delta / (2 - max - min);
  	}

  	return [h, s * 100, l * 100];
  };

  convert$1.rgb.hsv = function (rgb) {
  	let rdif;
  	let gdif;
  	let bdif;
  	let h;
  	let s;

  	const r = rgb[0] / 255;
  	const g = rgb[1] / 255;
  	const b = rgb[2] / 255;
  	const v = Math.max(r, g, b);
  	const diff = v - Math.min(r, g, b);
  	const diffc = function (c) {
  		return (v - c) / 6 / diff + 1 / 2;
  	};

  	if (diff === 0) {
  		h = 0;
  		s = 0;
  	} else {
  		s = diff / v;
  		rdif = diffc(r);
  		gdif = diffc(g);
  		bdif = diffc(b);

  		if (r === v) {
  			h = bdif - gdif;
  		} else if (g === v) {
  			h = (1 / 3) + rdif - bdif;
  		} else if (b === v) {
  			h = (2 / 3) + gdif - rdif;
  		}

  		if (h < 0) {
  			h += 1;
  		} else if (h > 1) {
  			h -= 1;
  		}
  	}

  	return [
  		h * 360,
  		s * 100,
  		v * 100
  	];
  };

  convert$1.rgb.hwb = function (rgb) {
  	const r = rgb[0];
  	const g = rgb[1];
  	let b = rgb[2];
  	const h = convert$1.rgb.hsl(rgb)[0];
  	const w = 1 / 255 * Math.min(r, Math.min(g, b));

  	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

  	return [h, w * 100, b * 100];
  };

  convert$1.rgb.cmyk = function (rgb) {
  	const r = rgb[0] / 255;
  	const g = rgb[1] / 255;
  	const b = rgb[2] / 255;

  	const k = Math.min(1 - r, 1 - g, 1 - b);
  	const c = (1 - r - k) / (1 - k) || 0;
  	const m = (1 - g - k) / (1 - k) || 0;
  	const y = (1 - b - k) / (1 - k) || 0;

  	return [c * 100, m * 100, y * 100, k * 100];
  };

  function comparativeDistance(x, y) {
  	/*
  		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
  	*/
  	return (
  		((x[0] - y[0]) ** 2) +
  		((x[1] - y[1]) ** 2) +
  		((x[2] - y[2]) ** 2)
  	);
  }

  convert$1.rgb.keyword = function (rgb) {
  	const reversed = reverseKeywords[rgb];
  	if (reversed) {
  		return reversed;
  	}

  	let currentClosestDistance = Infinity;
  	let currentClosestKeyword;

  	for (const keyword of Object.keys(colorName)) {
  		const value = colorName[keyword];

  		// Compute comparative distance
  		const distance = comparativeDistance(rgb, value);

  		// Check if its less, if so set as closest
  		if (distance < currentClosestDistance) {
  			currentClosestDistance = distance;
  			currentClosestKeyword = keyword;
  		}
  	}

  	return currentClosestKeyword;
  };

  convert$1.keyword.rgb = function (keyword) {
  	return colorName[keyword];
  };

  convert$1.rgb.xyz = function (rgb) {
  	let r = rgb[0] / 255;
  	let g = rgb[1] / 255;
  	let b = rgb[2] / 255;

  	// Assume sRGB
  	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
  	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
  	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

  	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  	return [x * 100, y * 100, z * 100];
  };

  convert$1.rgb.lab = function (rgb) {
  	const xyz = convert$1.rgb.xyz(rgb);
  	let x = xyz[0];
  	let y = xyz[1];
  	let z = xyz[2];

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

  	const l = (116 * y) - 16;
  	const a = 500 * (x - y);
  	const b = 200 * (y - z);

  	return [l, a, b];
  };

  convert$1.hsl.rgb = function (hsl) {
  	const h = hsl[0] / 360;
  	const s = hsl[1] / 100;
  	const l = hsl[2] / 100;
  	let t2;
  	let t3;
  	let val;

  	if (s === 0) {
  		val = l * 255;
  		return [val, val, val];
  	}

  	if (l < 0.5) {
  		t2 = l * (1 + s);
  	} else {
  		t2 = l + s - l * s;
  	}

  	const t1 = 2 * l - t2;

  	const rgb = [0, 0, 0];
  	for (let i = 0; i < 3; i++) {
  		t3 = h + 1 / 3 * -(i - 1);
  		if (t3 < 0) {
  			t3++;
  		}

  		if (t3 > 1) {
  			t3--;
  		}

  		if (6 * t3 < 1) {
  			val = t1 + (t2 - t1) * 6 * t3;
  		} else if (2 * t3 < 1) {
  			val = t2;
  		} else if (3 * t3 < 2) {
  			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
  		} else {
  			val = t1;
  		}

  		rgb[i] = val * 255;
  	}

  	return rgb;
  };

  convert$1.hsl.hsv = function (hsl) {
  	const h = hsl[0];
  	let s = hsl[1] / 100;
  	let l = hsl[2] / 100;
  	let smin = s;
  	const lmin = Math.max(l, 0.01);

  	l *= 2;
  	s *= (l <= 1) ? l : 2 - l;
  	smin *= lmin <= 1 ? lmin : 2 - lmin;
  	const v = (l + s) / 2;
  	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  	return [h, sv * 100, v * 100];
  };

  convert$1.hsv.rgb = function (hsv) {
  	const h = hsv[0] / 60;
  	const s = hsv[1] / 100;
  	let v = hsv[2] / 100;
  	const hi = Math.floor(h) % 6;

  	const f = h - Math.floor(h);
  	const p = 255 * v * (1 - s);
  	const q = 255 * v * (1 - (s * f));
  	const t = 255 * v * (1 - (s * (1 - f)));
  	v *= 255;

  	switch (hi) {
  		case 0:
  			return [v, t, p];
  		case 1:
  			return [q, v, p];
  		case 2:
  			return [p, v, t];
  		case 3:
  			return [p, q, v];
  		case 4:
  			return [t, p, v];
  		case 5:
  			return [v, p, q];
  	}
  };

  convert$1.hsv.hsl = function (hsv) {
  	const h = hsv[0];
  	const s = hsv[1] / 100;
  	const v = hsv[2] / 100;
  	const vmin = Math.max(v, 0.01);
  	let sl;
  	let l;

  	l = (2 - s) * v;
  	const lmin = (2 - s) * vmin;
  	sl = s * vmin;
  	sl /= (lmin <= 1) ? lmin : 2 - lmin;
  	sl = sl || 0;
  	l /= 2;

  	return [h, sl * 100, l * 100];
  };

  // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
  convert$1.hwb.rgb = function (hwb) {
  	const h = hwb[0] / 360;
  	let wh = hwb[1] / 100;
  	let bl = hwb[2] / 100;
  	const ratio = wh + bl;
  	let f;

  	// Wh + bl cant be > 1
  	if (ratio > 1) {
  		wh /= ratio;
  		bl /= ratio;
  	}

  	const i = Math.floor(6 * h);
  	const v = 1 - bl;
  	f = 6 * h - i;

  	if ((i & 0x01) !== 0) {
  		f = 1 - f;
  	}

  	const n = wh + f * (v - wh); // Linear interpolation

  	let r;
  	let g;
  	let b;
  	/* eslint-disable max-statements-per-line,no-multi-spaces */
  	switch (i) {
  		default:
  		case 6:
  		case 0: r = v;  g = n;  b = wh; break;
  		case 1: r = n;  g = v;  b = wh; break;
  		case 2: r = wh; g = v;  b = n; break;
  		case 3: r = wh; g = n;  b = v; break;
  		case 4: r = n;  g = wh; b = v; break;
  		case 5: r = v;  g = wh; b = n; break;
  	}
  	/* eslint-enable max-statements-per-line,no-multi-spaces */

  	return [r * 255, g * 255, b * 255];
  };

  convert$1.cmyk.rgb = function (cmyk) {
  	const c = cmyk[0] / 100;
  	const m = cmyk[1] / 100;
  	const y = cmyk[2] / 100;
  	const k = cmyk[3] / 100;

  	const r = 1 - Math.min(1, c * (1 - k) + k);
  	const g = 1 - Math.min(1, m * (1 - k) + k);
  	const b = 1 - Math.min(1, y * (1 - k) + k);

  	return [r * 255, g * 255, b * 255];
  };

  convert$1.xyz.rgb = function (xyz) {
  	const x = xyz[0] / 100;
  	const y = xyz[1] / 100;
  	const z = xyz[2] / 100;
  	let r;
  	let g;
  	let b;

  	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  	// Assume sRGB
  	r = r > 0.0031308
  		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
  		: r * 12.92;

  	g = g > 0.0031308
  		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
  		: g * 12.92;

  	b = b > 0.0031308
  		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
  		: b * 12.92;

  	r = Math.min(Math.max(0, r), 1);
  	g = Math.min(Math.max(0, g), 1);
  	b = Math.min(Math.max(0, b), 1);

  	return [r * 255, g * 255, b * 255];
  };

  convert$1.xyz.lab = function (xyz) {
  	let x = xyz[0];
  	let y = xyz[1];
  	let z = xyz[2];

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

  	const l = (116 * y) - 16;
  	const a = 500 * (x - y);
  	const b = 200 * (y - z);

  	return [l, a, b];
  };

  convert$1.lab.xyz = function (lab) {
  	const l = lab[0];
  	const a = lab[1];
  	const b = lab[2];
  	let x;
  	let y;
  	let z;

  	y = (l + 16) / 116;
  	x = a / 500 + y;
  	z = y - b / 200;

  	const y2 = y ** 3;
  	const x2 = x ** 3;
  	const z2 = z ** 3;
  	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

  	x *= 95.047;
  	y *= 100;
  	z *= 108.883;

  	return [x, y, z];
  };

  convert$1.lab.lch = function (lab) {
  	const l = lab[0];
  	const a = lab[1];
  	const b = lab[2];
  	let h;

  	const hr = Math.atan2(b, a);
  	h = hr * 360 / 2 / Math.PI;

  	if (h < 0) {
  		h += 360;
  	}

  	const c = Math.sqrt(a * a + b * b);

  	return [l, c, h];
  };

  convert$1.lch.lab = function (lch) {
  	const l = lch[0];
  	const c = lch[1];
  	const h = lch[2];

  	const hr = h / 360 * 2 * Math.PI;
  	const a = c * Math.cos(hr);
  	const b = c * Math.sin(hr);

  	return [l, a, b];
  };

  convert$1.rgb.ansi16 = function (args, saturation = null) {
  	const [r, g, b] = args;
  	let value = saturation === null ? convert$1.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

  	value = Math.round(value / 50);

  	if (value === 0) {
  		return 30;
  	}

  	let ansi = 30
  		+ ((Math.round(b / 255) << 2)
  		| (Math.round(g / 255) << 1)
  		| Math.round(r / 255));

  	if (value === 2) {
  		ansi += 60;
  	}

  	return ansi;
  };

  convert$1.hsv.ansi16 = function (args) {
  	// Optimization here; we already know the value and don't need to get
  	// it converted for us.
  	return convert$1.rgb.ansi16(convert$1.hsv.rgb(args), args[2]);
  };

  convert$1.rgb.ansi256 = function (args) {
  	const r = args[0];
  	const g = args[1];
  	const b = args[2];

  	// We use the extended greyscale palette here, with the exception of
  	// black and white. normal palette only has 4 greyscale shades.
  	if (r === g && g === b) {
  		if (r < 8) {
  			return 16;
  		}

  		if (r > 248) {
  			return 231;
  		}

  		return Math.round(((r - 8) / 247) * 24) + 232;
  	}

  	const ansi = 16
  		+ (36 * Math.round(r / 255 * 5))
  		+ (6 * Math.round(g / 255 * 5))
  		+ Math.round(b / 255 * 5);

  	return ansi;
  };

  convert$1.ansi16.rgb = function (args) {
  	let color = args % 10;

  	// Handle greyscale
  	if (color === 0 || color === 7) {
  		if (args > 50) {
  			color += 3.5;
  		}

  		color = color / 10.5 * 255;

  		return [color, color, color];
  	}

  	const mult = (~~(args > 50) + 1) * 0.5;
  	const r = ((color & 1) * mult) * 255;
  	const g = (((color >> 1) & 1) * mult) * 255;
  	const b = (((color >> 2) & 1) * mult) * 255;

  	return [r, g, b];
  };

  convert$1.ansi256.rgb = function (args) {
  	// Handle greyscale
  	if (args >= 232) {
  		const c = (args - 232) * 10 + 8;
  		return [c, c, c];
  	}

  	args -= 16;

  	let rem;
  	const r = Math.floor(args / 36) / 5 * 255;
  	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  	const b = (rem % 6) / 5 * 255;

  	return [r, g, b];
  };

  convert$1.rgb.hex = function (args) {
  	const integer = ((Math.round(args[0]) & 0xFF) << 16)
  		+ ((Math.round(args[1]) & 0xFF) << 8)
  		+ (Math.round(args[2]) & 0xFF);

  	const string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert$1.hex.rgb = function (args) {
  	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  	if (!match) {
  		return [0, 0, 0];
  	}

  	let colorString = match[0];

  	if (match[0].length === 3) {
  		colorString = colorString.split('').map(char => {
  			return char + char;
  		}).join('');
  	}

  	const integer = parseInt(colorString, 16);
  	const r = (integer >> 16) & 0xFF;
  	const g = (integer >> 8) & 0xFF;
  	const b = integer & 0xFF;

  	return [r, g, b];
  };

  convert$1.rgb.hcg = function (rgb) {
  	const r = rgb[0] / 255;
  	const g = rgb[1] / 255;
  	const b = rgb[2] / 255;
  	const max = Math.max(Math.max(r, g), b);
  	const min = Math.min(Math.min(r, g), b);
  	const chroma = (max - min);
  	let grayscale;
  	let hue;

  	if (chroma < 1) {
  		grayscale = min / (1 - chroma);
  	} else {
  		grayscale = 0;
  	}

  	if (chroma <= 0) {
  		hue = 0;
  	} else
  	if (max === r) {
  		hue = ((g - b) / chroma) % 6;
  	} else
  	if (max === g) {
  		hue = 2 + (b - r) / chroma;
  	} else {
  		hue = 4 + (r - g) / chroma;
  	}

  	hue /= 6;
  	hue %= 1;

  	return [hue * 360, chroma * 100, grayscale * 100];
  };

  convert$1.hsl.hcg = function (hsl) {
  	const s = hsl[1] / 100;
  	const l = hsl[2] / 100;

  	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

  	let f = 0;
  	if (c < 1.0) {
  		f = (l - 0.5 * c) / (1.0 - c);
  	}

  	return [hsl[0], c * 100, f * 100];
  };

  convert$1.hsv.hcg = function (hsv) {
  	const s = hsv[1] / 100;
  	const v = hsv[2] / 100;

  	const c = s * v;
  	let f = 0;

  	if (c < 1.0) {
  		f = (v - c) / (1 - c);
  	}

  	return [hsv[0], c * 100, f * 100];
  };

  convert$1.hcg.rgb = function (hcg) {
  	const h = hcg[0] / 360;
  	const c = hcg[1] / 100;
  	const g = hcg[2] / 100;

  	if (c === 0.0) {
  		return [g * 255, g * 255, g * 255];
  	}

  	const pure = [0, 0, 0];
  	const hi = (h % 1) * 6;
  	const v = hi % 1;
  	const w = 1 - v;
  	let mg = 0;

  	/* eslint-disable max-statements-per-line */
  	switch (Math.floor(hi)) {
  		case 0:
  			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
  		case 1:
  			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
  		case 2:
  			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
  		case 3:
  			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
  		case 4:
  			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
  		default:
  			pure[0] = 1; pure[1] = 0; pure[2] = w;
  	}
  	/* eslint-enable max-statements-per-line */

  	mg = (1.0 - c) * g;

  	return [
  		(c * pure[0] + mg) * 255,
  		(c * pure[1] + mg) * 255,
  		(c * pure[2] + mg) * 255
  	];
  };

  convert$1.hcg.hsv = function (hcg) {
  	const c = hcg[1] / 100;
  	const g = hcg[2] / 100;

  	const v = c + g * (1.0 - c);
  	let f = 0;

  	if (v > 0.0) {
  		f = c / v;
  	}

  	return [hcg[0], f * 100, v * 100];
  };

  convert$1.hcg.hsl = function (hcg) {
  	const c = hcg[1] / 100;
  	const g = hcg[2] / 100;

  	const l = g * (1.0 - c) + 0.5 * c;
  	let s = 0;

  	if (l > 0.0 && l < 0.5) {
  		s = c / (2 * l);
  	} else
  	if (l >= 0.5 && l < 1.0) {
  		s = c / (2 * (1 - l));
  	}

  	return [hcg[0], s * 100, l * 100];
  };

  convert$1.hcg.hwb = function (hcg) {
  	const c = hcg[1] / 100;
  	const g = hcg[2] / 100;
  	const v = c + g * (1.0 - c);
  	return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };

  convert$1.hwb.hcg = function (hwb) {
  	const w = hwb[1] / 100;
  	const b = hwb[2] / 100;
  	const v = 1 - b;
  	const c = v - w;
  	let g = 0;

  	if (c < 1) {
  		g = (v - c) / (1 - c);
  	}

  	return [hwb[0], c * 100, g * 100];
  };

  convert$1.apple.rgb = function (apple) {
  	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
  };

  convert$1.rgb.apple = function (rgb) {
  	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
  };

  convert$1.gray.rgb = function (args) {
  	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };

  convert$1.gray.hsl = function (args) {
  	return [0, 0, args[0]];
  };

  convert$1.gray.hsv = convert$1.gray.hsl;

  convert$1.gray.hwb = function (gray) {
  	return [0, 100, gray[0]];
  };

  convert$1.gray.cmyk = function (gray) {
  	return [0, 0, 0, gray[0]];
  };

  convert$1.gray.lab = function (gray) {
  	return [gray[0], 0, 0];
  };

  convert$1.gray.hex = function (gray) {
  	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
  	const integer = (val << 16) + (val << 8) + val;

  	const string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert$1.rgb.gray = function (rgb) {
  	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  	return [val / 255 * 100];
  };

  /*
  	This function routes a model to all other models.

  	all functions that are routed have a property `.conversion` attached
  	to the returned synthetic function. This property is an array
  	of strings, each with the steps in between the 'from' and 'to'
  	color models (inclusive).

  	conversions that are not possible simply are not included.
  */

  function buildGraph() {
  	const graph = {};
  	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
  	const models = Object.keys(conversions);

  	for (let len = models.length, i = 0; i < len; i++) {
  		graph[models[i]] = {
  			// http://jsperf.com/1-vs-infinity
  			// micro-opt, but this is simple.
  			distance: -1,
  			parent: null
  		};
  	}

  	return graph;
  }

  // https://en.wikipedia.org/wiki/Breadth-first_search
  function deriveBFS(fromModel) {
  	const graph = buildGraph();
  	const queue = [fromModel]; // Unshift -> queue -> pop

  	graph[fromModel].distance = 0;

  	while (queue.length) {
  		const current = queue.pop();
  		const adjacents = Object.keys(conversions[current]);

  		for (let len = adjacents.length, i = 0; i < len; i++) {
  			const adjacent = adjacents[i];
  			const node = graph[adjacent];

  			if (node.distance === -1) {
  				node.distance = graph[current].distance + 1;
  				node.parent = current;
  				queue.unshift(adjacent);
  			}
  		}
  	}

  	return graph;
  }

  function link(from, to) {
  	return function (args) {
  		return to(from(args));
  	};
  }

  function wrapConversion(toModel, graph) {
  	const path = [graph[toModel].parent, toModel];
  	let fn = conversions[graph[toModel].parent][toModel];

  	let cur = graph[toModel].parent;
  	while (graph[cur].parent) {
  		path.unshift(graph[cur].parent);
  		fn = link(conversions[graph[cur].parent][cur], fn);
  		cur = graph[cur].parent;
  	}

  	fn.conversion = path;
  	return fn;
  }

  var route = function (fromModel) {
  	const graph = deriveBFS(fromModel);
  	const conversion = {};

  	const models = Object.keys(graph);
  	for (let len = models.length, i = 0; i < len; i++) {
  		const toModel = models[i];
  		const node = graph[toModel];

  		if (node.parent === null) {
  			// No possible conversion, or this node is the source model.
  			continue;
  		}

  		conversion[toModel] = wrapConversion(toModel, graph);
  	}

  	return conversion;
  };

  const convert = {};

  const models = Object.keys(conversions);

  function wrapRaw(fn) {
  	const wrappedFn = function (...args) {
  		const arg0 = args[0];
  		if (arg0 === undefined || arg0 === null) {
  			return arg0;
  		}

  		if (arg0.length > 1) {
  			args = arg0;
  		}

  		return fn(args);
  	};

  	// Preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  function wrapRounded(fn) {
  	const wrappedFn = function (...args) {
  		const arg0 = args[0];

  		if (arg0 === undefined || arg0 === null) {
  			return arg0;
  		}

  		if (arg0.length > 1) {
  			args = arg0;
  		}

  		const result = fn(args);

  		// We're assuming the result is an array here.
  		// see notice in conversions.js; don't use box types
  		// in conversion functions.
  		if (typeof result === 'object') {
  			for (let len = result.length, i = 0; i < len; i++) {
  				result[i] = Math.round(result[i]);
  			}
  		}

  		return result;
  	};

  	// Preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  models.forEach(fromModel => {
  	convert[fromModel] = {};

  	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
  	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

  	const routes = route(fromModel);
  	const routeModels = Object.keys(routes);

  	routeModels.forEach(toModel => {
  		const fn = routes[toModel];

  		convert[fromModel][toModel] = wrapRounded(fn);
  		convert[fromModel][toModel].raw = wrapRaw(fn);
  	});
  });

  var colorConvert = convert;

  const _slice = [].slice;

  const skippedModels = [
  	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
  	'keyword',

  	// Gray conflicts with some method names, and has its own method defined.
  	'gray',

  	// Shouldn't really be in color-convert either...
  	'hex',
  ];

  const hashedModelKeys = {};
  for (const model of Object.keys(colorConvert)) {
  	hashedModelKeys[_slice.call(colorConvert[model].labels).sort().join('')] = model;
  }

  const limiters = {};

  function Color(object, model) {
  	if (!(this instanceof Color)) {
  		return new Color(object, model);
  	}

  	if (model && model in skippedModels) {
  		model = null;
  	}

  	if (model && !(model in colorConvert)) {
  		throw new Error('Unknown model: ' + model);
  	}

  	let i;
  	let channels;

  	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
  		this.model = 'rgb';
  		this.color = [0, 0, 0];
  		this.valpha = 1;
  	} else if (object instanceof Color) {
  		this.model = object.model;
  		this.color = object.color.slice();
  		this.valpha = object.valpha;
  	} else if (typeof object === 'string') {
  		const result = colorString.get(object);
  		if (result === null) {
  			throw new Error('Unable to parse color from string: ' + object);
  		}

  		this.model = result.model;
  		channels = colorConvert[this.model].channels;
  		this.color = result.value.slice(0, channels);
  		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
  	} else if (object.length > 0) {
  		this.model = model || 'rgb';
  		channels = colorConvert[this.model].channels;
  		const newArray = _slice.call(object, 0, channels);
  		this.color = zeroArray(newArray, channels);
  		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
  	} else if (typeof object === 'number') {
  		// This is always RGB - can be converted later on.
  		this.model = 'rgb';
  		this.color = [
  			(object >> 16) & 0xFF,
  			(object >> 8) & 0xFF,
  			object & 0xFF,
  		];
  		this.valpha = 1;
  	} else {
  		this.valpha = 1;

  		const keys = Object.keys(object);
  		if ('alpha' in object) {
  			keys.splice(keys.indexOf('alpha'), 1);
  			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
  		}

  		const hashedKeys = keys.sort().join('');
  		if (!(hashedKeys in hashedModelKeys)) {
  			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
  		}

  		this.model = hashedModelKeys[hashedKeys];

  		const labels = colorConvert[this.model].labels;
  		const color = [];
  		for (i = 0; i < labels.length; i++) {
  			color.push(object[labels[i]]);
  		}

  		this.color = zeroArray(color);
  	}

  	// Perform limitations (clamping, etc.)
  	if (limiters[this.model]) {
  		channels = colorConvert[this.model].channels;
  		for (i = 0; i < channels; i++) {
  			const limit = limiters[this.model][i];
  			if (limit) {
  				this.color[i] = limit(this.color[i]);
  			}
  		}
  	}

  	this.valpha = Math.max(0, Math.min(1, this.valpha));

  	if (Object.freeze) {
  		Object.freeze(this);
  	}
  }

  Color.prototype = {
  	toString() {
  		return this.string();
  	},

  	toJSON() {
  		return this[this.model]();
  	},

  	string(places) {
  		let self = this.model in colorString.to ? this : this.rgb();
  		self = self.round(typeof places === 'number' ? places : 1);
  		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to[self.model](args);
  	},

  	percentString(places) {
  		const self = this.rgb().round(typeof places === 'number' ? places : 1);
  		const args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to.rgb.percent(args);
  	},

  	array() {
  		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
  	},

  	object() {
  		const result = {};
  		const channels = colorConvert[this.model].channels;
  		const labels = colorConvert[this.model].labels;

  		for (let i = 0; i < channels; i++) {
  			result[labels[i]] = this.color[i];
  		}

  		if (this.valpha !== 1) {
  			result.alpha = this.valpha;
  		}

  		return result;
  	},

  	unitArray() {
  		const rgb = this.rgb().color;
  		rgb[0] /= 255;
  		rgb[1] /= 255;
  		rgb[2] /= 255;

  		if (this.valpha !== 1) {
  			rgb.push(this.valpha);
  		}

  		return rgb;
  	},

  	unitObject() {
  		const rgb = this.rgb().object();
  		rgb.r /= 255;
  		rgb.g /= 255;
  		rgb.b /= 255;

  		if (this.valpha !== 1) {
  			rgb.alpha = this.valpha;
  		}

  		return rgb;
  	},

  	round(places) {
  		places = Math.max(places || 0, 0);
  		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
  	},

  	alpha(value) {
  		if (arguments.length > 0) {
  			return new Color(this.color.concat(Math.max(0, Math.min(1, value))), this.model);
  		}

  		return this.valpha;
  	},

  	// Rgb
  	red: getset('rgb', 0, maxfn(255)),
  	green: getset('rgb', 1, maxfn(255)),
  	blue: getset('rgb', 2, maxfn(255)),

  	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

  	saturationl: getset('hsl', 1, maxfn(100)),
  	lightness: getset('hsl', 2, maxfn(100)),

  	saturationv: getset('hsv', 1, maxfn(100)),
  	value: getset('hsv', 2, maxfn(100)),

  	chroma: getset('hcg', 1, maxfn(100)),
  	gray: getset('hcg', 2, maxfn(100)),

  	white: getset('hwb', 1, maxfn(100)),
  	wblack: getset('hwb', 2, maxfn(100)),

  	cyan: getset('cmyk', 0, maxfn(100)),
  	magenta: getset('cmyk', 1, maxfn(100)),
  	yellow: getset('cmyk', 2, maxfn(100)),
  	black: getset('cmyk', 3, maxfn(100)),

  	x: getset('xyz', 0, maxfn(100)),
  	y: getset('xyz', 1, maxfn(100)),
  	z: getset('xyz', 2, maxfn(100)),

  	l: getset('lab', 0, maxfn(100)),
  	a: getset('lab', 1),
  	b: getset('lab', 2),

  	keyword(value) {
  		if (arguments.length > 0) {
  			return new Color(value);
  		}

  		return colorConvert[this.model].keyword(this.color);
  	},

  	hex(value) {
  		if (arguments.length > 0) {
  			return new Color(value);
  		}

  		return colorString.to.hex(this.rgb().round().color);
  	},

  	hexa(value) {
  		if (arguments.length > 0) {
  			return new Color(value);
  		}

  		const rgbArray = this.rgb().round().color;

  		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
  		if (alphaHex.length === 1) {
  			alphaHex = '0' + alphaHex;
  		}

  		return colorString.to.hex(rgbArray) + alphaHex;
  	},

  	rgbNumber() {
  		const rgb = this.rgb().color;
  		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
  	},

  	luminosity() {
  		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
  		const rgb = this.rgb().color;

  		const lum = [];
  		for (const [i, element] of rgb.entries()) {
  			const chan = element / 255;
  			lum[i] = (chan <= 0.039_28) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
  		}

  		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  	},

  	contrast(color2) {
  		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
  		const lum1 = this.luminosity();
  		const lum2 = color2.luminosity();

  		if (lum1 > lum2) {
  			return (lum1 + 0.05) / (lum2 + 0.05);
  		}

  		return (lum2 + 0.05) / (lum1 + 0.05);
  	},

  	level(color2) {
  		const contrastRatio = this.contrast(color2);
  		if (contrastRatio >= 7.1) {
  			return 'AAA';
  		}

  		return (contrastRatio >= 4.5) ? 'AA' : '';
  	},

  	isDark() {
  		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
  		const rgb = this.rgb().color;
  		const yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  		return yiq < 128;
  	},

  	isLight() {
  		return !this.isDark();
  	},

  	negate() {
  		const rgb = this.rgb();
  		for (let i = 0; i < 3; i++) {
  			rgb.color[i] = 255 - rgb.color[i];
  		}

  		return rgb;
  	},

  	lighten(ratio) {
  		const hsl = this.hsl();
  		hsl.color[2] += hsl.color[2] * ratio;
  		return hsl;
  	},

  	darken(ratio) {
  		const hsl = this.hsl();
  		hsl.color[2] -= hsl.color[2] * ratio;
  		return hsl;
  	},

  	saturate(ratio) {
  		const hsl = this.hsl();
  		hsl.color[1] += hsl.color[1] * ratio;
  		return hsl;
  	},

  	desaturate(ratio) {
  		const hsl = this.hsl();
  		hsl.color[1] -= hsl.color[1] * ratio;
  		return hsl;
  	},

  	whiten(ratio) {
  		const hwb = this.hwb();
  		hwb.color[1] += hwb.color[1] * ratio;
  		return hwb;
  	},

  	blacken(ratio) {
  		const hwb = this.hwb();
  		hwb.color[2] += hwb.color[2] * ratio;
  		return hwb;
  	},

  	grayscale() {
  		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
  		const rgb = this.rgb().color;
  		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
  		return Color.rgb(value, value, value);
  	},

  	fade(ratio) {
  		return this.alpha(this.valpha - (this.valpha * ratio));
  	},

  	opaquer(ratio) {
  		return this.alpha(this.valpha + (this.valpha * ratio));
  	},

  	rotate(degrees) {
  		const hsl = this.hsl();
  		let hue = hsl.color[0];
  		hue = (hue + degrees) % 360;
  		hue = hue < 0 ? 360 + hue : hue;
  		hsl.color[0] = hue;
  		return hsl;
  	},

  	mix(mixinColor, weight) {
  		// Ported from sass implementation in C
  		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
  		if (!mixinColor || !mixinColor.rgb) {
  			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
  		}

  		const color1 = mixinColor.rgb();
  		const color2 = this.rgb();
  		const p = weight === undefined ? 0.5 : weight;

  		const w = 2 * p - 1;
  		const a = color1.alpha() - color2.alpha();

  		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
  		const w2 = 1 - w1;

  		return Color.rgb(
  			w1 * color1.red() + w2 * color2.red(),
  			w1 * color1.green() + w2 * color2.green(),
  			w1 * color1.blue() + w2 * color2.blue(),
  			color1.alpha() * p + color2.alpha() * (1 - p));
  	},
  };

  // Model conversion methods and static constructors
  for (const model of Object.keys(colorConvert)) {
  	if (skippedModels.includes(model)) {
  		continue;
  	}

  	const channels = colorConvert[model].channels;

  	// Conversion methods
  	Color.prototype[model] = function () {
  		if (this.model === model) {
  			return new Color(this);
  		}

  		if (arguments.length > 0) {
  			return new Color(arguments, model);
  		}

  		const newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
  		return new Color(assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha), model);
  	};

  	// 'static' construction methods
  	Color[model] = function (color) {
  		if (typeof color === 'number') {
  			color = zeroArray(_slice.call(arguments), channels);
  		}

  		return new Color(color, model);
  	};
  }

  function roundTo(number, places) {
  	return Number(number.toFixed(places));
  }

  function roundToPlace(places) {
  	return function (number) {
  		return roundTo(number, places);
  	};
  }

  function getset(model, channel, modifier) {
  	model = Array.isArray(model) ? model : [model];

  	for (const m of model) {
  		(limiters[m] || (limiters[m] = []))[channel] = modifier;
  	}

  	model = model[0];

  	return function (value) {
  		let result;

  		if (arguments.length > 0) {
  			if (modifier) {
  				value = modifier(value);
  			}

  			result = this[model]();
  			result.color[channel] = value;
  			return result;
  		}

  		result = this[model]().color[channel];
  		if (modifier) {
  			result = modifier(result);
  		}

  		return result;
  	};
  }

  function maxfn(max) {
  	return function (v) {
  		return Math.max(0, Math.min(max, v));
  	};
  }

  function assertArray(value) {
  	return Array.isArray(value) ? value : [value];
  }

  function zeroArray(array, length) {
  	for (let i = 0; i < length; i++) {
  		if (typeof array[i] !== 'number') {
  			array[i] = 0;
  		}
  	}

  	return array;
  }

  var color = Color;

  function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var PointLayer = /*#__PURE__*/function (_BaseLayer) {
    _inherits(PointLayer, _BaseLayer);

    var _super = _createSuper$2(PointLayer);

    function PointLayer(container, options) {
      var _this;

      _classCallCheck(this, PointLayer);

      _this = _super.call(this, container, options);

      _defineProperty(_assertThisInitialized(_this), "vertText", vertShader$2);

      _defineProperty(_assertThisInitialized(_this), "fragText", fragShader$2);

      _defineProperty(_assertThisInitialized(_this), "bufferData", []);

      return _this;
    }

    _createClass(PointLayer, [{
      key: "processData",
      value: function processData() {
        var vertexData = [];
        var colorData = [];
        this.data.forEach(function (point) {
          var _point$data = point.data,
              x = _point$data.x,
              y = _point$data.y,
              z = _point$data.z,
              color$1 = _point$data.color,
              size = _point$data.size,
              style = _point$data.style;
          vertexData.push(x, y, z, size, style === 'rect' ? 1 : 0);
          color$1 = color(color$1).array();

          var _color = color$1,
              _color2 = _slicedToArray(_color, 4),
              r = _color2[0],
              g = _color2[1],
              b = _color2[2],
              _color2$ = _color2[3],
              a = _color2$ === void 0 ? 1 : _color2$;

          colorData.push(r, g, b, a * 255);
        });
        this.vertexData = vertexData;
        this.colorData = colorData;
        this.bindBuffer();
      }
    }, {
      key: "bindBuffer",
      value: function bindBuffer() {
        var gl = this.gl;
        this.bufferData = [];
        var byteLength = Float32Array.BYTES_PER_ELEMENT;
        var stride = byteLength * 5;
        var vertBuffer = gl.createBuffer();
        var vertBufferData = new Float32Array(this.vertexData);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
          buffer: vertBuffer,
          data: vertBufferData,
          attributes: [{
            name: 'aPos',
            size: 3,
            stride: stride
          }, {
            name: 'aSize',
            size: 1,
            stride: stride,
            offset: byteLength * 3
          }, {
            name: 'aStyle',
            size: 1,
            stride: stride,
            offset: byteLength * 4
          }]
        });
        var colorBuffer = gl.createBuffer();
        var colorBufferData = new Uint8Array(this.colorData);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
          buffer: colorBuffer,
          data: colorBufferData,
          attributes: [{
            name: 'aColor',
            size: 4,
            type: this.gl.UNSIGNED_BYTE,
            normalize: true
          }]
        });
      }
    }, {
      key: "draw",
      value: function draw() {
        var gl = this.gl;
        var primitiveType = gl.POINTS; // 绘制类型

        var offset = 0; // 从缓冲读取时的偏移量

        var count = this.data.length; // 着色器运行次数

        gl.drawArrays(primitiveType, offset, count);
      }
    }]);

    return PointLayer;
  }(BaseLayer);

  var vertShader$1 = "attribute vec3 aPos;attribute vec4 aColor;varying vec4 vColor;uniform mat4 u_matrix;void main(void){gl_Position=u_matrix*vec4(aPos,1.0);vColor=aColor;}";

  var fragShader$1 = "precision mediump float;varying vec4 vColor;void main(void){gl_FragColor=vColor;}";

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var GeometryLayer = /*#__PURE__*/function (_BaseLayer) {
    _inherits(GeometryLayer, _BaseLayer);

    var _super = _createSuper$1(GeometryLayer);

    function GeometryLayer(options) {
      var _this;

      _classCallCheck(this, GeometryLayer);

      _this = _super.call(this, options);

      _defineProperty(_assertThisInitialized(_this), "pointsLength", 0);

      _defineProperty(_assertThisInitialized(_this), "vertexData", []);

      _defineProperty(_assertThisInitialized(_this), "colorData", []);

      _defineProperty(_assertThisInitialized(_this), "vertText", vertShader$1);

      _defineProperty(_assertThisInitialized(_this), "fragText", fragShader$1);

      return _this;
    }

    _createClass(GeometryLayer, [{
      key: "processData",
      value: function processData() {
        var _this2 = this;

        var vertexData = [];
        var colorData = [];
        this.pointsLength = 0;
        this.data.forEach(function (geometry) {
          var vertecies = geometry.data;
          vertecies.forEach(function (vertex) {
            vertexData.push(vertex[0], vertex[1], vertex[2]);
            _this2.pointsLength++;
            var color$1 = vertex[3] || '#000';
            color$1 = color(color$1).array();

            var _color = color$1,
                _color2 = _slicedToArray(_color, 4),
                r = _color2[0],
                g = _color2[1],
                b = _color2[2],
                _color2$ = _color2[3],
                a = _color2$ === void 0 ? 1 : _color2$;

            colorData.push(r, g, b, a * 255);
          });
        });
        this.vertexData = vertexData;
        this.colorData = colorData;
        this.bindBuffer();
      }
    }, {
      key: "bindBuffer",
      value: function bindBuffer() {
        var gl = this.gl;
        this.bufferData = [];
        var vertBuffer = gl.createBuffer();
        var vertBufferData = new Float32Array(this.vertexData);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
          buffer: vertBuffer,
          data: vertBufferData,
          attributes: [{
            name: 'aPos',
            size: 3
          }]
        });
        var colorBuffer = gl.createBuffer();
        var colorBufferData = new Uint8Array(this.colorData);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);
        this.bufferData.push({
          buffer: colorBuffer,
          data: colorBufferData,
          attributes: [{
            name: 'aColor',
            size: 4,
            type: this.gl.UNSIGNED_BYTE,
            normalize: true
          }]
        });
      }
    }, {
      key: "draw",
      value: function draw() {
        var gl = this.gl;
        var primitiveType = gl.TRIANGLES; // 绘制类型

        var offset = 0; // 从缓冲读取时的偏移量

        var count = this.pointsLength; // 着色器运行次数

        gl.drawArrays(primitiveType, offset, count);
      }
    }]);

    return GeometryLayer;
  }(BaseLayer);

  var View = /*#__PURE__*/function () {
    function View(element, options) {
      _classCallCheck(this, View);

      _defineProperty(this, "instances", []);

      if (typeof container === 'string') {
        element = document.querySelector(element);
      }

      if (!(element instanceof HTMLElement)) {
        throw new TypeError('wrong html element！');
      }

      this.opts = options || {};
      this.data = this.opts.data || [];
      this.canvas = document.createElement('canvas');
      var width = element.clientWidth;
      var height = element.clientHeight;
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.background = 'transparent'; // this.canvas.style.height = height;

      element.appendChild(this.canvas);
      this.gl = getGLContext(this.canvas);
      this.bindEvents();
    }

    _createClass(View, [{
      key: "bindEvents",
      value: function bindEvents() {
        window.addEventListener('resize', function () {
          console.log('resize');
        });
      }
    }, {
      key: "add",
      value: function add(instance) {
        this.instances.push(instance);
        instance.initialize(this.canvas, this.gl);
      }
    }, {
      key: "remove",
      value: function remove(instance) {
        var index = this.instances.indexOf(instance);

        if (index > -1) {
          this.instances.splice(index, 1);
          instance.destroy();
        }
      }
    }, {
      key: "render",
      value: function render() {
        this.instances.forEach(function (instance) {
          instance.render();
        });
      }
    }]);

    return View;
  }();

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  var vertShader = "attribute vec2 a_pos;attribute vec4 a_color;attribute vec2 a_texCoord;uniform vec2 u_resolution;varying vec4 v_color;varying vec2 v_texCoord;void main(void){v_texCoord=a_texCoord;v_color=a_color;vec2 zeroToOne=a_pos/u_resolution;vec2 clipSpace=zeroToOne*2.0-1.0;gl_Position=vec4(clipSpace*vec2(1,-1),0,1.0);}";

  var fragShader = "precision mediump float;uniform sampler2D u_image;uniform vec2 u_textureSize;varying vec2 v_texCoord;varying vec4 v_color;void main(void){vec2 onePixel=vec2(1.0,1.0)/u_textureSize;gl_FragColor=(texture2D(u_image,v_texCoord)+texture2D(u_image,v_texCoord+vec2(onePixel.x,0.0))+texture2D(u_image,v_texCoord+vec2(-onePixel.x,0.0)))/3.0;}";

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var Point$1 = /*#__PURE__*/function (_GL) {
    _inherits(Point, _GL);

    var _super = _createSuper(Point);

    function Point(canvas, option) {
      var _this;

      _classCallCheck(this, Point);

      _this = _super.call(this, canvas, option);
      _this.option = option;

      var resolutionUniformLocation = _this.gl.getUniformLocation(_this.glProgram, 'u_resolution'); // 设置全局变量 分辨率


      _this.gl.uniform2f(resolutionUniformLocation, _this.gl.canvas.width, _this.gl.canvas.height);

      return _this;
    }

    _createClass(Point, [{
      key: "getShaders",
      value: function getShaders() {
        return {
          vs_source: vertShader,
          fs_source: fragShader
        };
      }
    }, {
      key: "getImage",
      value: function getImage(url) {
        return new Promise(function (resolve, reject) {
          var image = new Image();
          image.src = url;
          image.crossOrigin = true;

          image.onload = function () {
            resolve(image);
          };

          image.onerror = function (e) {
            reject(e);
          };
        });
      } // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    }, {
      key: "setVertex",
      value: function setVertex() {
        var gl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gl;
        this.positionBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer(); // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.aVertexPosition = gl.getAttribLocation(this.glProgram, 'a_pos'); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

        var size = 2; // 2 components per iteration

        var type = gl.FLOAT; // the data is 32bit floats

        var normalize = false;
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position

        var offset = 0; // start at the beginning of the buffer

        gl.vertexAttribPointer(this.aVertexPosition, size, type, normalize, stride, offset);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer); // Turn on the color attribute

        this.aColorPosition = gl.getAttribLocation(this.glProgram, 'a_color');
        gl.vertexAttribPointer(this.aColorPosition, 4, gl.UNSIGNED_BYTE, true, stride, offset);
      }
    }, {
      key: "setupBuffer",
      value: function setupBuffer() {
        var gl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.gl;
        // 创建一个随机矩形
        // 并将写入位置缓冲
        // 因为位置缓冲是我们绑定在
        // `ARRAY_BUFFER`绑定点上的最后一个缓冲
        this.setRectangle(gl, // 点
        100, 100, 300, 300, // 颜色
        0, 0, 255, 255); // 设置一个随机颜色
        // 绘制矩形

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      } // 用参数生成矩形顶点并写进缓冲

    }, {
      key: "setRectangle",
      value: function setRectangle(gl, x, y, width, height, r, g, b, a) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(this.aVertexPosition);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.enableVertexAttribArray(this.aColorPosition);
        var colorArr = new Array(6).fill([r, g, b, a]);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorArr.flat()), gl.STATIC_DRAW);
      }
    }, {
      key: "setTexture",
      value: function setTexture(image) {
        var gl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.gl;
        var textureSizeLocation = gl.getUniformLocation(this.glProgram, 'u_textureSize');
        var texCoordLocation = gl.getAttribLocation(this.glProgram, 'a_texCoord'); // 设置图像的大小

        gl.uniform2f(textureSizeLocation, image.width, image.height); // 给矩形提供纹理坐标

        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0); // 创建纹理

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture); // 设置参数，让我们可以绘制任何尺寸的图像

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // 将图像上传到纹理

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      }
    }, {
      key: "render",
      value: function () {
        var _render = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
          var image;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.getImage(this.option.image);

                case 2:
                  image = _context.sent;
                  this.setTexture(image);
                  this.setVertex();
                  this.setupBuffer();

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function render() {
          return _render.apply(this, arguments);
        }

        return render;
      }()
    }]);

    return Point;
  }(BaseLayer);

  var Point = /*#__PURE__*/function () {
    function Point(options) {
      _classCallCheck(this, Point);

      _defineProperty(this, "opts", {
        x: 0,
        y: 0,
        z: 0,
        color: '#000000ff',
        size: 5,
        style: 'rect'
      });

      _defineProperty(this, "update", function () {});

      this.opts = Object.assign(this.opts, options);
    }

    _createClass(Point, [{
      key: "data",
      get: function get() {
        return this.opts;
      }
    }, {
      key: "x",
      get: function get() {
        return this.opts.x;
      },
      set: function set(value) {
        this.opts.x = value;
        this.update(this.opts);
      }
    }, {
      key: "y",
      get: function get() {
        return this.opts.y;
      },
      set: function set(value) {
        this.opts.y = value;
        this.update(this.opts);
      }
    }, {
      key: "z",
      get: function get() {
        return this.opts.z;
      },
      set: function set(value) {
        this.opts.z = value;
        this.update(this.opts);
      }
    }, {
      key: "size",
      get: function get() {
        return this.opts.size;
      },
      set: function set(value) {
        this.opts.size = value;
        this.update(this.opts);
      }
    }, {
      key: "color",
      get: function get() {
        return this.opts.color;
      },
      set: function set(value) {
        this.opts.color = value;
        this.update(this.opts);
      }
    }]);

    return Point;
  }();

  var Geometry = function Geometry() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, Geometry);

    _defineProperty(this, "data", []);

    _defineProperty(this, "update", function () {});

    this.data = data;
    this.opts = options;
  };

  exports.Geometry = Geometry;
  exports.GeometryLayer = GeometryLayer;
  exports.Point = Point;
  exports.PointLayer = PointLayer;
  exports.Texture = Point$1;
  exports.View = View;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
