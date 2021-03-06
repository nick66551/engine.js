/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Sprite = __webpack_require__(1);
	var Sprites = __webpack_require__(3);
	var EventList = __webpack_require__(4);
	var Inspector = __webpack_require__(5);
	var Clock = __webpack_require__(6);
	var Renderer = __webpack_require__(7);
	var Sound = __webpack_require__(9);

	function engine(stageId, debugMode){

	    var canvas= document.getElementById(stageId);
	    var ctx = canvas.getContext("2d");

	    var settings = {
	        width: canvas.width,
	        height: canvas.height,
	        zoom: 1,
	        // gravity: 0, //@TODO: set gravity
	        updateFunctions: []
	    };

	    var sprites = new Sprites();
	    var inspector = new Inspector();
	    var io = __webpack_require__(10)(canvas, settings, debugMode);
	    var eventList = new EventList(io, debugMode);
	    var renderer = new Renderer(ctx, settings, debugMode);
	    var sound = new Sound();
	    var clock = new Clock(function(){
	        if(background.path){
	            renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
	        }
	        renderer.drawSprites(sprites);
	        eventList.traverse();
	        for(var i=0; i<settings.updateFunctions.length; i++){
	            settings.updateFunctions[i]();
	        };
	        sprites.runOnTick();
	        sprites.removeDeletedSprites();
	        inspector.updateFPS();
	    });

	    var background={};    

	    debugMode = debugMode || false;

	    function set(args){
	        settings.zoom       = args.zoom || settings.zoom;
	        settings.width      = args.width || settings.width;
	        settings.height     = args.height || settings.height;
	        settings.gravity    = args.gravity || settings.gravity;
	        settings.update     = args.update || settings.update;
	        if(args.width || args.zoom){ canvas.width = settings.width*settings.zoom;}
	        if(args.height || args.zoom){ canvas.height = settings.height*settings.zoom;}
	        return this;
	    }

	    // for proxy.setBackdrop, setBackground
	    function setBackground (path, x, y, w, h) {
	        background.path = path;
	        background.x = x;
	        background.y = y;
	        background.w = w;
	        background.h = h;
	    }

	    // for proxy.on / when: 
	    var when = function(event, target, handler){
	        if(typeof target === "function"){ // 如果不指定對象，直接傳入 handler
	            eventList.register(event, null, target);
	        } else {
	            eventList.register(event, target, handler);
	        }
	    }
	    var proxy = {
	        createSprite: function(args){
	            var newSprite = new Sprite(args, eventList, settings, renderer)
	            sprites._sprites.push(newSprite);
	            sprites._sprites.sort(function(a, b){return a.layer-b.layer;}); // 針對 z-index 做排序，讓越大的排在越後面，可以繪製在最上層
	            return newSprite;
	        },
	        print: renderer.print,
	        setBackground: setBackground,
	        setBackdrop: setBackground,
	        cursor: io.cursor,
	        inspector: inspector,
	        when: when,
	        on: when,
	        set: set,
	        stop: function(){ clock.stop(); sound.stop(); },
	        start: function(){ clock.start(); },
	        update: function(func){ settings.updateFunctions.push(func); },
	        always: function(func){ settings.updateFunctions.push(func); },
	        forever: function(func){ settings.updateFunctions.push(func); },
	        ctx: ctx,
	        clear: function(){ renderer.clear(); },
	        preloadImages: function(imagePaths, completeCallback, progressCallback){ renderer.preload(imagePaths, completeCallback, progressCallback); },
	        sound: sound,

	        // Will be deprecated:
	        drawBackdrop: function(src, x, y, width, height){ renderer.drawBackdrop(src, x, y, width, height); },
	        drawSprites: function(){ renderer.drawSprites(sprites); }
	    };
	    return proxy;
	}

	window.Engine = engine;

