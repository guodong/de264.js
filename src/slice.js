/**
 * Created by gd on 16/5/10.
 */
define([
    'de264/queuebuffer',
    'de264/slice_header'
], function(_queuebuffer, _slice_header) {

    var  MbPartPredMode = function(mb_type) {
        if (mb_type <= 5) {
            return 2;
        } else if (mb_type === 6) {
            return 0;
        } else {
            return 1;
        }
    };
    var NumMbPart = function(mb_type) {
        switch (mb_type) {
            case 1:
            case 0:
                return 1;
            case 2:
            case 3:
                return 2;
            default:
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

    function Slice(buf, decoder) {
        this.buf = buf;
        this.dv = new DataView(this.buf);
        this.decoder = decoder;
    }
    
    Slice.prototype = {
        parse: function() {
            var qb = _queuebuffer.create(this.buf);
            /* slice_header() */
            this.first_mb_in_slice = qb.deqUe();
            this.slice_type = qb.deqUe();
            this.pic_parameter_set_id = qb.deqUe();
            this.frame_num = qb.deqBits(this.nal.decoder.sps.log2_max_frame_num_minus4 + 4);

            if (!this.nal.decoder.sps.frame_mbs_only_flag) {
                this.field_pic_flag = qb.deqBits(1);
                if (this.field_pic_flag) {
                    this.bottom_field_flag = qb.deqBits(1);
                }
            }

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

            if ((this.slice_type % 5) === 1) { /* B slice */
                this.direct_spatial_mv_pred_flag = qb.deqBits(1);
            }

            if (((this.slice_type % 5) === 0) || ((this.slice_type % 5) === 1) || ((this.slice_type % 5) === 3)) {
                this.num_ref_idx_active_override_flag = qb.deqBits(1);
                if (this.num_ref_idx_active_override_flag) {
                    this.num_ref_idx_l0_active_minus1 = qb.deqUe();
                    if (this.slice_type % 5 === 1) {
                        this.num_ref_idx_l1_active_minus1 = qb.deqUe();
                    }
                }
            }

            /* ref_pic_list_reordering() */
            if (((this.slice_type % 5) !== 2) && ((this.slice_type % 5) !== 4)) {
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

            if ((this.slice_type % 5) === 1) {
                this.ref_pic_list_reordering_flag_l1 = qb.deqBits(1);
                if(this.ref_pic_list_reordering_flag_l1) {
                    do {
                        this.reordering_of_pic_nums_idc = qb.deqUe();
                        if (this.reordering_of_pic_nums_idc === 0 || this.reordering_of_pic_nums_idc === 1) {
                            this.abs_diff_pic_num_minus1 = qb.deqUe();
                        } else if(this.reordering_of_pic_nums_idc === 2) {
                            this.long_term_pic_num = qb.deqUe();
                        }
                    } while (this.reordering_of_pic_nums_idc !== 3);
                }
            }

            /* ref_pic_list_reordering() end */

            if ((this.nal.decoder.pps.weighted_pred_flag && (this.slice_type % 5 === 0 || this.slice_type % 5 === 3)) || (this.nal.decoder.pps.weighted_bipred_idc === 1 && this.slice_type % 5 === 1)) {
                /* pred_weight_table() */
                this.luma_log2_weight_denom = qb.deqUe();
                if (this.nal.decoder.sps.chroma_format_idc !== 0) {
                    this.chroma_log2_weight_denom = qb.deqUe();
                }
                for (var i = 0; i <= this.num_ref_idx_l0_active_minus1; i++) {
                    this.luma_weight_l0_flag = qb.deqBits(1);
                    this.luma_weight_l0 = [];
                    this.luma_offset_l0 = [];
                    if (this.luma_weight_l0_flag) {
                        this.luma_weight_l0[i] = qb.deqSe();
                        this.luma_offset_l0[i] = qb.deqSe();
                    }
                    if (this.nal.decoder.sps.chroma_format_idc !== 0) {
                        this.chroma_weight_l0_flag = qb.deqBits(1);
                        if (this.chroma_weight_l0_flag) {
                            this.chroma_weight_l0 = [];
                            this.chroma_weight_l0[i] = [];
                            this.chroma_offset_l0 = [];
                            this.chroma_offset_l0[i] = [];
                            for (var j = 0; j < 2; j++) {
                                this.chroma_weight_l0[i][j] = qb.deqSe();
                                this.chroma_offset_l0[i][j] = qb.deqSe();
                            }
                        }
                    }
                }

                if (this.slice_type % 5 === 1) { /* B slice */
                    // TODO
                }
                /* pred_weight_table() end */
            }

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

            if (this.nal.decoder.pps.entropy_coding_mode_flag && (this.slice_type % 5 !== 2) && (this.slice_type % 5 !== 4)) {
                this.cabac_init_idc = qb.deqUe();
            }
            this.slice_qp_delta = qb.deqSe();

            if ((this.slice_type % 5  === 3) || (this.slice_type % 5 === 4)) {
                if (this.slice_type % 5 === 3) {
                    this.sp_for_switch_flag = qb.deqBits(1);
                }
                this.slice_qs_delta = qb.deqSe();
            }
            if (this.nal.decoder.pps.deblocking_filter_control_present_flag) {
                this.disable_deblocking_filter_idc = qb.deqUe();
                if (this.disable_deblocking_filter_idc !== 1) {
                    this.slice_alpha_c0_offset_div2 = qb.deqSe();
                    this.slice_beta_offset_div2 = qb.deqSe();
                }
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

                this.slice_group_change_cycle = qb.deqBits(j);
            }
            console.log('header', this);
            /* slice_header() end*/

            /* slice_data() */
            if (this.nal.decoder.pps.entropy_coding_mode_flag) {
                while (!qb.isAligned()) {
                    this.cabac_alignment_one_bit = qb.deqBits(1);
                }
            }
            var MbaffFrameFlag = this.nal.decoder.sps.mb_adaptive_frame_field_flag && !this.field_pic_flag;
            var CurrMbAddr = this.first_mb_in_slice * (1 + MbaffFrameFlag);
            var moreDataFlag = 1;
            var prevMbSkipped = 0;
            var self = this;
            var NextMbAddress = function(n) { /* could be optimized */
                var FrameHeightInMbs = (2 - self.nal.decoder.sps.frame_mbs_only_flag) * PicHeightInMapUnits;
                var PicHeightInMbs = FrameHeightInMbs / ( 1 + self.field_pic_flag );
                var PicSizeInMbs = PicWidthInMbs * PicHeightInMbs;
                var MbToSliceGroupMap = [];
                var mapUnitToSliceGroupMap = [];
                for (var i = 0; i < PicSizeInMapUnits; i++) {
                    mapUnitToSliceGroupMap[i] = self.nal.decoder.pps.slice_group_id[i];
                }
                if (self.nal.decoder.sps.frame_mbs_only_flag === 1 || self.field_pic_flag === 1) {
                    MbToSliceGroupMap = mapUnitToSliceGroupMap;
                } else if (MbaffFrameFlag === 1) {
                    for (var i in mapUnitToSliceGroupMap) {
                        MbToSliceGroupMap[i] = mapUnitToSliceGroupMap[Math.floor(i / 2)];
                    }
                } else {
                    for (var i in mapUnitToSliceGroupMap) {
                        MbToSliceGroupMap[i] = mapUnitToSliceGroupMap[(Math.floow(i/(2*PicWidthInMbs))) * PicWidthInMbs + (i % PicWidthInMbs)];
                    }
                }
                var i = n + 1;
                while (i < PicSizeInMbs && (MbToSliceGroupMap[i] != MbToSliceGroupMap[n])) {
                    i++;
                }
                return i;
            };

            do {
                if ((this.slice_type % 5 !== 2) && (this.slice_type % 5 !== 4)) {
                    if (!this.nal.decoder.pps.entropy_coding_mode_flag) {
                        this.mb_skip_run = qb.deqUe();
                        prevMbSkipped = (this.mb_skip_run > 0);
                        for (var i = 0; i < this.mb_skip_run; i++) {
                            CurrMbAddr = NextMbAddress(CurrMbAddr);
                        }
                        moreDataFlag = qb.more_rbsp_data();
                    } else {
                        // TODO
                    }
                }

                if (moreDataFlag) { console.log('more');
                    if (MbaffFrameFlag && (CurrMbAddr % 2 === 0 || (CurrMbAddr % 2 === 1 && prevMbSkipped))) {
                        this.mb_field_decoding_flag = qb.deqBits(1);
                    }
                    /* macroblock_layer() */

                    this.mb_type = qb.deqUe();
                    if (this.mb_type === 25) { /* I_PCM */
                        while (!qb.isAligned()) {
                            this.pcm_alignment_zero_bit = qb.deqBits(1);
                        }
                        this.pcm_byte = [];
                        for (var i = 0; i < 384; i++) {
                            this.pcm_byte[i] = qb.deqBits(8);
                        }
                    } else {
                        if (MbPartPredMode(this.mb_type) !== 0 && MbPartPredMode(this.mb_type) !== 1 && NumMbPart(this.mb_type) === 4) {
                            /* sub_mb_pred() */
                            this.sub_mb_type = [];
                            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
                                this.sub_mb_type[mbPartIdx] = qb.deqUe();
                            }
                            this.ref_idx_l0 = [];
                            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) { /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice */
                                if ((this.num_ref_idx_l0_active_minus1 > 0 || this.mb_field_decoding_flag) && this.mb_type !== 5 && this.sub_mb_type[mbPartIdx] !== 0) { // TODO: SubMbPredMode()
                                    this.ref_idx_l0[mbPartIdx] = qb.deqTe(this.num_ref_idx_l0_active_minus1 > 1);
                                }
                            }
                            
                            /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice, so no need to parse ref_idx_l1 */
                            
                            this.mvd_l0 = [];
                            for (var mbPartIdx = 0; mbPartIdx < 4; mbPartIdx++) {
                                this.mvd_l0[mbPartIdx] = [];
                                if (this.sub_mb_type[mbPartIdx] !== 0) {
                                    for (var subMbPartIdx = 0; subMbPartIdx < NumSubMbPart(this.sub_mb_type[mbPartIdx]); subMbPartIdx++) {
                                        this.mvd_l0[mbPartIdx][subMbPartIdx] = [];
                                        for (var compIdx = 0; compIdx < 2; compIdx++) {
                                            this.mvd_l0[mbPartIdx][subMbPartIdx][compIdx] = qb.deqSe();
                                        }
                                    }
                                }
                            }
                            /* SubMbPredMode(sub_mb_type[mbPartIdx]) is Prd_L0 for P slice, so no need to parse follow */
                            /* sub_mb_pred() */
                        } else {
                            /* mb_pred() */
                            if (MbPartPredMode(this.mb_type) === 0 || MbPartPredMode(this.mb_type) === 1) {
                                if (MbPartPredMode(this.mb_type) === 0) {
                                    this.prev_intra4x4_pred_mode_flag = [];
                                    this.rem_intra4x4_pred_mode = [];
                                    for (var luma4x4BlkIdx = 0; luma4x4BlkIdx < 16; luma4x4BlkIdx++) {
                                        this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx] = qb.deqBits(1);
                                        if (!this.prev_intra4x4_pred_mode_flag[luma4x4BlkIdx]) {
                                            this.rem_intra4x4_pred_mode[luma4x4BlkIdx] = qb.deqBits(3);
                                        }
                                    }
                                }
                                this.intra_chroma_pred_mode = qb.deqUe();
                            } else {
                                // TODO
                            }
                            /* mb_pred() end */
                        }
                    }
                    /* macroblock_layer() end */
                }
                moreDataFlag = qb.more_rbsp_data();
                CurrMbAddr = NextMbAddress(CurrMbAddr);
                console.log(this);
            } while (moreDataFlag);
        },
        mb_pred: function() {
            //if (MbPartPredMode(this.mb_type) === )
        }
    };
    
    function create(buf) {
        var slice = new Slice(buf);
        return slice;
    }
    
    return {
        create: create
    };
});