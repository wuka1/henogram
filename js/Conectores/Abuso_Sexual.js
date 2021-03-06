;(function() {

    var TrasladarPunto = function(from, n, upper, amplitude) {
        var dux = isFinite(n) ? (Math.cos(n) * amplitude) : 0;    
        var duy = isFinite(n) ? (Math.sin(n) * amplitude) : amplitude;
        return [ 
            from[0] - ((upper ? -1 : 1) * dux), 
            from[1] + ((upper ? -1 : 1) * duy)
        ];
    };

    var PuntoEnLinea = function(from, m, distance) {
        var dux = isFinite(m) ? (Math.cos(m) * distance) : 0;
        var duy = isFinite(m) ? (Math.sin(m) * distance) : distance;
        return [
            from[0] + dux,
            from[1] + duy
        ];
    };

    var Abuso_Sexual = function(params) {
        params = params || {};
        var _super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments);
        this.type = "Abuso_Sexual";

        var wavelength = params.wavelength || 10,
            amplitude = params.amplitude || 10,
            spring = params.spring,
            compressedThreshold = params.compressedThreshold || 5;

        this._compute = function(paintInfo, paintParams) {

            var dx = paintInfo.endStubX - paintInfo.startStubX,
                dy = paintInfo.endStubY - paintInfo.startStubY,
                d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)), 
                m = Math.atan2(dy, dx), 
                n = Math.atan2(dx, dy),
                origin = [ paintInfo.startStubX, paintInfo.startStubY ],
                current = [ paintInfo.startStubX, paintInfo.startStubY ],
                
                w = spring ? d <= compressedThreshold ? 1 : d / 20 : wavelength,
                peaks = Math.round(d / w), 
                shift = d - (peaks * w),
                upper = true;

          
             _super.addSegment(this, "Straight", { 
                x1:paintInfo.sx, 
                y1:paintInfo.sy,
                x2:paintInfo.startStubX,
                y2:paintInfo.startStubY
             });

            for (var i = 0; i < peaks - 3; i++) {
                // debugger;
                var xy = PuntoEnLinea(origin, m, shift + ((i+1) * w)),
                    pxy = TrasladarPunto(xy, n, upper, amplitude);

                _super.addSegment(this, "Straight", { 
                    x1:current[0], 
                    y1:current[1],
                    x2:pxy[0],
                    y2:pxy[1]
                 });
                
                upper = !upper;
                current = pxy;
            }
                
            _super.addSegment(this, "Straight", { 
                x1:current[0], 
                y1:current[1],
                x2:paintInfo.endStubX,
                y2:current[1]
             });
            
            console.log(this);
            /*
             _super.addSegment(this, "Straight", { 
                x1:paintInfo.endStubX, 
                y1:paintInfo.endStubY,
                x2:paintInfo.tx,
                y2:paintInfo.ty
             });*/
        };
    };
    jsPlumbUtil.extend(Abuso_Sexual, jsPlumb.Connectors.AbstractConnector);
    jsPlumb.registerConnectorType(Abuso_Sexual, "Abuso_Sexual");
})();
