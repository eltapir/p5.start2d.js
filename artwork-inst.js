// let myp5 = new p5((sketch) => {

//     let x = 100;
//     let y = 100;

//     sketch.setup = () => {
//         sketch.createCanvas(200, 200);
//     };

//     sketch.draw = () => {
//         sketch.background(0);
//         sketch.fill(255);
//         sketch.rect(x, y, 50, 50);
//     };
// });

const artwork = new p5((aw) => {

    aw.setup = () => {

        aw.createCanvas({

            // size: paperSize.A4,
            // size: ['297', '210'],
            // size: ['297mm', '210mm'],
            // size: ['8.268in', '11.693in'],
            // size: ['29.7cm', '21cm'],

            orientation: 'landscape',
            units: 'mm',
            ppi: 300,

            // *** the above size parameters, all have the same result.
            // *** ==> canvas of size 297mm by 210mm @ 300 dpi

            size: [400, 118],

            backgroundImage: './wallpaper.png',

            maxZoom: 2.0,
            minZoom: 0.1,

            outputFileName: 'Artwork',
            outputFileNamePrefix: '@date',
            outputFileNameSuffix: '@seed',

            screenPadding: '1cm'

        });

        // testing
        // aw.resizeCanvas(300, 150);

        aw.background(255);

        // !!!!! SCALING IS NOT READY YET IN SETUP FUNCTION            !!!!!
        // !!!!! SEE RED DIAGONAL LINE DRAWN IN SETUP VS DRAWN IN DRAW !!!!!
        aw.stroke(255, 0, 0);
        diagonal();
        // !!!!! ----------------------------------------------------- !!!!!
    }

    aw.draw = () => {

        // !!!!! SCALING IS CORRECT IN DRAW FUNCTION                    !!!!!
        // !!!!! SEE GREY DIAGONAL LINE DRAWN IN SETUP VS DRAWN IN DRAW !!!!!
        aw.stroke(0, 50);
        diagonal();
        // !!!!! ------------------------------------------------------ !!!!!

        aw.strokeWeight(1);
        aw.noFill();

        for (let i = 0; i < 100; i++) {

            let cx = aw.random(width);
            let cy = aw.random(height);
            let r = aw.random(width / 8);

            aw.stroke(aw.random(255), aw.random(255), aw.random(255), 50);

            aw.circle(cx, cy, r);
        }

        __draw();

    }

    const diagonal = () => {

        aw.strokeWeight(10);
        aw.line(0, 0, width, height);
    }

    const __draw = () => {

        // simple measurement lines

        aw.strokeWeight(0.5);
        aw.textAlign(aw.CENTER);
        aw.textSize(7);
        aw.fill(0);

        aw.stroke(0);
        drawArrow('left');
        aw.line(0, height / 2, width / 3 - 16, height / 2);
        aw.line(width / 3 + 8, height / 2, width, height / 2);
        drawArrow('right');
        aw.noStroke();
        aw.text(`${aw.round(width)}${units} @ ${ppi}ppi => ${pixelWidth}px`, width / 2, height / 2 - 5);

        aw.stroke(0);
        drawArrow('top');
        aw.line(width / 3, 0, width / 3, height);
        drawArrow('bottom');
        aw.noStroke();

        aw.translate(width / 3, height / 2);
        aw.rotate(aw.PI * 1.5);
        aw.text(`${aw.round(height)}${units} @ ${ppi}ppi => ${pixelHeight}px`, 0, - 5);
    }

    const drawArrow = (dir) => {

        // simple arrow drawing :)

        const as = 6;

        aw.push();

        aw.noStroke();
        aw.fill(0);

        if (dir === 'left') {

            let x = 0;
            let y = height / 2;

            aw.triangle(x, y, x + as, y - as / 2, x + as, y + as / 2);

        } else if (dir === 'right') {

            let x = width;
            let y = height / 2;

            aw.triangle(x, y, x - as, y - as / 2, x - as, y + as / 2);

        } else if (dir === 'top') {

            let x = width / 3;
            let y = 0;

            aw.triangle(x, y, x - as / 2, y + as, x + as / 2, y + as);

        } else if (dir === 'bottom') {

            let x = width / 3;
            let y = height;

            aw.triangle(x, y, x - as / 2, y - as, x + as / 2, y - as)
        }

        aw.pop();
    }

});

