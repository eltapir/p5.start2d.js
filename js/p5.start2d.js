/* ********************************************************************************************** */
/*                                                                                                */
/* Copyright (C) 2019-2020, Kris HEYSE                                                            */
/*                                                                                                */
/* This library is free software; you can redistribute it and/or                                  */
/* modify it under the terms of the GNU Lesser General Public                                     */
/* License version 2.1 as published by the Free Software Foundation.                              */
/*                                                                                                */
/* This library is distributed in the hope that it will be useful,                                */
/* but WITHOUT ANY WARRANTY; without even the implied warranty of                                 */
/* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU                              */
/* Lesser General Public License for more details.                                                */
/*                                                                                                */
/* You should have received a copy of the GNU Lesser General Public                               */
/* License along with this library; if not, write to the Free Software                            */
/* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA                   */
/*                                                                                                */
/* ********************************************************************************************** */

/* ********************************************************************************************** */
/*                                                                                                */
/*   p5.js Extension                                                                              */
/*                                                                                                */
/* - Use of mm, cm and inches, instead of pixels                                                  */
/* - Panning and zooming                                                                          */
/* - Easy export to png file                                                                      */
/*                                                                                                */
/*   Author   : Kris HEYSE                                                                        */
/*   version  : 0.4.1                                                                             */
/*                                                                                                */
/* ********************************************************************************************** */

'use strict';


// CONSTANTS
// =================================================================================================

const VERSION = '0.4.1';

const ARTWORK_DEFAULTS = {

    size: [297, 210],  // array of strings: ['297mm', '210mm']
                       // array of numbers: [297, 210]
                       // string: 'A4', 'A2', 'LETTER', 'ANSIA', ...
    orientation: null, // string: 'portrait', 'landscape' or null
    units: 'mm',       // string: px, mm, cm, in
    exportPPI: 300,    // number: output/export resolution (pixels per inch)

    maxZoom: 2.0,   // number: maximum zoom
    minZoom: 0.2,   // number: minimum zoom => can change to fit sketch on screen
    zoomInc: 0.025, // number: zoom / scroll step size

    screenPadding: '10mm', // string: space between artwork and window/screen border
                           // number: value in units
    screenPPI: 96,         // number: screen resolution

    shadowVisible: true,                  // bool: shadow visible
    shadowColor: 'rgba(64, 64, 64, 0.5)', // string: shadow color
    shadowX: '0mm',                       // string|number: unit value (ex. '1cm' or 1)
    shadowY: '6mm',                       // string|number: unit value (ex. '10mm' or 10)
    shadowBlur: '10mm',                   // string|number: unit value (ex. '0.4in')

    wallpaperColor: '#808080', // string: body/wallpaper color

    outputFileName: 'artwork-@date-@seed', // string: output file name
                                           // @seed == current seed value
                                           // @date == date & time
                                           // ex.: @seed-artwork-@date  
                                           // =>   seed  name     date    time
                                           // =>   7521-artwork-20190513-161132

    xyDisplayDecimals: 2, // number: number of decimals for mouse cooordinates display

    // -----------------------------------------------------------------------------------------

    wallpaperImage: null,
    renderer: null,
    seed: null,
    noiseSeed: null
}

