/**
 * Created by gd on 16/6/28.
 */
define([
    'de264/common',
    'de264/defs'
], function(_common, _defs) {
    function deriveLumaBoundaryStrength(p0, q0, verticalEdgeFlag) {
        var bS;
        
    }
    function filterSetOfSamples(p, q, chromaEdgeFlag, verticalEdgeFlag, decoder, mbAddr, x, y) {
        var bS;
        if (chromaEdgeFlag === 0) {
            if (verticalEdgeFlag) {
                if ((x === 0) && (decoder.mbs[mbAddr-1].type === _defs.I_MB || decoder.mbs[mbAddr].type === _defs.I_MB)) {
                    bS = 4;
                } else if (decoder.mbs[mbAddr].type === _defs.I_MB) {
                    bS = 3;
                }
            }else {
                if ((y === 0) && (decoder.mbs[mbAddr-decoder.widthInMb].type === _defs.I_MB || decoder.mbs[mbAddr].type === _defs.I_MB)) {
                    bS = 4;
                } else if (decoder.mbs[mbAddr-decoder.widthInMb].type === _defs.I_MB || decoder.mbs[mbAddr].type === _defs.I_MB) {
                    bS = 3;
                }
            }

        }
    }

    function filterBlockEdges(decoder, mbAddr, chromaEdgeFlag, verticalEdgeFlag, xE, yE) {
        var nE = chromaEdgeFlag ? 8 : 16;
        var xyP = _common.inverseMbScan(mbAddr, decoder.width);
        for (var x = 0; x < xE; x++) {
            for (var y = 0; y < yE; y++) {
                var p = [];
                var q = [];
                for (var i = 0; i < 4; i++) {
                    if (verticalEdgeFlag) {
                        q[i] = decoder.SL[xyP.x + x + i][xyP.y + y];
                        p[i] = decoder.SL[xyP.x + x - i - 1][xyP.y + y];
                    } else {
                        q[i] = decoder.SL[xyP.x + x][xyP.y + (y + i) - (y % 2)];
                        p[i] = decoder.SL[xyP.x + x][xyP.y + (y - i - 1) - (y % 2)];
                    }
                }
                filterSetOfSamples(p, q, chromaEdgeFlag, verticalEdgeFlag, decoder, mbAddr, x, y);

            }
        }
    }

    return {
        filterBlockEdges: filterBlockEdges
    };
});