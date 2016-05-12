/**
 * Created by gd on 16/5/9.
 */
define(['de264/queuebuffer'], function(_queuebuffer) {


    function Sps(buf) {
        this.buf = buf;
        this.dv = new DataView(this.buf);
    }
    
    Sps.prototype = {
        parse: function() {
            var qb = _queuebuffer.create(this.buf);
            this.profile_idc = qb.deqBits(8);
            this.constraint_set0_flag = qb.deqBits(1);
            this.constraint_set1_flag = qb.deqBits(1);
            this.constraint_set2_flag = qb.deqBits(1);
            this.constraint_set3_flag = qb.deqBits(1);

            /* reserved_zero_4bits */
            qb.deqBits(4);

            this.level_idc = qb.deqBits(8);
            if (this.profile_idc === 100 || this.profile_idc === 110 || this.profile_idc === 122 || this.profile_idc === 144) {
                this.chroma_format_idc = qb.deqUe();
                if (this.chroma_format_idc === 3) {
                    this.residual_colour_transform_flag = qb.deqBits(1);
                }
                this.bit_depth_luma_minus8 = qb.deqUe();
                this.bit_depth_chroma_minus8 = qb.deqUe();
                this.qpprime_y_zero_transform_bypass_flag = qb.deqBits(1);
                this.seq_scaling_matrix_present_flag = qb.deqBits(1);
                if (this.seq_scaling_matrix_present_flag) {
                    this.seq_scaling_list_present_flag = [];
                    for (var i = 0; i < 8; i++) {
                        this.seq_scaling_list_present_flag[i] = qb.deqBits(1);
                        if (this.seq_scaling_list_present_flag[i]) {
                            if (i < 6) {
                                // TODO
                            } else {
                                // TODO
                            }
                        }
                    }
                }
            }
            this.log2_max_frame_num_minus4 = qb.deqUe();
            this.pic_order_cnt_type = qb.deqUe();
            if (this.pic_order_cnt_type === 0) {
                this.log2_max_pic_order_cnt_lsb_minus4 = qb.deqUe();
            } else if (this.pic_order_cnt_type === 1) {
                this.delta_pic_order_always_zero_flag = qb.deqBits(1);
                this.offset_for_non_ref_pic = qb.deqUe();
            }
            this.num_ref_frames = qb.deqUe();
            this.gaps_in_frame_num_value_allowed_flag = qb.deqBits(1);
            this.pic_width_in_mbs_minus1 = qb.deqUe();
            this.pic_height_in_map_units_minus1 = qb.deqUe();
            this.frame_mbs_only_flag = qb.deqBits(1);
            if (!this.frame_mbs_only_flag) {
                this.mb_adaptive_frame_field_flag = qb.deqBits(1);
            }
            this.direct_8x8_inference_flag = qb.deqBits(1);
            this.frame_cropping_flag = qb.deqBits(1);
            if (this.frame_cropping_flag) {
                this.frame_crop_left_offset = qb.deqUe();
                this.frame_crop_right_offset = qb.deqUe();
                this.frame_crop_top_offset = qb.deqUe();
                this.frame_crop_bottom_offset = qb.deqUe();
            }
            this.vui_parameters_present_flag = qb.deqBits(1);
            if (this.vui_parameters_present_flag) {
                this.aspect_ratio_info_present_flag = qb.deqBits(1);
                if (this.aspect_ratio_info_present_flag) {
                    this.aspect_ratio_idc = qb.deqBits(8);
                    if (this.aspect_ratio_idc === 255) {
                        this.sar_width = qb.deqBits(16);
                        this.sar_height = qb.deqBits(16);
                    }
                }
                this.overscan_info_present_flag = qb.deqBits(1);
                if (this.overscan_info_present_flag) {
                    this.overscan_appropriate_flag = qb.deqBits(1);
                }
                this.video_signal_type_present_flag = qb.deqBits(1);
                if (this.video_signal_type_present_flag) {
                    this.video_format = qb.deqBits(3);
                    this.video_full_range_flag = qb.deqBits(1);
                    this.colour_description_present_flag = qb.deqBits(1);
                    if (this.colour_description_present_flag) {
                        this.colour_primaries = qb.deqBits(8);
                        this.transfer_characteristics = qb.deqBits(8);
                        this.matrix_coefficients = qb.deqBits(8);

                    }
                }
                this.chroma_loc_info_present_flag = qb.deqBits(1);
                if (this.chroma_loc_info_present_flag) {
                    this.chroma_sample_loc_type_top_field = qb.deqUe();
                    this.chroma_sample_loc_type_bottom_field = qb.deqUe();
                }
                this.timing_info_present_flag = qb.deqBits(1);
                if (this.timing_info_present_flag) {
                    this.num_units_in_tick = qb.deqBits(32);
                    this.time_scale = qb.deqBits(32);
                    this.fixed_frame_rate_flag = qb.deqBits(1);
                }
                this.nal_hrd_parameters_present_flag = qb.deqBits(1);
                if (this.nal_hrd_parameters_present_flag) {
                    // todo
                }
                this.vcl_hrd_parameters_present_flag = qb.deqBits(1);
                if (this.vcl_hrd_parameters_present_flag) {
                    // todo
                }
                if (this.nal_hrd_parameters_present_flag || this.vcl_hrd_parameters_present_flag) {
                    this.low_delay_hrd_flag = qb.deqBits(1);
                }
                this.pic_struct_present_flag = qb.deqBits(1);
                this.bitstream_restriction_flag = qb.deqBits(1);
                if (this.bitstream_restriction_flag) {
                    this.motion_vectors_over_pic_boundaries_flag = qb.deqBits(1);
                    this.max_bytes_per_pic_denom = qb.deqUe();
                    this.max_bits_per_mb_denom = qb.deqUe();
                    this.log2_max_mv_length_horizontal = qb.deqUe();
                    this.log2_max_mv_length_vertical = qb.deqUe();
                    this.num_reorder_frames = qb.deqUe();
                    this.max_dec_frame_buffering = qb.deqUe();
                }
            }

            console.log(this);
        }
    };
    
    function create(buf) {
        var sps = new Sps(buf);
        return sps;
    }
    
    return {
        create: create
    };
});