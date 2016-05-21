/**
 * Created by gd on 16/5/12.
 */
define([
    'de264/common',
    'de264/defs',
    'de264/queuebuffer'
], function(_common, _defs, _queuebuffer) {
    var MbPartPredMode = function(mb_type, slice_type) {
        if (_common.isISlice(slice_type)) {
            if (mb_type === 0) {
                return _defs.PRED_MODE_INTRA4x4;
            } else {
                return _defs.PRED_MODE_INTRA16x16;
            }
        } else {
            return _defs.PRED_MODE_INTER;
        }
    };
    var NumMbPart = function(mb_type) {
        switch (mb_type) {
            case _defs.P_L0_16x16:
            case _defs.P_Skip:
                return 1;
            case  _defs.P_L0_L0_16x8:
            case _defs.P_L0_L0_8x16:
                return 2;
            default: /* P_8x8, P_8x8ref0 */
                return 4;

        }
    };
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

    function sub_mb_pred(mb_type) {
        var qb = this.qb;
        this.sub_mb_type = [];
        for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
            this.sub_mb_type[mbPartIdx] = qb.deqUe();
        }
        this.ref_idx_l0 = [];
        for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) { /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice */
            if ((this.num_ref_idx_l0_active_minus1 > 0 || this.mb_field_decoding_flag) && mb_type !== _defs.P_8x8ref0 && this.sub_mb_type[mbPartIdx] !== _defs.B_Direct_8x8) { // TODO: SubMbPredMode()
                this.ref_idx_l0[mbPartIdx] = qb.deqTe(this.num_ref_idx_l0_active_minus1 > 1);
            }
        }

        /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice, so no need to parse ref_idx_l1 */

        this.mvd_l0 = [];
        for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
            this.mvd_l0[mbPartIdx] = [];
            if (this.sub_mb_type[mbPartIdx] !== _defs.B_Direct_8x8) {
                for (var subMbPartIdx = 0; subMbPartIdx < NumSubMbPart(this.sub_mb_type[mbPartIdx]); subMbPartIdx++) {
                    this.mvd_l0[mbPartIdx][subMbPartIdx] = [];
                    for (var compIdx = 0; compIdx < 2; compIdx++) {
                        this.mvd_l0[mbPartIdx][subMbPartIdx][compIdx] = qb.deqSe();
                    }
                }
            }
        }
        /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice, so no need to parse follow */
    }

    function mb_pred(mb_type) {
        var qb = this.qb;
        switch (MbPartPredMode(mb_type, this.slice.slice_type)) {
            case _defs.PRED_MODE_INTER:
                if (this.num_ref_idx_l0_active_minus1 > 0) {
                    this.ref_idx_l0 = [];
                    for (var i = NumMbPart(mb_type), j = 0; i--; j++) {
                        this.ref_idx_l0[j] = qb.deqTe((this.num_ref_idx_l0_active_minus1 > 1));
                    }
                }
                this.mvd_l0 = [];
                for (var i = NumMbPart(mb_type), j = 0; i--; j++) {
                    this.mvd_l0[j] = {hor: qb.deqSe(), ver: qb.deqSe()};
                }
                break;
            case _defs.PRED_MODE_INTRA4x4:
                this.prev_intra4x4_pred_mode_flag = [];
                this.rem_intra4x4_pred_mode = [];
                for (var luma4x4BlkIdx = 0; luma4x4BlkIdx < 16; luma4x4BlkIdx++) {
                    this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx] = qb.deqBits(1);
                    if (!this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx]) {
                        this.rem_intra4x4_pred_mode[luma4x4BlkIdx] = qb.deqBits(3);
                    }
                }
            /* falls through */
            case _defs.PRED_MODE_INTRA16x16:
                this.intra_chroma_pred_mode = qb.deqUe();
                break;
        }
    }

    function calcNC(mb, blockIndex) {
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
            if (_common.isNeighbourAvailable(this.this.mbB)) {
                if (tmp) {
                    nc = (nc + his.mbB.totalCoeff[neighbourB[1]] + 1) >> 1;
                } else {
                    nc = this.mbB.totalCoeff[neighbourB[1]];
                }
            }
        }
        return nc;
    }

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
        0x000C0071: [0, 6],
        0x000B00C0: [1, 6],
        0x000A0140: [2, 6],
        0x00080400: [3, 6],
        0x000D0051: [0, 7],
        0x000D0070: [1, 7],
        0x000B00A0: [2, 7],
        0x00090200: [3, 7],
        0x000D0040: [0, 8],
        0x000D0050: [1, 8],
        0x000D0061: [2, 8],
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

    function decodeCoeffToken(qb, nc) {
        var state = 0x00000000;
        if (nc < 2) {
            for (var size = 0; size < 16; size++) {
                var bit = qb.deqBits(1);
                state += 1 << 16;
                state |= bit << (15 - size);
                if (coeff_map_nc_0_2[state]) {
                    return coeff_map_nc_02[state];
                }
            }
        }

        return null;
    }

    function residual_block_cavlc(nc, coeffLevel, maxNumCoeff) {

        //var coeff_token = this.qb.deqc
    }

    function residual(mb_type) {
        if (MbPartPredMode(mb_type, this.slice_type) === _defs.PRED_MODE_INTRA16x16) {
            // TODO
        }

        var Intra16x16ACLevel = [];
        var LumaLevel = [];
        for (var i8x8 = 0; i8x8 < 4; i8x8++) {
            for (var i4x4 = 0; i4x4 < 4; i4x4++) {
                if (this.CodedBlockPattenLuma & (1 << i8x8)) {
                    if (MbPartPredMode(mb_type, this.slice.slice_type) === _defs.PRED_MODE_INTRA16x16) {
                        Intra16x16ACLevel[i8x8 * 4 + i4x4] = [];
                        var nc = calcNC(this, 4 * i8x8 + i4x4);
                        residual_block_cavlc.call(this, nc, Intra16x16ACLevel[i8x8 * 4 + i4x4], 15);
                    } else {
                        LumaLevel[i8x8 * 4 + i4x4] = [];
                        residual_block_cavlc.call(this, nc, LumaLevel[i8x8 * 4 + i4x4], 16);
                    }
                } else {
                    if (MbPartPredMode(mb_type, this.slice.slice_type) === _defs.PRED_MODE_INTRA16x16) {
                        for (var i = 0; i < 15; i++) {
                            Intra16x16ACLevel[i8x8 * 4 + i4x4][i] = 0;
                        }
                    } else {
                        for (var i = 0; i < 16; i++) {
                            LumaLevel[i8x8 * 4 + i4x4][i] = 0;
                        }
                    }
                }
            }
        }

        var ChromaDCLevel = [];
        for (var iCbCr = 0; iCbCr < 2; iCbCr++) {
            ChromaDCLevel[iCbCr] = [];
            if (this.CodedBlockPatternChroma & 3) {
                residual_block_cavlc(ChromaDCLevel[iCbCr], 4);
            } else {
                for (var i = 0; i < 4; i++) {
                    ChromaDCLevel[iCbCr][i] = 0;
                }
            }
        }

        var ChromaACLevel = [];
        for (var iCbCr = 0; iCbCr < 2; iCbCr++) {
            ChromaACLevel[iCbCr] = [];
            for (var i4x4 = 0; i4x4 < 4; i4x4++) {
                ChromaACLevel[iCbCr][i4x4] = [];
                if (this.CodedBlockPatternChroma & 2) {
                    residual_block_cavlc(ChromaACLevel[iCbCr][i4x4], 15);
                } else {
                    for (var i = 0; i < 15; i++) {
                        ChromaACLevel[iCbCr][i4x4][i] = 0;
                    }
                }
            }
        }
    }

    function Macroblock_layer(qb, slice) {
        this.qb = qb;
        this.slice = slice;

        this.totalCoeff = [];
    }

    Macroblock_layer.prototype = {
        parse: function() {
            var qb = this.qb;
            this.mb_type = qb.deqUe();
            if (this.mb_type === _defs.I_PCM) { /* I_PCM */
                while (!qb.isAligned()) {
                    this.pcm_alignment_zero_bit = qb.deqBits(1);
                }
                this.pcm_byte = [];
                for (var i = 0; i < 384; i++) {
                    this.pcm_byte[i] = qb.deqBits(8);
                }
            } else {
                var noSubMbPartSizeLessThan8x8Flag = 1;
                if (MbPartPredMode(this.mb_type, this.slice.slice_type) === _defs.PRED_MODE_INTER && NumMbPart(mb_type) === 4) {
                    /* sub_mb_pred() */
                    sub_mb_pred.call(this, this.mb_type);
                    /* sub_mb_pred() end*/
                } else {
                    /* mb_pred() */
                    mb_pred.call(this, this.mb_type);
                    /* mb_pred() end */
                }

                if (MbPartPredMode(this.mb_type, this.slice.slice_type) !== _defs.PRED_MODE_INTRA16x16) {
                    this.coded_block_pattern = qb.deqMe(MbPartPredMode(this.mb_type, this.slice.slice_type) === _defs.PRED_MODE_INTRA4x4);
                    this.CodedBlockPattenLuma = this.coded_block_pattern % 16;
                    this.CodedBlockPatternChroma = Math.floor(this.coded_block_pattern / 16);
                } else {
                    if (this.mb_type >= 5 && this.mb_type <= 8) {
                        this.CodedBlockPattenLuma = 15;
                        this.CodedBlockPatternChroma = 1;
                    }
                }
                if (this.coded_block_pattern || MbPartPredMode(this.mb_type, this.slice.slice_type) === _defs.PRED_MODE_INTRA16x16) {
                    this.mb_qp_delta = qb.deqSe();
                    residual.call(this, this.mb_type);
                }
            }
        }
    };

    function create(qb, slice) {
        var ml = new Macroblock_layer(qb, slice);
        return ml;
    }

    return {
        create: create
    };
});