const PAPER_SIZE = {

    'A0': ['841mm', '1189mm'],
    'A1': ['594mm', '841mm'],
    'A2': ['420mm', '594mm'],
    'A3': ['297mm', '420mm'],
    'A4': ['210mm', '297mm'],
    'A5': ['148mm', '210mm'],
    'A6': ['105mm', '148mm'],
    'A7': ['74mm', '105mm'],
    'A8': ['52mm', '74mm'],
    'A9': ['37mm', '52mm'],
    'A10': ['26mm', '37mm'],

    'B0': ['1000mm', '1414mm'],
    'B1': ['707mm', '1000mm'],
    'B2': ['500mm', '707mm'],
    'B3': ['353mm', '500mm'],
    'B4': ['250mm', '353mm'],
    'B5': ['176mm', '250mm'],
    'B6': ['125mm', '176mm'],
    'B7': ['88mm', '125mm'],
    'B8': ['62mm', '88mm'],
    'B9': ['44mm', '62mm'],
    'B10': ['31mm', '44mm'],

    'C0': ['917mm', '1297mm'],
    'C1': ['648mm', '917mm'],
    'C2': ['458mm', '648mm'],
    'C3': ['324mm', '458mm'],
    'C4': ['229mm', '324mm'],
    'C5': ['162mm', '229mm'],
    'C6': ['114mm', '162mm'],
    'C7': ['81mm', '114mm'],
    'C8': ['57mm', '81mm'],
    'C9': ['40mm', '57mm'],
    'C10': ['28mm', '40mm'],

    'LEDGER': ['11in', '17in'],
    'LEGAL': ['8.5in', '14in'],
    'LETTER': ['8.5in', '11in'],
    'JUNIOR': ['5in', '8in'],

    'ANSIA': ['8.5in', '11.0in'],
    'ANSIB': ['11.0in', '17.0in'],
    'ANSIC': ['17.0in', '22.0in'],
    'ANSID': ['22.0in', '34.0in'],
    'ANSIE': ['34.0in', '44.0in'],

    'ARCHA': ['9.0in', '12.0in'],
    'ARCHB': ['12.0in', '18.0in'],
    'ARCHC': ['18.0in', '24.0in'],
    'ARCHD': ['24.0in', '36.0in'],
    'ARCHE': ['36.0in', '48.0in'],
    'ARCHE1': ['30.0in', '42.0in']
}


// PUBLIC METHODS
// =================================================================================================

// createCanvas

