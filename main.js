/*jshint browser:true, white:true*/
/*globals Vect:false */
window.requestAnimationFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

var x, y;
var delta, time = Date.now();
var canvas, paper, ctx, pctx;

var circle1 = {
    rate: 300,
    radius: 100,
    x: 140,
    y: 0
};

var circle2 = {
    rate: 310,
    radius: 64,
    x: 420,
    y: 0
};

var config = {
    armLength: 250,
    showDebug: false,
    doubleLength: false,
    extendedArm: true,
    clear: function () {
        pctx.clearRect(0, 0, 600, 600);
    }
};

function init() {
    canvas = document.getElementById('screen');
    paper = document.createElement('canvas');
    paper.width = 600;
    paper.height = 600;

    ctx = canvas.getContext('2d');
    pctx = paper.getContext('2d');

    var gui = new dat.GUI();

    var f1 = gui.addFolder('Circle 1');
    f1.add(circle1, 'rate').min(100).max(600).onFinishChange(config.clear);
    f1.add(circle1, 'radius').min(0).max(100).onFinishChange(config.clear);
    f1.add(circle1, 'x').min(0).max(300).onFinishChange(config.clear);
    f1.add(circle1, 'y').min(0).max(300).onFinishChange(config.clear);

    var f2 = gui.addFolder('Circle 2');
    f2.add(circle2, 'rate').min(100).max(600).onFinishChange(config.clear);
    f2.add(circle2, 'radius').min(0).max(100).onFinishChange(config.clear);
    f2.add(circle2, 'x').min(300).max(600).onFinishChange(config.clear);
    f2.add(circle2, 'y').min(0).max(300).onFinishChange(config.clear);

    gui.add(config, 'armLength').min(250).max(500).onFinishChange(config.clear);
    gui.add(config, 'doubleLength').onFinishChange(config.clear);
    gui.add(config, 'extendedArm').onFinishChange(config.clear);
    gui.add(config, 'showDebug');
    gui.add(config, 'clear');
}

function CircVect(circ) {
    return new Vect(
        circ.radius * Math.sin(time / circ.rate) + circ.x,
        circ.radius * Math.cos(time / circ.rate) + circ.y
    );
}

function step(time, delta) {
    ctx.clearRect(0, 0, 600, 600);
    var A = CircVect(circle1);
    var B = CircVect(circle2);
    var I = Vect.mid(A, B);
    var o = A.angleTo(B);
    var l = A.distTo(I);

    var C = new Vect(
        -Math.sqrt((config.armLength * config.armLength) - (l * l)),
        l
    );
    C.rot(-o);
    C.add(A);

    var pen = C;

    if (config.showDebug) {
        ctx.beginPath();
        ctx.arc(
            circle1.x,
            circle1.y,
            circle1.radius,
            0, Math.PI * 2, true
        );
        ctx.moveTo(circle2.x + circle2.radius, circle2.y);
        ctx.arc(
            circle2.x,
            circle2.y,
            circle2.radius,
            0, Math.PI * 2, true
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(C.x, C.y);

        ctx.moveTo(B.x, B.y);
        ctx.lineTo(C.x, C.y);
        ctx.stroke();
    }

    var A2;
    if (config.doubleLength) {
        A2 = Vect.mid(A, C);
        var B2 = Vect.mid(B, C);
        //A2 = Vect.mid(A2, C);
        //B2 = Vect.mid(B2, C);
        var I2 = Vect.mid(A2, B2);
        var l2 = A2.distTo(I2);
        C2 = new Vect(
            -Math.sqrt((config.armLength * config.armLength) - (l2 * l2)),
            l2
        );
        C2.rot(-o);
        C2.add(A2);
        pen = C2;

        if (config.showDebug) {
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
            ctx.moveTo(A2.x, A2.y);
            ctx.lineTo(C2.x, C2.y);

            ctx.moveTo(B2.x, B2.y);
            ctx.lineTo(C2.x, C2.y);
            ctx.stroke();
        }
    }

    if (config.extendedArm) {
        var C2 = pen;
        var E = Vect.sub(pen, A2 || A);
        E.normalise();
        E.x *= config.armLength / 3;
        E.y *= config.armLength / 3;
        var C3 = Vect.add(pen, E);
        pen = C3;
        if (config.showDebug) {
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(pen.x, pen.y);
            ctx.lineTo(C2.x, C2.y);
            ctx.stroke();
        }
    }

    ctx.strokeStyle = 'black';

    pctx.beginPath();
    pctx.moveTo(x, y);
    pctx.lineTo(
        x = pen.x,
        y = pen.y
    );
    pctx.stroke();
    ctx.drawImage(paper, 0, 0);
}

function loopsy() {
    delta = Date.now() - time;
    time = time + delta;
    step(time, delta);
    requestAnimationFrame(loopsy);
}

window.onload = function () {
    init();
    loopsy();
};