/***/ },
/* 1 */
/***/ (function(module, exports) {

//  state 用來表達 renderer 的以下狀態：
//
//   1. readyToStart:
//      初始狀態，此時執行 start 會直接開始 cycling(不斷執行 onTick)，並將狀態切換為 "running"。
//   2. running:
//      不停 cycling，此時可執行 stop 將狀態切換為 "stopping"。
//      但是執行 start 則不會有任何反應
//      執行 stop 則不會有任何反應。
//   3. stopping:
//      此時雖然已接受到停止訊息，但是最後一次的 rendering 尚未結束，
//      因此若在此時執行 start，會每隔一小段時間檢查 state 是否回復到 "readyToStart"。
//
//  狀態變化流程如下：
//  (1) -> (2) -> (3) -> (1)

var FPS = 60

function Clock(update){
    this._state = "readyToStart"; //"readyToStart", "stopping", "running";
    this._update = update;
}

Clock.prototype.start = function(){
    if(this._state==="readyToStart"){
        var onTick;
        this._state = "running";
        onTick = (function(){
            if(this._state==="running"){
                this._update();
                setTimeout(function(){
                    requestAnimationFrame(onTick);
                },1000/FPS);
            } else {
                this._state = "readyToStart";
            }
        }).bind(this);
        setTimeout( onTick, 0 ); // 必須 Async，否則會產生微妙的時間差
    } else if (this._state==="stopping") {
        setTimeout( start, 10 );
    }
}

Clock.prototype.stop = function(){
    if(this._state==="running"){
        this._state = "stopping";
    }
}

module.exports = Clock;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function EventList(io, debugMode){
    this.pool=[];
    this.io=io;
    this.debugMode = debugMode || false;
}

EventList.prototype.traverse = function (){
    var pool = this.pool,
        io = this.io,
        debugMode = this.debugMode;
    for(var i=0; i<pool.length; i++){
        if (pool[i].sprite && pool[i].sprite.constructor.name=="Sprite" && pool[i].sprite._deleted){ pool.splice(i,1); }
        else if (pool[i].event=="hover")    { hoverJudger(   pool[i].sprite,  pool[i].handler, io.cursor,  debugMode ); }
        else if (pool[i].event=="click")    { clickJudger(   pool[i].sprite,  pool[i].handler, io.clicked, debugMode ); }
        else if (pool[i].event=="keydown")  { keydownJudger( pool[i].key,     pool[i].handler, io.keydown, debugMode ); }
        else if (pool[i].event=="keyup")    { keydownJudger( pool[i].key,     pool[i].handler, io.keyup,   debugMode ); }
        else if (pool[i].event=="holding")  { holdingJudger( pool[i].key,     pool[i].handler, io.holding, debugMode ); }
        else if (pool[i].event=="touch")    {
            if(!pool[i].sprites.length || pool[i].sprites.length<2){
                console.log("You must pass a sprites array which length is bigger than 1 as the second argument!");
                return;
            }
            touchJudger( pool[i].sprites, pool[i].handler, debugMode );
        }
    }
    clearEventRecord(this.io);
}

EventList.prototype.clear = function(){
    this.pool=[];
}

EventList.prototype.register = function(event, target, handler){
    var eventObj = {
        event:event,
        handler:handler
    }
    // @TODO: target 型別偵測
    if (event=="touch"){
        eventObj.sprites = target;
    } else if (event=="keydown" || event=="keyup" || event=="holding"){
        eventObj.key = target;
    } else if (event=="hover" || event=="click") {
        eventObj.sprite = target;
    }
    this.pool.push(eventObj);
};


function hoverJudger(sprite, handler, cursor, debugMode){
    if(sprite.touched(cursor)){
        handler.call(sprite);
        if(debugMode){
            console.log("Just fired a hover handler at: ("+cursor.x+","+cursor.y+")");
        }
    }
}

function clickJudger(sprite, handler, clicked, debugMode){
    if(clicked.x && clicked.y){ // 如果有點擊記錄才檢查
        if(sprite){ // 如果是 Sprite, 則對其做判定
            var crossX = (sprite.x+sprite.width/2)>clicked.x && clicked.x>(sprite.x-sprite.width/2),
                crossY = (sprite.y+sprite.height/2)>clicked.y && clicked.y>(sprite.y-sprite.height/2);
            if( sprite.touched(clicked.x,clicked.y) ){
                handler.call(sprite);
                if(debugMode){
                    console.log("Just fired a click handler on a sprite! ("+JSON.stringify(clicked)+")");
                }
            }
        } else { // 如果為 null, 則對整個遊戲舞台做判定
            handler();
            if(debugMode){
                console.log("Just fired a click handler on stage! ("+JSON.stringify(clicked)+")");
            }
        }
    }
}

function keydownJudger(key, handler, keydown, debugMode){
    if(keydown[key]){
        handler();
        if(debugMode){
            console.log("Just fired a keydown handler on: "+key);
        }
    }
}

function keyupJudger(key, handler, keyup, debugMode){
    if(keyup[key]){
        handler();
        if(debugMode){
            console.log("Just fired a keyup handler on: "+key);
        }
    }
}

function holdingJudger(key, handler, holding, debugMode){
    if(holding[key]){
        handler();
        if(debugMode){
            console.log("Just fired a holding handler on: "+key);
        }
    }
}

// @TODO: Now we could only detect Sprite instance, not include cursor.
function touchJudger(sprites, handler, debugMode){
    var sprite = sprites[0],
        targets = sprites.slice(1);

    if (sprite.touched(targets)) {
        handler.call(sprite);
        if(debugMode){
            console.log("Just fired a touch handler on: "+sprite);
        }
    }
}

function clearEventRecord(io){
    io.clicked.x=null;
    io.clicked.y=null;
    for(var key in io.keydown){
        io.keydown[key]=false;
        io.keyup[key]=false;
    }
}

module.exports = EventList;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function Inspector(){
    this.fps = 0;
    this._lastFrameUpdatedTime = (new Date()).getTime();
}

Inspector.prototype.updateFPS = function(){
    var now = (new Date()).getTime();
    this.fps = Math.round( 1000/(now-this._lastFrameUpdatedTime) );
    this._lastFrameUpdatedTime = now;
}

module.exports = Inspector;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var keycode = __webpack_require__(10);

var io = function(canvas, settings, debugMode){

    var exports={},
        cursor={x:0, y:0},
        key=[],
        clicked={x:null, y:null},
        keyup={},
        keydown={},
        holding={};

    debugMode = debugMode || false;

    // Make any element focusable for keydown event.
    canvas.setAttribute("tabindex",'1');
    canvas.style.outline = "none";

    canvas.addEventListener("mousemove", function(e){
        cursor.x = e.offsetX / settings.zoom;
        cursor.y = e.offsetY / settings.zoom;
    });

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX / settings.zoom;
        clicked.y = e.offsetY / settings.zoom;
        if(debugMode){
            console.log( "Clicked! cursor:"+JSON.stringify(cursor) );
        }
    });

    canvas.addEventListener("keydown", function(e){
        var key = keycode(e.keyCode);
        keydown[key] = true;
        holding[key] = true;
        if(debugMode){
            console.log( "Keydown! key:"+key );
        }
    });

    canvas.addEventListener("keyup", function(e){
        var key = keycode(e.keyCode);
        keyup[key] = true;
        holding[key] = false;
        if(debugMode){
            console.log( "Keyup! key:"+key );
        }
    });

    exports.cursor = cursor;
    exports.clicked = clicked;
    exports.keyup = keyup;
    exports.keydown = keydown;
    exports.holding = holding;
    return exports;
};