p5.prototype.createCanvas = function(originalFunc) {

    return function (props = {}) {
    
        let cvs;
    
        this._ctx = this._isGlobal ? window : this;
    
        this._p5StartMode = false;
    
        if (typeof props === 'object') {
    
            console.log(`p5.start2d.js v${VERSION}`);
    
            this._props = { ...ARTWORK_DEFAULTS, ...props };
    
            this._p5StartMode = true;
    
            this._units = this._props.units;
            this._exportPPI = this._props.exportPPI;
    
            // TODO: test with (U)HD monitor
            this._dpr = Math.ceil(window.devicePixelRatio) || 1;
            this._cssScreenPPI = this._props.screenPPI / this._dpr;
    
            if (typeof this._props.screenPadding === 'number') {
    
                this._screenPadding = this._props.screenPadding + this._units;
    
            } else {
    
                this._screenPadding = this._props.screenPadding;
            }
    
            if (typeof this._props.size === 'string') {
    
                if (this._props.size.toUpperCase() in PAPER_SIZE) {
    
                    this._props.size = PAPER_SIZE[this._props.size.toUpperCase()];
    
                } else {
    
                    console.log(`# WARNING #\ninvalid paper size. Set to default ${ARTWORK_DEFAULTS.size}\n\n`)
                    this._props.size = ARTWORK_DEFAULTS.size;
                }
            }
    
            this._uWidth = this._toUnits(this._props.size[0], this._units, this._exportPPI);
            this._uHeight = this._toUnits(this._props.size[1], this._units, this._exportPPI);
    
            this._orientation = this._props.orientation;
    
            if (this._orientation && this._orientation.toLowerCase() === 'portrait') {
    
                if (this._uWidth > this._uHeight) {
    
                    let tmp = this._uWidth;
                    this._uWidth = this._uHeight;
                    this._uHeight = tmp
                }
    
            } else if (this._orientation && this._orientation.toLowerCase() === 'landscape') {
    
                if (this._uWidth < this._uHeight) {
    
                    let tmp = this._uWidth;
                    this._uWidth = this._uHeight;
                    this._uHeight = tmp
                }
            }
    
            this._rndr = props.renderer === null ? this.P2D : props.renderer;
    
            this._minZoom = this._props.minZoom;
            this._minZoomCurrent = this._minZoom;
            this._maxZoom = this._props.maxZoom;
            this._zoomInc = this._props.zoomInc;
    
            this._shadowVisible = !!this._props.shadowVisible;
            this._shadowColor = this._props.shadowColor;
            this._shadowX = this._toUnits(this._props.shadowX, this._units, this._cssScreenPPI);
            this._shadowY = this._toUnits(this._props.shadowY, this._units, this._cssScreenPPI);
            this._shadowBlur = this._toUnits(this._props.shadowBlur, this._units, this._cssScreenPPI);
    
            this._seed = this._props.seed || Math.floor(Math.random() * (10000 - 1000) + 1000);
            this._noiseSeed = this._props.noiseSeed || this._seed;
    
            this._wallpaperColor = this._props.wallpaperColor;
            this._wallpaperImage = this._props.wallpaperImage;
    
            this._outputFileName = this._props.outputFileName;
    
            this._dispDec = this._props.xyDisplayDecimals;
    
            // -------------------------------------------------------------------------------------
    
            this._aw = null;
    
            this._uMult = 0;
            this._pxWidth = 0;
            this._pxHeight = 0;
            this._pxScreenPadding = 0;
    
            this._fitZoom = 0;
            this._zoom = 0;
    
            this._cvsStartPos;
            this._mouseX = 0;
            this._mouseY = 0;
            this._mouseStartDragX = 0;
            this._mouseStartDragY = 0;
            this._mouseDown = false;
            this._mouseDragging = false;
            this._hasMouseFocus = false;
    
            this._xyDisplay = null;
    
            // -------------------------------------------------------------------------------------
    
            this._aw = this._createArtworkParent();
    
            this._setWallpaper(this._aw, this._wallpaperImage, this._wallpaperColor);
    
            this.randomSeed(this._seed);
            this.noiseSeed(this._noiseSeed);
    
            this._initUnitScale();
    
            if (this._rndr === this.WEBGL) {
    
                this.noSmooth();
                this.setAttributes('antialias', true);
            }
    
            cvs = originalFunc.call(this, this._pxWidth, this._pxHeight, this._props.renderer);
            cvs.parent(this._aw.id);
            this.canvas.classList.add('canvas');
    
            this._initPanZoom();
            this._initShadow();
            this._initListeners();
            this._initPositionDisplay();

            this._displayCoordinates();
            
    
            if (this.drawingContext.imageSmoothingEnabled) {
    
                this.drawingContext.imageSmoothingEnabled = true;
            }
    
            if (this.drawingContext.imageSmoothingQuality) {
    
                this.drawingContext.imageSmoothingQuality = 'high';
            }
    
            this.noLoop();
    
            this._setGlobalProperties();
    
            // TODO : test this in setup()
            this.drawingContext.scale(this._unitScale, this._unitScale);
    
            console.log(`width: ${this._uWidth}${this._units} ` +
                `/ height: ${this._uHeight}${this._units} ` +
                `/ exportPPI: ${this._exportPPI} / seed: ${this._seed}`);
    
        } else {
    
            cvs = originalFunc.apply(this, arguments);
        }
    
        return cvs;
    }

}(p5.prototype.createCanvas);


// resizeCanvas
// should you feel the need to cut your canvas in half while painting ;)

p5.prototype.resizeCanvas = function(originalFunc) {

    return function(w, h, noRedraw) {

        if (this._p5StartMode) {

            if (this._seed) {
                this.randomSeed(this._seed);
            }
    
            if (this._noiseSeed) {
                this.noiseSeed(this._noiseSeed);
            }
    
            this._uWidth = w;
            this._uHeight = h;
    
            this._pxWidth = Math.floor(this._uWidth * this._uMult);
            this._pxHeight = Math.floor(this._uHeight * this._uMult);
    
            // original.apply(this, [this._pxWidth, this._pxHeight, noRedraw]);
            originalFunc.call(this, this._pxWidth, this._pxHeight, noRedraw);
    
            this._initPanZoom();
    
            this._setGlobalProperties();
    
            // TODO : test this in setup()
            this.drawingContext.scale(this._unitScale, this._unitScale);
    
            console.log(`width: ${this._uWidth}${this._units} ` +
                `/ height: ${this._uHeight}${this._units} ` +
                `/ exportPPI: ${this._exportPPI} / seed: ${this._seed}`);
    
        } else {
    
            originalFunc.apply(this, arguments);
        }

    }

}(p5.prototype.resizeCanvas);


