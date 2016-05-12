/**
 * Created by gd on 16/5/10.
 */
define([
    'de264/queuebuffer'
], function(_queuebuffer) {
    function Slice_header(buf) {
        this.buf = buf;
        this.dv = new DataView(this.buf);
    }

    Slice_header.prototype = {
        parse: function() {
            var qb = _queuebuffer.create(this.buf);
        }
    };

    function create(buf) {
        var slice_header = new Slice_header(buf);
        return slice_header;
    }

    return {
        create: create
    };
});