module.exports = io;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var util = __webpack_require__(0);
var loader = new (__webpack_require__(9))();

function Renderer(ctx, sprites, settings, debugMode){

    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
    // var stageWidth = settings.width,
    //     stageHeight = settings.height;

    var imageCache = {};

    this.clear = function() {
        ctx.clearRect(0,0,settings.width,settings.height);
    };

    this.print = function(words, x, y, color, size, font) {
        x = x || 20;
        y = y || 20;
        size = size || 16; // Set or default
        font = font || "Arial";
        ctx.textBaseline = "top";
        ctx.font = (size*settings.zoom)+"px " + font;
        ctx.fillStyle = color || "black";
        ctx.fillText(words, x * settings.zoom, y * settings.zoom);

    };

    this.drawSprites = function(sprites){
        sprites.each(this.drawInstance);
    };

    this.drawInstance = function(instance){
        // console.log(instance);
        if(!instance.hidden){
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            var img = getImgFromCache(instance.getCurrentCostume());
            instance.width = img.width * instance.scale;
            instance.height = img.height * instance.scale;

            var rad = util.degreeToRad(instance.direction);
            ctx.scale(settings.zoom,settings.zoom);
            ctx.globalAlpha = instance.opacity;
            if (instance.rotationstyle === 'flipped') {
                if(rad >= Math.PI) {
                    ctx.translate(instance.x*2, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(  img,
                                    (instance.x-instance.width/2),
                                    (instance.y-instance.height/2),
                                    instance.width,
                                    instance.height
                    )
                    ctx.scale(-1, 1);
                    ctx.translate(-instance.x*2, 0);
                    ctx.globalAlpha = 1;
                    ctx.scale(1/settings.zoom,1/settings.zoom);
                    return;
                } else {
                    var rad = 0;
                }
            }
            if(instance.rotationstyle === 'fixed') {
                var rad = 0;
            }
            ctx.translate(instance.x, instance.y);
            ctx.rotate(rad);
            ctx.drawImage( img,
                        (-instance.width / 2),
                        (-instance.height / 2),
                        instance.width,
                        instance.height
            );
            ctx.rotate(-rad);
            ctx.translate(-instance.x, -instance.y);
            ctx.globalAlpha = 1;
            ctx.scale(1/settings.zoom,1/settings.zoom);
        }
    };

    this.getImgFromCache = getImgFromCache;

    // @Params:
    // - src: backdrop image location
    // - options: {x:number, y:number, width:number, height:number}
    this.drawBackdrop = function(src, x, y, width, height){
        if(src[0]=='#'){
            ctx.fillStyle=src;
            ctx.fillRect(0,0,settings.width*settings.zoom,settings.height*settings.zoom);
        } else {
            var img = imageCache[src];
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            if( !img ){
                img=new Image();
                img.src=src;
                imageCache[src]=img;
            }
            ctx.drawImage(
                img,
                (x||0)*settings.zoom,
                (y||0)*settings.zoom,
                (width||img.width)*settings.zoom,
                (height||img.height)*settings.zoom
            );
        }
    };

    this.preload = function(images, completeFunc, progressFunc){
        var loaderProxy = {};
        if(images.length>0){
            if(completeFunc){
                onComplete(completeFunc);
            }
            if(progressFunc){
                onProgress(progressFunc);
            }
            for(var i=0; i<images.length; i++){
                var path = images[i];
                imageCache[path] = loader.addImage(path);
            }
            function onComplete(callback){
                loader.addCompletionListener(function(){
                    callback();
                });
            };
            function onProgress(callback){
                loader.addProgressListener(function(e) {
                    // e.completedCount, e.totalCount, e.resource.imageNumber
                    callback(e);
                });
            }
            loaderProxy.complete = onComplete;
            loaderProxy.progress = onProgress;
            loader.start();
            if(debugMode){
                console.log("Start loading "+images.length+" images...");
                loader.addProgressListener(function(e) {
                    console.log("Preloading progressing...");
                });
                loader.addCompletionListener(function(){
                    console.log("Preloading completed!");
                });
            }
        } else {
            if(completeFunc){
                completeFunc();
            }
        }
        return loaderProxy;
    };

    function getImgFromCache(path){
        var img = imageCache[path];
        if( !img ){
            img=new Image();
            img.src=path;
            imageCache[path]=img;
        }
        return img;
    }
}

module.exports = Renderer;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

function Sound(debugMode){
    this.sounds = [];
    // this.generate = function(url){
    //     return (function(){
    //         var sound = new Audio(url),
    //             obj = {};
    //         sounds.push(sound);
    //         obj.play = function(url){
    //             sound.load();
    //             sound.play();
    //         };
    //         obj.stop = function(){
    //             sound.pause();
    //             sound.currentTime = 0;
    //         };
    //         return obj;
    //     })()
    // }
    this.play = function(url){
        var sounds = this.sounds;
        return (function(){
            var sound = new Audio(url);
            var index = sounds.length;
            sounds.push(sound);
            sound.play();
            sound.addEventListener('ended', function(){
                sounds[index] = null;
                sound = null;
            });
            return sound;
        })();
    }
    this.stop = function(){
        for(var i=0; i<this.sounds.length; i++){
            if(this.sounds[i]){
                this.sounds[i].pause();
            }
        }
    }
}

module.exports = Sound;

/***/ }),
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var loader = new (__webpack_require__(8))();

	function Renderer(ctx, settings, debugMode){

	    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
	    // var stageWidth = settings.width,
	    //     stageHeight = settings.height;

	    var imageCache = {};

	    this.clear = function() {
	        ctx.clearRect(0,0,settings.width,settings.height);
	    };

	    this.print = function(words, x, y, color, size, font) {
	        x = util.isNumeric(x) ? x : 20;
	        y = util.isNumeric(y) ? y : 20;
	        size = size || 16; // Set or default
	        font = font || "Arial";
	        ctx.textBaseline = "top";
	        ctx.font = (size*settings.zoom)+"px " + font;
	        ctx.fillStyle = color || "black";
	        ctx.fillText(words, x * settings.zoom, y * settings.zoom);
	    };

	    this.drawSprites = function(sprites){
	        sprites.each(this.drawInstance);
	    };

	    this.drawInstance = function(instance){
	        // console.log(instance);
	        if(!instance.hidden){
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            var img = getImgFromCache(instance.getCurrentCostume());
	            instance.width = img.width * instance.scale;
	            instance.height = img.height * instance.scale;

	            var rad = util.degreeToRad(instance.direction);
	            ctx.scale(settings.zoom,settings.zoom);
	            ctx.globalAlpha = instance.opacity;
	            if (instance.rotationstyle === 'flipped') {
	                if(rad >= Math.PI) {
	                    ctx.translate(instance.x*2, 0);
	                    ctx.scale(-1, 1);
	                    ctx.drawImage(  img,
	                                    (instance.x-instance.width/2),
	                                    (instance.y-instance.height/2),
	                                    instance.width,
	                                    instance.height
	                    )
	                    ctx.scale(-1, 1);
	                    ctx.translate(-instance.x*2, 0);
	                    ctx.globalAlpha = 1;
	                    ctx.scale(1/settings.zoom,1/settings.zoom);
	                    return;
	                } else {
	                    var rad = 0;
	                }
	            }
	            if(instance.rotationstyle === 'fixed') {
	                var rad = 0;
	            }
	            ctx.translate(instance.x, instance.y);
	            ctx.rotate(rad);
	            ctx.drawImage( img,
	                        (-instance.width / 2),
	                        (-instance.height / 2),
	                        instance.width,
	                        instance.height
	            );
	            ctx.rotate(-rad);
	            ctx.translate(-instance.x, -instance.y);
	            ctx.globalAlpha = 1;
	            ctx.scale(1/settings.zoom,1/settings.zoom);
	        }
	    };

	    this.getImgFromCache = getImgFromCache;

	    // @Params:
	    // - src: backdrop image location
	    // - options: {x:number, y:number, width:number, height:number}
	    this.drawBackdrop = function(src, x, y, width, height){
	        if(src[0]=='#'){
	            ctx.fillStyle=src;
	            ctx.fillRect(0,0,settings.width*settings.zoom,settings.height*settings.zoom);
	        } else {
	            var img = imageCache[src];
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            if( !img ){
	                img=new Image();
	                img.src=src;
	                imageCache[src]=img;
	            }
	            ctx.drawImage(
	                img,
	                (x||0)*settings.zoom,
	                (y||0)*settings.zoom,
	                (width||img.width)*settings.zoom,
	                (height||img.height)*settings.zoom
	            );
	        }
	    };

	    this.preload = function(images, completeFunc, progressFunc){
	        var loaderProxy = {};
	        if(images.length>0){
	            if(completeFunc){
	                onComplete(completeFunc);
	            }
	            if(progressFunc){
	                onProgress(progressFunc);
	            }
	            for(var i=0; i<images.length; i++){
	                var path = images[i];
	                imageCache[path] = loader.addImage(path);
	            }
	            function onComplete(callback){
	                loader.addCompletionListener(function(){
	                    callback();
	                });
	            };
	            function onProgress(callback){
	                loader.addProgressListener(function(e) {
	                    // e.completedCount, e.totalCount, e.resource.imageNumber
	                    callback(e);
	                });
	            }
	            loaderProxy.complete = onComplete;
	            loaderProxy.progress = onProgress;
	            loader.start();
	            if(debugMode){
	                console.log("Start loading "+images.length+" images...");
	                loader.addProgressListener(function(e) {
	                    console.log("Preloading progressing...");
	                });
	                loader.addCompletionListener(function(){
	                    console.log("Preloading completed!");
	                });
	            }
	        } else {
	            if(completeFunc){
	                completeFunc();
	            }
	        }
	        return loaderProxy;
	    };

	    function getImgFromCache(path){
	        var img = imageCache[path];
	        if( !img ){
	            img=new Image();
	            img.src=path;
	            imageCache[path]=img;
	        }
	        return img;
	    }
	}

	module.exports = Renderer;