// resetMatrix

p5.prototype.resetMatrix = function(originalFunc) {

    return function() {

        originalFunc.call(this);
 
        if (this._p5StartMode) {

            if (!this._rndr || this._rndr === this.P2D) {
    
                this.push();
                this.drawingContext.scale(this._unitScale, this._unitScale);
            }
    
            this._setGlobalProperties();
        }

    }

}(p5.prototype.resetMatrix);


// randomSeed

p5.prototype.randomSeed = function (originalFunc) {

    return function(seed) {

        originalFunc.call(this, seed);
    
        if (this._p5StartMode) {
    
            this._seed = seed;
        }
    }

}(p5.prototype.randomSeed);


// noiseSeed

p5.prototype.noiseSeed = function (originalFunc) {

    return function(seed) {

        originalFunc.call(this, seed);
    
        if (this._p5StartMode) {
    
            this._seed = seed;
        }
    }

}(p5.prototype.noiseSeed);


// timer (added for testing performance while developing)

p5.prototype.startTimer = function () {

    if (!this._startTm) {

        this._startTm = parseInt(performance.now());
    }
}

p5.prototype.stopTimer = function () {

    const msToTime = function (millis) {

        let m = '' + Math.floor(millis % 1000) + '';
        let S = '' + Math.floor((millis / 1000) % 60);
        let M = '' + Math.floor((millis / (1000 * 60)) % 60);
        let H = '' + Math.floor((millis / (1000 * 60 * 60)) % 24);

        m = m.padStart(3, '0');
        S = S.padStart(2, '0');
        M = M.padStart(2, '0');
        H = H.padStart(2, '0');

        return H + ':' + M + ':' + S + '.' + m;
    }

    if (this._startTm) {

        let ms = parseInt(performance.now()) - this._startTm;

        console.log('~'.repeat(40));
        console.log('Duration (ms)    :'.padEnd(18), ('' + ms).padStart(12) + ' ms');
        console.log('Duration (HMS.m) :'.padEnd(18), (msToTime(ms)).padStart(12) + ' h');
        console.log('~'.repeat(40), '\n\n');

        this._startTm = null;

    } else {

        console.log('You have to use startTimer() before stopTimer()');
    }
}


// PRIVATE METHODS
// =================================================================================================

p5.prototype._toUnits = function(value, units = 'px', resolution = 96) {

    const unitTable = {

        'mm': {
            'mm': 1.00,
            'cm': 10.0,
            'in': 25.4,
            'px': 25.4 / resolution
        },

        'cm': {
            'mm': 0.10,
            'cm': 1.00,
            'in': 2.54,
            'px': 2.54 / resolution
        },

        'in': {
            'mm': 1.00 / 25.4,
            'cm': 1.00 / 2.54,
            'in': 1.00,
            'px': 1.00 / resolution
        },

        'px': {
            'mm': resolution / 25.4,
            'cm': resolution / 2.54,
            'in': resolution,
            'px': 1.00
        }
    }

    const cssVal = typeof value === 'number' ? value + units : value;
    const valObject = this._splitCssValue(cssVal);

    return valObject.value * unitTable[units][valObject.units === '' ? units : valObject.units];
}

p5.prototype._splitCssValue = function(cssValue) {

    const arr = cssValue.match(/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/);
    return { cssValue: arr[0], value: arr[1], units: arr[2] };
}

