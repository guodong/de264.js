/**
 * Created by gd on 16/5/12.
 */
define([
    'de264/common',
    'de264/defs',
    'de264/queuebuffer',
    'de264/util',
    'de264/subMb'
], function(_common, _defs, _queuebuffer, _util, _subMb) {

    var coeff_map_nc_0_2 = {
        0x00018000: [0, 0],
        0x00061400: [0, 1],
        0x00024000: [1, 1],
        0x00080700: [0, 2],
        0x00061000: [1, 2],
        0x00032000: [2, 2],
        0x00090380: [0, 3],
        0x00080600: [1, 3],
        0x00070A00: [2, 3],
        0x00051800: [3, 3],
        0x000A01C0: [0, 4],
        0x00090300: [1, 4],
        0x00080500: [2, 4],
        0x00060C00: [3, 4],
        0x000B00E0: [0, 5],
        0x000A0180: [1, 5],
        0x00090280: [2, 5],
        0x00070800: [3, 5],
        0x000D0078: [0, 6],
        0x000B00C0: [1, 6],
        0x000A0140: [2, 6],
        0x00080400: [3, 6],
        0x000D0058: [0, 7],
        0x000D0070: [1, 7],
        0x000B00A0: [2, 7],
        0x00090200: [3, 7],
        0x000D0040: [0, 8],
        0x000D0050: [1, 8],
        0x000D0068: [2, 8],
        0x000A0100: [3, 8],
        0x000E003C: [0, 9],
        0x000E0038: [1, 9],
        0x000D0048: [2, 9],
        0x000B0080: [3, 9],
        0x000E002C: [0, 10],
        0x000E0028: [1, 10],
        0x000E0034: [2, 10],
        0x000D0060: [3, 10],
        0x000F001E: [0, 11],
        0x000F001C: [1, 11],
        0x000E0024: [2, 11],
        0x000E0030: [3, 11],
        0x000F0016: [0, 12],
        0x000F0014: [1, 12],
        0x000F001A: [2, 12],
        0x000E0020: [3, 12],
        0x0010000F: [0, 13],
        0x000F0002: [1, 13],
        0x000F0012: [2, 13],
        0x000F0018: [3, 13],
        0x0010000B: [0, 14],
        0x0010000E: [1, 14],
        0x0010000D: [2, 14],
        0x000F0010: [3, 14],
        0x00100007: [0, 15],
        0x0010000A: [1, 15],
        0x00100009: [2, 15],
        0x0010000C: [3, 15],
        0x00100004: [0, 16],
        0x00100006: [1, 16],
        0x00100005: [2, 16],
        0x00100008: [3, 16]
    };

    var coeff_map_nc_2_4 = {
        0x0002C000: [0, 0],
        0x00062C00: [0, 1],
        0x00028000: [1, 1],
        0x00061C00: [0, 2],
        0x00053800: [1, 2],
        0x00036000: [2, 2],
        0x00070E00: [0, 3],
        0x00062800: [1, 3],
        0x00062400: [2, 3],
        0x00045000: [3, 3],
        0x00080700: [0, 4],
        0x00061800: [1, 4],
        0x00061400: [2, 4],
        0x00044000: [3, 4],
        0x00080400: [0, 5],
        0x00070C00: [1, 5],
        0x00070A00: [2, 5],
        0x00053000: [3, 5],
        0x00090380: [0, 6],
        0x00080600: [1, 6],
        0x00080500: [2, 6],
        0x00062000: [3, 6],
        0x000B01E0: [0, 7],
        0x00090300: [1, 7],
        0x00090280: [2, 7],
        0x00061000: [3, 7],
        0x000B0160: [0, 8],
        0x000B01C0: [1, 8],
        0x000B01A0: [2, 8],
        0x00070800: [3, 8],
        0x000C00F0: [0, 9],
        0x000B0140: [1, 9],
        0x000B0120: [2, 9],
        0x00090200: [3, 9],
        0x000C00B0: [0, 10],
        0x000C00E0: [1, 10],
        0x000C00D0: [2, 10],
        0x000B0180: [3, 10],
        0x000C0080: [0, 11],
        0x000C00A0: [1, 11],
        0x000C0090: [2, 11],
        0x000B0100: [3, 11],
        0x000D0078: [0, 12],
        0x000D0070: [1, 12],
        0x000D0068: [2, 12],
        0x000C00C0: [3, 12],
        0x000D0058: [0, 13],
        0x000D0050: [1, 13],
        0x000D0048: [2, 13],
        0x000D0060: [3, 13],
        0x000D0038: [0, 14],
        0x000E002C: [1, 14],
        0x000D0030: [2, 14],
        0x000D0040: [3, 14],
        0x000E0024: [0, 15],
        0x000E0020: [1, 15],
        0x000E0028: [2, 15],
        0x000D0008: [3, 15],
        0x000E001C: [0, 16],
        0x000E0018: [1, 16],
        0x000E0014: [2, 16],
        0x000E0010: [3, 16]
    };

    var coeff_map_nc_4_8 = {
        0x0004F000: [0, 0],
        0x00063C00: [0, 1],
        0x0004E000: [1, 1],
        0x00062C00: [0, 2],
        0x00057800: [1, 2],
        0x0004D000: [2, 2],
        0x00062000: [0, 3],
        0x00056000: [1, 3],
        0x00057000: [2, 3],
        0x0004C000: [3, 3],
        0x00071E00: [0, 4],
        0x00055000: [1, 4],
        0x00055800: [2, 4],
        0x0004B000: [3, 4],
        0x00071600: [0, 5],
        0x00054000: [1, 5],
        0x00054800: [2, 5],
        0x0004A000: [3, 5],
        0x00071200: [0, 6],
        0x00063800: [1, 6],
        0x00063400: [2, 6],
        0x00049000: [3, 6],
        0x00071000: [0, 7],
        0x00062800: [1, 7],
        0x00062400: [2, 7],
        0x00048000: [3, 7],
        0x00080F00: [0, 8],
        0x00071C00: [1, 8],
        0x00071A00: [2, 8],
        0x00056800: [3, 8],
        0x00080B00: [0, 9],
        0x00080E00: [1, 9],
        0x00071400: [2, 9],
        0x00063000: [3, 9],
        0x00090780: [0, 10],
        0x00080A00: [1, 10],
        0x00080D00: [2, 10],
        0x00071800: [3, 10],
        0x00090580: [0, 11],
        0x00090700: [1, 11],
        0x00080900: [2, 11],
        0x00080C00: [3, 11],
        0x00090400: [0, 12],
        0x00090500: [1, 12],
        0x00090680: [2, 12],
        0x00080800: [3, 12],
        0x000A0340: [0, 13],
        0x00090380: [1, 13],
        0x00090480: [2, 13],
        0x00090600: [3, 13],
        0x000A0240: [0, 14],
        0x000A0300: [1, 14],
        0x000A02C0: [2, 14],
        0x000A0280: [3, 14],
        0x000A0140: [0, 15],
        0x000A0200: [1, 15],
        0x000A01C0: [2, 15],
        0x000A0180: [3, 15],
        0x000A0040: [0, 16],
        0x000A0100: [1, 16],
        0x000A00C0: [2, 16],
        0x000A0080: [3, 16]
    };

    var coeff_map_nc_8 = {
        0x00060C00: [0, 0],
        0x00060000: [0, 1],
        0x00060400: [1, 1],
        0x00061000: [0, 2],
        0x00061400: [1, 2],
        0x00061800: [2, 2],
        0x00062000: [0, 3],
        0x00062400: [1, 3],
        0x00062800: [2, 3],
        0x00062C00: [3, 3],
        0x00063000: [0, 4],
        0x00063400: [1, 4],
        0x00063800: [2, 4],
        0x00063C00: [3, 4],
        0x00064000: [0, 5],
        0x00064400: [1, 5],
        0x00064800: [2, 5],
        0x00064C00: [3, 5],
        0x00065000: [0, 6],
        0x00065400: [1, 6],
        0x00065800: [2, 6],
        0x00065C00: [3, 6],
        0x00066000: [0, 7],
        0x00066400: [1, 7],
        0x00066800: [2, 7],
        0x00066C00: [3, 7],
        0x00067000: [0, 8],
        0x00067400: [1, 8],
        0x00067800: [2, 8],
        0x00067C00: [3, 8],
        0x00068000: [0, 9],
        0x00068400: [1, 9],
        0x00068800: [2, 9],
        0x00068C00: [3, 9],
        0x00069000: [0, 10],
        0x00069400: [1, 10],
        0x00069800: [2, 10],
        0x00069C00: [3, 10],
        0x0006A000: [0, 11],
        0x0006A400: [1, 11],
        0x0006A800: [2, 11],
        0x0006AC00: [3, 11],
        0x0006B000: [0, 12],
        0x0006B400: [1, 12],
        0x0006B800: [2, 12],
        0x0006BC00: [3, 12],
        0x0006C000: [0, 13],
        0x0006C400: [1, 13],
        0x0006C800: [2, 13],
        0x0006CC00: [3, 13],
        0x0006D000: [0, 14],
        0x0006D400: [1, 14],
        0x0006D800: [2, 14],
        0x0006DC00: [3, 14],
        0x0006E000: [0, 15],
        0x0006E400: [1, 15],
        0x0006E800: [2, 15],
        0x0006EC00: [3, 15],
        0x0006F000: [0, 16],
        0x0006F400: [1, 16],
        0x0006F800: [2, 16],
        0x0006FC00: [3, 16]
    };

    var coeff_map_nc_m1 = {
        0x00024000: [0, 0],
        0x00061C00: [0, 1],
        0x00018000: [1, 1],
        0x00061000: [0, 2],
        0x00061800: [1, 2],
        0x00032000: [2, 2],
        0x00060C00: [0, 3],
        0x00070600: [1, 3],
        0x00070400: [2, 3],
        0x00061400: [3, 3],
        0x00060800: [0, 4],
        0x00080300: [1, 4],
        0x00080200: [2, 4],
        0x00070000: [3, 4],
    };

    var total_zeros_map = [{
        /* totalCoeff == 1 */
        0x00018000: 0,
        0x00036000: 1,
        0x00034000: 2,
        0x00043000: 3,
        0x00042000: 4,
        0x00051800: 5,
        0x00051000: 6,
        0x00060C00: 7,
        0x00060800: 8,
        0x00070600: 9,
        0x00070400: 10,
        0x00080300: 11,
        0x00080200: 12,
        0x00090180: 13,
        0x00090100: 14,
        0x00090080: 15
    }, {
        /* totalCoeff == 2 */
        0x0003E000: 0,
        0x0003C000: 1,
        0x0003A000: 2,
        0x00038000: 3,
        0x00036000: 4,
        0x00045000: 5,
        0x00044000: 6,
        0x00043000: 7,
        0x00042000: 8,
        0x00051800: 9,
        0x00051000: 10,
        0x00060C00: 11,
        0x00060800: 12,
        0x00060400: 13,
        0x00060000: 14
    }, {
        /* totalCoeff == 3 */
        0x00045000: 0,
        0x0003E000: 1,
        0x0003C000: 2,
        0x0003A000: 3,
        0x00044000: 4,
        0x00043000: 5,
        0x00038000: 6,
        0x00036000: 7,
        0x00042000: 8,
        0x00051800: 9,
        0x00051000: 10,
        0x00060400: 11,
        0x00050800: 12,
        0x00060000: 13,
    }, {
        /* totalCoeff == 4 */
        0x00051800: 0,
        0x0003E000: 1,
        0x00045000: 2,
        0x00044000: 3,
        0x0003C000: 4,
        0x0003A000: 5,
        0x00038000: 6,
        0x00043000: 7,
        0x00036000: 8,
        0x00042000: 9,
        0x00051000: 10,
        0x00050800: 11,
        0x00050000: 12,
    }, {
        /* totalCoeff == 5 */
        0x00045000: 0,
        0x00044000: 1,
        0x00043000: 2,
        0x0003E000: 3,
        0x0003C000: 4,
        0x0003A000: 5,
        0x00038000: 6,
        0x00036000: 7,
        0x00042000: 8,
        0x00050800: 9,
        0x00041000: 10,
        0x00050000: 11,
    }, {
        /* totalCoeff == 6 */
        0x00060400: 0,
        0x00050800: 1,
        0x0003E000: 2,
        0x0003C000: 3,
        0x0003A000: 4,
        0x00038000: 5,
        0x00036000: 6,
        0x00034000: 7,
        0x00041000: 8,
        0x00032000: 9,
        0x00060000: 10,
    }, {
        /* totalCoeff == 7 */
        0x00060400: 0,
        0x00050800: 1,
        0x0003A000: 2,
        0x00038000: 3,
        0x00036000: 4,
        0x0002C000: 5,
        0x00034000: 6,
        0x00041000: 7,
        0x00032000: 8,
        0x00060000: 9,
    }, {
        /* totalCoeff == 8 */
        0x00060400: 0,
        0x00041000: 1,
        0x00050800: 2,
        0x00036000: 3,
        0x0002C000: 4,
        0x00028000: 5,
        0x00034000: 6,
        0x00032000: 7,
        0x00060000: 8,
    }, {
        /* totalCoeff == 9 */
        0x00060400: 0,
        0x00060000: 1,
        0x00041000: 2,
        0x0002C000: 3,
        0x00028000: 4,
        0x00032000: 5,
        0x00024000: 6,
        0x00050800: 7,
    }, {
        /* totalCoeff == 10 */
        0x00050800: 0,
        0x00050000: 1,
        0x00032000: 2,
        0x0002C000: 3,
        0x00028000: 4,
        0x00024000: 5,
        0x00041000: 6,
    }, {
        /* totalCoeff == 11 */
        0x00040000: 0,
        0x00041000: 1,
        0x00032000: 2,
        0x00034000: 3,
        0x00018000: 4,
        0x00036000: 5,
    }, {
        /* totalCoeff == 12 */
        0x00040000: 0,
        0x00041000: 1,
        0x00024000: 2,
        0x00018000: 3,
        0x00032000: 4,
    }, {
        /* totalCoeff == 13 */
        0x00030000: 0,
        0x00032000: 1,
        0x00018000: 2,
        0x00024000: 3,
    }, {
        /* totalCoeff == 14 */
        0x00020000: 0,
        0x00024000: 1,
        0x00018000: 2,
    }, {
        /* totalCoeff == 15 */
        0x00010000: 0,
        0x00018000: 1,
    }];

    var run_before_map = [{
        0x00018000: 0,
        0x00010000: 1,
    }, {
        0x00018000: 0,
        0x00024000: 1,
        0x00020000: 2,
    }, {
        0x0002C000: 0,
        0x00028000: 1,
        0x00024000: 2,
        0x00020000: 3,
    }, {
        0x0002C000: 0,
        0x00028000: 1,
        0x00024000: 2,
        0x00032000: 3,
        0x00030000: 4,
    }, {
        0x0002C000: 0,
        0x00028000: 1,
        0x00036000: 2,
        0x00034000: 3,
        0x00032000: 4,
        0x00030000: 5,
    }, {
        0x0002C000: 0,
        0x00030000: 1,
        0x00032000: 2,
        0x00036000: 3,
        0x00034000: 4,
        0x0003A000: 5,
        0x00038000: 6,
    }, {
        0x0003E000: 0,
        0x0003C000: 1,
        0x0003A000: 2,
        0x00038000: 3,
        0x00036000: 4,
        0x00034000: 5,
        0x00032000: 6,
        0x00041000: 7,
        0x00050800: 8,
        0x00060400: 9,
        0x00070200: 10,
        0x00080100: 11,
        0x00090080: 12,
        0x000A0040: 13,
        0x000B0020: 14,
    }
    ];

    var NumSubMbPart = function(sub_mb_type) {
        switch (sub_mb_type) {
            case 0:
                return 1;
            case 1:
            case 2:
                return 2;
            default:
                return 4;
        }
    };

    function calcNC(blockIndex) {
        var neighbourA = _common.getNeighbourA4x4(blockIndex);
        var neighbourB = _common.getNeighbourB4x4(blockIndex);
        var nc = 0;

        if (neighbourA[0] === _defs.MB_CURR && neighbourB[0] === _defs.MB_CURR) {
            nc = (this.totalCoeff[neighbourA[1]] + this.totalCoeff[neighbourB[1]] + 1) >> 1;
        } else if (neighbourA[0] === _defs.MB_CURR) {
            nc = this.totalCoeff[neighbourA[1]];
            if (_common.isNeighbourAvailable(this, this.mbB)) {
                nc = (nc + this.mbB.totalCoeff[neighbourB[1]] + 1) >> 1;
            }
        } else if (neighbourB[0] === _defs.MB_CURR) {
            nc = this.totalCoeff[neighbourB[1]];
            if (_common.isNeighbourAvailable(this, this.mbA)) {
                nc = (nc + this.mbA.totalCoeff[neighbourA[1]] + 1) >> 1;
            }
        } else {
            var tmp = 0;
            if (_common.isNeighbourAvailable(this, this.mbA)) {
                nc = this.mbA.totalCoeff[neighbourA[1]];
                tmp = 1;
            }
            if (_common.isNeighbourAvailable(this, this.mbB)) {
                if (tmp) {
                    nc = (nc + this.mbB.totalCoeff[neighbourB[1]] + 1) >> 1;
                } else {
                    nc = this.mbB.totalCoeff[neighbourB[1]];
                }
            }
        }
        return nc || 0;
    }

    function decodeCoeffToken(qb, nc) {
        var state = 0x00000000;
        if (0 <= nc && nc < 2) {
            for (var size = 0; size < 16; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_0_2[state] !== undefined) {
                    return coeff_map_nc_0_2[state];
                }
            }
        } else if (2 <= nc && nc < 4) {
            for (var size = 0; size < 16; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_2_4[state] !== undefined) {
                    return coeff_map_nc_2_4[state];
                }
            }
        } else if (4 <= nc && nc < 8) {
            for (var size = 0; size < 10; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_4_8[state] !== undefined) {
                    return coeff_map_nc_4_8[state];
                }
            }
        } else if (8 <= nc) {
            for (var size = 0; size < 6; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_8[state] !== undefined) {
                    return coeff_map_nc_8[state];
                }
            }
        } else if (nc === -1) {
            for (var size = 0; size < 8; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_m1[state] !== undefined) {
                    return coeff_map_nc_m1[state];
                }
            }
        }
        console.log('nc', nc, state);
    }

    function decodeLevelPrefix(qb) {
        for (var i = 0; i < 32; i++) {
            var bit = qb.deqBits(1);
            if (bit) {
                return i;
            }
        }
        return null;
    }

    function decodeTotalZeros(qb, totalCoeff, isChromaDC) {
        var state = 0x00000000;
        if (!isChromaDC) {
            for (var i = 0; i < 17 - totalCoeff; i++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - i);
                if (total_zeros_map[totalCoeff - 1][state] !== undefined) {
                    return total_zeros_map[totalCoeff - 1][state];
                }
            }
        } else {
            if (totalCoeff === 1) {
                for (var i = 0; i < 3; i++) {
                    var bit = qb.deqBits(1);
                    if (bit) {
                        return i;
                    }
                }
                return 3;
            } else if (totalCoeff === 2) {
                for (var i = 0; i < 2; i++) {
                    var bit = qb.deqBits(1);
                    if (bit) {
                        return i;
                    }
                }
                return 2;
            } else if (totalCoeff === 3) {
                for (var i = 0; i < 1; i++) {
                    var bit = qb.deqBits(1);
                    if (bit) {
                        return i;
                    }
                }
                return 1;
            }
        }
    }

    function decodeRunBefore(qb, zerosLeft) {
        var state = 0x00000000;
        var loops = 0;
        switch (zerosLeft) {
            case 1:
                loops = 1;
                break;
            case 2:
            case 3:
                loops = 2;
                break;
            case 4:
            case 5:
            case 6:
                loops = 3;
                break;
            default:
                loops = 11;
                break;
        }

        if (zerosLeft <= 6) {
            for (var i = 0; i < loops; i++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - i);
                if (run_before_map[zerosLeft - 1][state] !== undefined) {
                    return run_before_map[zerosLeft - 1][state];
                }
            }
        } else {
            for (var i = 0; i < loops; i++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - i);
                if (run_before_map[6][state] !== undefined) {
                    return run_before_map[6][state];
                }
            }
        }

    }

    function residual_block_cavlc(nc, coeffLevel, maxNumCoeff) {
        for (var i = 0; i < maxNumCoeff; i++) {
            coeffLevel[i] = 0;
        }
        var params = decodeCoeffToken(this.qb, nc);
        var suffixLength = 0;
        var trailing_ones_sign_flag = 0;
        var level = [];
        var level_suffix;
        if (params[1] > 0) {
            if (params[1] > 10 && params[0] < 3) {
                suffixLength = 1;
            } else {
                suffixLength = 0;
            }
            for (var i = 0; i < params[1]; i++) {
                if (i < params[0]) {
                    trailing_ones_sign_flag = this.qb.deqBits(1);
                    level[i] = 1 - 2 * trailing_ones_sign_flag;
                } else {
                    var level_prefix = decodeLevelPrefix(this.qb);
                    var levelCode = (level_prefix << suffixLength);
                    if (suffixLength > 0 || level_prefix >= 14) {
                        var levelSuffixSize;
                        if (level_prefix === 14 && suffixLength === 0) {
                            levelSuffixSize = 4;
                        } else if (level_prefix === 15) {
                            levelSuffixSize = 12;
                        } else {
                            levelSuffixSize = suffixLength;
                        }
                        if (levelSuffixSize) {
                            level_suffix = this.qb.deqBits(levelSuffixSize);
                        } else {
                            level_suffix = 0;
                        }
                        levelCode += level_suffix;
                    }
                    if (level_prefix === 15 && suffixLength === 0) {
                        levelCode += 15;
                    }
                    if (i === params[0] && params[0] < 3) {
                        levelCode += 2;
                    }
                    if (levelCode % 2 === 0) {
                        level[i] = (levelCode + 2) >> 1;
                    } else {
                        level[i] = (-levelCode - 1) >> 1;
                    }
                    if (suffixLength === 0) {
                        suffixLength = 1;
                    }
                    if (Math.abs(level[i]) > (3 << (suffixLength - 1)) && suffixLength < 6) {
                        suffixLength++;
                    }
                }
            }
            var zerosLeft = 0;
            if (params[1] < maxNumCoeff) {
                var total_zeros = decodeTotalZeros(this.qb, params[1], maxNumCoeff === 4);
                zerosLeft = total_zeros;
            }

            var run = [];
            for (var i = 0; i < params[1] - 1; i++) {
                if (zerosLeft > 0) {
                    var run_before = decodeRunBefore(this.qb, zerosLeft);
                    run[i] = run_before;
                } else {
                    run[i] = 0;
                }
                zerosLeft = zerosLeft - run[i];
            }
            run[params[1] - 1] = zerosLeft;
            var coeffNum = -1;
            for (var i = params[1] - 1; i >= 0; i--) {
                coeffNum += run[i] + 1;
                coeffLevel[coeffNum] = level[i];
            }
        }
        return params[1];
    }

    function residual(mb_type) {
        if (this.mbPartPredMode === _defs.Intra_16x16) {
            var nc = calcNC.call(this, 0); // why?
            this.Intra16x16DCLevel = [];
            var tc = residual_block_cavlc.call(this, nc, this.Intra16x16DCLevel, 16);
            this.totalCoeff[24] = tc;
        }

        this.Intra16x16ACLevel = [];
        var LumaLevel = [];
        this.LumaLevel = LumaLevel;
        for (var i8x8 = 0; i8x8 < 4; i8x8++) {
            for (var i4x4 = 0; i4x4 < 4; i4x4++) {
                if (this.CodedBlockPattenLuma & (1 << i8x8)) {
                    var nc = calcNC.call(this, 4 * i8x8 + i4x4);
                    if (this.mbPartPredMode === _defs.Intra_16x16) {
                        this.Intra16x16ACLevel[i8x8 * 4 + i4x4] = [];
                        var tc = residual_block_cavlc.call(this, nc, this.Intra16x16ACLevel[i8x8 * 4 + i4x4], 15);
                        this.totalCoeff[i8x8 * 4 + i4x4] = tc;
                    } else {
                        LumaLevel[i8x8 * 4 + i4x4] = [];
                        var tc = residual_block_cavlc.call(this, nc, LumaLevel[i8x8 * 4 + i4x4], 16);
                        this.totalCoeff[i8x8 * 4 + i4x4] = tc;
                    }
                } else {
                    if (this.mbPartPredMode === _defs.Intra_16x16) {
                        this.Intra16x16ACLevel[i8x8 * 4 + i4x4] = [];
                        for (var i = 0; i < 15; i++) {
                            this.Intra16x16ACLevel[i8x8 * 4 + i4x4][i] = 0;
                        }
                    } else {
                        LumaLevel[i8x8 * 4 + i4x4] = [];
                        for (var i = 0; i < 16; i++) {
                            LumaLevel[i8x8 * 4 + i4x4][i] = 0;
                        }
                    }
                }
            }
        }

        var ChromaDCLevel = [];
        var idx = 25;
        for (var iCbCr = 0; iCbCr < 2; iCbCr++) {
            ChromaDCLevel[iCbCr] = [];
            if (this.CodedBlockPatternChroma & 3) {
                var tc = residual_block_cavlc.call(this, -1, ChromaDCLevel[iCbCr], 4);
                this.totalCoeff[idx] = tc;
            } else {
                for (var i = 0; i < 4; i++) {
                    ChromaDCLevel[iCbCr][i] = 0;
                }
            }
            idx++;
        }

        var ChromaACLevel = [];
        var idx = 16;
        for (var iCbCr = 0; iCbCr < 2; iCbCr++) {
            ChromaACLevel[iCbCr] = [];
            for (var i4x4 = 0; i4x4 < 4; i4x4++) {
                ChromaACLevel[iCbCr][i4x4] = [];
                if (this.CodedBlockPatternChroma & 2) {
                    var nc = calcNC.call(this, idx); // problem
                    var tc = residual_block_cavlc.call(this, nc, ChromaACLevel[iCbCr][i4x4], 15);
                    this.totalCoeff[idx] = tc;
                } else {
                    for (var i = 0; i < 15; i++) {
                        ChromaACLevel[iCbCr][i4x4][i] = 0;
                    }
                    this.totalCoeff[idx] = 0;
                }
                idx++;
            }
        }
    }

    function edgeBoundaryStrength(mb1, mb2, ind1, ind2) {

        if (mb1.totalCoeff[ind1] || mb2.totalCoeff[ind2]) {
            return 2;
        }
        else if ((mb1.refAddr[ind1 >> 2] != mb2.refAddr[ind2 >> 2]) ||
            (Math.abs(mb1.mv[ind1].hor - mb2.mv[ind2].hor) >= 4) ||
            (Math.abs(mb1.mv[ind1].ver - mb2.mv[ind2].ver) >= 4)) {
            return 1;
        }
        else
            return 0;
    }

    function InnerBoundaryStrength(mb1, ind1, ind2) {
        var tmp1, tmp2;
        var mv1, mv2, mv3, mv4;

        tmp1 = mb1.totalCoeff[ind1];
        tmp2 = mb1.totalCoeff[ind2];
        mv1 = mb1.mv[ind1].hor;
        mv2 = mb1.mv[ind2].hor;
        mv3 = mb1.mv[ind1].ver;
        mv4 = mb1.mv[ind2].ver;

        if (tmp1 || tmp2) {
            return 2;
        }
        else if ((Math.abs(mv1 - mv2) >= 4) || (Math.abs(mv3 - mv4) >= 4) ||
            (mb1.refAddr[ind1 >> 2] != mb1.refAddr[ind2 >> 2])) {
            return 1;
        }
        else
            return 0;
    }

    function Macroblock_layer(qb, slice) {
        this.qb = qb;
        this.slice = slice;

        this.totalCoeff = [];
        for (var i = 0; i < 23; i++) {
            this.totalCoeff[i] = 0;
        }

        this.luma4x4 = [];
        this.luma4x4PredMode = [];
        this.intra4x4PredMode = [];

        /* 16 * 16 * 3 / 2 = 384 */
        this.yuv = new Array(384);
        this.luma = [];
        for (var i = 0; i < 16; i++) {
            this.luma[i] = [0, 0, 0, 0];
        }

        this.decoded = {
            lumas: new Array(16)
        };
        this.prev_intra4x4_pred_mode_flag = [];
        this.rem_intra4x4_pred_mode = [];
        this.mv = new Array(16);
        for (var i = 0; i < 16; i++) {
            this.mv[i] = {ver: 0, hor: 0};
        }
        this.mvd_l0 = new Array(4);
        for (var i = 0; i < 4; i++) {
            this.mvd_l0[i] = {ver: 0, hor: 0};
        }
        this.sub_mb_type = new Array(4);
        this.refPic = new Array(4);
        this.ref_idx_l0 = [0, 0, 0, 0];
        this.subMbs = [];
        for (var i = 0; i < 4; i++) {
            this.subMbs[i] = _subMb.create();
        }
        this.refAddr = [null, null, null, null];
    }

    Macroblock_layer.prototype = {
        parse: function(qb) {
            this.qb = qb;
            this.mb_type = qb.deqUe();
            if (_common.isISlice(this.slice.slice_type)) {
                this.type = _defs.I_MB;
                this.mbPartPredMode = (this.mb_type === 0) ? _defs.Intra_4x4 : _defs.Intra_16x16;
            } else {
                if (this.mb_type > 4) { /* I Mb */
                    this.type = _defs.I_MB;
                    this.mb_type -= 5;
                    this.mbPartPredMode = (this.mb_type === 0) ? _defs.Intra_4x4 : _defs.Intra_16x16;
                } else {
                    this.type = _defs.P_MB;
                    if (this.mb_type === 0 || this.mb_type === 1 || this.mb_type === 2 || this.mb_type === 100) { /* mb_type 100 for P_Skip */
                        this.mbPartPredMode = _defs.Pred_L0;
                    } else {
                        this.mbPartPredMode = _defs.Pred_Na;
                    }
                }
            }


            /* init sub macroblocks */
            if (this.type === _defs.P_MB) {
                switch (this.mb_type) {
                    case _defs.P_L0_16x16:
                    case _defs.P_Skip:
                        this.numMbPart = 1;
                        this.mbPartWidth = 16;
                        this.mbPartHeight = 16;
                        break;
                    case _defs.P_L0_L0_16x8:
                        this.numMbPart = 2;
                        this.mbPartWidth = 16;
                        this.mbPartHeight = 8;
                        break;
                    case _defs.P_L0_L0_8x16:
                        this.numMbPart = 2;
                        this.mbPartWidth = 8;
                        this.mbPartHeight = 16;
                        break;
                    default:
                        this.numMbPart = 4;
                        this.mbPartWidth = 8;
                        this.mbPartHeight = 8;
                        break;
                }
            }
            /* init sub macroblocks end */


            if (this.mb_type === _defs.I_PCM) { /* I_PCM */
                while (!qb.isAligned()) {
                    this.pcm_alignment_zero_bit = qb.deqBits(1);
                }
                this.pcm_byte = [];
                for (var i = 0; i < 384; i++) {
                    this.pcm_byte[i] = qb.deqBits(8);
                }
            } else {
                if (this.mbPartPredMode !== _defs.Intra_4x4 && this.mbPartPredMode !== _defs.Intra_16x16 && this.numMbPart === 4) {
                    /* sub_mb_pred() */
                    this.subMbPred();
                    /* sub_mb_pred() end*/
                } else {
                    /* mb_pred() */
                    this.mbPred();
                    /* mb_pred() end */
                }

                if (this.mbPartPredMode !== _defs.Intra_16x16) {
                    this.coded_block_pattern = qb.deqMe(this.mbPartPredMode === _defs.Intra_4x4);
                    this.CodedBlockPattenLuma = this.coded_block_pattern % 16;
                    this.CodedBlockPatternChroma = Math.floor(this.coded_block_pattern / 16);
                } else {
                    if (this.mb_type <= 12) {
                        this.CodedBlockPattenLuma = 0;
                    } else {
                        this.CodedBlockPattenLuma = 15;
                    }
                    if ((this.mb_type >= 1 && this.mb_type <= 4) || (this.mb_type >= 13 && this.mb_type <= 16)) {
                        this.CodedBlockPatternChroma = 0;
                    } else if ((this.mb_type >= 5 && this.mb_type <= 8) || (this.mb_type >= 17 && this.mb_type <= 20)) {
                        this.CodedBlockPatternChroma = 1;
                    } else if ((this.mb_type >= 9 && this.mb_type <= 12) || (this.mb_type >= 21 && this.mb_type <= 24)) {
                        this.CodedBlockPatternChroma = 2;
                    }
                }
                if (this.CodedBlockPattenLuma > 0 || this.CodedBlockPatternChroma > 0 || this.mbPartPredMode === _defs.Intra_16x16) {
                    this.mb_qp_delta = qb.deqSe();
                    residual.call(this, this.mb_type);
                    this.hasResidual = true;
                } else {
                    this.mb_qp_delta = 0;
                }
            }
        },
        mbPred: function() {
            var qb = this.qb;
            if (this.mbPartPredMode === _defs.Intra_4x4 || this.mbPartPredMode === _defs.Intra_16x16) {
                if (this.mbPartPredMode === _defs.Intra_4x4) {
                    for (var luma4x4BlkIdx = 0; luma4x4BlkIdx < 16; luma4x4BlkIdx++) {
                        this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx] = qb.deqBits(1);
                        if (!this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx]) {
                            this.rem_intra4x4_pred_mode[luma4x4BlkIdx] = qb.deqBits(3);
                        }
                    }
                }
                this.intra_chroma_pred_mode = qb.deqUe();
            } else {
                this.ref_idx_l0 = [0, 0, 0, 0];
                for (var mbPartIdx = 0; mbPartIdx < this.numMbPart; mbPartIdx++) {
                    if (this.slice.num_ref_idx_l0_active_minus1 > 0) {
                        this.ref_idx_l0[mbPartIdx] = qb.deqTe((this.slice.num_ref_idx_l0_active_minus1 > 1));
                    }
                }
                this.mvd_l0 = [];
                for (var mbPartIdx = 0; mbPartIdx < this.numMbPart; mbPartIdx++) {
                    this.mvd_l0[mbPartIdx] = {hor: qb.deqSe(), ver: qb.deqSe()};
                }
            }
        },
        subMbPred: function() {
            var qb = this.qb;
            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
                this.subMbs[mbPartIdx].setSubMbType(qb.deqUe());
            }
            this.ref_idx_l0 = [0, 0, 0, 0];
            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) { /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice */
                if ((this.slice.num_ref_idx_l0_active_minus1 > 0) && mb_type !== _defs.P_8x8ref0) {
                    this.ref_idx_l0[mbPartIdx] = qb.deqTe(this.slice.num_ref_idx_l0_active_minus1 > 1);
                }
            }

            /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice, so no need to parse ref_idx_l1 */

            this.mvd_l0 = [];
            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
                this.mvd_l0[mbPartIdx] = [];
                for (var subMbPartIdx = 0; subMbPartIdx < this.subMbs[mbPartIdx].numSubMbPart; subMbPartIdx++) {
                    this.mvd_l0[mbPartIdx][subMbPartIdx] = {hor: qb.deqSe(), ver: qb.deqSe()};
                }
            }
        },
        getMbPartPredMode: function() {
            return (this.mb_type === 0) ? _defs.Intra_4x4 : _defs.Intra_16x16;
        },
        getIntra16x16PredMode: function() {
            return (this.mb_type - 1) % 4;
        },
        isMbAAvailable: function() {
            if (!this.mbA || this.slice != this.mbA.slice) {
                return false;
            }
            return true;
        },
        isMbBAvailable: function() {
            if (!this.mbB || this.slice != this.mbB.slice) {
                return false;
            }
            return true;
        },
        getIntra4x4PredMode: function(blockIndex) {
            var pm, pmA, pmB;
            var nA = _common.getNeighbourA4x4(blockIndex);
            var nB = _common.getNeighbourB4x4(blockIndex);

            if (nA[0] === _defs.MB_CURR) {
                pmA = this.intra4x4PredMode[nA[1]];
            } else {
                if (this.mbA === null) {
                    pmA = -1;
                } else {
                    if (this.mbA.mb_type === 0) {
                        pmA = this.mbA.intra4x4PredMode[nA[1]];
                    } else {
                        pmA = 2;
                    }
                }
            }

            if (nB[0] === _defs.MB_CURR) {
                pmB = this.intra4x4PredMode[nB[1]];
            } else {
                if (!this.isMbBAvailable()) {
                    pmB = -1;
                } else {
                    if (this.mbB.mb_type === 0) {
                        pmB = this.mbB.intra4x4PredMode[nB[1]];
                    } else {
                        pmB = 2;
                    }
                }
            }

            if (pmA === -1 || pmB === -1) {
                pm = 2;
            } else {
                pm = _util.min(pmA, pmB);
            }

            if (!this.prev_intra4x4_pred_mode_flag[blockIndex]) {
                if (this.rem_intra4x4_pred_mode[blockIndex] < pm) {
                    pm = this.rem_intra4x4_pred_mode[blockIndex];
                } else {
                    pm = this.rem_intra4x4_pred_mode[blockIndex] + 1;
                }

            }

            /* store pred mode in order to reduce calculation */
            this.intra4x4PredMode[blockIndex] = pm;
            return pm;
        },
        getRight16: function() {
            var lumas = [];
            for (var i = 0; i < 16; i++) {
                lumas[i] = this.luma[i][15];
            }

            return lumas;
        },
        getBottom16: function() {
            var lumas = [];
            for (var i = 0; i < 16; i++) {
                lumas[i] = this.luma[15][i];
            }

            return lumas;
        },
        getRight4: function(blockIndex) {
            var lumas = [];
            var x = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 0) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 0);
            var y = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 1) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 1);
            for (var i = 0; i < 4; i++) {
                lumas[i] = this.luma[y + i][x + 3];
            }
            return lumas;
        },
        getBottom4: function(blockIndex) {
            var lumas = [];
            var x = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 0) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 0);
            var y = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 1) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 1);
            for (var i = 0; i < 4; i++) {
                lumas[i] = this.luma[y + 3][x + i];
            }
            return lumas;
        },
        isNeighbourAvailable: function(neighbour) {
            if (!neighbour || this.slice != neighbour.slice) {
                return false;
            }
            return true;
        },
        writeBlockToLuma: function(data, blockIndex) {
            var x = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 0) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 0);
            var y = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 1) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 1);
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    this.luma[y + i][x + j] = data[i][j];
                }
            }
        },
        decode: function() {
            if (this.type === _defs.I_MB) {
                if (this.mbPartPredMode === _defs.Intra_16x16) {
                    var pm = this.getIntra16x16PredMode();
                    switch (pm) {
                        case _defs.Intra_16x16_Vertical:
                            var source = this.mbB.getBottom16();
                            for (var blk = 0; blk < 16; blk++) {

                                var data = [
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80]
                                ];
                                if (blk === 0 || blk === 2 || blk === 8 || blk === 10) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[j];
                                        }
                                    }
                                } else if (blk === 1 || blk === 3 || blk === 9 || blk === 11) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[j + 4];
                                        }
                                    }
                                } else if (blk === 4 || blk === 6 || blk === 12 || blk === 14) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[j + 8];
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[j + 12];
                                        }
                                    }
                                }
                                this.decoded.lumas[blk] = data;
                                this.writeBlockToLuma(data, blk);
                            }
                            break;
                        case _defs.Intra_16x16_Horizontal:
                            var source = this.mbA.getRight16();
                            for (var blk = 0; blk < 16; blk++) {

                                var data = [
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80]
                                ];
                                if (blk === 0 || blk === 1 || blk === 4 || blk === 5) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[i];
                                        }
                                    }
                                } else if (blk === 2 || blk === 3 || blk === 6 || blk === 7) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[i + 4];
                                        }
                                    }
                                } else if (blk === 8 || blk === 9 || blk === 12 || blk === 13) {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[i + 8];
                                        }
                                    }
                                } else {
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = source[i + 12];
                                        }
                                    }
                                }
                                this.decoded.lumas[blk] = data;
                                this.writeBlockToLuma(data, blk);
                            }
                            break;
                        case _defs.Intra_16x16_DC:
                            for (var blk = 0; blk < 16; blk++) {
                                var data = [
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80]
                                ];
                                var sum = 0, n = 0, out = 128;
                                if (this.isMbAAvailable()) {
                                    var source = this.mbA.getRight16();
                                    for (var i = 0; i < 16; i++) {
                                        sum += source[i];
                                    }
                                    n += 16;
                                }
                                if (this.isMbBAvailable()) {
                                    var source = this.mbB.getBottom16();
                                    for (var i = 0; i < 16; i++) {
                                        sum += source[i];
                                    }
                                    n += 16;
                                }
                                if (this.isMbAAvailable() || this.isMbBAvailable()) {
                                    out = Math.floor(sum / n);
                                }
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        data[i][j] = out;
                                    }
                                }
                                this.decoded.lumas[blk] = data;
                                this.writeBlockToLuma(data, blk);
                            }
                            break;
                        case _defs.Intra_16x16_Plane:
                            var left = this.mbA.getRight16();
                            var top = this.mbB.getBottom16();
                            var a = 16 * (top[15] + left[15]);
                            var H = 0;
                            for (var i = 0; i < 8; i++) {
                                H += (i + 1) * (left[8 + i] - top[6 - i]);
                            }
                            var b = (5 * H + 32) >> 6;

                            var V = 0;
                            for (var i = 0; i < 8; i++) {
                                V += (i + 1) * (top[8 + i] - left[6 - i]);
                            }
                            var c = (5 * V + 32) >> 6;
                            var tmp = [];
                            for (var i = 0; i < 16; i++) {
                                tmp[i] = [];
                                for (var j = 0; j < 16; j++) {
                                    tmp[i][j] = _common.clip1((a + b * (i - 7) + c * (j - 7) + 16) >> 5);
                                }
                            }


                            for (var blk = 0; blk < 16; blk++) {
                                var data = [
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80],
                                    [0x80, 0x80, 0x80, 0x80]
                                ];
                                var bid = _defs.map4x4to16x16[blk];
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        data[i][j] = tmp[(bid % 4) * 4 + i][(bid % 4) * 4 + j];
                                    }
                                }

                                this.decoded.lumas[blk] = data;
                                this.writeBlockToLuma(data, blk);
                            }
                            break;

                    }

                    /* bellow is residual */
                    var dc = this.Intra16x16DCLevel;

                    var c = [
                        [dc[0], dc[1], dc[5], dc[6]],
                        [dc[2], dc[4], dc[7], dc[12]],
                        [dc[3], dc[8], dc[11], dc[13]],
                        [dc[9], dc[10], dc[14], dc[15]]
                    ];

                    var tmp1 = [
                        [1, 1, 1, 1],
                        [1, 1, -1, -1],
                        [1, -1, -1, 1],
                        [1, -1, 1, -1]
                    ];
                    var tmp2 = [
                        [1, 1, 1, 1],
                        [1, 1, -1, -1],
                        [1, -1, -1, 1],
                        [1, -1, 1, -1]
                    ];
                    var tmp3 = _util.matrix.multiply(tmp1, c);
                    var f = _util.matrix.multiply(tmp3, tmp2);

                    var qpY = this.decoder.pps.pic_init_qp_minus26 + 26 + this.slice.slice_qp_delta;
                    if (this.mbaddr !== this.first_mb_in_slice) {
                        qpY = (this.slice.decoder.mbs[this.mbaddr - 1].qpY + this.mb_qp_delta + 52) % 52;
                    }
                    this.qpY = qpY;

                    var dcY = [[], [], [], []];
                    if (qpY >= 12) {
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                dcY[i][j] = (f[i][j] * _common.LevelScale(qpY % 6, 0, 0)) << (Math.floor(qpY / 6) - 2);
                            }
                        }
                    } else {
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                dcY[i][j] = (f[i][j] * _common.LevelScale(qpY % 6, 0, 0) + (1 << (1 - Math.floor(qpY / 6)))) >> (2 - Math.floor(qpY / 6));
                            }
                        }
                    }

                    for (var blk = 0; blk < 16; blk++) {
                        var lumaList = [];
                        lumaList[0] = dcY[_defs.abmap[blk][0]][_defs.abmap[blk][1]];
                        for (var i = 1; i < 16; i++) {
                            lumaList[i] = this.Intra16x16ACLevel[blk][i - 1];
                        }

                        var c = [
                            [lumaList[0], lumaList[1], lumaList[5], lumaList[6]],
                            [lumaList[2], lumaList[4], lumaList[7], lumaList[12]],
                            [lumaList[3], lumaList[8], lumaList[11], lumaList[13]],
                            [lumaList[9], lumaList[10], lumaList[14], lumaList[15]]
                        ];
                        var d = [
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0]
                        ];
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                d[i][j] = (c[i][j] * _common.LevelScale(qpY % 6, i, j)) << Math.floor(qpY / 6);
                            }
                        }
                        d[0][0] = c[0][0];

                        var e = [
                            [d[0][0] + d[0][2], d[0][0] - d[0][2], (d[0][1] >> 1) - d[0][3], d[0][1] + (d[0][3] >> 1)],
                            [d[1][0] + d[1][2], d[1][0] - d[1][2], (d[1][1] >> 1) - d[1][3], d[1][1] + (d[1][3] >> 1)],
                            [d[2][0] + d[2][2], d[2][0] - d[2][2], (d[2][1] >> 1) - d[2][3], d[2][1] + (d[2][3] >> 1)],
                            [d[3][0] + d[3][2], d[3][0] - d[3][2], (d[3][1] >> 1) - d[3][3], d[3][1] + (d[3][3] >> 1)],
                        ];

                        var f = [
                            [e[0][0] + e[0][3], e[0][1] + e[0][2], e[0][1] - e[0][2], e[0][0] - e[0][3]],
                            [e[1][0] + e[1][3], e[1][1] + e[1][2], e[1][1] - e[1][2], e[1][0] - e[1][3]],
                            [e[2][0] + e[2][3], e[2][1] + e[2][2], e[2][1] - e[2][2], e[2][0] - e[2][3]],
                            [e[3][0] + e[3][3], e[3][1] + e[3][2], e[3][1] - e[3][2], e[3][0] - e[3][3]],
                        ];

                        var g = [
                            [f[0][0] + f[2][0], f[0][1] + f[2][1], f[0][2] + f[2][2], f[0][3] + f[2][3]],
                            [f[0][0] - f[2][0], f[0][1] - f[2][1], f[0][2] - f[2][2], f[0][3] - f[2][3]],
                            [(f[1][0] >> 1) - f[3][0], (f[1][1] >> 1) - f[3][1], (f[1][2] >> 1) - f[3][2], (f[1][3] >> 1) - f[3][3]],
                            [f[1][0] + (f[3][0] >> 1), f[1][1] + (f[3][1] >> 1), f[1][2] + (f[3][2] >> 1), f[1][3] + (f[3][3] >> 1)]
                        ];

                        var h = [
                            [g[0][0] + g[3][0], g[0][1] + g[3][1], g[0][2] + g[3][2], g[0][3] + g[3][3]],
                            [g[1][0] + g[2][0], g[1][1] + g[2][1], g[1][2] + g[2][2], g[1][3] + g[2][3]],
                            [g[1][0] - g[2][0], g[1][1] - g[2][1], g[1][2] - g[2][2], g[1][3] - g[2][3]],
                            [g[0][0] - g[3][0], g[0][1] - g[3][1], g[0][2] - g[3][2], g[0][3] - g[3][3]],
                        ];

                        var r = [[], [], [], []];
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                r[i][j] = (h[i][j] + 32) >> 6;
                            }
                        }

                        var data = this.decoded.lumas[blk];
                        for (var i = 0; i < 4; i++) {
                            for (var j = 0; j < 4; j++) {
                                data[i][j] += r[i][j];
                            }
                        }
                        this.decoded.lumas[blk] = data;
                        this.writeBlockToLuma(data, blk);

                    }


                } else {

                    var qpY = this.decoder.pps.pic_init_qp_minus26 + 26 + this.slice.slice_qp_delta;
                    if (this.mbaddr !== this.slice.first_mb_in_slice) {
                        qpY = (this.slice.decoder.mbs[this.mbaddr - 1].qpY + this.mb_qp_delta + 52) % 52;
                    }
                    this.qpY = qpY;

                    for (var blk = 0; blk < 16; blk++) {
                        var pm = this.getIntra4x4PredMode(blk);

                        var data = [
                            [0x80, 0x80, 0x80, 0x80],
                            [0x80, 0x80, 0x80, 0x80],
                            [0x80, 0x80, 0x80, 0x80],
                            [0x80, 0x80, 0x80, 0x80]
                        ];

                        switch (pm) {
                            case _defs.Intra_4x4_Vertical:
                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var source = sourceMb.getBottom4(nB[1]);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        data[i][j] = source[j];
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Horizontal:
                                var nA = _common.getNeighbourA4x4(blk);
                                var sourceMb;
                                if (nA[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbA;
                                }
                                if (!sourceMb) {
                                    return;
                                }
                                var source = sourceMb.getRight4(nA[1]);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        data[i][j] = source[i];
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_DC:
                                var nA = _common.getNeighbourA4x4(blk);
                                var nB = _common.getNeighbourB4x4(blk);
                                var Amb = (nA[0] === _defs.MB_CURR) ? this : this.mbA;
                                var Bmb = (nB[0] === _defs.MB_CURR) ? this : this.mbB;
                                var sum = 0, n = 0;
                                if (Amb === null && Bmb === null) {
                                    /* default is 128, so do nothing */
                                } else {
                                    if (this.isNeighbourAvailable(Amb)) {
                                        for (var i = 0; i < 4; i++) {
                                            sum += Amb.getRight4(nA[1])[i];
                                        }
                                        sum += 2;
                                        n += 4;
                                    }
                                    if (this.isNeighbourAvailable(Bmb)) {
                                        for (var i = 0; i < 4; i++) {
                                            sum += Bmb.getBottom4(nB[1])[i];
                                        }
                                        sum += 2;
                                        n += 4;
                                    }
                                    var out;
                                    if (this.isNeighbourAvailable(Amb) || this.isNeighbourAvailable(Bmb)) {
                                        out = Math.floor(sum / n);
                                    } else {
                                        out = 128;
                                    }
                                    for (var i = 0; i < 4; i++) {
                                        for (var j = 0; j < 4; j++) {
                                            data[i][j] = out;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Diagonal_Down_left:
                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var source1 = sourceMb.getBottom4(nB[1]);

                                var source2;
                                var nC = _common.getNeighbourC4x4(blk);
                                if (nC[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else if (nC[0] === _defs.MB_C) {
                                    sourceMb = this.mbC;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else if (nC[0] === _defs.MB_B) {
                                    sourceMb = this.mbB;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else { /* MB_NA */
                                    source2 = [source1[3], source1[3], source1[3], source1[3]];
                                }

                                var source = source1.concat(source2);
                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if (i === 3 && j === 3) {
                                            data[j][i] = (source[6] + 3 * source[7] + 2) >> 2;
                                        } else {
                                            data[j][i] = (source[i + j] + 2 * source[i + j + 1] + source[i + j + 2] + 2) >> 2;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Diagonal_Down_Right:
                                var nD = _common.getNeighbourD4x4(blk);
                                var sourceMb;
                                if (nD[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else if (nD[0] === _defs.MB_A) {
                                    sourceMb = this.mbA;
                                } else if (nD[0] === _defs.MB_B) {
                                    sourceMb = this.mbB;
                                } else if (nD[0] === _defs.MB_D) {
                                    sourceMb = this.mbD;
                                }
                                var sourceD = sourceMb.getRight4(nD[1]);

                                var nA = _common.getNeighbourA4x4(blk);
                                if (nA[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbA;
                                }
                                var sourceA = sourceMb.getRight4(nA[1]);

                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var sourceB = sourceMb.getBottom4(nB[1]);

                                sourceA = [sourceD[3]].concat(sourceA);
                                sourceB = [sourceD[3]].concat(sourceB);

                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if (i > j) {
                                            data[j][i] = (sourceB[i - j - 1] + 2 * sourceB[i - j] + sourceB[i - j + 1] + 2) >> 2;
                                        } else if (i < j) {
                                            data[j][i] = (sourceA[j - i - 1] + 2 * sourceB[j - i] + sourceB[j - i + 1] + 2) >> 2;
                                        } else {
                                            data[j][i] = (sourceB[1] + 2 * sourceB[0] + sourceA[1] + 2) >> 2;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Vertical_Right:
                                var nD = _common.getNeighbourD4x4(blk);
                                var sourceMb;
                                if (nD[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else if (nD[0] === _defs.MB_A) {
                                    sourceMb = this.mbA;
                                } else if (nD[0] === _defs.MB_B) {
                                    sourceMb = this.mbB;
                                } else if (nD[0] === _defs.MB_D) {
                                    sourceMb = this.mbD;
                                }
                                var sourceD = sourceMb.getRight4(nD[1]);

                                var nA = _common.getNeighbourA4x4(blk);
                                if (nA[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbA;
                                }
                                var sourceA = sourceMb.getRight4(nA[1]);

                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var sourceB = sourceMb.getBottom4(nB[1]);

                                sourceA = [sourceD[3]].concat(sourceA);
                                sourceB = [sourceD[3]].concat(sourceB);

                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if ((2 * i - j === 0) || (2 * i - j === 2) || (2 * i - j === 4) || (2 * i - j === 6)) {
                                            data[j][i] = (sourceB[i - (j >> 1)] + sourceB[i - (j >> 1) + 1] + 1) >> 1;
                                        } else if ((2 * i - j === 1) || (2 * i - j === 3) || (2 * i - j === 5)) {
                                            data[j][i] = (sourceB[i - (j >> 1) - 1] + 2 * sourceB[i - (j >> 1)] + sourceB[i - (j >> 1) + 1] + 2) >> 2;
                                        } else if (2 * i - j === -1) {
                                            data[j][i] = (sourceA[1] + 2 * sourceA[0] + sourceB[1] + 2) >> 2;
                                        } else {
                                            data[j][i] = (sourceA[j] + 2 * sourceA[j - 1] + sourceA[j - 2] + 2) >> 2;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Horizontal_Down:
                                var nD = _common.getNeighbourD4x4(blk);
                                var sourceMb;
                                if (nD[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else if (nD[0] === _defs.MB_A) {
                                    sourceMb = this.mbA;
                                } else if (nD[0] === _defs.MB_B) {
                                    sourceMb = this.mbB;
                                } else if (nD[0] === _defs.MB_D) {
                                    sourceMb = this.mbD;
                                }
                                var sourceD = sourceMb.getRight4(nD[1]);

                                var nA = _common.getNeighbourA4x4(blk);
                                if (nA[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbA;
                                }
                                var sourceA = sourceMb.getRight4(nA[1]);

                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var sourceB = sourceMb.getBottom4(nB[1]);

                                sourceA = [sourceD[3]].concat(sourceA);
                                sourceB = [sourceD[3]].concat(sourceB);

                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if ((2 * j - i === 0) || (2 * j - i === 2) || (2 * j - i === 4) || (2 * j - i === 6)) {
                                            data[j][i] = (sourceA[j - (i >> 1)] + sourceA[j - (i >> 1) + 1] + 1) >> 1;
                                        } else if ((2 * j - i === 1) || (2 * j - i === 3) || (2 * j - i === 5)) {
                                            data[j][i] = (sourceA[j - (i >> 1) - 1] + 2 * sourceA[j - (i >> 1)] + sourceA[j - (i >> 1) + 1] + 2) >> 2;
                                        } else if (2 * j - i === -1) {
                                            data[j][i] = (sourceA[1] + 2 * sourceA[0] + sourceB[1] + 2) >> 2;
                                        } else {
                                            data[j][i] = (sourceB[i] + 2 * sourceB[i - 1] + sourceB[i - 2] + 2) >> 2;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Vertical_Left:
                                var nB = _common.getNeighbourB4x4(blk);
                                var sourceMb;
                                if (nB[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbB;
                                }
                                var source1 = sourceMb.getBottom4(nB[1]);

                                var source2;
                                var nC = _common.getNeighbourC4x4(blk);
                                if (nC[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else if (nC[0] === _defs.MB_C) {
                                    sourceMb = this.mbC;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else if (nC[0] === _defs.MB_B) {
                                    sourceMb = this.mbB;
                                    source2 = sourceMb.getBottom4(nC[1]);
                                } else { /* MB_NA */
                                    source2 = [source1[3], source1[3], source1[3], source1[3]];
                                }

                                var source = source1.concat(source2);
                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if (j === 0 || j === 2) {
                                            data[j][i] = (source[i + (j >> 1)] + source[i + (j >> 1) + 1] + 1) >> 1;
                                        } else {
                                            data[j][i] = (source[i + (j >> 1)] + 2 * source[i + (j >> 1) + 1] + source[i + (j >> 1) + 2] + 2) >> 2;
                                        }
                                    }
                                }
                                break;
                            case _defs.Intra_4x4_Horizontal_Up:
                                var nA = _common.getNeighbourA4x4(blk);
                                var sourceMb;
                                if (nA[0] === _defs.MB_CURR) {
                                    sourceMb = this;
                                } else {
                                    sourceMb = this.mbA;
                                }
                                var source = sourceMb.getRight4(nA[1]);

                                for (var i = 4; i--;) {
                                    for (var j = 4; j--;) {
                                        if ((i + 2 * j === 0) || (i + 2 * j === 2) || (i + 2 * j === 4)) {
                                            data[j][i] = (source[j + (i >> 1)] + source[j + (i >> 1) + 1] + 1) >> 1;
                                        } else if ((i + 2 * j === 1) || (i + 2 * j === 3)) {
                                            data[j][i] = (source[j + (i >> 1)] + 2 * source[j + (i >> 1) + 1] + source[j + (i >> 1) + 2] + 2) >> 2;
                                        } else if (i + 2 * j === 5) {
                                            data[j][i] = (source[2] + 3 * source[3] + 2) >> 2;
                                        } else {
                                            data[j][i] = source[3];
                                        }
                                    }
                                }
                                break;

                        }
                        //console.log('pred', JSON.stringify(data));
                        if ((this.CodedBlockPattenLuma & (1 << (blk >> 2)))) {
                            var lumas = this.LumaLevel[blk];

                            var c = [
                                [lumas[0], lumas[1], lumas[5], lumas[6]],
                                [lumas[2], lumas[4], lumas[7], lumas[12]],
                                [lumas[3], lumas[8], lumas[11], lumas[13]],
                                [lumas[9], lumas[10], lumas[14], lumas[15]]
                            ];


                            var d = [
                                [0, 0, 0, 0],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0]
                            ];
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    d[i][j] = (c[i][j] * _common.LevelScale(qpY % 6, i, j)) << Math.floor(qpY / 6);
                                }
                            }

                            var e = [
                                [d[0][0] + d[0][2], d[0][0] - d[0][2], (d[0][1] >> 1) - d[0][3], d[0][1] + (d[0][3] >> 1)],
                                [d[1][0] + d[1][2], d[1][0] - d[1][2], (d[1][1] >> 1) - d[1][3], d[1][1] + (d[1][3] >> 1)],
                                [d[2][0] + d[2][2], d[2][0] - d[2][2], (d[2][1] >> 1) - d[2][3], d[2][1] + (d[2][3] >> 1)],
                                [d[3][0] + d[3][2], d[3][0] - d[3][2], (d[3][1] >> 1) - d[3][3], d[3][1] + (d[3][3] >> 1)],
                            ];

                            var f = [
                                [e[0][0] + e[0][3], e[0][1] + e[0][2], e[0][1] - e[0][2], e[0][0] - e[0][3]],
                                [e[1][0] + e[1][3], e[1][1] + e[1][2], e[1][1] - e[1][2], e[1][0] - e[1][3]],
                                [e[2][0] + e[2][3], e[2][1] + e[2][2], e[2][1] - e[2][2], e[2][0] - e[2][3]],
                                [e[3][0] + e[3][3], e[3][1] + e[3][2], e[3][1] - e[3][2], e[3][0] - e[3][3]],
                            ];

                            var g = [
                                [f[0][0] + f[2][0], f[0][1] + f[2][1], f[0][2] + f[2][2], f[0][3] + f[2][3]],
                                [f[0][0] - f[2][0], f[0][1] - f[2][1], f[0][2] - f[2][2], f[0][3] - f[2][3]],
                                [(f[1][0] >> 1) - f[3][0], (f[1][1] >> 1) - f[3][1], (f[1][2] >> 1) - f[3][2], (f[1][3] >> 1) - f[3][3]],
                                [f[1][0] + (f[3][0] >> 1), f[1][1] + (f[3][1] >> 1), f[1][2] + (f[3][2] >> 1), f[1][3] + (f[3][3] >> 1)]
                            ];

                            var h = [
                                [g[0][0] + g[3][0], g[0][1] + g[3][1], g[0][2] + g[3][2], g[0][3] + g[3][3]],
                                [g[1][0] + g[2][0], g[1][1] + g[2][1], g[1][2] + g[2][2], g[1][3] + g[2][3]],
                                [g[1][0] - g[2][0], g[1][1] - g[2][1], g[1][2] - g[2][2], g[1][3] - g[2][3]],
                                [g[0][0] - g[3][0], g[0][1] - g[3][1], g[0][2] - g[3][2], g[0][3] - g[3][3]],
                            ];

                            var r = [];
                            for (var i = 0; i < 4; i++) {
                                r[i] = [];
                                for (var j = 0; j < 4; j++) {
                                    r[i][j] = (h[i][j] + 32) >> 6;
                                }
                            }

                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    data[i][j] += r[i][j];
                                    if (data[i][j] < 0) {
                                        data[i][j] = 0;
                                    }
                                    if (data[i][j] > 255) {
                                        data[i][j] = 255;
                                    }
                                }
                            }
                        }
                        this.decoded.lumas[blk] = data;
                        this.writeBlockToLuma(data, blk);
                    }

                }
                /* save 3-dimensional array to yuv */
                // for (var blk = 0; blk < 16; blk++) {
                //     for (var i = 0; i < 4; i++) {
                //         for (var j = 0; j < 4; j++) {
                //             this.yuv[16 * (_defs.map4x4to16x16[blk] >> 2 + i) + (_defs.map4x4to16x16[blk] % 4) * 4 + j] = this.decoded.lumas[blk][i][j];
                //         }
                //     }
                // }
            } else { /* P_MB */
                this.interPrediction();
                if (this.hasResidual) {
                    var qpY = this.decoder.pps.pic_init_qp_minus26 + 26 + this.slice.slice_qp_delta;
                    if (this.mbaddr !== this.slice.first_mb_in_slice) {
                        qpY = (this.slice.decoder.mbs[this.mbaddr - 1].qpY + this.mb_qp_delta + 52) % 52;
                    }
                    this.qpY = qpY;
                    for (var blk = 0; blk < 16; blk++) {
                        if ((this.CodedBlockPattenLuma & (1 << (blk >> 2)))) {
                            var lumas = this.LumaLevel[blk];

                            var c = [
                                [lumas[0], lumas[1], lumas[5], lumas[6]],
                                [lumas[2], lumas[4], lumas[7], lumas[12]],
                                [lumas[3], lumas[8], lumas[11], lumas[13]],
                                [lumas[9], lumas[10], lumas[14], lumas[15]]
                            ];


                            var d = [
                                [0, 0, 0, 0],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0]
                            ];
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    d[i][j] = (c[i][j] * _common.LevelScale(qpY % 6, i, j)) << Math.floor(qpY / 6);
                                }
                            }

                            var e = [
                                [d[0][0] + d[0][2], d[0][0] - d[0][2], (d[0][1] >> 1) - d[0][3], d[0][1] + (d[0][3] >> 1)],
                                [d[1][0] + d[1][2], d[1][0] - d[1][2], (d[1][1] >> 1) - d[1][3], d[1][1] + (d[1][3] >> 1)],
                                [d[2][0] + d[2][2], d[2][0] - d[2][2], (d[2][1] >> 1) - d[2][3], d[2][1] + (d[2][3] >> 1)],
                                [d[3][0] + d[3][2], d[3][0] - d[3][2], (d[3][1] >> 1) - d[3][3], d[3][1] + (d[3][3] >> 1)],
                            ];

                            var f = [
                                [e[0][0] + e[0][3], e[0][1] + e[0][2], e[0][1] - e[0][2], e[0][0] - e[0][3]],
                                [e[1][0] + e[1][3], e[1][1] + e[1][2], e[1][1] - e[1][2], e[1][0] - e[1][3]],
                                [e[2][0] + e[2][3], e[2][1] + e[2][2], e[2][1] - e[2][2], e[2][0] - e[2][3]],
                                [e[3][0] + e[3][3], e[3][1] + e[3][2], e[3][1] - e[3][2], e[3][0] - e[3][3]],
                            ];

                            var g = [
                                [f[0][0] + f[2][0], f[0][1] + f[2][1], f[0][2] + f[2][2], f[0][3] + f[2][3]],
                                [f[0][0] - f[2][0], f[0][1] - f[2][1], f[0][2] - f[2][2], f[0][3] - f[2][3]],
                                [(f[1][0] >> 1) - f[3][0], (f[1][1] >> 1) - f[3][1], (f[1][2] >> 1) - f[3][2], (f[1][3] >> 1) - f[3][3]],
                                [f[1][0] + (f[3][0] >> 1), f[1][1] + (f[3][1] >> 1), f[1][2] + (f[3][2] >> 1), f[1][3] + (f[3][3] >> 1)]
                            ];

                            var h = [
                                [g[0][0] + g[3][0], g[0][1] + g[3][1], g[0][2] + g[3][2], g[0][3] + g[3][3]],
                                [g[1][0] + g[2][0], g[1][1] + g[2][1], g[1][2] + g[2][2], g[1][3] + g[2][3]],
                                [g[1][0] - g[2][0], g[1][1] - g[2][1], g[1][2] - g[2][2], g[1][3] - g[2][3]],
                                [g[0][0] - g[3][0], g[0][1] - g[3][1], g[0][2] - g[3][2], g[0][3] - g[3][3]],
                            ];

                            var r = [];
                            for (var i = 0; i < 4; i++) {
                                r[i] = [];
                                for (var j = 0; j < 4; j++) {
                                    r[i][j] = (h[i][j] + 32) >> 6;
                                }
                            }
                            var data = this.getBlockData(blk);
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < 4; j++) {
                                    data[i][j] += r[i][j];
                                    if (data[i][j] < 0) {
                                        data[i][j] = 0;
                                    }
                                    if (data[i][j] > 255) {
                                        data[i][j] = 255;
                                    }
                                }
                            }
                            this.writeBlockToLuma(data, blk);
                        }
                    }
                }
            }

        },
        getBlockData: function(blockIndex) {
            var data = [];
            var x = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 0) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 0);
            var y = _common.inverseRasterScan(blockIndex >> 2, 8, 8, 16, 1) + _common.inverseRasterScan(blockIndex % 4, 4, 4, 8, 1);

            for (var i = 0; i < 4; i++) {
                data[i] = [];
                for (var j = 0; j < 4; j++) {
                    data[i][j] = this.luma[y + i][x + j];
                }
            }
            return data;
        },
        inverseMbPartScan: function(mbPartIdx) {
            return {
                x: _common.inverseRasterScan(mbPartIdx, this.mbPartWidth, this.mbPartHeight, 16, 0),
                y: _common.inverseRasterScan(mbPartIdx, this.mbPartWidth, this.mbPartHeight, 16, 1),
            };
        },
        inverseSubMbPartScan: function(mbPartIdx, subMbPartIdx) {
            if (this.mb_type === _defs.P_8x8 || this.mb_type === _defs.P_8x8ref0) {
                return {
                    xS: _common.inverseRasterScan(subMbPartIdx, this.subMbs[mbPartIdx].subMbPartWidth, this.subMbs[mbPartIdx].subMbPartHeight, 8, 0),
                    yS: _common.inverseRasterScan(subMbPartIdx, this.subMbs[mbPartIdx].subMbPartWidth, this.subMbs[mbPartIdx].subMbPartHeight, 8, 1),
                };
            } else {
                return {
                    xS: _common.inverseRasterScan(subMbPartIdx, 4, 4, 8, 0),
                    yS: _common.inverseRasterScan(subMbPartIdx, 4, 4, 8, 1)
                };
            }
        },
        deriveNeighbouringPartitions: function(mbPartIdx, currSubMbType, subMbPartIdx) {
            var pos = this.inverseMbPartScan(mbPartIdx);
            var posS = {xS: 0, yS: 0};
            if (this.mb_type === _defs.P_8x8 || this.mb_type === _defs.P_8x8ref0) {
                posS = this.inverseSubMbPartScan(mbPartIdx, subMbPartIdx);
            }
            var predPartWidth;
            if (this.mb_type === _defs.P_Skip) {
                predPartWidth = 16;
            } else if (this.mb_type === _defs.P_8x8 || this.mb_type === _defs.P_8x8ref0) {
                predPartWidth = this.subMbs[mbPartIdx].subMbPartWidth;
            } else {
                predPartWidth = this.mbPartWidth;
            }

            var xyD = {xD: -1, yD: 0};
            var xyN = {xN: pos.x + posS.xS + xyD.xD, yN: pos.y + posS.yS + xyD.yD};
        },
        deriveMotionDataOfNeighbouringPartitions: function(mbPartIdx, subMbPartIdx, currSubMbType) {

        },
        deriveLumaMvAndRefIdxSkip: function() {
            var refIdxL0 = 0;
            var currSubMbType = this.sub_mb_type[0];
            this.deriveMotionDataOfNeighbouringPartitions(0, 0, currSubMbType);
        },
        deriveMvAndRefIdx: function(mbPartIdx, subMbPartIdx) {
            if (this.mb_type === _defs.P_Skip) {
                return this.deriveLumaMvAndRefIdxSkip();
            }
        },
        interPrediction: function() {
            // for (var mbPartIdx = 0; mbPartIdx < this.numMbPart; mbPartIdx++) {
            //     for (var subMbPartIdx = 0; subMbPartIdx < this.numSubMbPart; numSubMbPart++) {
            //         var mvCnt = 0;
            //         var out = this.deriveMvAndRefIdx(mbPartIdx, subMbPartIdx);
            //         mvCnt += out.subMvCnt;
            //     }
            // }
            var row = Math.floor(this.mbaddr / this.decoder.widthInMb);
            var col = (this.mbaddr - row * this.decoder.widthInMb);
            row = row << 4;
            col = col << 4;
            this.refImage = {
                width: this.decoder.widthInMb,
                height: this.decoder.heightInMb
            };

            switch (this.mb_type) {
                case _defs.P_Skip:
                case _defs.P_L0_16x16:
                    this.mvPrediction16x16();
                    this.refImage.data = this.refAddr[0];
                    var predPartL0 = this.predictSamples(this.mv[0], col, row, 16, 16);
                    for (var i = 0; i < 16; i++) {
                        for (var j = 0; j < 16; j++) {
                            this.luma[i][j] = predPartL0[i][j];
                        }
                    }
                    break;
                case _defs.P_L0_L0_16x8:
                    this.mvPrediction16x8();
                    this.refImage.data = this.refAddr[0];
                    var predPartL0 = this.predictSamples(this.mv[0], col, row, 16, 8);
                    for (var i = 0; i < 8; i++) {
                        for (var j = 0; j < 16; j++) {
                            this.luma[i][j] = predPartL0[i][j];
                        }
                    }
                    this.refImage.data = this.refAddr[2];
                    var predPartL0 = this.predictSamples(this.mv[8], col, row + 8, 16, 8);
                    for (var i = 0; i < 8; i++) {
                        for (var j = 0; j < 16; j++) {
                            this.luma[i + 8][j] = predPartL0[i][j];
                        }
                    }
                    break;
                case _defs.P_L0_L0_8x16:
                    this.mvPrediction8x16();
                    this.refImage.data = this.refAddr[0];
                    var predPartL0 = this.predictSamples(this.mv[0], col, row, 8, 16);
                    for (var i = 0; i < 16; i++) {
                        for (var j = 0; j < 8; j++) {
                            this.luma[i][j] = predPartL0[i][j];
                        }
                    }
                    this.refImage.data = this.refAddr[1];
                    var predPartL0 = this.predictSamples(this.mv[4], col + 8, row, 8, 16);
                    for (var i = 0; i < 16; i++) {
                        for (var j = 0; j < 8; j++) {
                            this.luma[i][j + 8] = predPartL0[i][j];
                        }
                    }
                    break;
                default:
                    this.mvPrediction8x8();
                    var predPartL0;
                    for (var part = 0; part < 4; part++) {
                        this.refImage.data = this.refAddr[part];
                        var x = part & 0x1 ? 8 : 0;
                        var y = part < 2 ? 0 : 8;
                        switch (this.subMbs[part].sub_mb_type) {
                            case _defs.P_L0_8x8:
                                predPartL0 = this.predictSamples(this.mv[4 * part], col + x, row + y, 8, 8);
                                for (var i = 0; i < 8; i++) {
                                    for (var j = 0; j < 8; j++) {
                                        this.luma[y + i][x + j] = predPartL0[i][j];
                                    }
                                }
                                break;
                            case _defs.P_L0_8x4:
                                predPartL0 = this.predictSamples(this.mv[4 * part], col + x, row + y, 8, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 8; j++) {
                                        this.luma[y + i][x + j] = predPartL0[i][j];
                                    }
                                }
                                predPartL0 = this.predictSamples(this.mv[4 * part + 2], col + x, row + y + 4, 8, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 8; j++) {
                                        this.luma[y + i + 4][x + j] = predPartL0[i][j];
                                    }
                                }
                                break;
                            case _defs.P_L0_4x8:
                                predPartL0 = this.predictSamples(this.mv[4 * part], col + x, row + y, 4, 8);
                                for (var i = 0; i < 8; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i][x + j] = predPartL0[i][j];
                                    }
                                }
                                predPartL0 = this.predictSamples(this.mv[4 * part + 1], col + x + 4, row + y, 4, 8);
                                for (var i = 0; i < 8; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i][x + j + 4] = predPartL0[i][j];
                                    }
                                }
                                break;
                            default:
                                predPartL0 = this.predictSamples(this.mv[4 * part], col + x, row + y, 4, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i][x + j] = predPartL0[i][j];
                                    }
                                }
                                predPartL0 = this.predictSamples(this.mv[4 * part + 1], col + x + 4, row + y, 4, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i][x + j + 4] = predPartL0[i][j];
                                    }
                                }
                                predPartL0 = this.predictSamples(this.mv[4 * part + 2], col + x, row + y + 4, 4, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i + 4][x + j] = predPartL0[i][j];
                                    }
                                }
                                predPartL0 = this.predictSamples(this.mv[4 * part + 3], col + x + 4, row + y + 4, 4, 4);
                                for (var i = 0; i < 4; i++) {
                                    for (var j = 0; j < 4; j++) {
                                        this.luma[y + i + 4][x + j + 4] = predPartL0[i][j];
                                    }
                                }
                                break;
                        }
                    }
                    break;
            }
        },
        lumaSampleInterpolation: function(xInt, yInt, xFrac, yFrac) {
            var lumaFracPos = [
                /* G  d  h  n    a  e  i  p    b  f  j   q     c   g   k   r */
                [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];
            var luma = 0;
            switch (lumaFracPos[xFrac][yFrac]) {
                case 0:
                    luma = this.refImage.data[yInt * this.decoder.width + xInt];
                    break;
                case 1:
                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);
                    var d = (lumaG + h + 1) >> 1;
                    luma = d;
                    break;
                case 2:
                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);
                    luma = h;
                    break;
                case 3:
                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);
                    var n = (lumaM + h + 1) >> 1;
                    luma = n;
                    break;
                case 4: /* a */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);
                    var n = (lumaG + b + 1) >> 1;
                    luma = n;
                    break;
                case 5: /* e */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);

                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);
                    var e = (b + h + 1) >> 1;
                    luma = e;
                    break;
                case 6: /* i */
                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);

                    var lumacc = this.lumaSampleInterpolation(xInt - 2, yInt, 0, 2);
                    var lumadd = this.lumaSampleInterpolation(xInt - 1, yInt, 0, 2);
                    var m1 = this.lumaSampleInterpolation(xInt, yInt, 0, 2);
                    var lumaee = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var lumaff = this.lumaSampleInterpolation(xInt + 2, yInt, 0, 2);

                    var j1 = lumacc - 5 * lumadd + 20 * h1 + 20 * m1 - 5 * lumaee + lumaff;
                    var j = _common.clip1((j1 + 512) >> 10);

                    var i = (h + j + 1) >> 1;
                    luma = i;
                    break;
                case 7: /* p */
                    var xA = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yA = _common.clip3(0, this.decoder.height - 1, yInt - 2);
                    var lumaA = this.refImage.data[yA * this.decoder.width + xA];

                    var xC = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yC = _common.clip3(0, this.decoder.height - 1, yInt - 1);
                    var lumaC = this.refImage.data[yC * this.decoder.width + xC];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xM = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yM = _common.clip3(0, this.decoder.height - 1, yInt + 1);
                    var lumaM = this.refImage.data[yM * this.decoder.width + xM];

                    var xR = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yR = _common.clip3(0, this.decoder.height - 1, yInt + 2);
                    var lumaR = this.refImage.data[yR * this.decoder.width + xR];

                    var xT = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yT = _common.clip3(0, this.decoder.height - 1, yInt + 3);
                    var lumaT = this.refImage.data[yT * this.decoder.width + xT];

                    var h1 = lumaA - 5 * lumaC + 20 * lumaG + 20 * lumaM - 5 * lumaR + lumaT;
                    var h = _common.clip1((h1 + 16) >> 5);

                    var s = this.lumaSampleInterpolation(xInt, yInt + 1, 2, 0);

                    var p = (h + s + 1) >> 1;
                    luma = p;
                    break;
                case 8: /* b */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);
                    luma = b;
                    break;
                case 9: /* f */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);

                    var lumacc = this.lumaSampleInterpolation(xInt - 2, yInt, 0, 2);
                    var lumadd = this.lumaSampleInterpolation(xInt - 1, yInt, 0, 2);
                    var m1 = this.lumaSampleInterpolation(xInt, yInt, 0, 2);
                    var lumaee = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var lumaff = this.lumaSampleInterpolation(xInt + 2, yInt, 0, 2);

                    var j1 = lumacc - 5 * lumadd + 20 * h1 + 20 * m1 - 5 * lumaee + lumaff;
                    var j = _common.clip1((j1 + 512) >> 10);

                    var f = (b + j + 1) >> 1;
                    luma = f;
                    break;
                case 10: /* j */
                    var lumacc = this.lumaSampleInterpolation(xInt - 2, yInt, 0, 2);
                    var lumadd = this.lumaSampleInterpolation(xInt - 1, yInt, 0, 2);
                    var m1 = this.lumaSampleInterpolation(xInt, yInt, 0, 2);
                    var lumaee = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var lumaff = this.lumaSampleInterpolation(xInt + 2, yInt, 0, 2);

                    var j1 = lumacc - 5 * lumadd + 20 * h1 + 20 * m1 - 5 * lumaee + lumaff;
                    var j = _common.clip1((j1 + 512) >> 10);

                    luma = j;
                    break;
                case 11: /* q */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);

                    var lumacc = this.lumaSampleInterpolation(xInt - 2, yInt, 0, 2);
                    var lumadd = this.lumaSampleInterpolation(xInt - 1, yInt, 0, 2);
                    var m1 = this.lumaSampleInterpolation(xInt, yInt, 0, 2);
                    var lumaee = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var lumaff = this.lumaSampleInterpolation(xInt + 2, yInt, 0, 2);

                    var j1 = lumacc - 5 * lumadd + 20 * h1 + 20 * m1 - 5 * lumaee + lumaff;
                    var j = _common.clip1((j1 + 512) >> 10);

                    var s = this.lumaSampleInterpolation(xInt, yInt + 1, 2, 0);
                    var q = (j + s + 1) >> 1;
                    luma = q;
                    break;
                case 12: /* c */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);

                    var c = (lumaH + b + 1) >> 1;
                    luma = c;
                    break;
                case 13: /* g */
                    var xE = _common.clip3(0, this.decoder.width - 1, xInt - 2);
                    var yE = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaE = this.refImage.data[yE * this.decoder.width + xE];

                    var xF = _common.clip3(0, this.decoder.width - 1, xInt - 1);
                    var yF = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaF = this.refImage.data[yF * this.decoder.width + xF];

                    var xG = _common.clip3(0, this.decoder.width - 1, xInt);
                    var yG = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaG = this.refImage.data[yG * this.decoder.width + xG];

                    var xH = _common.clip3(0, this.decoder.width - 1, xInt + 1);
                    var yH = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaH = this.refImage.data[yH * this.decoder.width + xH];

                    var xI = _common.clip3(0, this.decoder.width - 1, xInt + 2);
                    var yI = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaI = this.refImage.data[yI * this.decoder.width + xI];

                    var xJ = _common.clip3(0, this.decoder.width - 1, xInt + 3);
                    var yJ = _common.clip3(0, this.decoder.height - 1, yInt);
                    var lumaJ = this.refImage.data[yJ * this.decoder.width + xJ];

                    var b1 = lumaE - 5 * lumaF + 20 * lumaG + 20 * lumaH - 5 * lumaI + lumaJ;
                    var b = _common.clip1((b1 + 16) >> 5);

                    var m = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var g = (b + m + 1) >> 1;
                    luma = g;
                    break;
                case 14: /* k */
                    var lumacc = this.lumaSampleInterpolation(xInt - 2, yInt, 0, 2);
                    var lumadd = this.lumaSampleInterpolation(xInt - 1, yInt, 0, 2);
                    var m1 = this.lumaSampleInterpolation(xInt, yInt, 0, 2);
                    var lumaee = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var lumaff = this.lumaSampleInterpolation(xInt + 2, yInt, 0, 2);

                    var j1 = lumacc - 5 * lumadd + 20 * h1 + 20 * m1 - 5 * lumaee + lumaff;
                    var j = _common.clip1((j1 + 512) >> 10);

                    var m = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var k = (j + m + 1) >> 1;
                    luma = k;
                    break;
                case 15: /* r */
                    var m = this.lumaSampleInterpolation(xInt + 1, yInt, 0, 2);
                    var s = this.lumaSampleInterpolation(xInt, yInt + 1, 2, 0);
                    var r = (m + s + 1) >> 1;
                    luma = r;
                    break;
            }
            return luma;
        },
        predictSamples: function(mv, xA, yA, partWidth, partHeight) {
            var xFrac, yFrac;

            xFrac = mv.hor & 0x3;
            yFrac = mv.ver & 0x3;

            var predPartL0 = [];
            for (var i = 0; i < partHeight; i++) {
                predPartL0[i] = [];
                for (var j = 0; j < partWidth; j++) {
                    var xInt = xA + (mv.hor >> 2) + j;
                    var yInt = yA + (mv.ver >> 2) + i;
                    var luma = this.lumaSampleInterpolation(xInt, yInt, xFrac, yFrac);
                    predPartL0[i][j] = luma;
                }
            }
            return predPartL0;

        },
        getInterNeighbour: function(mb, index) {
            var n = {
                avaliable: 0,
                refIndex: 0xFFFFFFFF,
                mv: {
                    hor: 0,
                    ver: 0
                }
            };
            if (mb && mb.slice === this.slice) {
                var tmp = mb.mb_type;
                n.avaliable = 1;
                if (tmp <= _defs.P_8x8ref0) {
                    var tmpMv = mb.mv[index];
                    tmp = mb.refPic[index >> 2];
                    n.refIndex = tmp;
                    n.mv = tmpMv;
                }
            }
            return n;
        },
        mvPrediction16x16: function() {
            var refIndex = this.ref_idx_l0[0];
            refIndex = refIndex || 0;
            var na = this.getInterNeighbour(this.mbA, 5);
            var nb = this.getInterNeighbour(this.mbB, 10);
            var mv = {hor: 0, ver: 0};
            if (this.mb_type === _defs.P_Skip && (!na.avaliable || !nb.avaliable || (na.refIndex === 0 && (na.mv.hor === 0 && na.mv.ver === 0)) || (nb.refIndex === 0 && (nb.mv.hor === 0 && nb.mv.ver === 0)))) {
                mv.hor = mv.ver = 0;
            } else {
                mv = this.mvd_l0[0];
                var nc = this.getInterNeighbour(this.mbC, 10);
                if (!nc.avaliable) {
                    nc = this.getInterNeighbour(this.mbD, 15);
                }

                var mvPred = {};
                if (!na.avaliable || nb.avaliable || nc.avaliable) {
                    var isA = (na.refIndex === refIndex) ? 1 : 0;
                    var isB = (nb.refIndex === refIndex) ? 1 : 0;
                    var isC = (nc.refIndex === refIndex) ? 1 : 0;
                    if ((isA + isB + isC) !== 1) {
                        mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                        mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                    } else if (isA) {
                        mvPred = na.mv;
                    } else if (isB) {
                        mvPred = nb.mv;
                    } else {
                        mvPred = nc.mv;
                    }
                } else {
                    mvPred = na.mv;
                }
                mv.hor += mvPred.hor;
                mv.ver += mvPred.ver;
            }

            for (var i = 0; i < 16; i++) {
                this.mv[i] = mv;
            }
            for (var i = 0; i < 4; i++) {
                this.refPic[i] = refIndex;
                this.refAddr[i] = this.decoder.dpb.refPicList0[refIndex].data;
            }
            //console.log(this.mbaddr, JSON.stringify(this.mv));
        },
        mvPrediction16x8: function() {
            var mvPred = {hor: 0, ver: 0};
            var mv = this.mvd_l0[0];
            var refIndex = this.ref_idx_l0[0];
            var nb = this.getInterNeighbour(this.mbB, 10);
            if (nb.refIndex === refIndex) {
                mvPred = nb.mv;
            } else {
                var na = this.getInterNeighbour(this.mbA, 5);
                var nc = this.getInterNeighbour(this.mbC, 10);
                if (!nc.avaliable) {
                    nc = this.getInterNeighbour(this.mbD, 15);
                }
                if (!na.avaliable || nb.avaliable || nc.avaliable) {
                    var isA = (na.refIndex === refIndex) ? 1 : 0;
                    var isB = (nb.refIndex === refIndex) ? 1 : 0;
                    var isC = (nc.refIndex === refIndex) ? 1 : 0;
                    if ((isA + isB + isC) !== 1) {
                        mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                        mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                    } else if (isA) {
                        mvPred = na.mv;
                    } else if (isB) {
                        mvPred = nb.mv;
                    } else {
                        mvPred = nc.mv;
                    }
                } else {
                    mvPred = na.mv;
                }
            }
            mv.hor += mvPred.hor;
            mv.ver += mvPred.ver;

            for (var i = 0; i < 8; i++) {
                this.mv[i] = mv;
            }

            this.refPic[0] = refIndex;
            this.refPic[1] = refIndex;
            this.refAddr[0] = this.decoder.dpb.refPicList0[refIndex].data;
            this.refAddr[1] = this.decoder.dpb.refPicList0[refIndex].data;

            mv = this.mvd_l0[1];
            refIndex = this.ref_idx_l0[1];
            var na = this.getInterNeighbour(this.mbA, 13);
            if (na.refIndex === refIndex) {
                mvPred = na.mv;
            } else {
                nb.avaliable = true;
                nb.refIndex = this.refPic[0];
                nb.mv = this.mv[0];

                var nc = this.getInterNeighbour(this.mbA, 7);
                if (!na.avaliable || nb.avaliable || nc.avaliable) {
                    var isA = (na.refIndex === refIndex) ? 1 : 0;
                    var isB = (nb.refIndex === refIndex) ? 1 : 0;
                    var isC = (nc.refIndex === refIndex) ? 1 : 0;
                    if ((isA + isB + isC) !== 1) {
                        mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                        mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                    } else if (isA) {
                        mvPred = na.mv;
                    } else if (isB) {
                        mvPred = nb.mv;
                    } else {
                        mvPred = nc.mv;
                    }
                } else {
                    mvPred = na.mv;
                }
            }
            mv.hor += mvPred.hor;
            mv.ver += mvPred.ver;

            for (var i = 8; i < 16; i++) {
                this.mv[i] = mv;
            }
            this.refPic[2] = refIndex;
            this.refPic[3] = refIndex;
            this.refAddr[2] = this.decoder.dpb.refPicList0[refIndex].data;
            this.refAddr[3] = this.decoder.dpb.refPicList0[refIndex].data;
            //console.log(this.mbaddr, JSON.stringify(this.mv));
        },
        mvPrediction8x16: function() {
            var mvPred = {hor: 0, ver: 0};
            var mv = this.mvd_l0[0];
            var refIndex = this.ref_idx_l0[0];
            var na = this.getInterNeighbour(this.mbA, 5);
            if (na.refIndex === refIndex) {
                mvPred = na.mv;
            } else {
                var nb = this.getInterNeighbour(this.mbB, 10);
                var nc = this.getInterNeighbour(this.mbB, 14);
                if (!nc.avaliable) {
                    nc = this.getInterNeighbour(this.mbD, 15);
                }
                if (!na.avaliable || nb.avaliable || nc.avaliable) {
                    var isA = (na.refIndex === refIndex) ? 1 : 0;
                    var isB = (nb.refIndex === refIndex) ? 1 : 0;
                    var isC = (nc.refIndex === refIndex) ? 1 : 0;
                    if ((isA + isB + isC) !== 1) {
                        mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                        mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                    } else if (isA) {
                        mvPred = na.mv;
                    } else if (isB) {
                        mvPred = nb.mv;
                    } else {
                        mvPred = nc.mv;
                    }
                } else {
                    mvPred = na.mv;
                }
            }
            mv.hor += mvPred.hor;
            mv.ver += mvPred.ver;

            for (var i = 0; i < 4; i++) {
                this.mv[i] = mv;
            }
            for (var i = 8; i < 12; i++) {
                this.mv[i] = mv;
            }

            this.refPic[0] = refIndex;
            this.refPic[2] = refIndex;
            this.refAddr[0] = this.decoder.dpb.refPicList0[refIndex].data;
            this.refAddr[2] = this.decoder.dpb.refPicList0[refIndex].data;

            mv = this.mvd_l0[1];
            refIndex = this.ref_idx_l0[1];
            var nc = this.getInterNeighbour(this.mbC, 10);
            if (!nc.avaliable) {
                nc = this.getInterNeighbour(this.mbB, 11);
            }
            if (nc.refIndex === refIndex) {
                mvPred = nc.mv;
            } else {
                na.avaliable = true;
                na.refIndex = this.refPic[0];
                na.mv = this.mv[0];

                var nb = this.getInterNeighbour(this.mbB, 14);
                if (!na.avaliable || nb.avaliable || nc.avaliable) {
                    var isA = (na.refIndex === refIndex) ? 1 : 0;
                    var isB = (nb.refIndex === refIndex) ? 1 : 0;
                    var isC = (nc.refIndex === refIndex) ? 1 : 0;
                    if ((isA + isB + isC) !== 1) {
                        mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                        mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                    } else if (isA) {
                        mvPred = na.mv;
                    } else if (isB) {
                        mvPred = nb.mv;
                    } else {
                        mvPred = nc.mv;
                    }
                } else {
                    mvPred = na.mv;
                }
            }
            mv.hor += mvPred.hor;
            mv.ver += mvPred.ver;

            for (var i = 4; i < 8; i++) {
                this.mv[i] = mv;
            }
            for (var i = 12; i < 16; i++) {
                this.mv[i] = mv;
            }
            this.refPic[1] = refIndex;
            this.refPic[3] = refIndex;
            this.refAddr[1] = this.decoder.dpb.refPicList0[refIndex].data;
            this.refAddr[3] = this.decoder.dpb.refPicList0[refIndex].data;
            //console.log(this.mbaddr, JSON.stringify(this.mv));
        },
        mvPrediction8x8: function() {
            for (var i = 0; i < 4; i++) {
                this.refPic[i] = this.ref_idx_l0[i];
                console.log(this.ref_idx_l0);
                this.refAddr[i] = this.decoder.dpb.refPicList0[this.refPic[i]].data;
                for (var j = 0; j < this.subMbs.numSubMbPart; j++) {
                    this.mvPrediction(i, j);
                }
            }
        },
        getNeighbourMb: function(neighbour) {
            if (neighbour == _defs.MB_A)
                return (this.mbA);
            else if (neighbour == _defs.MB_B)
                return (this.mbB);
            else if (neighbour == _defs.MB_C)
                return (this.mbC);
            else if (neighbour == _defs.MB_D)
                return (this.mbD);
            else if (neighbour == _defs.MB_CURR)
                return this;
            else
                return null;
        },
        mvPrediction: function(mbPartIdx, subMbPartIdx) {
            var mv, mvPred;
            var refIndex;
            var subMbPartMode;
            var n;
            var nMb;
            var na, nb, nc;


            mv = this.mvd_l0[mbPartIdx][subMbPartIdx];
            subMbPartMode = this.subMbs[mbPartIdx].sub_mb_type;
            refIndex = this.ref_idx_l0[mbPartIdx];

            n = _defs.N_A_SUB_PART[mbPartIdx][subMbPartMode][subMbPartIdx];
            nMb = this.getNeighbourMb(n[0]);
            na = this.getInterNeighbour(nMb, n[1]);

            n = _defs.N_B_SUB_PART[mbPartIdx][subMbPartMode][subMbPartIdx];
            nMb = this.getNeighbourMb(n[0]);
            nb = this.getInterNeighbour(nMb, n[1]);

            n = _defs.N_C_SUB_PART[mbPartIdx][subMbPartMode][subMbPartIdx];
            nMb = this.getNeighbourMb(n[0]);
            nc = this.getInterNeighbour(nMb, n[1]);

            if (!nc.available) {
                n = _defs.N_D_SUB_PART[mbPartIdx][subMbPartMode][subMbPartIdx];
                nMb = this.getNeighbourMb(n[0]);
                nc = this.getInterNeighbour(nMb, n[1]);
            }


            if (!na.avaliable || nb.avaliable || nc.avaliable) {
                var isA = (na.refIndex === refIndex) ? 1 : 0;
                var isB = (nb.refIndex === refIndex) ? 1 : 0;
                var isC = (nc.refIndex === refIndex) ? 1 : 0;
                if ((isA + isB + isC) !== 1) {
                    mvPred.hor = _common.medianFilter(na.mv.hor, nb.mv.hor, nc.mv.hor);
                    mvPred.ver = _common.medianFilter(na.mv.ver, nb.mv.ver, nc.mv.ver);
                } else if (isA) {
                    mvPred = na.mv;
                } else if (isB) {
                    mvPred = nb.mv;
                } else {
                    mvPred = nc.mv;
                }
            } else {
                mvPred = na.mv;
            }

            mv.hor += mvPred.hor;
            mv.ver += mvPred.ver;

            switch (subMbPartMode) {
                case _defs.P_L0_8x8:
                    this.mv[4 * mbPartIdx] = mv;
                    this.mv[4 * mbPartIdx + 1] = mv;
                    this.mv[4 * mbPartIdx + 2] = mv;
                    this.mv[4 * mbPartIdx + 3] = mv;
                    break;

                case _defs.P_L0_8x4:
                    this.mv[4 * mbPartIdx + 2 * subMbPartIdx] = mv;
                    this.mv[4 * mbPartIdx + 2 * subMbPartIdx + 1] = mv;
                    break;

                case _defs.P_L0_4x8:
                    this.mv[4 * mbPartIdx + subMbPartIdx] = mv;
                    this.mv[4 * mbPartIdx + subMbPartIdx + 2] = mv;
                    break;

                case _defs.P_L0_4x4:
                    this.mv[4 * mbPartIdx + subMbPartIdx] = mv;
                    break;
            }
        },
        getBoundaryStrengths: function(bS, flags) {
            var mb4x4Index = [0, 1, 4, 5, 2, 3, 6, 7, 8, 9, 12, 13, 10, 11, 14, 15];
            for (var i = 0; i < bS.length; i++) {
                bS[i] = {
                    top: 0,
                    left: 0
                };
            }
            var nonZeroBs = false;
            if (flags.filter_top_edge) {
                if (this.type === _defs.I_MB || this.mbB.type === _defs.I_MB) {
                    for (var i = 0; i < 4; i++) {
                        bS[i] = {
                            top: 4
                        };
                    }
                    nonZeroBs = true;
                } else {
                    bS[0] = {
                        top: edgeBoundaryStrength(this, this.mbB, 0, 10)
                    };
                    bS[1] = {
                        top: edgeBoundaryStrength(this, this.mbB, 1, 11)
                    };
                    bS[2] = {
                        top: edgeBoundaryStrength(this, this.mbB, 4, 14)
                    };
                    bS[3] = {
                        top: edgeBoundaryStrength(this, this.mbB, 5, 15)
                    };
                    if (bS[0].top || bS[1].top || bS[2].top || bS[3].top) {
                        nonZeroBs = true;
                    }
                }
            } else {
                bS[0] = {
                    top: 0
                };
                bS[1] = {
                    top: 0
                };
                bS[2] = {
                    top: 0
                };
                bS[3] = {
                    top: 0
                };
            }
            if (flags.filter_left_edge) {
                if (this.type === _defs.I_MB || (this.mbB && this.mbB.type === _defs.I_MB)) {
                    for (var i = 0; i < 4; i += 4) {
                        bS[i] = {
                            left: 4
                        };
                    }
                    nonZeroBs = true;
                } else {
                    bS[0] = {
                        left: edgeBoundaryStrength(this, this.mbA, 0, 5)
                    };
                    bS[4] = {
                        left: edgeBoundaryStrength(this, this.mbA, 2, 7)
                    };
                    bS[8] = {
                        left: edgeBoundaryStrength(this, this.mbA, 8, 13)
                    };
                    bS[12] = {
                        left: edgeBoundaryStrength(this, this.mbA, 10, 15)
                    };
                    if (!nonZeroBs && (bS[0].top || bS[4].top || bS[8].top || bS[12].top)) {
                        nonZeroBs = true;
                    }
                }
            } else {
                bS[0] = {
                    left: 0
                };
                bS[4] = {
                    left: 0
                };
                bS[8] = {
                    left: 0
                };
                bS[12] = {
                    left: 0
                };
            }
            if (this.type === _defs.I_MB) {
                bS[4].top = bS[5].top = bS[6].top = bS[7].top =
                    bS[8].top = bS[9].top = bS[10].top = bS[11].top =
                        bS[12].top = bS[13].top = bS[14].top = bS[15].top = 3;

                bS[1].left = bS[2].left = bS[3].left =
                    bS[5].left = bS[6].left = bS[7].left =
                        bS[9].left = bS[10].left = bS[11].left =
                            bS[13].left = bS[14].left = bS[15].left = 3;
                nonZeroBs = true;

            } else {
                var mb = this;
                if (this.numMbPart === 1) {
                    bS[4].top = mb.totalCoeff[2] || mb.totalCoeff[0] ? 2 : 0;
                    bS[5].top = mb.totalCoeff[3] || mb.totalCoeff[1] ? 2 : 0;
                    bS[6].top = mb.totalCoeff[6] || mb.totalCoeff[4] ? 2 : 0;
                    bS[7].top = mb.totalCoeff[7] || mb.totalCoeff[5] ? 2 : 0;
                    bS[8].top = mb.totalCoeff[8] || mb.totalCoeff[2] ? 2 : 0;
                    bS[9].top = mb.totalCoeff[9] || mb.totalCoeff[3] ? 2 : 0;
                    bS[10].top = mb.totalCoeff[12] || mb.totalCoeff[6] ? 2 : 0;
                    bS[11].top = mb.totalCoeff[13] || mb.totalCoeff[7] ? 2 : 0;
                    bS[12].top = mb.totalCoeff[10] || mb.totalCoeff[8] ? 2 : 0;
                    bS[13].top = mb.totalCoeff[11] || mb.totalCoeff[9] ? 2 : 0;
                    bS[14].top = mb.totalCoeff[14] || mb.totalCoeff[12] ? 2 : 0;
                    bS[15].top = mb.totalCoeff[15] || mb.totalCoeff[13] ? 2 : 0;

                    bS[1].left = mb.totalCoeff[1] || mb.totalCoeff[0] ? 2 : 0;
                    bS[2].left = mb.totalCoeff[4] || mb.totalCoeff[1] ? 2 : 0;
                    bS[3].left = mb.totalCoeff[5] || mb.totalCoeff[4] ? 2 : 0;
                    bS[5].left = mb.totalCoeff[3] || mb.totalCoeff[2] ? 2 : 0;
                    bS[6].left = mb.totalCoeff[6] || mb.totalCoeff[3] ? 2 : 0;
                    bS[7].left = mb.totalCoeff[7] || mb.totalCoeff[6] ? 2 : 0;
                    bS[9].left = mb.totalCoeff[9] || mb.totalCoeff[8] ? 2 : 0;
                    bS[10].left = mb.totalCoeff[12] || mb.totalCoeff[9] ? 2 : 0;
                    bS[11].left = mb.totalCoeff[13] || mb.totalCoeff[12] ? 2 : 0;
                    bS[13].left = mb.totalCoeff[11] || mb.totalCoeff[10] ? 2 : 0;
                    bS[14].left = mb.totalCoeff[14] || mb.totalCoeff[11] ? 2 : 0;
                    bS[15].left = mb.totalCoeff[15] || mb.totalCoeff[14] ? 2 : 0;
                }
                /* 16x8 inter mb . ref addresses and motion vectors can be different
                 * only for the middle horizontal edge, for the other top edges it is
                 * enough to check whether the blocks contain coefficients or not. The
                 * same applies to all internal left edges. */
                else if (mb.mb_type == _defs.P_L0_L0_16x8) {
                    bS[4].top = mb.totalCoeff[2] || mb.totalCoeff[0] ? 2 : 0;
                    bS[5].top = mb.totalCoeff[3] || mb.totalCoeff[1] ? 2 : 0;
                    bS[6].top = mb.totalCoeff[6] || mb.totalCoeff[4] ? 2 : 0;
                    bS[7].top = mb.totalCoeff[7] || mb.totalCoeff[5] ? 2 : 0;
                    bS[12].top = mb.totalCoeff[10] || mb.totalCoeff[8] ? 2 : 0;
                    bS[13].top = mb.totalCoeff[11] || mb.totalCoeff[9] ? 2 : 0;
                    bS[14].top = mb.totalCoeff[14] || mb.totalCoeff[12] ? 2 : 0;
                    bS[15].top = mb.totalCoeff[15] || mb.totalCoeff[13] ? 2 : 0;
                    bS[8].top = InnerBoundaryStrength(mb, 8, 2);
                    bS[9].top = InnerBoundaryStrength(mb, 9, 3);
                    bS[10].top = InnerBoundaryStrength(mb, 12, 6);
                    bS[11].top = InnerBoundaryStrength(mb, 13, 7);

                    bS[1].left = mb.totalCoeff[1] || mb.totalCoeff[0] ? 2 : 0;
                    bS[2].left = mb.totalCoeff[4] || mb.totalCoeff[1] ? 2 : 0;
                    bS[3].left = mb.totalCoeff[5] || mb.totalCoeff[4] ? 2 : 0;
                    bS[5].left = mb.totalCoeff[3] || mb.totalCoeff[2] ? 2 : 0;
                    bS[6].left = mb.totalCoeff[6] || mb.totalCoeff[3] ? 2 : 0;
                    bS[7].left = mb.totalCoeff[7] || mb.totalCoeff[6] ? 2 : 0;
                    bS[9].left = mb.totalCoeff[9] || mb.totalCoeff[8] ? 2 : 0;
                    bS[10].left = mb.totalCoeff[12] || mb.totalCoeff[9] ? 2 : 0;
                    bS[11].left = mb.totalCoeff[13] || mb.totalCoeff[12] ? 2 : 0;
                    bS[13].left = mb.totalCoeff[11] || mb.totalCoeff[10] ? 2 : 0;
                    bS[14].left = mb.totalCoeff[14] || mb.totalCoeff[11] ? 2 : 0;
                    bS[15].left = mb.totalCoeff[15] || mb.totalCoeff[14] ? 2 : 0;
                }
                /* 8x16 inter mb . ref addresses and motion vectors can be different
                 * only for the middle vertical edge, for the other left edges it is
                 * enough to check whether the blocks contain coefficients or not. The
                 * same applies to all internal top edges. */
                else if (mb.mb_type == _defs.P_L0_L0_8x16) {
                    bS[4].top = mb.totalCoeff[2] || mb.totalCoeff[0] ? 2 : 0;
                    bS[5].top = mb.totalCoeff[3] || mb.totalCoeff[1] ? 2 : 0;
                    bS[6].top = mb.totalCoeff[6] || mb.totalCoeff[4] ? 2 : 0;
                    bS[7].top = mb.totalCoeff[7] || mb.totalCoeff[5] ? 2 : 0;
                    bS[8].top = mb.totalCoeff[8] || mb.totalCoeff[2] ? 2 : 0;
                    bS[9].top = mb.totalCoeff[9] || mb.totalCoeff[3] ? 2 : 0;
                    bS[10].top = mb.totalCoeff[12] || mb.totalCoeff[6] ? 2 : 0;
                    bS[11].top = mb.totalCoeff[13] || mb.totalCoeff[7] ? 2 : 0;
                    bS[12].top = mb.totalCoeff[10] || mb.totalCoeff[8] ? 2 : 0;
                    bS[13].top = mb.totalCoeff[11] || mb.totalCoeff[9] ? 2 : 0;
                    bS[14].top = mb.totalCoeff[14] || mb.totalCoeff[12] ? 2 : 0;
                    bS[15].top = mb.totalCoeff[15] || mb.totalCoeff[13] ? 2 : 0;

                    bS[1].left = mb.totalCoeff[1] || mb.totalCoeff[0] ? 2 : 0;
                    bS[3].left = mb.totalCoeff[5] || mb.totalCoeff[4] ? 2 : 0;
                    bS[5].left = mb.totalCoeff[3] || mb.totalCoeff[2] ? 2 : 0;
                    bS[7].left = mb.totalCoeff[7] || mb.totalCoeff[6] ? 2 : 0;
                    bS[9].left = mb.totalCoeff[9] || mb.totalCoeff[8] ? 2 : 0;
                    bS[11].left = mb.totalCoeff[13] || mb.totalCoeff[12] ? 2 : 0;
                    bS[13].left = mb.totalCoeff[11] || mb.totalCoeff[10] ? 2 : 0;
                    bS[15].left = mb.totalCoeff[15] || mb.totalCoeff[14] ? 2 : 0;
                    bS[2].left = InnerBoundaryStrength(mb, 4, 1);
                    bS[6].left = InnerBoundaryStrength(mb, 6, 3);
                    bS[10].left = InnerBoundaryStrength(mb, 12, 9);
                    bS[14].left = InnerBoundaryStrength(mb, 14, 11);
                }
                else {
                    bS[4].top =
                        InnerBoundaryStrength(mb, mb4x4Index[4], mb4x4Index[0]);
                    bS[5].top =
                        InnerBoundaryStrength(mb, mb4x4Index[5], mb4x4Index[1]);
                    bS[6].top =
                        InnerBoundaryStrength(mb, mb4x4Index[6], mb4x4Index[2]);
                    bS[7].top =
                        InnerBoundaryStrength(mb, mb4x4Index[7], mb4x4Index[3]);
                    bS[8].top =
                        InnerBoundaryStrength(mb, mb4x4Index[8], mb4x4Index[4]);
                    bS[9].top =
                        InnerBoundaryStrength(mb, mb4x4Index[9], mb4x4Index[5]);
                    bS[10].top =
                        InnerBoundaryStrength(mb, mb4x4Index[10], mb4x4Index[6]);
                    bS[11].top =
                        InnerBoundaryStrength(mb, mb4x4Index[11], mb4x4Index[7]);
                    bS[12].top =
                        InnerBoundaryStrength(mb, mb4x4Index[12], mb4x4Index[8]);
                    bS[13].top =
                        InnerBoundaryStrength(mb, mb4x4Index[13], mb4x4Index[9]);
                    bS[14].top =
                        InnerBoundaryStrength(mb, mb4x4Index[14], mb4x4Index[10]);
                    bS[15].top =
                        InnerBoundaryStrength(mb, mb4x4Index[15], mb4x4Index[11]);

                    bS[1].left =
                        InnerBoundaryStrength(mb, mb4x4Index[1], mb4x4Index[0]);
                    bS[2].left =
                        InnerBoundaryStrength(mb, mb4x4Index[2], mb4x4Index[1]);
                    bS[3].left =
                        InnerBoundaryStrength(mb, mb4x4Index[3], mb4x4Index[2]);
                    bS[5].left =
                        InnerBoundaryStrength(mb, mb4x4Index[5], mb4x4Index[4]);
                    bS[6].left =
                        InnerBoundaryStrength(mb, mb4x4Index[6], mb4x4Index[5]);
                    bS[7].left =
                        InnerBoundaryStrength(mb, mb4x4Index[7], mb4x4Index[6]);
                    bS[9].left =
                        InnerBoundaryStrength(mb, mb4x4Index[9], mb4x4Index[8]);
                    bS[10].left =
                        InnerBoundaryStrength(mb, mb4x4Index[10], mb4x4Index[9]);
                    bS[11].left =
                        InnerBoundaryStrength(mb, mb4x4Index[11], mb4x4Index[10]);
                    bS[13].left =
                        InnerBoundaryStrength(mb, mb4x4Index[13], mb4x4Index[12]);
                    bS[14].left =
                        InnerBoundaryStrength(mb, mb4x4Index[14], mb4x4Index[13]);
                    bS[15].left =
                        InnerBoundaryStrength(mb, mb4x4Index[15], mb4x4Index[14]);
                }
                if (!nonZeroBs &&
                    (bS[4].top || bS[5].top || bS[6].top || bS[7].top ||
                    bS[8].top || bS[9].top || bS[10].top || bS[11].top ||
                    bS[12].top || bS[13].top || bS[14].top || bS[15].top ||
                    bS[1].left || bS[2].left || bS[3].left ||
                    bS[5].left || bS[6].left || bS[7].left ||
                    bS[9].left || bS[10].left || bS[11].left ||
                    bS[13].left || bS[14].left || bS[15].left))
                    nonZeroBs = true;
            }
            return nonZeroBs;
        },
        getLumaEdgeThresholds: function(thresholds, filteringFlags) {

            /* Variables */

            var
                indexA, indexB,
                qpAv, qp, qpTmp;
            var alphas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 6, 7, 8, 9, 10,
                12, 13, 15, 17, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 71, 80, 90, 101, 113, 127, 144, 162,
                182, 203, 226, 255, 255];

            /* array of beta values, from the standard */
            var betas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 4, 4,
                4, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18];

            var tc0 = [
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
                [0, 0, 0], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 1], [1, 1, 1],
                [1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 2], [1, 1, 2], [1, 1, 2], [1, 1, 2], [1, 2, 3],
                [1, 2, 3], [2, 2, 3], [2, 2, 4], [2, 3, 4], [2, 3, 4], [3, 3, 5], [3, 4, 6], [3, 4, 6],
                [4, 5, 7], [4, 5, 8], [4, 6, 9], [5, 7, 10], [6, 8, 11], [6, 8, 13], [7, 10, 14], [8, 11, 16],
                [9, 12, 18], [10, 13, 20], [11, 15, 23], [13, 17, 25]
            ];
            qp = this.qpY;

            indexA = _common.clip3(0, 51, qp + this.slice.slice_alpha_c0_offset_div2 << 1);
            indexB = _common.clip3(0, 51, qp + this.slice.slice_beta_offset_div2 << 1);

            thresholds[2].alpha = alphas[indexA];
            thresholds[2].beta = betas[indexB];
            thresholds[2].tc0 = tc0[indexA];

            if (filteringFlags.filter_top_edge) {
                qpTmp = this.mbB.qpY;
                if (qpTmp != qp) {
                    qpAv = (qp + qpTmp + 1) >> 1;

                    indexA = _common.clip3(0, 51, qpAv + this.slice.slice_alpha_c0_offset_div2 << 1);
                    indexB = _common.clip3(0, 51, qpAv + this.slice.slice_beta_offset_div2 << 1);


                    thresholds[0].alpha = alphas[indexA];
                    thresholds[0].beta = betas[indexB];
                    thresholds[0].tc0 = tc0[indexA];
                }
                else {
                    thresholds[0].alpha = thresholds[2].alpha;
                    thresholds[0].beta = thresholds[2].beta;
                    thresholds[0].tc0 = thresholds[2].tc0;
                }
            }
            if (filteringFlags.filter_left_edge) {
                qpTmp = this.mbA.qpY;
                if (qpTmp != qp) {
                    qpAv = (qp + qpTmp + 1) >> 1;

                    indexA = _common.clip3(0, 51, qpAv + this.slice.slice_alpha_c0_offset_div2 << 1);
                    indexB = _common.clip3(0, 51, qpAv + this.slice.slice_beta_offset_div2 << 1);

                    thresholds[1].alpha = alphas[indexA];
                    thresholds[1].beta = betas[indexB];
                    thresholds[1].tc0 = tc0[indexA];
                }
                else {
                    thresholds[1].alpha = thresholds[2].alpha;
                    thresholds[1].beta = thresholds[2].beta;
                    thresholds[1].tc0 = thresholds[2].tc0;
                }
            }

        },
        filterLuma: function(data, index, bS, thresholds, width) {
            var tmp = bS;
            var ptr = data;
            var offset = 0;
            for (var vblock = 4; vblock--;) {
                /* only perform filtering if bS is non-zero, first of the four
                 * FilterVerLumaEdge handles the left edge of the macroblock, others
                 * filter inner edges */
                if (tmp[0].left)
                    FilterVerLumaEdge(ptr, index, tmp[0].left, thresholds[1], width);
                if (tmp[1].left)
                    FilterVerLumaEdge(ptr, index + 4, tmp[1].left, thresholds[2], width);
                if (tmp[2].left)
                    FilterVerLumaEdge(ptr, index + 8, tmp[2].left, thresholds[2], width);
                if (tmp[3].left)
                    FilterVerLumaEdge(ptr, index + 12, tmp[3].left, thresholds[2], width);

                /* if bS is equal for all horizontal edges of the row . perform
                 * filtering with FilterHorLuma, otherwise use FilterHorLumaEdge for
                 * each edge separately. offset variable indicates top macroblock edge
                 * on the first loop round, inner edge for the other rounds */
                if (tmp[0].top == tmp[1].top && tmp[1].top == tmp[2].top &&
                    tmp[2].top == tmp[3].top) {
                    if (tmp[0].top)
                        FilterHorLuma(ptr, tmp[0].top, thresholds[offset], width);
                }
                else {
                    if (tmp[0].top)
                        FilterHorLumaEdge(ptr, index, tmp[0].top, thresholds[offset],
                            width);
                    if (tmp[1].top)
                        FilterHorLumaEdge(ptr, index + 4, tmp[1].top, thresholds[offset],
                            width);
                    if (tmp[2].top)
                        FilterHorLumaEdge(ptr, index + 8, tmp[2].top, thresholds[offset],
                            width);
                    if (tmp[3].top)
                        FilterHorLumaEdge(ptr, index + 12, tmp[3].top, thresholds[offset],
                            width);
                }

                /* four pixel rows ahead, i.e. next row of 4x4-blocks */
                index += width * 4;
                tmp = tmp.slice(4);
                offset = 2;
            }
        }
    };

    var h264Cliparr =
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
            16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
            32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
            48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
            64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
            80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
            96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
            112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127,
            128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143,
            144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
            160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175,
            176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191,
            192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
            208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223,
            224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
            240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255
        ];
    var h264Clip = h264Cliparr.slice(512);

    function FilterVerLumaEdge(data, index, bS, thresholds, imageWidth) {

        /* Variables */

        var delta, tc, tmp;
        var i;
        var p0, q0, p1, q1, p2, q2;
        var tmpFlag;
        var clp = h264Clip;


        if (bS < 4) {
            tc = thresholds.tc0[bS - 1];
            tmp = tc;
            for (i = 4; i; i--, index += imageWidth) {
                p1 = data[index - 2];
                p0 = data[index - 1];
                q0 = data[index];
                q1 = data[index + 1];
                if ((Math.abs(p0 - q0) < thresholds.alpha) &&
                    (Math.abs(p1 - p0) < thresholds.beta) &&
                    (Math.abs(q1 - q0) < thresholds.beta)) {
                    p2 = data[index - 3];
                    q2 = data[index + 2];

                    if (Math.abs(p2 - p0) < thresholds.beta) {
                        data[index - 2] = (p1 + _common.clip3(-tc, tc,
                            (p2 + ((p0 + q0 + 1) >> 1) - (p1 << 1)) >> 1));
                        tmp++;
                    }

                    if (Math.abs(q2 - q0) < thresholds.beta) {
                        data[index + 1] = (q1 + _common.clip3(-tc, tc,
                            (q2 + ((p0 + q0 + 1) >> 1) - (q1 << 1)) >> 1));
                        tmp++;
                    }

                    delta = _common.clip3(-tmp, tmp, ((((q0 - p0) << 2) +
                    (p1 - q1) + 4) >> 3));

                    p0 = clp[p0 + delta];
                    q0 = clp[q0 - delta];
                    tmp = tc;
                    data[index - 1] = p0;
                    data[index] = q0;
                }
            }
        }
        else {
            for (i = 4; i; i--, index += imageWidth) {
                p1 = data[index - 2];
                p0 = data[index - 1];
                q0 = data[index];
                q1 = data[index + 1];
                if ((Math.abs(p0 - q0) < thresholds.alpha) &&
                    (Math.abs(p1 - p0) < thresholds.beta) &&
                    (Math.abs(q1 - q0) < thresholds.beta)) {
                    tmpFlag = (Math.abs(p0 - q0) < ((thresholds.alpha >> 2) + 2)) ? true : false;

                    p2 = data[index - 3];
                    q2 = data[index + 2];

                    if (tmpFlag && Math.abs(p2 - p0) < thresholds.beta) {
                        tmp = p1 + p0 + q0;
                        data[index - 1] = ((p2 + 2 * tmp + q1 + 4) >> 3);
                        data[index - 2] = ((p2 + tmp + 2) >> 2);
                        data[index - 3] = ((2 * data[index - 4] + 3 * p2 + tmp + 4) >> 3);
                    }
                    else
                        data[index - 1] = (2 * p1 + p0 + q1 + 2) >> 2;

                    if (tmpFlag && Math.abs(q2 - q0) < thresholds.beta) {
                        tmp = p0 + q0 + q1;
                        data[index] = ((p1 + 2 * tmp + q2 + 4) >> 3);
                        data[index + 1] = ((tmp + q2 + 2) >> 2);
                        data[index + 2] = ((2 * data[index + 3] + 3 * q2 + tmp + 4) >> 3);
                    }
                    else
                        data[index] = ((2 * q1 + q0 + p1 + 2) >> 2);
                }
            }
        }

    }

    function FilterHorLuma(data, index, bS, thresholds, imageWidth) {

        /* Variables */

        var delta, tc, tmp;
        var i;
        var p0, q0, p1, q1, p2, q2;
        var tmpFlag;
        var clp = h264Clip;


        if (bS < 4) {
            tc = thresholds.tc0[bS - 1];
            tmp = tc;
            for (i = 16; i; i--, index++) {
                p1 = data[index - imageWidth * 2];
                p0 = data[index - imageWidth];
                q0 = data[index];
                q1 = data[index + imageWidth];
                if ((Math.abs(p0 - q0) < thresholds.alpha) &&
                    (Math.abs(p1 - p0) < thresholds.beta) &&
                    (Math.abs(q1 - q0) < thresholds.beta)) {
                    p2 = data[index - imageWidth * 3];

                    if (Math.abs(p2 - p0) < thresholds.beta) {
                        data[index - imageWidth * 2] = (p1 + _common.clip3(-tc, tc,
                            (p2 + ((p0 + q0 + 1) >> 1) - (p1 << 1)) >> 1));
                        tmp++;
                    }

                    q2 = data[index + imageWidth * 2];

                    if (Math.abs(q2 - q0) < thresholds.beta) {
                        data[index + imageWidth] = (q1 + _common.clip3(-tc, tc,
                            (q2 + ((p0 + q0 + 1) >> 1) - (q1 << 1)) >> 1));
                        tmp++;
                    }

                    delta = _common.clip3(-tmp, tmp, ((((q0 - p0) << 2) +
                    (p1 - q1) + 4) >> 3));

                    p0 = clp[p0 + delta];
                    q0 = clp[q0 - delta];
                    tmp = tc;
                    data[index - imageWidth] = p0;
                    data[index] = q0;
                }
            }
        }
        else {
            for (i = 16; i; i--, index++) {
                p1 = data[index - imageWidth * 2];
                p0 = data[index - imageWidth];
                q0 = data[index];
                q1 = data[index + imageWidth];
                if ((Math.abs(p0 - q0) < thresholds.alpha) &&
                    (Math.abs(p1 - p0) < thresholds.beta) &&
                    (Math.abs(q1 - q0) < thresholds.beta)) {
                    tmpFlag = (Math.abs(p0 - q0) < ((thresholds.alpha >> 2) + 2)) ? true : false;

                    p2 = data[index - imageWidth * 3];
                    q2 = data[index + imageWidth * 2];

                    if (tmpFlag && Math.abs(p2 - p0) < thresholds.beta) {
                        tmp = p1 + p0 + q0;
                        data[index - imageWidth] = ((p2 + 2 * tmp + q1 + 4) >> 3);
                        data[index - imageWidth * 2] = ((p2 + tmp + 2) >> 2);
                        data[index - imageWidth * 3] = ((2 * data[index - imageWidth * 4] +
                        3 * p2 + tmp + 4) >> 3);
                    }
                    else
                        data[index - imageWidth] = ((2 * p1 + p0 + q1 + 2) >> 2);

                    if (tmpFlag && Math.abs(q2 - q0) < thresholds.beta) {
                        tmp = p0 + q0 + q1;
                        data[index] = ((p1 + 2 * tmp + q2 + 4) >> 3);
                        data[index + imageWidth] = ((tmp + q2 + 2) >> 2);
                        data[index + imageWidth * 2] = ((2 * data[index + imageWidth * 3] +
                        3 * q2 + tmp + 4) >> 3);
                    }
                    else
                        data[index] = (2 * q1 + q0 + p1 + 2) >> 2;
                }
            }
        }

    }

    function FilterHorLumaEdge(data, index, bS, thresholds, imageWidth) {

        /* Variables */

        var delta, tc, tmp;
        var i;
        var p0, q0, p1, q1, p2, q2;
        var clp = h264Clip;


        tc = thresholds.tc0[bS - 1];
        tmp = tc;
        for (i = 4; i; i--, index++) {
            p1 = data[index - imageWidth * 2];
            p0 = data[index - imageWidth];
            q0 = data[index];
            q1 = data[index + imageWidth];
            if ((Math.abs(p0 - q0) < thresholds.alpha) &&
                (Math.abs(p1 - p0) < thresholds.beta) &&
                (Math.abs(q1 - q0) < thresholds.beta)) {
                p2 = data[index - imageWidth * 3];

                if (Math.abs(p2 - p0) < thresholds.beta) {
                    data[index - imageWidth * 2] = (p1 + _common.clip3(-tc, tc,
                        (p2 + ((p0 + q0 + 1) >> 1) - (p1 << 1)) >> 1));
                    tmp++;
                }

                q2 = data[index + imageWidth * 2];

                if (Math.abs(q2 - q0) < thresholds.beta) {
                    data[index + imageWidth] = (q1 + _common.clip3(-tc, tc,
                        (q2 + ((p0 + q0 + 1) >> 1) - (q1 << 1)) >> 1));
                    tmp++;
                }

                delta = _common.clip3(-tmp, tmp, ((((q0 - p0) << 2) +
                (p1 - q1) + 4) >> 3));

                p0 = clp[p0 + delta];
                q0 = clp[q0 - delta];
                tmp = tc;
                data[index - imageWidth] = p0;
                data[index] = q0;
            }
        }
    }

    function create(opts) {
        var ml = new Macroblock_layer();
        if (opts) {
            for (var i in opts) {
                ml[i] = opts[i];
            }
        }
        return ml;
    }

    return {
        create: create
    };
});