/***/ },
/* 8 */
/***/ (function(module, exports) {

function Sprites(){
    this._sprites = [];
}

Sprites.prototype.runOnTick = function(){
    this.each(function(){
        this.update();
    });
}

Sprites.prototype.each = function(func){
    var sprites = this._sprites;
    // console.log(func);
    for(var i=0; i<sprites.length; i++){
        func.call(sprites[i],sprites[i]);
    }
}

Sprites.prototype.removeDeletedSprites = function(){
    var sprites = this._sprites;
    for(var i=0; i<sprites.length; i++){
        if(sprites[i]._deleted){
            sprites.splice(i,1);
        }
    }
}

Sprites.prototype.clear = function(){
    this._sprites = [];
};

module.exports = Sprites;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

/*!  | http://thinkpixellab.com/PxLoader */
/*
 * PixelLab Resource Loader
 * Loads resources while providing progress updates.
 */

function PxLoader(settings) {

    // merge settings with defaults
    settings = settings || {};
    this.settings = settings;

    // how frequently we poll resources for progress
    if (settings.statusInterval == null) {
        settings.statusInterval = 5000; // every 5 seconds by default
    }

    // delay before logging since last progress change
    if (settings.loggingDelay == null) {
        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
    }

    // stop waiting if no progress has been made in the moving time window
    if (settings.noProgressTimeout == null) {
        settings.noProgressTimeout = Infinity; // do not stop waiting by default
    }

    var entries = [],
        // holds resources to be loaded with their status
        completionListeners = [],
        progressListeners = [],
        timeStarted, progressChanged = Date.now();

    /**
     * The status of a resource
     * @enum {number}
     */
    var ResourceState = {
        QUEUED: 0,
        WAITING: 1,
        LOADED: 2,
        ERROR: 3,
        TIMEOUT: 4
    };

    // places non-array values into an array.
    var ensureArray = function(val) {
        if (val == null) {
            return [];
        }

        if (Array.isArray(val)) {
            return val;
        }

        return [val];
    };

    // add an entry to the list of resources to be loaded
    this.add = function(resource) {

        // TODO: would be better to create a base class for all resources and
        // initialize the PxLoaderTags there rather than overwritting tags here
        resource.tags = new PxLoaderTags(resource.tags);

        // ensure priority is set
        if (resource.priority == null) {
            resource.priority = Infinity;
        }

        entries.push({
            resource: resource,
            status: ResourceState.QUEUED
        });
    };

    this.addProgressListener = function(callback, tags) {
        progressListeners.push({
            callback: callback,
            tags: new PxLoaderTags(tags)
        });
    };

    this.addCompletionListener = function(callback, tags) {
        completionListeners.push({
            tags: new PxLoaderTags(tags),
            callback: function(e) {
                if (e.completedCount === e.totalCount) {
                    callback(e);
                }
            }
        });
    };

    // creates a comparison function for resources
    var getResourceSort = function(orderedTags) {

        // helper to get the top tag's order for a resource
        orderedTags = ensureArray(orderedTags);
        var getTagOrder = function(entry) {
            var resource = entry.resource,
                bestIndex = Infinity;
            for (var i = 0; i < resource.tags.length; i++) {
                for (var j = 0; j < Math.min(orderedTags.length, bestIndex); j++) {
                    if (resource.tags.all[i] === orderedTags[j] && j < bestIndex) {
                        bestIndex = j;
                        if (bestIndex === 0) {
                            break;
                        }
                    }
                    if (bestIndex === 0) {
                        break;
                    }
                }
            }
            return bestIndex;
        };
        return function(a, b) {
            // check tag order first
            var aOrder = getTagOrder(a),
                bOrder = getTagOrder(b);
            if (aOrder < bOrder) { return -1; }
            if (aOrder > bOrder) { return 1; }

            // now check priority
            if (a.priority < b.priority) { return -1; }
            if (a.priority > b.priority) { return 1; }
            return 0;
        };
    };

    this.start = function(orderedTags) {
        timeStarted = Date.now();

        // first order the resources
        var compareResources = getResourceSort(orderedTags);
        entries.sort(compareResources);

        // trigger requests for each resource
        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            entry.status = ResourceState.WAITING;
            entry.resource.start(this);
        }

        // do an initial status check soon since items may be loaded from the cache
        setTimeout(statusCheck, 100);
    };

    var statusCheck = function() {
        var checkAgain = false,
            noProgressTime = Date.now() - progressChanged,
            timedOut = (noProgressTime >= settings.noProgressTimeout),
            shouldLog = (noProgressTime >= settings.loggingDelay);

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (entry.status !== ResourceState.WAITING) {
                continue;
            }

            // see if the resource has loaded
            if (entry.resource.checkStatus) {
                entry.resource.checkStatus();
            }

            // if still waiting, mark as timed out or make sure we check again
            if (entry.status === ResourceState.WAITING) {
                if (timedOut) {
                    entry.resource.onTimeout();
                } else {
                    checkAgain = true;
                }
            }
        }

        // log any resources that are still pending
        if (shouldLog && checkAgain) {
            log();
        }

        if (checkAgain) {
            setTimeout(statusCheck, settings.statusInterval);
        }
    };

    this.isBusy = function() {
        for (var i = 0, len = entries.length; i < len; i++) {
            if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
                return true;
            }
        }
        return false;
    };

    var onProgress = function(resource, statusType) {

        var entry = null,
            i, len, listeners, listener, shouldCall;

        // find the entry for the resource
        for (i = 0, len = entries.length; i < len; i++) {
            if (entries[i].resource === resource) {
                entry = entries[i];
                break;
            }
        }

        // we have already updated the status of the resource
        if (entry == null || entry.status !== ResourceState.WAITING) {
            return;
        }
        entry.status = statusType;
        progressChanged = Date.now();

        // ensure completion listeners fire after progress listeners
        listeners = progressListeners.concat( completionListeners );

        // fire callbacks for interested listeners
        for (i = 0, len = listeners.length; i < len; i++) {

            listener = listeners[i];
            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                shouldCall = true;
            } else {
                // listener only wants to hear about certain tags
                shouldCall = resource.tags.intersects(listener.tags);
            }

            if (shouldCall) {
                sendProgress(entry, listener);
            }
        }
    };

    this.onLoad = function(resource) {
        onProgress(resource, ResourceState.LOADED);
    };
    this.onError = function(resource) {
        onProgress(resource, ResourceState.ERROR);
    };
    this.onTimeout = function(resource) {
        onProgress(resource, ResourceState.TIMEOUT);
    };

    // sends a progress report to a listener
    var sendProgress = function(updatedEntry, listener) {
        // find stats for all the resources the caller is interested in
        var completed = 0,
            total = 0,
            i, len, entry, includeResource;
        for (i = 0, len = entries.length; i < len; i++) {

            entry = entries[i];
            includeResource = false;

            if (listener.tags.length === 0) {
                // no tags specified so always tell the listener
                includeResource = true;
            } else {
                includeResource = entry.resource.tags.intersects(listener.tags);
            }

            if (includeResource) {
                total++;
                if (entry.status === ResourceState.LOADED ||
                    entry.status === ResourceState.ERROR ||
                    entry.status === ResourceState.TIMEOUT) {

                    completed++;
                }
            }
        }

        listener.callback({
            // info about the resource that changed
            resource: updatedEntry.resource,

            // should we expose StatusType instead?
            loaded: (updatedEntry.status === ResourceState.LOADED),
            error: (updatedEntry.status === ResourceState.ERROR),
            timeout: (updatedEntry.status === ResourceState.TIMEOUT),

            // updated stats for all resources
            completedCount: completed,
            totalCount: total
        });
    };

    // prints the status of each resource to the console
    var log = this.log = function(showAll) {
        if (!window.console) {
            return;
        }

        var elapsedSeconds = Math.round((Date.now() - timeStarted) / 1000);
        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

        for (var i = 0, len = entries.length; i < len; i++) {
            var entry = entries[i];
            if (!showAll && entry.status !== ResourceState.WAITING) {
                continue;
            }

            var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
            switch(entry.status) {
                case ResourceState.QUEUED:
                    message += ' (Not Started)';
                    break;
                case ResourceState.WAITING:
                    message += ' (Waiting)';
                    break;
                case ResourceState.LOADED:
                    message += ' (Loaded)';
                    break;
                case ResourceState.ERROR:
                    message += ' (Error)';
                    break;
                case ResourceState.TIMEOUT:
                    message += ' (Timeout)';
                    break;
            }

            if (entry.resource.tags.length > 0) {
                message += ' Tags: [' + entry.resource.tags.all.join(',') + ']';
            }

            window.console.log(message);
        }
    };
}