p5.prototype._createArtworkParent = function() {

    const comment1 = document.createComment(' Added by p5.start2d.js ');
    const aw = document.createElement('div');
    const comment2 = document.createComment(' ---------------------- ');

    let firstChild;

    this._removeComments(document.documentElement);

    firstChild = document.body.childNodes[0];

    aw.id = 'artwork';
    aw.classList.add('artwork');

    document.body.insertBefore(comment1, firstChild);
    document.body.insertBefore(aw, firstChild);
    document.body.insertBefore(comment2, firstChild);

    return aw;
}

p5.prototype._removeComments = function(node) {

    // ORIGINAL SOURCE:
    // https://www.sitepoint.com/removing-useless-nodes-from-the-dom/

    for (let n = 0; n < node.childNodes.length; n++) {

        let child = node.childNodes[n];

        if (child.nodeType === Node.COMMENT_NODE) {

            node.removeChild(child);
            n--;

        } else if (child.nodeType === 1) {

            this._removeComments(child);
        }
    }
}

p5.prototype._setWallpaper = function() {

    if (this._wallpaperImage) {

        const img = new Image();

        img.addEventListener('load', (ev) => {

            this._aw.style.background = `url(${img.src})`;

        }, { once: true });

        img.addEventListener('error', (err) => {

            console.log(`ERROR : Background image "${img.src}" not found`);
            this._aw.style.background = this._wallpaperColor;

        }, { once: true });

        img.src = this._wallpaperImage;

    } else {

        this._aw.style.background = this._wallpaperColor;
    }
}

p5.prototype._initUnitScale = function () {

    if (this._units === 'mm') {
        this._uMult = this._exportPPI / 25.4;
    } else if (this._units === 'cm') {
        this._uMult = this._exportPPI / 2.54;
    } else if (this._units === 'in') {
        this._uMult = this._exportPPI;
    } else {
        this._uMult = 1;
    }

    // TODO: test with (U)HD monitor
    this._unitScale = this._uMult; // * window.devicePixelRatio;

    this._pxWidth = Math.round(this._uWidth * this._uMult);
    this._pxHeight = Math.round(this._uHeight * this._uMult);
    this._pxScreenPadding = Math.round(this._toUnits(this._screenPadding, 'px', this._cssScreenPPI));
}

p5.prototype._initPanZoom = function () {

    const awWidth = this.canvas.parentNode.offsetWidth;
    const awHeight = this.canvas.parentNode.offsetHeight;
    const kw = (awWidth - 2 * this._pxScreenPadding) / this._pxWidth;
    const kh = (awHeight - 2 * this._pxScreenPadding) / this._pxHeight;

    this._minZoomScaled = Math.min(this._minZoom, this._minZoom / this._exportPPI * this._cssScreenPPI);
    this._maxZoomScaled = Math.min(this._maxZoom, this._maxZoom / this._exportPPI * this._cssScreenPPI);

    this._fitZoom = Math.min(this._maxZoomScaled, Math.min(kw, kh));
    this._minZoomCurrent = this._fitZoom < this._minZoomScaled ? this._fitZoom : this._minZoomCurrent;

    // *** fit if canvas is larger then window. if smaller stay at zoom 1 (one)
    this._fitZoom = Math.min(1 / this._exportPPI * this._cssScreenPPI, this._fitZoom);

    // *** always fit; enlarge if canvas is smaller then window
    // this._maxZoomScaled = Math.max(this._maxZoomScaled, this._fitZoom);

    this._zoom = this._fitZoom;

    this._scaleArtwork();
    this._positionArtwork();
}

p5.prototype._scaleArtwork = function () {

    this.canvas.style.width = this._pxWidth * this._zoom + 'px';
    this.canvas.style.height = this._pxHeight * this._zoom + 'px';

    if (this._shadowVisible) {

        this._drawShadow();
    }
}

p5.prototype._positionArtwork = function (left, top) {

    const cvsStyle = this.canvas.style;

    if (!(left || top)) {

        cvsStyle.left = (this._aw.offsetWidth - this._pxWidth * this._zoom) / 2 + 'px';
        cvsStyle.top = (this._aw.offsetHeight - this._pxHeight * this._zoom) / 2 + 'px';

    } else {

        cvsStyle.left = left + 'px';
        cvsStyle.top = top + 'px';
    }
}

