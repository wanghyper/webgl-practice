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
      var glProgram = this.glProgram = createProgram(gl, vertexShader, fragmentShader); // use program

      gl.useProgram(glProgram);
    }
  }, {
    key: "setupVertBuffer",
    value: function setupVertBuffer(vertex) {
      var gl = this.gl;
      var vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
      var aVertexPosition = gl.getAttribLocation(this.glProgram, 'aPos');
      gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertexPosition);
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

var vertShader = "attribute vec3 aPos;void main(void){gl_Position=vec4(aPos,1.0);gl_PointSize=10.0;}";

var fragShader = "void main(void){gl_FragColor=vec4(1.0,1.0,1.0,1.0);}";

var Point = /*#__PURE__*/function (_GL) {
  _inherits(Point, _GL);

  var _super = _createSuper(Point);

  function Point(canvas) {
    _classCallCheck(this, Point);

    return _super.call(this, canvas);
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
    key: "setupBuffer",
    value: function setupBuffer() {
      var vertex = [0, 0, 0];
      this.setupVertBuffer(vertex);
    }
  }, {
    key: "render",
    value: function render() {
      this.setupBuffer();
      this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }
  }]);

  return Point;
}(GL);

// import Layer from './perspective-camera';
var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var layer = new Point(canvas);
layer.render();
