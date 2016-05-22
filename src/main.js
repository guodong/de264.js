/**
 * Created by gd on 16/5/8.
 */
define([
    'de264/nal',
    'de264/ringbuffer',
    'de264/sps',
    'de264/pps',
    'de264/slice'
], function(_nal, _ringbuffer, _sps, _pps, _slice) {
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
                case 7: /* sps */
                    var sps = _sps.create(nal.rbsp);
                    sps.parse();
                    this.sps = sps;
                    this.spses[sps.seq_parameter_set_id] = sps;
                    this.mbs = new Array((sps.pic_width_in_mbs_minus1 + 1) * (sps.pic_height_in_map_units_minus1 + 1));
                    this.initMbNeighbours();
                    break;
                case 8: /* pps */
                    var pps = _pps.create(nal.rbsp);
                    pps.parse();
                    this.pps = pps;
                    this.ppses[pps.pic_parameter_set_id] = pps;
                    break;
                case 5: /* Coded slice of an IDR picture */
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
        pushData: function(buf) {
            this.buffer.enq(buf);
            this.decode();
        },
        initMbNeighbours: function() {
            var row = 0,
                col = 0,
                picWidth = this.sps.pic_width_in_mbs_minus1 + 1,
                picSizeInMbs = (this.sps.pic_width_in_mbs_minus1 + 1) * (this.sps.pic_height_in_map_units_minus1 + 1);

            for (var i = 0; i < picSizeInMbs; i++) {
                this.mbs[i] = {};
                if (col) {
                    this.mbs[i].mbA = this.mbs[i - 1];
                } else {
                    this.mbs[i].mbA = null;
                }

                if (row) {
                    this.mbs[i].mbB = this.mbs[i - picWidth];
                } else {
                    this.mbs[i].mbB = null;
                }

                col++;
                if (col === picWidth) {
                    col = 0;
                    row++;
                }
            }

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