/**
 * Created by gd on 16/5/9.
 */
define(function() {
    
    function Queuebuffer(buf) {
        this.buf = buf;
        this.dv = new DataView(this.buf);
        this.bitindex = 0;
    }

    Queuebuffer.prototype = {
        deqBits: function(numBits) {
            var bytepos = this.bitindex >> 3;
            var distToTail = (8 - (this.bitindex + numBits) % 8) % 8;
            var distToBegin = this.bitindex % 8;

            var out = 0;
            var needBytes = Math.floor((this.bitindex + numBits - 1) / 8) - Math.floor(this.bitindex / 8) + 1;
            var bytes = new Array(needBytes);
            for (var i = 0; i < needBytes; i++) { console.log(this.buf.byteLength, this.bitindex);
                bytes[i] = this.dv.getUint8(bytepos + i);
            }
            
            /* cut first byte */
            bytes[0] &= (0xFF >> distToBegin);
            
            for (var i = 0; i < needBytes; i++) {
                out |= bytes[i]  << ((needBytes - i - 1) << 3) >> distToTail;
            }
            this.bitindex += numBits;

            return out;
        },
        getBits: function(numBits) {
            var out = this.deqBits(numBits);
            this.bitindex -= numBits;
            return out;
        },
        deqUe: function() {
            var leadingZeroBits = -1;
            for (var i = 0; !i; leadingZeroBits++) {
                i = this.deqBits(1);
            }

            var out = (1 << leadingZeroBits) - 1 + this.deqBits(leadingZeroBits);
            return out;
        },
        deqSe: function() {
            var val = this.deqUe();
            if (val === 0) { /* if not check 0, this function will return -0 */
                return 0;
            }
            var out = (val & 0x01) ? ((val + 1) >> 1) : -((val + 1) >> 1);
            return out;
        },
        deqTe: function(greaterThanOne) {
            var gto = greaterThanOne || true;
            if (gto) {
                return this.deqUe();
            } else {
                var val = this.getBits(1);
                return val ^= 0x1;
            }
        },
        isAligned: function() {
            return this.bitindex % 8 === 0;
        },
        more_rbsp_data: function() {
            var bits = this.buf.byteLength * 8 - this.bitindex;
            if (bits === 0) {
                return false;
            }
            if ((bits > 8) || (this.getBits(bits) >> (32 - bits)) != (1 << (bits - 1))) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    function create(buf) {
        var qb = new Queuebuffer(buf);
        return qb;
    }
    
    return {
        create: create
    };
});