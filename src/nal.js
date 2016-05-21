/**
 * Created by gd on 16/5/8.
 */
define([
    'de264/queuebuffer',
], function(_queuebuffer) {

    function Nal(buf, decoder) {
        this.buf = buf;
        this.dv = new DataView(buf);
        this.decoder = decoder;
    }

    Nal.prototype = {
        parse: function() {
            var qb = _queuebuffer.create(this.buf);
            this.forbidden_zero_bit = qb.deqBits(1);
            if (this.forbidden_zero_bit) {
                return;
            }
            this.nal_ref_idc = qb.deqBits(2);
            this.nal_unit_type = qb.deqBits(5);

            var rbsp = new ArrayBuffer(this.buf.byteLength);
            var rbsp_dv = new DataView(rbsp);
            var numBytesInRBSP = 0;
            var numBytesInNALunit = this.buf.byteLength;
            for (var i = 0; i < numBytesInNALunit; i++) {
                if ((i >= 2) &&
                    (this.dv.getUint8(i - 2) === 0x00 && this.dv.getUint8(i - 1) === 0x00 && this.dv.getUint8(i) === 0x03)) {
                    i++;
                }
                rbsp_dv.setUint8(numBytesInRBSP++, this.dv.getUint8(i));
            }
            this.rbsp = rbsp.slice(1, numBytesInRBSP);
        },
    };

    function create(buf, decoder) {
        var nal = new Nal(buf, decoder);
        return nal;
    }

    /**
     * extract one nalu from ringbuffer
     * @Ringbuffer buf
     */
    function extract(rbuf) {
        // while (rbuf.deqUint16() === 0x0000 && rbuf)
        // /* remove data before 0x000000 or 0x000001 */
        // var buf = new ArrayBuffer(4);
        // while (rbuf.deq(buf, 4, true)) {
        //
        // }
        // /* byte stream format if starts with 0x000001 or 0x000000 */
        // if (buf.byteLength >= 4 && arr[0] === 0x00 && arr[1] === 0x00 && arr[2]&0xFE === 0x00) {
        //
        // }
    }

    return {
        create: create
    };
});