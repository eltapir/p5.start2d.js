const artwork = new p5((aw) => {

    aw.setup = () => {

        aw.createCanvas({

            // size: paperSize.A4,
            // size: ['297', '210'],
            // size: ['297mm', '210mm'],
            // size: ['8.268in', '11.693in'],
            // size: ['29.7cm', '21cm'],
            size: 'A4',

            orientation: 'landscape',
            units: 'mm',
            ppi: 300,

            // *** the above size parameters, all have the same result.
            // *** ==> canvas of size 297mm by 210mm @ 300 dpi

            backgroundImage: './assets/wallpaper.png',

            maxZoom: 2.0,
            minZoom: 0.1,

            outputFileName: 'Artwork',
            outputFileNamePrefix: '@date',
            outputFileNameSuffix: '@seed',

            screenPPI: 96,
            screenPadding: '1cm'

        });

        // testing
        aw.resizeCanvas(300, 150);

        aw.background(255);

        // !!!!! TEST SCALING IN SETUP & DRAW   !!!!!
        aw.strokeWeight(10);
        aw.stroke(255, 0, 0, 100);
        diagonal();
        // !!!!! ------------------------------ !!!!!
    }

    aw.draw = () => {

        // !!!!! TEST SCALING IN SETUP & DRAW   !!!!!
        aw.strokeWeight(1);
        aw.stroke(0, 50);
        diagonal();
        // !!!!! ------------------------------ !!!!!

        aw.strokeWeight(1);
        aw.noFill();

        for (let i = 0; i < 100; i++) {

            let cx = aw.random(aw.width);
            let cy = aw.random(aw.height);
            let r = aw.random(aw.width / 8);

            aw.stroke(aw.random(255), aw.random(255), aw.random(255), 50);

            aw.circle(cx, cy, r);
        }

        __draw();
    }

    const diagonal = () => {

        aw.line(aw.width * 0.5, aw.height * 0.5, aw.width * 0.75, aw.height * 0.75);
    }

    const __draw = () => {

        // simple measurement lines

        aw.strokeWeight(0.5);
        aw.textAlign(aw.CENTER);
        aw.textSize(7);
        aw.fill(0);

        aw.stroke(0);
        drawArrow('left');
        aw.line(0, aw.height / 2, aw.width / 3 - 16, aw.height / 2);
        aw.line(aw.width / 3 + 8, aw.height / 2, aw.width, aw.height / 2);
        drawArrow('right');
        aw.noStroke();
        aw.text(`${aw.round(aw.width)}${aw.units} @ ${aw.ppi}ppi => ${aw.pixelWidth}px`, aw.width / 2, aw.height / 2 - 5);

        aw.stroke(0);
        drawArrow('top');
        aw.line(aw.width / 3, 0, aw.width / 3, aw.height);
        drawArrow('bottom');
        aw.noStroke();

        aw.push();
        aw.translate(aw.width / 3, aw.height / 2);
        aw.rotate(aw.PI * 1.5);
        aw.text(`${aw.round(aw.height)}${aw.units} @ ${aw.ppi}ppi => ${aw.pixelHeight}px`, 0, - 5);
        aw.pop();
    }

    const drawArrow = (dir) => {

        // simple arrow drawing :)

        const as = 6;

        aw.push();

        aw.noStroke();
        aw.fill(0);

        if (dir === 'left') {

            let x = 0;
            let y = aw.height / 2;

            aw.triangle(x, y, x + as, y - as / 2, x + as, y + as / 2);

        } else if (dir === 'right') {

            let x = aw.width;
            let y = aw.height / 2;

            aw.triangle(x, y, x - as, y - as / 2, x - as, y + as / 2);

        } else if (dir === 'top') {

            let x = aw.width / 3;
            let y = 0;

            aw.triangle(x, y, x - as / 2, y + as, x + as / 2, y + as);

        } else if (dir === 'bottom') {

            let x = aw.width / 3;
            let y = aw.height;

            aw.triangle(x, y, x - as / 2, y - as, x + as / 2, y - as)
        }

        aw.pop();
    }

});