// Tag object to handle tag intersection; once created not meant to be changed
// Performance rationale: http://jsperf.com/lists-indexof-vs-in-operator/3

function PxLoaderTags(values) {

    this.all = [];
    this.first = null; // cache the first value
    this.length = 0;

    // holds values as keys for quick lookup
    this.lookup = {};

    if (values) {

        // first fill the array of all values
        if (Array.isArray(values)) {
            // copy the array of values, just to be safe
            this.all = values.slice(0);
        } else if (typeof values === 'object') {
            for (var key in values) {
                if(values.hasOwnProperty(key)) {
                    this.all.push(key);
                }
            }
        } else {
            this.all.push(values);
        }

        // cache the length and the first value
        this.length = this.all.length;
        if (this.length > 0) {
            this.first = this.all[0];
        }

        // set values as object keys for quick lookup during intersection test
        for (var i = 0; i < this.length; i++) {
            this.lookup[this.all[i]] = true;
        }
    }
}

// compare this object with another; return true if they share at least one value
PxLoaderTags.prototype.intersects = function(other) {

    // handle empty values case
    if (this.length === 0 || other.length === 0) {
        return false;
    }

    // only a single value to compare?
    if (this.length === 1 && other.length === 1) {
        return this.first === other.first;
    }

    // better to loop through the smaller object
    if (other.length < this.length) {
        return other.intersects(this);
    }

    // loop through every key to see if there are any matches
    for (var key in this.lookup) {
        if (other.lookup[key]) {
            return true;
        }
    }

    return false;
};

