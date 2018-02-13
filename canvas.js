define([
    'jquery'
], function ($) {
    var CanvasUtil = {
        context:'',
        rootNode:'#contentholder',
        debug:false,
        lineWidth:1,
        canvas:{name:'mainCanvas', height:0, width:0},

        //create and return the canvas
        initCanvas:function (rootNode) {
            if (rootNode)
                this.rootNode = rootNode;

            this.canvas.width = window.innerWidth / 1.2;
            this.canvas.height = window.innerHeight / 1.2;

            var canvasString = '<canvas id="' + this.canvas.name + '" width="' + this.canvas.width + '" height="' + this.canvas.height + '">Canvas is not supported</canvas>';

            $(this.rootNode).empty();
            $(canvasString).appendTo(this.rootNode);
            this.context = $('#' + this.canvas.name).get(0).getContext('2d');

            return this;
        },

        initCanvasQuiet:function (rootNode, width, height) {
            if (rootNode)
                this.rootNode = rootNode;

            this.canvas.width = width || $(this.rootNode.children()[0]).innerWidth() - 42;
            this.canvas.height = height || rootNode.innerHeight() - 2;

            var canvasString = '<canvas id="' + this.canvas.name + '" width="' + this.canvas.width + '" height="' + this.canvas.height + '">Canvas is not supported</canvas>';
            if($('#'+this.canvas.name)) $('#'+this.canvas.name).remove();
            $(canvasString).insertBefore($(this.rootNode.children()[0]));

            this.context = $('#' + this.canvas.name).get(0).getContext('2d');

            return this;
        },

        clear:function () {
            try {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            } catch (e) {
                //this will sometimes throw an error if the canvas is not initialized.  ignore.
            }
        },

        //Canvas utility functions
        drawRect:function (x, y, height, width, color, transparency) {
            if (this.debug && console)
                console.log('drawRect: ' + x + ',' + y + ',' + height + ',' + width);

            with (this.context) {
                globalAlpha = (transparency) ? transparency : 1.0;
                strokeStyle = color || '#0f0';
                strokeRect(x, y, height, width);
                globalAlpha = 1.0; //reset the transparency
            }
        },

        drawFillRect:function (x, y, height, width, color, transparency) {
            if (this.debug && console)
                console.log('drawFillRect: ' + x + ',' + y + ',' + height + ',' + width);

            with (this.context) {
                globalAlpha = (transparency) ? transparency : 1.0;
                fillStyle = color || '#0f0';
                fillRect(x, y, height, width);
                globalAlpha = 1.0; //reset the transparency
            }
        },

        drawCircle:function (x, y, radius, color, lineWidth, transparency) {
            if (this.debug && console)
                console.log(x + ',' + y + ',' + radius + ',' + color);

            with (this.context) {
                beginPath();
                arc(x, y, radius, 0, Math.PI * 2, false);
                closePath();
                lineWidth = lineWidth || this.lineWidth;
                strokeStyle = color || 'white';
                stroke();
            }
        },

        drawFillCircle:function (x, y, radius, color, lineWidth, transparency) {
            if (this.debug && console)
                console.log(x + ',' + y + ',' + radius + ',' + color);

            with (this.context) {
                beginPath();
                arc(x, y, radius, 0, Math.PI * 2, false);
                closePath();
                fillStyle = color;
                fill();
            }
        },

        drawLine:function (x1, y1, x2, y2, color, thickness, transparency) {
            if (this.debug && console)
                console.log(x1 + ',' + y1 + ',' + x2 + ',' + y2 + ',' + color + ',' + thickness + ', ' + transparency);

            with (this.context) {
                beginPath();
                moveTo(x1, y1);
                lineTo(x2, y2);
                moveTo(x2, y2); // this properly closes the path by moving to the end of our new line
                closePath();
                lineWidth = thickness || 2;
                globalAlpha = transparency || 1.0;
                lineCap = "round";
                lineJoin = "round";
                strokeStyle = color || 'white';
                stroke();
                globalAlpha = 1.0; //reset the transparency
            }
        },

        drawBezierCurve:function (x1, y1, cpx, cpy, x2, y2, color, thickness) {
            with (this.context) {
                beginPath();
                moveTo(x1, y1);
                bezierCurveTo(cpx, cpy, x2, y2, x2, y2);
                strokeStyle = color || "#ccc";
                lineWidth = thickness || 2;
                stroke();
                closePath();
            }

        },

        write:function (x, y, text, color, font) {
            if (this.debug && console)
                console.log(x + ',' + y + ',' + text + ',' + color + ',' + font);

            with (this.context) {
                fillStyle = (color) ? color : 'black';
                font = (font) ? font : '11px Helvatica';
                textBaseline = 'middle';
                fillText(text, x, y);
            }
        },

        inBounds:function (shape, x, y) {
            if (shape.r) {
                //has a radius, check that
                //thanx, pythagoras.
                var distance_squared = ((shape.x - x) * (shape.x - x)) + ((shape.y - y) * (shape.y - y));
                return (shape.r ^ 2 > distance_squared);
            }

            if (shape.x2) {
                //it's a rectangle, check that
                return (shape.x1 < x && shape.x2 > x && shape.y1 < y && shape.y2 > y);
            }

            if (shape.points) {
                //it's some other polygon, check that
            }

            //who knows?
            return false;
        }


    };
    return CanvasUtil;
});
