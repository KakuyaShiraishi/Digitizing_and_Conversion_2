//884と863でバーのレクト関係
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
 
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var images = [{name: "授業説明", value: "panel.jpg"}, { name: "line", value: "line.jpg" }, { name: "copic", value: "copic.jpg" }, { name: "QRコード", value: "qr.jpg" }, { name: "数学・グラフ", value: "math.jpg" }, { name: "バーコード", value: "barcode.jpg" }, { name: "天道虫", value: "7_1.bmp" }, { name: "generative1", value: "ge1.jpg" }, { name: "generative2", value: "ge2.jpg" }, { name: "generative3", value: "ge3.jpg" }, { name: "generative4", value: "ge4.jpg" }, { name: "ボロノイ図", value: "voro.jpg" }, { name: "葉っぱ", value: "leave.jpg" }];

var scales = ['major', 'naturalMinor', 'harmonicMinor', 'melodicMinor', 'chromatic', 'wholeTone', 'majorPentatonic', 'minorPentatonic', 'kuomiPentatonic', 'chinesePentatonic'];

var notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

var numNotes = [5, 10, 20, 40, 60, 100, 200];

var headerElements = ["画像", "音色"];
var panelElements = [];
var container, icon; 

var Controls = function () {
	function Controls(imageCanvas, drawCanvas, settings, handlePlay, handleStop, regenerateSynth) {
		_classCallCheck(this, Controls);

		this.settings = settings;
		this.imageCanvas = imageCanvas;
		this.drawCanvas = drawCanvas;
		this.handlePlay = handlePlay;
		this.handleStop = handleStop;
		this.regenerateSynth = regenerateSynth;
		this.createHeader();
		//this.createControls();  //自動生成されない
		//console.log(this.imageCanvas);  //ボツ
		//nx.onload = function() {
		// Slider will not jump to touch position.
		//slider1.mode = "relative"
		//  slider1.hslider = true
		// slider1.draw();
		// }
	}

	_createClass(Controls, [{
		key: "createHeader",
		value: function createHeader() {
			container = document.createElement('div');
			container.id = "controls";
			container.className = "container-style";
			document.body.appendChild(container);
			var header = document.createElement("div");
			header.id = "header";
			container.appendChild(header);
			for (var i = 0; i < headerElements.length; i++) {
				var button = document.createElement('div');
				button.innerHTML = headerElements[i];
				button.className = "header-button";
				button.id = i;
				button.onclick = this.handleMenuChange;
				header.appendChild(button);
				headerElements[i] = button;
			}
			headerElements[0].className += " selected";
			this.createImagePanel(container);
			this.createSoundPanel(container);
			this.createDrawPanel(container);
			panelElements[1].className = "panel hide";
			panelElements[2].className = "panel hide";
			var div = document.createElement('div');
			//div.id = "close-button";
			//div.innerHTML = "close controls";
			div.onclick = this.hideMenu;
			container.appendChild(div);
			icon = document.createElement('div');
			icon.className = "icon hidden";
			icon.onclick = this.showMenu;
			document.body.appendChild(icon);
		}
	}, 
	
	/*{ key: "hideMenu",
		value: function hideMenu() {
			//console.log(this.container);
			console.log("hiding");
			icon.className = "icon";
			container.className = "container-style hidden";
		}
	}, 
	{ key: "showMenu",
		value: function showMenu() {
			icon.className = "icon hidden";
			container.className = "container-style";
		}
	},*/
	
	
	
	{ key: "createImagePanel",
		value: function createImagePanel(container) {
			var panel = document.createElement('div'); 
			panel.className = "panel";
			container.appendChild(panel);

			this.addDropdown(images, panel, "以下から画像を選んでください: ", "panel.jpg", this.selectImage.bind(this));
			var label = document.createElement("LABEL");
			label.className = "upload-container";
			var span = document.createElement("SPAN");
			//span.innerHTML = "... upload from file";

			var x = document.createElement("INPUT");
			x.setAttribute("type", "file");
			x.onchange = this.uploadFile.bind(this);
			label.appendChild(x);
			label.appendChild(span);
			panel.appendChild(label);
			this.addDial("白黒反転", "toggle", panel, this.updateSetting.bind(this), { value: this.settings.invert }, "invert");
			this.addDial("複写", "position", panel, this.updateSetting.bind(this), { x: this.settings.複写.x, y: this.settings.複写.y }, "drawRepetitions");
			this.addDial("オフセット", "position", panel, this.updateSetting.bind(this), { x: this.settings.オフセット.x, y: this.settings.オフセット.y }, "drawRepetitions");
			this.addDial("ブライトネス", "dial", panel, this.updateSetting.bind(this), { value: this.settings.ブライトネス }, "calculatePixels");
			this.addDial("コントラスト", "dial", panel, this.updateSetting.bind(this), { value: this.settings.コントラスト }, "calculatePixels");
			
			//this.addDial("画像の隣接幅", "position", panel, this.updateSetting.bind(this), { x: this.settings.画像の隣接幅.x, y: this.settings.画像の隣接幅.y }, "drawRepetitions");
			// 	this.addDial("reset", "button", panel, this.invert.bind(this));
			//this.addDial("clear imaオフセットge", "button", panel, this.imageCanvas.clearImage.bind(this.imageCanvas));
			this.addDial("回転", "dial", panel, this.updateSetting.bind(this), { value: this.settings.回転 }, "drawRepetitions");
			//this.addDial("clear background", "button", panel, this.updateSetting.bind(this), {}, "clearImage");

			nx.colorize('#00c654'/*'#f06'*/); //操作子のカラー
			//nx.colorrize('#ffff');
			nx.colorize("fill", "#ffffff"); //ボタンの中の色 
			panelElements.push(panel);
	  }
	}, 
	{ key: "createSoundPanel",
		value: function createSoundPanel(container) {
			var panel = document.createElement('div');
			panel.className = "panel";
			container.appendChild(panel);
			this.addDial("再生", "toggle", panel, this.togglePlay.bind(this));
			this.addDial("速さ", "dial", panel, this.updateSetting.bind(this), { value: this.settings.速さ });
			this.addDropdown(scales, panel, "スケール: ", this.settings.scale.type, this.selectScale.bind(this));
			this.addDropdown(notes, panel, "キー: ", this.settings.scale.note, this.selectKey.bind(this));
			var octaves = [];
			for (var i = 0; i < 9; i++) {
				octaves.push(i);
			}
			this.addDropdown(octaves, panel, "オクターブ: ", this.settings.scale.octave, this.selectOctave.bind(this));
			this.addDropdown(numNotes, panel, "ノート数: ", this.settings.scale.numSteps, this.selectNum.bind(this));

			panelElements.push(panel);
		}
	}, 
	

	{ key: "createDrawPanel",
		value: function createDrawPanel(container) {
			var panel = document.createElement('div');
			panel.className = "panel";
			container.appendChild(panel);
			this.addDial("stroke_width", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_width });
			this.addDial("stroke_repetitions", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_repetitions });
			this.addDial("stroke_opacity", "dial", panel, this.updateSetting.bind(this), { value: this.settings.stroke_opacity });

			this.addDial("eraser", "toggle", panel, this.updateSetting.bind(this), { value: this.settings.eraser });
			this.addDial("stroke_offset", "position", panel, this.updateSetting.bind(this), { x: this.settings.stroke_offset.x, y: this.settings.stroke_offset.y });
			this.addDial("clear drawing", "button", panel, this.drawCanvas.clear.bind(this.drawCanvas));

			panelElements.push(panel);
		}
	},
	
	
	
	
	
	
	{ key: "togglePlay",
		value: function togglePlay() {
			if (this.settings.play) {
				this.handleStop();
			} else {
				this.handlePlay();
			}
		}
	}, 
	{ key: "toggleDraw",
		value: function toggleDraw() {}
	}, 
	{ key: "handleMenuChange",
		value: function handleMenuChange(e) {
			//console.log(e.target);
			for (var i = 0; i < headerElements.length; i++) {
				headerElements[i].className = "header-button";
			}
			for (var i = 0; i < panelElements.length; i++) {
				panelElements[i].className = "panel hide";
			}
			headerElements[e.target.id].className += " selected";
			panelElements[e.target.id].className = "panel";
		}
	}, 
	{ key: "updateSpeed",
		value: function updateSpeed(e) {
			this.settings.pixel_step = e.value * 400 - 200;
			//console.log(this.settings.pixel_step);
		}
	}, 
	{ key: "updateSetting",
		value: function updateSetting(label, canvasEvent, e) {
			//console.log(label);
			//console.log(e);
			//console.log(canvasEvent);
			if ('value' in e) {
				//console.log("setting eraser to" + e.value);
				this.settings[label] = e.value;
				//console.log(this.settings[label]);
			} else if (e.press) {
					//this.settings[label]= e.value;
				} else if (e.x && this.settings[label]) {
						this.settings[label].x = e.x;
						this.settings[label].y = e.y;
					}
			if (canvasEvent != null) {
				var fn = this.imageCanvas[canvasEvent].bind(this.imageCanvas);
				fn();
			}
		}
	}, 
	{ key: "addDial",
		value: function addDial(label, type, container, handler, startVal, canvasHandler) {
			var dialHolder = document.createElement('div');
			dialHolder.style.padding = "5px";
			dialHolder.style.display = "inline-block";
			var testDial = document.createElement('canvas');
			if (type == "position") {
				dialHolder.style.padding = "3px";
				testDial.width = 68;
				testDial.height = 68;
				var l = label.replace(/_/g, ' ');
				this.addLabel(l, dialHolder, "dropdown-label");
			} else {
				testDial.className = "small-canvas";
				var l = label.replace(/_/g, ' ');
				this.addLabel(l, dialHolder, "label");
			}
			testDial.setAttribute("nx", type);
			testDial.setAttribute("label", label);
			testDial.id = label;

			container.appendChild(dialHolder);

			dialHolder.appendChild(testDial);
			nx.transform(testDial);
			nx.widgets[label].on('*', handler.bind(this, label, canvasHandler));
			if (startVal) {
				nx.widgets[label].set(startVal);
			}
		}
	}, 
	{ key: "addDropdown",
		value: function addDropdown(options, container, label, value, handler) {
			var dropdown = document.createElement("select");
			for (var i = 0; i < options.length; i++) {
				var op = new Option();
				if (options[i].value) {
					op.value = options[i].value;
					op.text = options[i].name;
				} else {
					op.value = options[i];
					op.text = options[i];
				}
				dropdown.options.add(op);
			}
			dropdown.onchange = handler;
			dropdown.value = value;
			this.addLabel(label, container, "header-label");
			container.appendChild(dropdown);
		}
	}, 
	{ key: "addLabel",
		value: function addLabel(text, container, className) {
			var label = document.createElement("div");
			label.className = className;
			label.innerHTML = text;

			container.appendChild(label);
		}
	}, 
	{ key: "selectImage",
		value: function selectImage(e) {
			//console.log(this.imageCanvas);
			this.imageCanvas.loadImage("./images/" + e.target.value);
		}
	}, 
	{ key: "selectKey",
		value: function selectKey(e) {
			//console.log(e.target.value);
			this.settings.scale.note = e.target.value;
			this.regenerateSynth();
		}
	}, 
	{ key: "selectOctave",
		value: function selectOctave(e) {
			this.settings.scale.octave = e.target.value;
			this.regenerateSynth();
		}
	}, 
	{ key: "selectNum",
		value: function selectNum(e) {
			//console.log(e.target.value);
			this.settings.scale.numSteps = e.target.value;
			this.regenerateSynth();
			////console.log(scale);
		}
	}, 
	{ key: "selectScale",
		value: function selectScale(e) {
			//console.log(e.target.value);
			this.settings.scale.type = e.target.value;
			this.regenerateSynth();
		}
	}, 
	{ key: "uploadFile",
		value: function uploadFile(e) {
			// TO DO : VALIDATE FILE
			var file = URL.createObjectURL(e.target.files[0]);
			this.imageCanvas.loadImage(file);
		}
	}, 
	{ key: "show",
		value: function show() {}
	}, 
	{ key: "hide",
		value: function hide() {}
	}]);

	return Controls;
}();


