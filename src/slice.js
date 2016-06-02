/**
 * Created by gd on 16/5/10.
 */
define([
    'de264/queuebuffer',
    'de264/slice_header',
    'de264/defs',
    'de264/common',
    'de264/macroblock_layer',
    'de264/util'
], function(_queuebuffer, _slice_header, _defs, _common, _macroblock_layer, _util) {

    function Slice(buf, decoder) {
        this.buf = buf;
        this.dv = new DataView(this.buf);
        this.qb = _queuebuffer.create(this.buf);
        this.decoder = decoder;
    }

    Slice.prototype = {
        parse: function() {
            var qb = this.qb;
            /* slice_header() */
            this.first_mb_in_slice = qb.deqUe();
            this.slice_type = qb.deqUe();
            this.pic_parameter_set_id = qb.deqUe();
            this.frame_num = qb.deqBits(this.nal.decoder.sps.log2_max_frame_num_minus4 + 4);

            if (this.nal.nal_unit_type === 5) {
                this.idr_pic_id = qb.deqUe();
            }

            if (this.nal.decoder.sps.pic_order_cnt_type === 0) {
                this.pic_order_cnt_lsb = qb.deqBits(this.nal.decoder.sps.log2_max_pic_order_cnt_lsb_minus4 + 4);
                if (this.nal.decoder.pps.pic_order_present_flag && !this.field_pic_flag) {
                    this.delta_pic_order_cnt_bottom = qb.deqSe();
                }
            }

            if (this.nal.decoder.sps.pic_order_cnt_type === 1 && !this.nal.decoder.sps.delta_pic_order_always_zero_flag) {
                this.delta_pic_order_cnt = [qb.deqSe()];
                if (this.nal.decoder.pps.pic_order_present_flag && !this.field_pic_flag) {
                    this.delta_pic_order_cnt[1] = qb.deqSe();
                }
            }

            if (this.nal.decoder.pps.redundant_pic_cnt_present_flag) {
                this.redundant_pic_cnt = qb.deqUe();
            }

            if (_common.isPSlice(this.slice_type)) {
                this.num_ref_idx_active_override_flag = qb.deqBits(1);
                if (this.num_ref_idx_active_override_flag) {
                    this.num_ref_idx_l0_active_minus1 = qb.deqUe();
                } else { /* set num_ref_idx_l0_active_minus1 from pic param set */
                    this.num_ref_idx_l0_active_minus1 = this.nal.decoder.pps.num_ref_idx_l0_active_minus1;
                }
            }

            /* ref_pic_list_reordering() */
            if (!_common.isISlice(this.slice_type)) {
                this.ref_pic_list_reordering_flag_l0 = qb.deqBits(1);
                if (this.ref_pic_list_reordering_flag_l0) {
                    do {
                        this.reordering_of_pic_nums_idc = qb.deqUe();
                        if (this.reordering_of_pic_nums_idc === 0 || this.reordering_of_pic_nums_idc === 1) {
                            this.abs_diff_pic_num_minus1 = qb.deqUe();
                        } else if (this.reordering_of_pic_nums_idc === 2) {
                            this.long_term_pic_num = qb.deqUe();
                        }
                    } while (this.reordering_of_pic_nums_idc !== 3);
                }
            }
            /* ref_pic_list_reordering() end */

            /* FF: weighted_pred_flag, this shall be 0 for baseline profile */

            if (this.nal.nal_ref_idc !== 0) {
                /* dec_ref_pic_marking() */
                if (this.nal.nal_unit_type === 5) {
                    this.no_output_of_prior_pics_flag = qb.deqBits(1);
                    this.long_term_reference_flag = qb.deqBits(1);
                } else {
                    this.adaptive_ref_pic_marking_mode_flag = qb.deqBits(1);
                    if (this.adaptive_ref_pic_marking_mode_flag) {
                        do {
                            this.memory_management_control_operation = qb.deqUe();
                            if (this.memory_management_control_operation === 1 || this.memory_management_control_operation === 3) {
                                this.difference_of_pic_nums_minus1 = qb.deqUe();
                            }
                            if (this.memory_management_control_operation === 2) {
                                this.long_term_pic_num = qb.deqUe();
                            }
                            if (this.memory_management_control_operation === 3 || this.memory_management_control_operation === 6) {
                                this.long_term_frame_idx = qb.deqUe();
                            }
                            if (this.memory_management_control_operation === 4) {
                                this.max_long_term_frame_idx_plus1 = qb.deqUe();
                            }
                        } while (this.memory_management_control_operation !== 0);
                    }
                }
                /* dec_ref_pic_marking() end */
            }

            this.slice_qp_delta = qb.deqSe();

            if (this.nal.decoder.pps.deblocking_filter_control_present_flag) {
                this.disable_deblocking_filter_idc = qb.deqUe();
                if (this.disable_deblocking_filter_idc !== 1) {
                    this.slice_alpha_c0_offset_div2 = qb.deqSe();
                    this.slice_beta_offset_div2 = qb.deqSe();
                }
            } else {
                this.disable_deblocking_filter_idc = 0;
            }

            if (this.nal.decoder.pps.num_slice_groups_minus1 > 0 && this.nal.decoder.pps.slice_group_map_type >= 3 && this.nal.decoder.pps.slice_group_map_type <= 5) {
                var PicWidthInMbs = this.nal.decoder.sps.pic_width_in_mbs_minus1 + 1;
                var PicHeightInMapUnits = this.nal.decoder.sps.pic_height_in_map_units_minus1 + 1;
                var PicSizeInMapUnits = PicWidthInMbs * PicHeightInMapUnits;

                var SliceGroupChangeRate = this.nal.decoder.pps.slice_group_change_rate_minus1 + 1;
                var val = PicSizeInMapUnits / SliceGroupChangeRate + 1;

                /* Ceil(Log2(val)) */
                var j = 0;
                while (val >> j)
                    j++;
                j--;
                if ((1 << j) < val) {
                    j++;
                }

                this.slice_group_change_cycle = qb.deqBits(j);
            }
            console.log('header', this.qb.bitindex, this);
            /* slice_header() end*/

            /* slice_data() */
            //var MbaffFrameFlag = this.nal.decoder.sps.mb_adaptive_frame_field_flag && !this.field_pic_flag;
            this.MbaffFrameFlag = 0;
            var MbaffFrameFlag = this.MbaffFrameFlag;
            var CurrMbAddr = this.first_mb_in_slice * (1 + MbaffFrameFlag);
            var moreDataFlag = 1;
            var prevMbSkipped = 0;
            var self = this;
            var NextMbAddress = function(n) { /* could be optimized */
                return n + 1;
                /* for test */
                // var FrameHeightInMbs = (2 - self.nal.decoder.sps.frame_mbs_only_flag) * PicHeightInMapUnits;
                // var PicHeightInMbs = FrameHeightInMbs / ( 1 + self.field_pic_flag );
                // var PicSizeInMbs = PicWidthInMbs * PicHeightInMbs;
                // var MbToSliceGroupMap = [];
                // var mapUnitToSliceGroupMap = [];
                // for (var i = 0; i < PicSizeInMapUnits; i++) {
                //     mapUnitToSliceGroupMap[i] = self.nal.decoder.pps.slice_group_id[i];
                // }
                // if (self.nal.decoder.sps.frame_mbs_only_flag === 1 || self.field_pic_flag === 1) {
                //     MbToSliceGroupMap = mapUnitToSliceGroupMap;
                // } else if (MbaffFrameFlag === 1) {
                //     for (var i in mapUnitToSliceGroupMap) {
                //         MbToSliceGroupMap[i] = mapUnitToSliceGroupMap[Math.floor(i / 2)];
                //     }
                // } else {
                //     for (var i in mapUnitToSliceGroupMap) {
                //         MbToSliceGroupMap[i] = mapUnitToSliceGroupMap[(Math.floow(i/(2*PicWidthInMbs))) * PicWidthInMbs + (i % PicWidthInMbs)];
                //     }
                // }
                // var i = n + 1;
                // while (i < PicSizeInMbs && (MbToSliceGroupMap[i] != MbToSliceGroupMap[n])) {
                //     i++;
                // }
                // return i;
            };

            do {
                if (!_common.isISlice(this.slice_type) && (this.slice_type % 5 !== 4)) {
                    if (!this.nal.decoder.pps.entropy_coding_mode_flag) {
                        this.mb_skip_run = qb.deqUe();
                        prevMbSkipped = (this.mb_skip_run > 0);
                        for (var i = 0; i < this.mb_skip_run; i++) {
                            CurrMbAddr = NextMbAddress(CurrMbAddr);
                        }
                        moreDataFlag = qb.more_rbsp_data();
                    } else {
                        // FF
                    }
                }

                if (moreDataFlag) {
                    if (MbaffFrameFlag && (CurrMbAddr % 2 === 0 || (CurrMbAddr % 2 === 1 && prevMbSkipped))) {
                        this.mb_field_decoding_flag = qb.deqBits(1);
                    }
                    /* macroblock_layer() */
                    var mb = _macroblock_layer.create(this.qb, this);
                    mb.mbaddr = CurrMbAddr;
                    mb.decoder = this.decoder;
                    var pw = this.decoder.sps.pic_width_in_mbs_minus1 + 1;
                    var ph = this.decoder.sps.pic_height_in_map_units_minus1 + 1;
                    if (CurrMbAddr % pw) {
                        mb.mbA = this.decoder.mbs[CurrMbAddr - 1];
                    } else {
                        mb.mbA = null;
                    }
                    if (Math.floor(CurrMbAddr / pw)) {
                        mb.mbB = this.decoder.mbs[CurrMbAddr - pw];
                    } else {
                        mb.mbB = null;
                    }
                    mb.parse();
                    console.log(CurrMbAddr, mb.mb_type, this.qb.bitindex, mb);
                    this.decoder.mbs[CurrMbAddr] = mb;
                    mb.decode();
                    /* macroblock_layer() end */
                }
                moreDataFlag = qb.more_rbsp_data();
                CurrMbAddr = NextMbAddress(CurrMbAddr);
            } while (moreDataFlag);
        }
    };

    

    function create(buf, sps, pps) {
        var slice = new Slice(buf, sps, pps);
        return slice;
    }

    return {
        create: create
    };
});