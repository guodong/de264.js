/**
 * Created by gd on 16/5/12.
 */
define([
    'de264/defs'
], function(_defs) {
    function isISlice(type) {
        return (type % 5 === _defs.I_SLICE);
    }
    
    function isPSlice(type) {
        return (type % 5 === _defs.P_SLICE);
    }
    
    function getNeighbourA4x4(blockIndex) {
        return _defs.NA_MAP[blockIndex];
    }
    
    function getNeighbourB4x4(blockIndex) {
        return _defs.NB_MAP[blockIndex];
    }

    function getNeighbourC4x4(blockIndex) {
        return _defs.NC_MAP[blockIndex];
    }

    function getNeighbourD4x4(blockIndex) {
        return _defs.ND_MAP[blockIndex];
    }

    function LevelScale(m, i, j) {
        var v = [
            [10, 16, 13],
            [11, 18, 14],
            [13, 20, 16],
            [14, 23, 18],
            [16, 25, 20],
            [18, 29, 23]
        ];

        if ((i === 0 && j === 0) || (i === 0 && j === 2) || (i === 2 && j === 0) || (i === 2 && j === 2)) {
            return v[m][0];
        } else if ((i === 1 && j === 1) || (i === 1 && j === 3) || (i === 3 && j === 1) || (i === 3 && j === 3)) {
            return v[m][1];
        } else {
            return v[m][2];
        }
    }
    
    function inverseRasterScan(a, b, c, d, e) {
        if (e === 0) {
            return (a % Math.floor(d / b)) * b;
        } else {
            return Math.floor(a / Math.floor(d / b)) * c;
        }
    }
    
    function medianFilter(a, b, c) {
        var max = a,
            min = a,
            med = a;
        if (b > max) {
            max = b;
        } else if (b < min) {
            min = b;
        }
        if (c > max) {
            med = max;
        } else if (c < min) {
            med = min;
        } else {
            med = c;
        }
        return med;
    }

    /*
     Check if neighbour macroblock is available. Neighbour macroblock
     is considered available if it is within the picture and belongs
     to the same slice as the current macroblock.
     */
    function isNeighbourAvailable(mb, neighbour) {
        if (!neighbour || mb.slice != neighbour.slice) {
            return false;
        }
        return true;
    }

    function clip3(x, y, z) {
        if (z < x) {
            return x;
        } else if (z > y) {
            return y;
        } else {
            return z;
        }
    }
    
    function clip1(x) {
        return clip3(0, 255, x);
    }
    
    
    return {
        isISlice: isISlice,
        isPSlice: isPSlice,
        getNeighbourA4x4: getNeighbourA4x4,
        getNeighbourB4x4: getNeighbourB4x4,
        getNeighbourC4x4: getNeighbourC4x4,
        getNeighbourD4x4: getNeighbourD4x4,
        isNeighbourAvailable: isNeighbourAvailable,
        LevelScale: LevelScale,
        inverseRasterScan: inverseRasterScan,
        clip3: clip3,
        clip1: clip1,
        medianFilter: medianFilter
    };
});