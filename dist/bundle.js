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

var GL = /*#__PURE__*/function () {
  function GL(canvas) {
    _classCallCheck(this, GL);

    _defineProperty(this, "gl", null);

    this.canvas = canvas;
    this.gl = this.getGLContext();
    this.initProgram(this.getShaders());
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
        } catch (e) {
          console.error('get gl context failed', e);
        }

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
    key: "initProgram",
    value: function initProgram(_ref) {
      var _ref$gl = _ref.gl,
          gl = _ref$gl === void 0 ? this.gl : _ref$gl,
          vs_source = _ref.vs_source,
          fs_source = _ref.fs_source;
      // compile shaders
      var vertexShader = createShader(gl, vs_source, gl.VERTEX_SHADER);
      var fragmentShader = createShader(gl, fs_source, gl.FRAGMENT_SHADER);
      this.glProgram = createProgram(gl, vertexShader, fragmentShader); // use program

      gl.useProgram(this.glProgram);
    }
  }]);

  return GL;
}(); // 创建着色器 参数：gl上下文，着色器内容，类型

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

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var vertShader = "attribute vec2 a_pos;attribute vec4 a_color;uniform vec2 u_resolution;varying vec4 v_color;void main(void){v_color=a_color;vec2 zeroToOne=a_pos/u_resolution;vec2 clipSpace=zeroToOne*2.0-1.0;gl_Position=vec4(clipSpace*vec2(1,-1),0,1.0);}";

var fragShader = "precision mediump float;varying vec4 v_color;void main(void){gl_FragColor=v_color;}";

var Point = /*#__PURE__*/function (_GL) {
  _inherits(Point, _GL);

  var _super = _createSuper(Point);

  function Point(canvas) {
    var _this;

    _classCallCheck(this, Point);

    _this = _super.call(this, canvas);

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

      // 绘制50个随机颜色矩形
      for (var ii = 0; ii < 10; ++ii) {
        // 创建一个随机矩形
        // 并将写入位置缓冲
        // 因为位置缓冲是我们绑定在
        // `ARRAY_BUFFER`绑定点上的最后一个缓冲
        this.setRectangle(gl, // 点
        randomInt(300), randomInt(300), randomInt(300), randomInt(300), // 颜色
        Math.random() * 256, Math.random() * 256, Math.random() * 256, 255); // 设置一个随机颜色
        // 绘制矩形

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
      }
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
    key: "render",
    value: function render() {
      this.setVertex();
      this.setupBuffer();
    }
  }]);

  return Point;
}(GL); // 返回 0 到 range 范围内的随机整数

function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// import Layer from './perspective-camera';
var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var layer = new Point(canvas);
layer.render();
