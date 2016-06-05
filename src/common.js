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
        clip3: clip3,
        clip1: clip1
    };
});