function PxLoaderImage(url, tags, priority, options) {
    options = options || {};

    var self = this,
        loader = null,
        img;

    img = this.img = new Image();
    if (options.origin) {
        img.crossOrigin = options.origin;
    }

    this.tags = tags;
    this.priority = priority;

    var onReadyStateChange = function() {
        if (self.img.readyState !== 'complete') {
            return;
        }

        onLoad();
    };

    var onLoad = function() {
        loader.onLoad(self);
        cleanup();
    };

    var onError = function() {
        loader.onError(self);
        cleanup();
    };

    var onTimeout = function() {
        loader.onTimeout(self);
        cleanup();
    };

    var cleanup = function() {
        self.unbind('load', onLoad);
        self.unbind('readystatechange', onReadyStateChange);
        self.unbind('error', onError);
    };

    this.start = function(pxLoader) {
        // we need the loader ref so we can notify upon completion
        loader = pxLoader;

        // NOTE: Must add event listeners before the src is set. We
        // also need to use the readystatechange because sometimes
        // load doesn't fire when an image is in the cache.
        self.bind('load', onLoad);
        self.bind('readystatechange', onReadyStateChange);
        self.bind('error', onError);

        self.img.src = url;
    };

    // called by PxLoader to check status of image (fallback in case
    // the event listeners are not triggered).
    this.checkStatus = function() {
        onReadyStateChange();
    };

    // called by PxLoader when it is no longer waiting
    this.onTimeout = function() {
        if (self.img.complete) {
            onLoad();
        } else {
            onTimeout();
        }
    };

    // returns a name for the resource that can be used in logging
    this.getName = function() {
        return url;
    };

    // cross-browser event binding
    this.bind = function(eventName, eventHandler) {
        self.img.addEventListener(eventName, eventHandler, false);
    };

    // cross-browser event un-binding
    this.unbind = function(eventName, eventHandler) {
        self.img.removeEventListener(eventName, eventHandler, false);
    };

}

