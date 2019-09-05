## p5.start2d.js

p5.start2d.js is an extension to ease the creation of 2D STatic ART with p5.js.
With p5.start2d.js you can use pixels (px), millimeters (mm), centimeters (cm) and
inches (in). Panning and zooming is also available together with easy PNG file export.
Just add the file p5.start2d.js to your html file and you are good to go.

![example] (example-export.png "Example export")

## Before using this extension, keep in mind that :
* It is created to use as a quick boilerplate to create generative art which has to be exported.
* It is not meant to use in web development (lack of cross browser compatibility / only tested in latest chrome).
* I tried to keep it simple to use; No fuss with bundlers or complex setups. Just copy the folder,
change artwork.js and generate some amazing artwork, print the artwork, sell it for lots of money,
do something good with the money and start over again...
* If p5.js didn't exist I wood never have written this extension.

---

### WHILE RUNNING :

- use mouse wheel to zoom in/out

- use mouse left button to drag / pan

- use the following keys :

  - (1) : zoom canvas to real size
  - (M) : zoom canvas to maximum zoom factor
  - (F) : zoom canvas to fit in window ( or zoom to real size )
  
  - (D) : show/hide mouse coordinates (in units) at the bottom
  - (E) : export to PNG file

---

### CHANGES TO THE NORMAL WAY OF USING p5.js

- In `createCanvas()`,  Instead of providing `width` and `height` you have to provide an object (see example)
- `noLoop()` is the default, since the main purpose of this addon is to create static art.

---

### CONVERTING PNG TO PDF

To convert PNG files to PDF files I use `imagemagick` (cross platform : linux, mac, win, ...)

`$ convert -quality 100 -density 300 artwork.png artwork.pdf`

( the density is the resolution/ppi used in your createCanvas parameters )

---

### EXAMPLE
```JS
function setup() {

    createCanvas({

        // array with width and height
        // numbers => [297, 210]
        // unit strings => ['11.0in', '25cm']
        // constant => paperSize.A4 (see source for possible values)
        // default: [297, 210]
        size: [297, 210],

        // orientation
        // 'portrait'  => height = biggest parameter from size
        // 'landscape' => height = smallest parameter from 
        // default: 'unchanged'
        orientation: 'portrait',

        // units to use in sketch
        // 'mm', 'cm', 'in', 'px'
        // the sizes in the size property are converted to this units
        // default: 'mm'
        units: 'mm',

        // output resolution (exporting canvas to file)
        // ie. 96 for screen (100 on my laptop), 144 HiDef screen, 300+ for printing, ...
        // default : 300
        ppi: 300,

        // maximum zoom
        // default : 2.0
        maxZoom: 2.0,

        // minimum zoom => can change to fit on screen
        // default : 0.2
        minZoom: 0.2,

        // zoom step size
        // default 0.025
        zoomInc: 0.025,
        
        // space between artwork and window/screen border
        // number => 32 (pixels)
        // unit string => '1.5cm' or '0.5in' or '32px'
        // 'default : '10mm'
        screenPadding: '20mm',

        // screen resolution
        // default : 96
        screenPPI: 96,         
        
        // shadow visible
        shadowVisible: true, 
        // shadow color
        shadowColor: 'rgba(64, 64, 64, 0.5)',
        // unit value (string : ex. '1cm')
        shadowX: '0mm',
        // unit value (string : ex. '10mm')
        shadowY: '6mm',
        // unit value (string : ex. '0.4in')
        shadowBlur: '10mm',
        
        // wallpaper color
        // default : '#dddddd'
        backgroundColor: '#ddddde',
        
        // output file name
        // default : 'artwork'
        outputFileName: 'artwork',

        // output file name prefix and suffix
        // @seed gives current seed value
        // @date gives date & time
        //
        //       seed  title    date    time
        // ex. : 7521-artwork-20190513-161132
        // 
        outputFileNamePrefix: '@seed',
        outputFileNameSuffix: '@date',
        
        // number of decimals when showing mouse coordinates
        // default: 2
        xyDisplayDecimals: 2, // number of decimals for mouse cooordinates display

    });

    background(255, 128, 0);
}

function draw() {

    // PUT SOMETHING AMAZING HERE
}

```

### For a working example, see the files :
* `index.html`
* `artwork.js` or `artwork-inst.js`

---

### LICENSE

LGPL2.1, see [LICENSE.txt](LICENSE.txt) for details.