p5.prototype._initListeners = function () {

    const waitForFinalEvent = (() => {

        // ORIGINAL SOURCE :
        // https://gist.github.com/mazell/289e13ccf01759fcb921

        let timers = {};

        return function (callback, ms, uniqueId) {
            if (!uniqueId) { uniqueId = 'Don\'t call this twice without a uniqueId'; }
            if (timers[uniqueId]) { clearTimeout(timers[uniqueId]); }
            timers[uniqueId] = setTimeout(callback, ms);
        };

    })();

    window.addEventListener('resize', (ev) => {

        waitForFinalEvent(this._onFinalWindowResize.bind(this), 200, 'unique resize key');
    });

    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this._onMouseUpOrLeave.bind(this));
    this.canvas.addEventListener('wheel', this._onMouseWheel.bind(this));

    document.addEventListener('keyup', this._onKeyUp.bind(this));
}

p5.prototype._onFinalWindowResize = function (ev) {

    this._initPanZoom();
}

p5.prototype._onMouseMove = function (ev) {

    const rect = this.canvas.getBoundingClientRect();
    const svgScale = this._pxWidth / rect.width;

    this._mouseX = (ev.clientX - rect.left) * svgScale / this._uMult;
    this._mouseY = (ev.clientY - rect.top) * svgScale / this._uMult;

    if (this._xyDisplay.style.display === 'block') {

        this._displayCoordinates();
    }
}

p5.prototype._displayCoordinates = function () {

    this._xyDisplay.innerHTML =
        `${this._mouseX.toFixed(this._dispDec)}${this._units} / ` +
        `${this._mouseY.toFixed(this._dispDec)}${this._units}`;
}

p5.prototype._onMouseDown = function (ev) {

    this._mouseDown = true;

    this._cvsStartPos = this._getElementPosition(this.canvas);
    this._mouseStartDragX = ev.clientX;
    this._mouseStartDragY = ev.clientY;

    this.canvas.addEventListener('mousemove', this._onMouseDragged.bind(this));
    this.canvas.addEventListener('mouseleave', this._onMouseUpOrLeave.bind(this));
}

p5.prototype._getElementPosition = function(el) {

    let elDim = window.getComputedStyle(el);
    let elX = parseFloat(elDim.getPropertyValue('left'));
    let elY = parseFloat(elDim.getPropertyValue('top'));

    return { x: elX, y: elY };
}

p5.prototype._onMouseDragged = function (ev) {

    if (this._mouseDown === true) {

        let left = this._cvsStartPos.x + (ev.clientX - this._mouseStartDragX);
        let top = this._cvsStartPos.y + (ev.clientY - this._mouseStartDragY);

        this._mouseDragging = true;

        this._positionArtwork(left, top);
    }
}

p5.prototype._onMouseUpOrLeave = function (ev) {

    if (this._mouseDragging === true) {

        this.canvas.removeEventListener('mousemove', this._onMouseDragged);
        this.canvas.removeEventListener('mouseleave', this._onMouseUpOrLeave);
    }

    this._mouseDown = false;
    this._mouseDragging = false;
}

p5.prototype._onMouseWheel = function (ev) {

    this._zoomInOut(ev, ev.offsetX, ev.offsetY);
}

