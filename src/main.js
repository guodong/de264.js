/**
 * Created by gd on 16/5/8.
 */
define([
    'de264/nal',
    'de264/ringbuffer',
    'de264/sps',
    'de264/pps',
    'de264/slice',
    'de264/defs',
    'de264/macroblock_layer'
], function(_nal, _ringbuffer, _sps, _pps, _slice, _defs, _macroblock_layer) {



    function Decoder() {
        this.buffer = _ringbuffer.create(1024*1024*8); // 8M buffer

        this.sps = null;
        this.pps = null;

        this.spses = [];
        this.ppses = [];

        this.mbs = [];
    }

    Decoder.prototype = {
        /**
         * decode nal
         * @param nal ArrayBuffer
         */
        decode: function() {
            var nal = _nal.extract(this.buffer);
            // var nal = _nal.extract(buf);
            // if (!this.initialized) {
            //     var dv = new DataView(buf);
            //     if (dv.getUint32(0) !== 1) {
            //         return;
            //     }
            //
            //     var nal = _nal.create(buf.slice(4));
            // }
        },
        decodeNal: function(buf) {
            var dv = new DataView(buf);
            var nal_buf;
            if (dv.getUint32(0) === 0x00000001) {
                nal_buf = buf.slice(4);
            } else if ((dv.getUint32(0) & 0xFFFFFF00) === 0x00000100) {
                nal_buf = buf.slice(3);
            } else {
                return;
            }
            var nal = _nal.create(nal_buf, this);
            nal.parse();
            switch (nal.nal_unit_type) {
                case _defs.NAL_SPS: /* sps */
                    var sps = _sps.create(nal.rbsp);
                    sps.parse();
                    this.sps = sps;
                    this.spses[sps.seq_parameter_set_id] = sps;
                    this.initMbs();
                    break;
                case _defs.NAL_PPS: /* pps */
                    var pps = _pps.create(nal.rbsp);
                    pps.parse();
                    this.pps = pps;
                    this.ppses[pps.pic_parameter_set_id] = pps;
                    break;
                case _defs.NAL_SLICE: /* Coded slice of an IDR picture */
                case _defs.NAL_SLICE_IDR:
                    if (!this.sps || !this.pps) { /* no active pps/sps */
                        break;
                    }
                    var slice = _slice.create(nal.rbsp, this);
                    slice.nal = nal;
                    slice.parse();
                    console.log(slice);
                    break;
                default:
                    break;
            }
            return nal;
        },
        initMbs: function() {
            this.mbs = [];
            var pw = this.sps.pic_width_in_mbs_minus1 + 1;
            var ph = this.sps.pic_height_in_map_units_minus1 + 1;

            /* allocate mbs memory */
            for (var i = 0; i < pw * ph; i++) {
                for (var j = 0; j < pw; j++) {
                    this.mbs[i] = _macroblock_layer.create({
                        decoder: this,
                        mbaddr: i
                    });
                }
            }

            /* init mb neighbours */
            for (var i = 0; i < ph; i++) {
                for (var j = 0; j < pw; j++) {
                    var mbaddr = i * pw + j;
                    var mb = this.mbs[mbaddr];

                    if (j > 0) {
                        mb.mbA = this.mbs[mbaddr - 1];
                    } else {
                        mb.mbA = null;
                    }

                    if (i > 0) {
                        mb.mbB = this.mbs[mbaddr - pw];
                    } else {
                        mb.mbB = null;
                    }

                    if (i && (j < pw - 1)) {
                        mb.mbC = this.mbs[mbaddr - pw + 1];
                    } else {
                        mb.mbC = null;
                    }

                    if (i > 0 && j > 0) {
                        mb.mbD = this.mbs[mbaddr - pw - 1];
                    } else {
                        this.mbD = null;
                    }
                }
            }
        },
        pushData: function(buf) {
            this.buffer.enq(buf);
            this.decode();
        },
        activateParamSets: function(pps) {
            
        }

    };

    function create() {
        var decoder = new Decoder();
        return decoder;
    }

    return {
        create: create
    };
});