//ここまでコントロール


exports.default = Controls;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var drawCanvas = function () {
	function drawCanvas(settings) {
		_classCallCheck(this, drawCanvas);

		//出力系
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = "fixed";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.settings = settings;
		this.isDrawing = false;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.lineJoin = "round";
		this.ctx.lineCap = "round";

		document.body.appendChild(this.canvas);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		// 現在のデータ表時
		this.imageData = this.data.data;
	}

	_createClass(drawCanvas, [
		
		
		{key: "startStroke",
		value: function startStroke(x, y) {
			this.prevX = x;
			this.prevY = y;
			this.ctx.strokeStyle = "#fff";
			//this.ctx.fillRect(x, y, 10, 10);
			this.isDrawing = true;
			//console.log(this.settings.eraser);
			if (this.settings.eraser == 1) {
				console.log("erasing");
				this.ctx.globalCompositeOperation = "destination-out";
				this.ctx.strokeStyle = "rgba(0,0,0,1)";
				this.ctx.lineWidth = 10.0 + this.settings.stroke_width * 100;
			} else {
				this.ctx.globalCompositeOperation = "source-over";
				this.ctx.strokeStyle = "rgba(255, 255, 255," + this.settings.stroke_opacity + ")";
				this.ctx.lineWidth = 0.1 + (this.settings.stroke_width * 4 + 1) * (this.settings.stroke_width * 4 + 1) * (this.settings.stroke_width * 4 + 1);
			}
		}
	},
	
	{
		key: "continueStroke",
		value: function continueStroke(x, y) {
			if (this.isDrawing) {
				var repetitions = 1;
				if (!this.settings.eraser) repetitions = Math.ceil(this.settings.stroke_repetitions * 10);
				var xOffset = this.settings.stroke_offset.x * 200 - 100;
				var yOffset = this.settings.stroke_offset.y * 200 - 100;
				//console.log(repetitions);

				for (var i = 0; i < repetitions; i++) {
					//this.ctx.fillRect(x, y, 10, 10);
					//this.ctx.lineWidth = 0.1 + (this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1)*(this.settings.stroke_width*4+1);
					this.ctx.beginPath();
					this.ctx.moveTo(this.prevX + xOffset * i, this.prevY + yOffset * i);
					this.ctx.lineTo(x + xOffset * i, y + yOffset * i);
					this.ctx.stroke();
				}
				this.prevX = x;
				this.prevY = y;
			}
		}
	}, 
	

	{
		key: "resize",
		value: function resize(w, h) {
			var tempCanvas = document.createElement("canvas");
			tempCanvas.width = w;
			tempCanvas.height = h;
			var tempCtx = tempCanvas.getContext('2d');
			tempCtx.drawImage(this.canvas, 0, 0, w, h);
			this.canvas.width = w;
			this.canvas.height = h;
			this.ctx.drawImage(tempCanvas, 0, 0);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	},


	{
		key: "clear",
		value: function clear() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	},


	{
		key: "endStroke",
		value: function endStroke() {
			this.isDrawing = false;
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
		}
	}
	
	
	
	]);

	return drawCanvas;
}();



exports.default = drawCanvas;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageCanvas = function () {
	function ImageCanvas(settings, handlePlay) {
		_classCallCheck(this, ImageCanvas);

		//output canvas
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = "fixed";
		this.canvas.style.top = "0px";
		this.canvas.style.left = "0px";
		this.settings = settings;
		this.handlePlay = handlePlay;

		//　フィルタリングされた画像
		this.filterCanvas = document.createElement("canvas");
		this.filterCanvas.width = window.innerWidth;
		this.filterCanvas.height = window.innerHeight;
		this.filterCtx = this.filterCanvas.getContext('2d');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		//this.ctx = ctx;
		document.body.appendChild(this.canvas);
		this.loadImage("./images/panel.jpg")
	} 

	_createClass(ImageCanvas, [{
		key: "clearImage",
		value: function clearImage() {
			console.log("clearing");
			this.ctx.globalCompositeOperation = "source-over";

			this.filterCtx.fillStyle = "rgb(0, 0, 0)";
			this.filterCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillStyle = "rgb(0, 0, 0)";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			//var data = [];
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
			this.originalData = [];
			for (var i = 0; i < this.data.data.length; i++) {
				this.originalData[i] = this.data.data[i];
			}
		}
	}, {
		key: "loadImage",
		value: function loadImage(filename) {
			console.log(filename);
			var img = new Image();
			img.src = filename;
			img.onload = function () {
				this.filterCtx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
				this.ctx.fillStyle = "rgb(0, 0, 0)";
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
				this.toGrayscale();
				if (this.settings.play) this.handlePlay();
			}.bind(this);
			this.img = img;
		}
	}, {
		key: "resize",
		value: function resize(w, h) {
			this.canvas.width = w;
			this.canvas.height = h;
			this.filterCanvas.width = w;
			this.filterCanvas.height = h;
			this.filterCtx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
			this.ctx.drawImage(this.filterCanvas, 0, 0, this.canvas.width, this.canvas.height);
			this.toGrayscale();
		}
	}, {
		key: "toGrayscale",
		value: function toGrayscale() {
			//0.299r + 0.587g + 0.114b.
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			var imageData = this.data.data;
			for (var i = 0; i < imageData.length; i += 4) {
				var grey = imageData[i] * 0.299 + imageData[i + 1] * 0.587 + imageData[i + 2] * 0.114;
				imageData[i] = grey;
				// green
				imageData[i + 1] = grey;
				// blue
				imageData[i + 2] = grey;
			}
			//  this.data.data = imageData;
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.imageData = imageData;

			this.originalData = [];
			for (var i = 0; i < imageData.length; i++) {
				this.originalData[i] = imageData[i];
			}
			console.log(this.originalData);
			console.log(imageData);
			// this.ctx.putImageData(this.data, 0, 0);
			if (this.settings.invert) {
				this.invert();
			} else {
				this.calculatePixels();
			}
		}
	}, {
		key: "drawRepetitions",
		value: function drawRepetitions() {
			var rotation = this.settings.回転 * Math.PI * 2;
			var width = this.canvas.width / (1 + this.settings.複写.x * 5);
			var height = this.canvas.height / (1 + this.settings.複写.y * 5);
			console.log(this.settings.画像の隣接幅.x);
			var spacingX = (3 * this.settings.画像の隣接幅.x + 0.5) * width;
			var spacingY = (3 * this.settings.画像の隣接幅.y + 0.5) * height;
			var numCols = this.canvas.width / spacingX;
			var numRows = this.canvas.height / spacingY;
			var modCanvas = document.createElement("canvas");
			modCanvas.width = width;
			modCanvas.height = height;
			var modCtx = modCanvas.getContext('2d');
			modCtx.translate(width / 2, height / 2);
			modCtx.rotate(rotation);
			modCtx.drawImage(this.filterCanvas, -width / 2, -height / 2, width, height);
			this.ctx.fillStyle = "rgb(0, 0, 0)";
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.globalCompositeOperation = "lighter";
			for (var i = 0; i < numCols + 1; i++) {
				for (var j = 0; j < numRows; j++) {
					var xPos = i * spacingX - this.settings.オフセット.x * spacingX * j;
					var yPos = j * spacingY - this.settings.オフセット.y * spacingY * i;

					if (xPos <= -spacingX) xPos += this.canvas.width;
					if (yPos <= -spacingY) yPos += this.canvas.height;
					//if(xPos > this.canvas.width) xPos -= this.canvas.width;
					this.ctx.drawImage(modCanvas, xPos, yPos, width, height);
				}
			}
			// this.ctx.drawImage(modCanvas, 0, 0, width, height);
			this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
			this.imageData = this.data.data;
			//this.originalData = this.data.data.slice(0);
		}
	}, {
		key: "invert",
		value: function invert() {
			// imageData ;

			for (var i = 0; i < this.imageData.length; i += 4) {
				//if(this.originalData[i] < 10) console.log(this.imageData[i]);
				//red
				this.imageData[i] = 255 - this.originalData[i];
				// green
				this.imageData[i + 1] = 255 - this.originalData[i + 1];
				// blue
				this.imageData[i + 2] = 255 - this.originalData[i + 2];
			}
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.originalData = [];
			for (var i = 0; i < this.data.data.length; i++) {
				this.originalData[i] = this.data.data[i];
			}
			this.calculatePixels();
		}
	}, {
		key: "regenerateImage",
		value: function regenerateImage() {}
		//明るさとコントラストを調整する

	}, {
		key: "calculatePixels",
		value: function calculatePixels() {
			//var this.settings.contrast = e.value*255*2 -255;
			var contrast = 255 * this.settings.コントラスト * 2 - 255;
			var bright = 255 * this.settings.ブライトネス * 2 - 255;
			console.log(contrast);
			var factor = 259 * (contrast + 255) / (255 * (259 - contrast));
			for (var i = 0; i < this.imageData.length; i += 4) {
				// red
				this.imageData[i] = factor * (this.originalData[i] + bright - 128) + 128;
				this.imageData[i + 1] = factor * (this.originalData[i + 1] + bright - 128) + 128;
				this.imageData[i + 2] = factor * (this.originalData[i + 2] + bright - 128) + 128;
			}
			this.ctx.putImageData(this.data, 0, 0);
			this.filterCtx.putImageData(this.data, 0, 0);
			this.drawRepetitions();
		}
	}]);

	return ImageCanvas;
}();

exports.default = ImageCanvas;

},{}],4:[function(require,module,exports){
'use strict';

var _synthesizer = require('./synthesizer.js');

var _synthesizer2 = _interopRequireDefault(_synthesizer);

var _scaleMaker = require('scale-maker');

var _scaleMaker2 = _interopRequireDefault(_scaleMaker);

var _controls = require('./controls.js');  //コントロールパネル削除

var _controls2 = _interopRequireDefault(_controls);  //コントロールパネル削除2

var _imageCanvas = require('./imageCanvas.js');

var _imageCanvas2 = _interopRequireDefault(_imageCanvas);

var _drawCanvas = require('./drawCanvas.js');

var _drawCanvas2 = _interopRequireDefault(_drawCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var synth, controls, imageCanvas, drawCanvas;
//squares

var prevTime, data; 
var colPos = 0;
var isPlaying = true;

var settings = {
  ブライトネス: 0.45,
  コントラスト: 0.5,

  invert: false,
  
  複写: {
    x: 0,
    y: 0
  },
  オフセット: {
    x: 0,
    y: 0
  },
  画像の隣接幅: {
    x: 0.16,
    y: 0.16
  },
  回転: 0,
  play: true, 
  
  速さ: 0.8,
  drawMode: false,
  stroke_width: 0.1,
  stroke_repetitions: 0.3,
  stroke_opacity: 1.0,
  eraser: 0,
  stroke_offset: {
    x: 0.6,
    y: 0.6
  },
  scale: {
    numSteps: 60,
    note: "C",
    octave: 0,
    
    
    //type: 'chromatic'
    type: 'major'
  	
  	
  	
  	
  }
};

var synthObj = {};
//var numSteps = 30;

//var isPlaying = false;

var scaleFrequencies;
//var settings.speed = 60;
var playheadCanvas, imageData, ctx, playheadCtx, compressor, ongoingTouches, mouse, touchObject, audioCtx, backgroundColor, oscillators;
// timing params
var requestId, startTime;
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//var scaleFrequencies = ScaleMaker.makeScale('chinesePentatonic', 'A#3', numSteps).inHertz;

//console.log(settings.scale);

window.onload = function () {
  var l = document.getElementById("landing");
  l.onclick = init;
  // init();
};

function handlePlay() {
  prevTime = audioCtx.currentTime;
  settings.play = true;
  // console.log(audioCtx);
  if (audioCtx.resume) {
    audioCtx.resume();
  } else {
    //ブラウザのサポートレジューム
  }

  requestId = requestAnimationFrame(nextStep);
}

function regenerateSynth() {
  synth.endSynth();
  var note = settings.scale.note + "" + settings.scale.octave;
  //console.log(settings.scale.numSteps);
  scaleFrequencies = _scaleMaker2.default.makeScale(settings.scale.type, note, parseInt(settings.scale.numSteps)).inHertz;
  synth = new _synthesizer2.default(scaleFrequencies, compressor, audioCtx);
}

function handleStop() {
  settings.play = false;
  if (audioCtx.suspend) {
    // audioCtx.resume();
    audioCtx.suspend();
  } else {
    //ブラウザのサポートのサスペンド
    // synth.zeroGains();
    var gainVals = [];
    for (var i = 0; i < settings.scale.numSteps; i++) {
      gainVals[i] = 0;
    }
    synth.updateGains(gainVals);
    cancelAnimationFrame(requestId);
  }
}

function init() {
  //log("init");
  document.body.removeChild(document.getElementById("landing"));
  ongoingTouches = new Array();

  touchObject = {};
  oscillators = {};

  imageCanvas = new _imageCanvas2.default(settings, handlePlay);
  drawCanvas = new _drawCanvas2.default(settings);
  playheadCanvas = document.createElement("canvas");
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
  playheadCanvas.style.position = "fixed";
  playheadCanvas.style.top = "0px";
  playheadCanvas.style.left = "0px";
  playheadCtx = playheadCanvas.getContext('2d');
  backgroundColor = "rgba(242, 35, 12, 0.1)";

  initAudioCtx();

  document.body.appendChild(playheadCanvas);
  controls = new _controls2.default(imageCanvas, drawCanvas, settings, handlePlay, handleStop, regenerateSynth);
  setEventHandlers();

  document.body.onkeydown = function (e) {
    if (e.keyCode == 32) {
      if (settings.play) {
        settings.play = false;
        handleStop();
      } else {
        settings.play = true;
        handlePlay();
      }
    }
    // else if(e.keyCode == 38){ // up key
    //   settings.speed +=5;
    // } else if(e.keyCode == 40){
    //   settings.speed -=5;
    // } else if(e.keyCode == 73){
    //   invert();
    // } else if(e.keyCode == 67){
    //   contrast();
    //  } else if(e.keyCode == 66){
    //   brighter();
    //  } else if(e.keyCode == 68){
    //   darker();
    // }
  };
}

function setEventHandlers() {
  console.log("setting event handlers");
  playheadCanvas.addEventListener("touchstart", handleTouchStart, false);
  playheadCanvas.addEventListener("touchend", handleTouchEnd, false);
  playheadCanvas.addEventListener("touchcancel", handleTouchCancel, false);
  playheadCanvas.addEventListener("touchmove", handleTouchMove, false);
  playheadCanvas.addEventListener("mousedown", handleMouseStart, false);
  playheadCanvas.addEventListener("mousemove", handleMouseMove, false);
  playheadCanvas.addEventListener("mouseup", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseout", handleMouseUp, false);
  playheadCanvas.addEventListener("mouseleave", handleMouseUp, false);
  window.addEventListener("resize", onResize);
}

function initAudioCtx() {
  audioCtx = new window.AudioContext();
  compressor = audioCtx.createDynamicsCompressor();
  compressor.connect(audioCtx.destination);
  scaleFrequencies = _scaleMaker2.default.makeScale(settings.scale.type, 'C3', settings.scale.numSteps).inHertz;
  synth = new _synthesizer2.default(scaleFrequencies, compressor, audioCtx);
}

function nextStep() {
  //var col = Math.floor(audioCtx.currentTime*settings.speed);
  var step = Math.floor((audioCtx.currentTime - prevTime) * (settings.速さ * 400 - 200));
  var col = colPos + step;
  if (col >= imageCanvas.canvas.width) {
    while (col >= imageCanvas.canvas.width) {
      col -= imageCanvas.canvas.width;
    }
  }
  if (col < 0) col += imageCanvas.canvas.width;
  playheadCtx.clearRect(0, 0, playheadCanvas.width, playheadCanvas.height);

  //playheadCtx.fillStyle = "rgba(255, 0, 102, 1)"; //バーのカラー
  playheadCtx.fillStyle = "rgba(0,255,108,1)";
  playheadCtx.fillRect(col - 5, 0, 1, imageCanvas.canvas.height);
  //playheadCtx.fillStyle = "rgba(153, 255, 204, 1)"; //バー内の反転カラー
  playheadCtx.fillStyle = "rgba(0, 0, 0, 1)"; 
  
  

  var gainVals = [];
  for (var i = 0; i < settings.scale.numSteps; i++) {
    var row = Math.floor((i + 0.5) * imageCanvas.canvas.height / settings.scale.numSteps);
    var off = (row * imageCanvas.canvas.width + col) * 4;
    var val;

    //val = imageCanvas.imageData[off]+imageCanvas.imageData[off+1]+imageCanvas.imageData[off+2])/(255*3);
    val = (imageCanvas.imageData[off] + drawCanvas.imageData[off] * (drawCanvas.imageData[off + 3] / 255)) / 255;
    // console.log(val);
    // console.log(row);
    // }
    playheadCtx.fillRect(col - 5, row, 1, val * 5); //バーで読み取った部分のレクと
    gainVals[i] = val;
    // if(val > 0) synth.playNote(i, val);
  }
  synth.updateGains(gainVals);
  requestId = requestAnimationFrame(nextStep);
  colPos = col;
  prevTime = audioCtx.currentTime;
}

function handleMouseStart(e) {
  // isScrubbing = true;
  // console.log(e.pageX);
  // colPos = e.pageX;
  // console.log(colPos);
  drawCanvas.startStroke(e.pageX, e.pageY);
}

function handleMouseMove(e) {
  // if(isScrubbing){
  //    colPos = e.pageX;
  //  }
  drawCanvas.continueStroke(e.pageX, e.pageY);
}

function handleMouseUp() {
  //isScrubbing = false;
  drawCanvas.endStroke();
}

function handleTouchStart(e) {
  // isScrubbing = true;
  //  var touches = e.changedTouches;
  if (e.touches != undefined) {
    // colPos = e.touches[0].pageX;
    drawCanvas.startStroke(e.touches[0].pageX, e.touches[0].pageY);
  }
}

function onResize() {
  imageCanvas.resize(window.innerWidth, window.innerHeight);
  drawCanvas.resize(window.innerWidth, window.innerHeight);
  playheadCanvas.width = window.innerWidth;
  playheadCanvas.height = window.innerHeight;
}

function handleTouchMove(e) {
  drawCanvas.continueStroke(e.touches[0].pageX, e.touches[0].pageY);
}

function handleTouchEnd(e) {
  drawCanvas.endStroke();
}

function handleTouchCancel(e) {}

},{"./controls.js":1,"./drawCanvas.js":2,"./imageCanvas.js":3,"./synthesizer.js":6,"scale-maker":5}],5:[function(require,module,exports){
module.exports = (function () {
  'use strict';
  
  var TWELFTH_ROOT = getNthRoot(2, 12), 
  //　単一区間あたりの半音の周波数を取得
      REF_FREQUENCIES = {
        A4: 440,
        C0: 16.35,
        B8: 7902.13
      },
      MIN_FREQUENCY = REF_FREQUENCIES.C0, // C0
      MAX_FREQUENCY = REF_FREQUENCIES.B8, // B8
      CENTS_PER_SEMITONE = 100,
      scaleDefs = {};

  // 与えられた規模の型の各音符の間(半音単位)間隔のシーケンス構築
  // 各スケールの配列
  // TODO: スケールの完全な基本の値
  scaleDefs.chromatic = [1];
  scaleDefs.wholeTone = [2];
  scaleDefs.major= [2, 2, 1, 2, 2, 2, 1];
  scaleDefs.majorPentatonic = [2, 2, 3, 2, 3];
  scaleDefs.minorPentatonic = [3, 2, 2, 3, 2];
  scaleDefs.kuomiPentatonic = [1, 4, 2, 1, 4];
  scaleDefs.chinesePentatonic = [4, 2, 1, 4, 1];
  scaleDefs.naturalMinor = [2, 1, 2, 2, 1, 2, 2];
  scaleDefs.harmonicMinor = [2, 1, 2, 2, 1, 3, 1];
  scaleDefs.melodicMinor = [2, 1, 2, 2, 2, 2, 1];

  function getNthRoot (value, n) {
  	
    return Math.pow(value, 1 / n);
  }

  //有効な音名を渡された場合はtrueを返す。'A4', 'C0', 'F#5', 'Gb2', 'Cb7'
  //そうでない場合はfalseを返す
  
  function isValidNoteName (noteName) {
    var validNameRegex = /^[A-G][b#]?[0-8]$/;

    return typeof noteName === 'string' && validNameRegex.test(noteName);
  }

  //指定されたスケールネームとスケールタイプは、コレクションである場合、true違う場合はfalse

  function isScaleTypeDefined (scaleName) {
    return scaleDefs.hasOwnProperty(scaleName);
  }

  //有効なスケールタイプを渡された場合はtrue。スケールの定義として文字列

  function isValidScaleName (scaleName) {
    var scaleNameRegex = /^[A-Za-z\-\_ ]+$/;

    return typeof scaleName === 'string' && scaleNameRegex.test(scaleName);
  }

  //有効なスケールの定義を渡された場合はtrue。整数の配列ということ

  function isValidScaleDefinition (scaleDef) {
    return Array.isArray(scaleDef) && scaleDef.every(isPositiveIntegerGreaterThanZero);
  }

  //整数を渡された場合ｈあtrue

  function isPositiveIntegerGreaterThanZero (value) {
    return (typeof value === 'number') && (value % 1 === 0) && (value > 0);
  }

  //基本周波数から半音の与えられた数だけ音符の周波数を返す。(間隔が負にできる)
 
  function getNoteByInterval (reference, interval) {
  	
    var frequency = reference * Math.pow(TWELFTH_ROOT, interval);
    frequency = (frequency > MAX_FREQUENCY) ? MAX_FREQUENCY : frequency;
    frequency = (frequency < MIN_FREQUENCY) ? MIN_FREQUENCY : frequency;

    // リファレンスとテスティングを用意にするために小数点以下2桁に丸める
    return Math.round(frequency * 100) / 100;
  }

  //デチューン(セント)の数は半音単位で間隔を与え、返す

  function getCentsByInterval (interval) {
     return interval * CENTS_PER_SEMITONE;
  }

  //A4に比べて半音単位で間隔を返す
  //例えば、('A',4) は0を返す。('C', 6)は13を返す。('A', 3)で-12を返す

  function getIntervalFromA4 (noteName, octave) {
    var semitonesInOctave = 12,
        A4Octave = 4,
        intervalsRelativeToA = {
          C: -9,
          D: -7,
          E: -5,
          F: -4,
          G: -2,
          A: 0,
          B: 2    
        };
    
    return intervalsRelativeToA[noteName] + ((octave - A4Octave) * semitonesInOctave);
  }

  //フラットをシャープのための間隔調整を返す。

  function getIntervalAdjustment (sharpOrFlat) {
    var adjustments = {
      '#': 1,
      'b': -1
    };

    if (sharpOrFlat !== '#' && sharpOrFlat !== 'b') {
      return 0;
    }

    return adjustments[sharpOrFlat];
  }

  //使用可能な全てのスケールの名前の配列を返す。

  function getScaleNames () {
    var scaleName,
        scaleNames = [];

    for (scaleName in scaleDefs) {
      if (scaleDefs.hasOwnProperty(scaleName)) {
        scaleNames.push(scaleName);
      }
    }

    return scaleNames;
  }

  //'A4', 'C0', 'F#5', 'Gb2', 'Cb7' として、使いやすい文字列と同等な音符の種は数を返す・

  function getNote (noteString) {
    if (!isValidNoteName(noteString)) {
      throw new Error('Invalid argument noteString: getNote(noteString) noteString should be a valid note name, eg. "Ab0", "C7"');
    }

    var noteNameMatch = noteString.match(/^[A-G]/g),
        sharpOrFlatMatch = noteString.match(/[b#]/g),
        octaveMatch = noteString.match(/[0-8]/g),
        noteName = noteNameMatch ? noteNameMatch[0] : null,
        sharpOrFlat = sharpOrFlatMatch ? sharpOrFlatMatch[0] : null,
        octave = octaveMatch ? parseInt(octaveMatch[0], 10) : null,
        intervalFromA,
        adjustedInterval;

    intervalFromA = getIntervalFromA4(noteName, octave);
    adjustedInterval = intervalFromA + getIntervalAdjustment(sharpOrFlat);

    return getNoteByInterval(REF_FREQUENCIES.A4, adjustedInterval);
  }

  //スケールの種類が与えられた音階の音符を表すヘルツの周波数の配列、頭のノートの頻度、およびノートの数を返す

  function makeScale (scaleType, startNote, noteCount) {
    if (arguments.length < 3) {
      throw new Error('Missing argument(s): makeScale() expects three arguments');
    }
    if (!isValidScaleName(scaleType)) {
      throw new Error('Invalid argument scaleType: makeScale(scaleType, startNote, noteCount) expects scaleType to be a string consisting of lower or upper case letters (A-Z, a-z), spaces, hyphens(-) or underscores(_) only');
    }
    if (!isScaleTypeDefined(scaleType)) {
      throw new Error('Scale type is undefined: makeScale(scaleType, startNote, noteCount) scale with name provided for scaleType is not defined – make sure you choose from available scale types');
    }
    if (!isPositiveIntegerGreaterThanZero(noteCount)) {
      throw new Error('Invalid argument noteCount: makeScale(scaleType, startNote, noteCount) expects noteCount to be a positive integer greater than 0');
    }
    if (!isValidNoteName(startNote)) {
      throw new Error('Invalid argument startNote: makeScale(scaleType, startNote, noteCount) startNote should be a valid note name, eg. "Ab0", "C7"');
    }
    var i,
        scaleDef = scaleDefs[scaleType],
        scaleInHertz = [],
        scaleInCents = [],
        scaleInSemitones = [],
        intervalsFromStartNote = 0,
        intervalCounter = 0,
        startFrequency = getNote(startNote);

  //最初の音符は常に指導周波数で出力あたりまえ

    scaleInHertz.push(startFrequency);
    scaleInCents.push(0);
    scaleInSemitones.push(0);

    for(i = 0; i < noteCount - 1; i += 1) {
      intervalsFromStartNote += scaleDef[intervalCounter];

      scaleInHertz.push(getNoteByInterval(startFrequency, intervalsFromStartNote));
      scaleInCents.push(getCentsByInterval(intervalsFromStartNote));
      scaleInSemitones.push(intervalsFromStartNote);

      intervalCounter = (intervalCounter === scaleDef.length - 1) ? 0 : intervalCounter + 1;
    }

    return {
      startNote: startFrequency,
      inHertz: scaleInHertz,
      inCents: scaleInCents,
      inSemiTones: scaleInSemitones
    };
  }

  //定義コレクションに指定された名前の新しいスケールの定義と半音間隔定義の配列をついかする。

  function addScale (name, scaleDef) {
    if (arguments.length < 2) {
      throw new Error('Missing argument(s): addScale() expects two arguments');
    }
    if (!isValidScaleName(name)) {
      throw new Error('Invalid argument name: addScale(name, scaleDef) expects name to be a string consisting of lower or upper case letters (A-Z, a-z), spaces, hyphens(-) or underscores(_) only');
    }
    if (isScaleTypeDefined(name)) {
      throw new Error('Scale type already defined: addScale(name, scaleDef) scale with value of name argument is already defined – make sure you choose a scale name not already in use');
    }
    if (!isValidScaleDefinition(scaleDef)) {
      throw new Error('Invalid argument scaleDef: addScale(name, scaleDef) expects scaleDef to be an array of only positive integers greater than 0');
    }

    scaleDefs[name] = scaleDef;
  }

  //モジュールのえくすぽーと　できるようにする。（未完）

  return {
    makeScale: makeScale,
    getNote: getNote,
    addScale: addScale,
    getScaleNames: getScaleNames,

    // テスト目的のためのエクスポート （パブリックAPIではない）
    test: {
      getIntervalFromA4: getIntervalFromA4,
      getIntervalAdjustment: getIntervalAdjustment,
      getCentsByInterval: getCentsByInterval,
      getNoteByInterval: getNoteByInterval,
      isValidNoteName: isValidNoteName,
      isValidScaleName: isValidScaleName,
      isValidScaleDefinition: isValidScaleDefinition,
      isPositiveIntegerGreaterThanZero: isPositiveIntegerGreaterThanZero,
      isScaleTypeDefined: isScaleTypeDefined
    }
  };
  
}());

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Synthesizer = function () {
	function Synthesizer(frequencies, compressor, ctx) {
		_classCallCheck(this, Synthesizer);

		this.frequencies = frequencies;
		this.ctx = ctx;
		this.oscillators = [];
		this.compressor = compressor;
		this.initOscillators(frequencies);
	}

	_createClass(Synthesizer, [{
		key: 'playNote',
		value: function playNote(index, gainVal) {
			var osc = this.ctx.createOscillator();
			//osc.type = 'sine'; //正弦波
			osc.type = 'square'; //矩形波
			//osc.type = 'sawtooth'; //鋸派
			//osc.type = 'triangle'; //三角派
			
			//	//console.log(osc.frequency);
			osc.frequency.value = this.frequencies[this.frequencies.length - 1 - index];
			var gain = this.ctx.createGain();
			gain.connect(this.compressor);
			gain.gain.value = 0;
			osc.connect(gain);
			gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.1);
			gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
			osc.start();
			osc.stop(this.ctx.currentTime + 0.8);
		}
	}, {
		key: 'initOscillators',
		value: function initOscillators(frequencies) {
			//console.log(frequencies);
			for (var i = 0; i < frequencies.length; i++) {
				var osc = this.ctx.createOscillator();
				//osc.type = 'sine';
				osc.type = 'square';
   			//osc.type = 'sawtooth';
				//osc.type = 'triangle';
				
				var gain = this.ctx.createGain();
				gain.connect(this.compressor);
				gain.gain.value = 0.0;
				osc.connect(gain);
				osc.frequency.value = frequencies[frequencies.length - 1 - i];
				//console.log(osc);
				osc.start(this.ctx.currentTime);
				this.oscillators[i] = { osc: osc, gain: gain, val: 0 };
			}
			//console.log(this.oscillators);, 0
		}
	}, {
		key: 'updateGains',
		value: function updateGains(gainVals) {
			for (var i = 0; i < gainVals.length; i++) {
				if (this.oscillators[i].val != gainVals[i]) {
					this.oscillators[i].val = gainVals[i];
					this.oscillators[i].gain.gain.cancelScheduledValues(this.ctx.currentTime);
					this.oscillators[i].gain.gain.linearRampToValueAtTime(gainVals[i], this.ctx.currentTime + 0.1);
				}
			}
		}
	}, {
		key: 'endSynth',
		value: function endSynth() {
			//console.log(this.oscillators);
			for (var i = 0; i < this.oscillators.length; i++) {
				this.oscillators[i].gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
				this.oscillators[i].osc.stop(this.ctx.currentTime + 0.8);
			}
		}
	}]);

	return Synthesizer;
}();

exports.default = Synthesizer;

},{}]},{},[4])