p5.prototype._zoomInOut = function (ev, mX, mY) {

    let cssStyles = window.getComputedStyle(this.canvas);
    let cvsW = parseFloat(cssStyles.getPropertyValue('width'));
    let cvsH = parseFloat(cssStyles.getPropertyValue('height'));

    let zoomInc = this._zoomInc;
    let oldZoom = this._zoom;
    let pctLeft = mX ? mX / cvsW : undefined;
    let pctTop = mY ? mY / cvsH : undefined;
    let pos = this._getElementPosition(this.canvas);
    let newLeft, newTop;

    if (ev) {

        ev.preventDefault();

        if (ev.ctrlKey) {
            zoomInc *= 2;
        }

        if (ev.altKey) {
            zoomInc *= 0.25;
        }

        if (ev.deltaY > 0) {

            // zoom out

            if (this._zoom > this._minZoomCurrent) {

                this._zoom = Math.max(this._minZoomCurrent, this._zoom - zoomInc);
            }

        } else if (ev.deltaY < 0) {

            // zoom in

            if (this._zoom < this._maxZoomScaled) {

                this._zoom = Math.min(this._maxZoomScaled, this._zoom + zoomInc);
            }
        }
    }

    this._scaleArtwork();

    newLeft = pos.x + (this._pxWidth * oldZoom - this._pxWidth * this._zoom) * pctLeft;
    newTop = pos.y + (this._pxHeight * oldZoom - this._pxHeight * this._zoom) * pctTop;
    this._positionArtwork(newLeft, newTop);
}

p5.prototype._onKeyUp = function (ev) {

    // Export drawing to PNG
    if (ev.key == 'e' || ev.key == 'E') {

        let fullName = this._outputFileName.replace('@date', this._getDateString());
        fullName = fullName.replace('@seed', this._seed);

        this.save(fullName);
    }

    // Zoom to (F)it in window
    if (ev.key == 'f' || ev.key == 'F') {

        this._zoom = this._fitZoom;
        this._zoomInOut();
    }

    // Zoom to scale (1)
    if (ev.key == '1') {

        this._zoom = 1 / this._exportPPI * this._cssScreenPPI;
        this._zoomInOut();
    }

    // Zoom to (M)aximum scale
    if (ev.key == 'm' || ev.key == 'M') {

        this._zoom = this._maxZoomScaled;
        this._zoomInOut();
    }

    // toggle mouse position display
    if (ev.key == 'd' || ev.key == 'D') {

        if (this._xyDisplay.style.display === 'none') {

            this._xyDisplay.style.display = 'block';
            this._displayCoordinates();

        } else {

            this._xyDisplay.style.display = 'none';
        }
    }

    // toggle shadow visibility
    if (ev.key === 's' || ev.key === 'S') {


        if (this._shadowVisible === true) {

            this._clearShadow();
            this._shadowVisible = false;

        } else {

            this._drawShadow();
            this._shadowVisible = true;
        }
    }
}

p5.prototype._getDateString = function() {

    let d = new Date();

    return d.getFullYear() +
        ('' + (d.getMonth() + 1)).padStart(2, '0') +
        ('' + d.getDate()).padStart(2, '0') + '-' +
        ('' + d.getHours()).padStart(2, '0') +
        ('' + d.getMinutes()).padStart(2, '0') +
        ('' + d.getSeconds()).padStart(2, '0');
}

p5.prototype._initShadow = function () {

    if (this._shadowVisible) {

        this._drawShadow();
    }
}

p5.prototype._drawShadow = function () {

    const scale = this._exportPPI / this._cssScreenPPI;

    const u = this._units;
    const sX = this._shadowX * this._zoom * scale;
    const sY = this._shadowY * this._zoom * scale;
    const sBlur = this._shadowBlur * this._zoom * scale;

    this.canvas.style.boxShadow = `${sX}${u} ${sY}${u} ${sBlur}${u} ${this._shadowColor}`;
}

p5.prototype._clearShadow = function () {

    this.canvas.style.boxShadow = 'none';
}

p5.prototype._initPositionDisplay = function () {

    this._xyDisplay = document.createElement('div');
    this._xyDisplay.classList.add('xy-display');
    this._xyDisplay.style.display = 'block';
    this._aw.appendChild(this._xyDisplay);
}

p5.prototype._setGlobalProperties = function () {

    this._setProperty('width', this._uWidth);
    this._setProperty('height', this._uHeight);
    this._setProperty('pixelWidth', this._pxWidth);
    this._setProperty('pixelHeight', this._pxHeight);
    this._setProperty('units', this._units);
    this._setProperty('exportPPI', this._exportPPI);
}