// add a convenience method to PxLoader for adding an image
PxLoader.prototype.addImage = function(url, tags, priority, options) {
    var imageLoader = new PxLoaderImage(url, tags, priority, options);
    this.add(imageLoader);

    // return the img element to the caller
    return imageLoader.img;
};

module.exports = PxLoader;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
}

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var Sprite = __webpack_require__(7);
var Sprites = __webpack_require__(8);
var EventList = __webpack_require__(2);
var Inspector = __webpack_require__(3);
var Clock = __webpack_require__(1);
var Renderer = __webpack_require__(5);
var Sound = __webpack_require__(6);

function engine(stageId, debugMode){

    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");

    var settings = {
        width: canvas.width,
        height: canvas.height,
        zoom: 1,
        // gravity: 0, //@TODO: set gravity
        updateFunctions: []
    };

    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = __webpack_require__(4)(canvas, settings, debugMode);
    var eventList = new EventList(io, debugMode);
    var renderer = new Renderer(ctx, sprites, settings, debugMode);
    var sound = new Sound();
    var clock = new Clock(function(){
        eventList.traverse();
        for(var i=0; i<settings.updateFunctions.length; i++){
            settings.updateFunctions[i]();
        };
        sprites.runOnTick();
        sprites.removeDeletedSprites();
        inspector.updateFPS();
    });

    debugMode = debugMode || false;

    function set(args){
        settings.zoom      = args.zoom || settings.zoom;
        settings.width      = args.width || settings.width;
        settings.height     = args.height || settings.height;
        settings.gravity    = args.gravity || settings.gravity;
        settings.update     = args.update || settings.update;
        if(args.width || args.zoom){ canvas.width = settings.width*settings.zoom;}
        if(args.height || args.zoom){ canvas.height = settings.height*settings.zoom;}
        return this;
    }

    // function reset(){
    //     eventList.clear();
    //     sprites.clear();
    // }

    // for proxy.on / when: 
    var when = function(event, target, handler){
        if(typeof target === "function"){ // 如果不指定對象，直接傳入 handler
            eventList.register(event, null, target);
        } else {
            eventList.register(event, target, handler);
        }
    }

    var proxy = {
        createSprite: function(args){
            var newSprite = new Sprite(args, eventList, settings, renderer)
            sprites._sprites.push(newSprite);
            sprites._sprites.sort(function(a, b){return a.layer-b.layer;}); // 針對 z-index 做排序，讓越大的排在越後面，可以繪製在最上層
            return newSprite;
        },
        print: renderer.print,
        drawSprites: function(){ renderer.drawSprites(sprites); },
        drawBackdrop: function(src, x, y, width, height){ renderer.drawBackdrop(src, x, y, width, height); },
        cursor: io.cursor,
        inspector: inspector,
        when: when,
        on: when,
        set: set,
        stop: function(){ clock.stop(); sound.stop(); },
        start: function(){ clock.start(); },
        update: function(func){ settings.updateFunctions.push(func); },
        always: function(func){ settings.updateFunctions.push(func); },
        forever: function(func){ settings.updateFunctions.push(func); },
        ctx: ctx,
        clear: function(){ renderer.clear(); },
        preloadImages: function(imagePaths, completeCallback, progressCallback){ renderer.preload(imagePaths, completeCallback, progressCallback); },
        sound: sound
    };
    return proxy;
}

window.Engine = engine;

/***/ })
/******/ ]);