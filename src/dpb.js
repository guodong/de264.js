/**
 * Created by gd on 16/6/11.
 */
define([
    'de264/defs',
    'de264/util'
], function(_defs, _util) {
    function Dpb() {
        this.maxRefFrames = 0;
        this.maxFrameNum = 0;
        /* overwrite on read sps */
    }

    Dpb.prototype = {
        init: function() {
            this.images = new Array(16);
            for (var i in this.images) {
                this.images[i] = {
                    data: new ArrayBuffer(this.decoder.picSizeInMb * 384)
                };
            }
            this.refPicList0 = this.images;
        },
        markDecRefPic: function() {

        },
        initRefPicList: function() {

        },
        findPic: function(picNum, isShortTerm) {
            var i = 0,
                found = false,
                type = isShortTerm ? _defs.SHORT_TERM : _defs.LONG_TERM;
            while (i < this.maxRefFrames && !found) {
                if (this.images[i].type === type && this.images[i].picNum === picNum) {
                    found = true;
                } else {
                    i++;
                }
            }
            if (found) {
                return i;
            }
            return -1;
        },
        reorderRefPicList: function(slice) {
            var order = slice.ref_pic_list_reordering,
                frameNum = slice.frame_num;
            var i = 0;
            var picNumNoWrap;
            var picNumPred;
            var picNum;
            var isShortTerm;
            var refIdxL0 = 0;
            while (order[i].reordering_of_pic_nums_idc < 3) {
                if (order[i].reordering_of_pic_nums_idc < 2) {
                    if (order[i].reordering_of_pic_nums_idc === 0) {
                        picNumNoWrap = frameNum - (order[i].abs_diff_pic_num_minus1 + 1);
                        if (picNumNoWrap < 0) {
                            picNumNoWrap += this.maxFrameNum;
                        }
                    } else {
                        picNumNoWrap = frameNum + (order[i].abs_diff_pic_num_minus1 + 1);
                        if (picNumNoWrap >= this.maxFrameNum) {
                            picNumNoWrap -= this.maxFrameNum;
                        }
                    }
                    picNumPred = picNumNoWrap;
                    picNum = picNumNoWrap;
                    if (picNumNoWrap > frameNum) {
                        picNum -= this.maxFrameNum;
                    }
                    isShortTerm = true;
                } else {
                    picNum = order[i].long_term_pic_num;
                    isShortTerm = false;
                }

                var index = this.findPic(picNum, isShortTerm);
                if (index < 0) {
                    return -1;
                }
                for (var cIdx = slice.num_ref_idx_l0_active_minus1 + 1; cIdx > refIdxL0; cIdx--) {
                    this.refPicList0[cIdx] = this.refPicList0[cIdx - 1];
                }
                this.refPicList0[refIdxL0++] = this.refPicList0[index];
                var nIdx = refIdxL0;
                for (var cIdx = refIdxL0; cIdx <= slice.num_ref_idx_l0_active_minus1 + 1; cIdx++) {
                    if (this.refPicList0[cIdx] !== this.refPicList0[index]) {
                        this.refPicList0[nIdx++] = this.refPicList0[cIdx];
                    }
                }
                i++;
            }

        }
    };

    function create(opts) {
        var dpb = new Dpb();
        for (var i in opts) {
            dpb[i] = opts[i];
        }
        dpb.init();
        return dpb;
    }

    return {
        create: create
    };
});