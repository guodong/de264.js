/**
 * Created by gd on 16/5/8.
 */
define(['de264/nal', 'de264/ringbuffer'], function(_nal, _ringbuffer) {
    function Decoder() {
        this.initialized = false;
        this.buffer = _ringbuffer.create(1024*1024*8); // 8M buffer

        this.sps = null;
        this.pps = null;
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
            if (nal.nal_unit_type === 7) { /* sps */
                this.sps = nal.sps;
            } else if (nal.nal_unit_type === 8) { /* pps */
                this.pps = nal.pps;
            }
            return nal;
        },
        pushData: function(buf) {
            this.buffer.enq(buf);
            this.decode();
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