/**
 * Created by gd on 16/6/22.
 */
define(function() {
    var lumaFracPos = [
        /* G  d  h  n    a  e  i  p    b  f  j   q     c   g   k   r */
        [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];

    // var fillBlock = function(ref, fill, x0, y0, width, height, blockWidth, blockHeight, fillScanLength) {
    //
    //     /* Variables */
    //
    //     var xstop, ystop;
    //     void (*fp)(u8*, u8*, i32, i32, i32);
    //     i32 left, x, right;
    //     i32 top, y, bottom;
    //
    //     xstop = x0 + (i32)blockWidth;
    //     ystop = y0 + (i32)blockHeight;
    //
    //     /* Choose correct function whether overfilling on left-edge or right-edge
    //      * is needed or not */
    //     if (x0 >= 0 && xstop <= (i32)width)
    //     fp = FillRow1;
    // else
    //     fp = h264bsdFillRow7;
    //
    //     if (ystop < 0)
    //         y0 = -(i32)blockHeight;
    //
    //     if (xstop < 0)
    //         x0 = -(i32)blockWidth;
    //
    //     if (y0 > (i32)height)
    //     y0 = (i32)height;
    //
    //     if (x0 > (i32)width)
    //     x0 = (i32)width;
    //
    //     xstop = x0 + (i32)blockWidth;
    //     ystop = y0 + (i32)blockHeight;
    //
    //     if (x0 > 0)
    //         ref += x0;
    //
    //     if (y0 > 0)
    //         ref += y0 * (i32)width;
    //
    //     left = x0 < 0 ? -x0 : 0;
    //     right = xstop > (i32)width ? xstop - (i32)width : 0;
    //     x = (i32)blockWidth - left - right;
    //
    //     top = y0 < 0 ? -y0 : 0;
    //     bottom = ystop > (i32)height ? ystop - (i32)height : 0;
    //     y = (i32)blockHeight - top - bottom;
    //
    //     /* Top-overfilling */
    //     for ( ; top; top-- )
    //     {
    //         (*fp)(ref, fill, left, x, right);
    //         fill += fillScanLength;
    //     }
    //
    //     /* Lines inside reference image */
    //     for ( ; y; y-- )
    //     {
    //         (*fp)(ref, fill, left, x, right);
    //         ref += width;
    //         fill += fillScanLength;
    //     }
    //
    //     ref -= width;
    //
    //     /* Bottom-overfilling */
    //     for ( ; bottom; bottom-- )
    //     {
    //         (*fp)(ref, fill, left, x, right);
    //         fill += fillScanLength;
    //     }
    // }
    //
    // var predictSamples = function(data, mv, refPic, xA, yA, partX, partY, partWidth, partHeight) {
    //     var xFrac, yFrac, width, height;
    //     var xInt, yInt;
    //     var lumaPartData;
    //
    //     /* luma */
    //     lumaPartData = data[16 * partY + partX];
    //
    //     xFrac = mv.hor & 0x3;
    //     yFrac = mv.ver & 0x3;
    //
    //     width = 16 * refPic.width;
    //     height = 16 * refPic.height;
    //
    //     xInt = xA + partX + (mv.hor >> 2);
    //     yInt = yA + partY + (mv.ver >> 2);
    //
    //
    //     switch (lumaFracPos[xFrac][yFrac]) {
    //         case 0: /* G */
    //             h264bsdFillBlock(refPic.data, lumaPartData,
    //                 xInt, yInt, width, height, partWidth, partHeight, 16);
    //             break;
    //         case 1: /* d */
    //             h264bsdInterpolateVerQuarter(refPic.data, lumaPartData,
    //                 xInt, yInt - 2, width, height, partWidth, partHeight, 0);
    //             break;
    //         case 2: /* h */
    //             h264bsdInterpolateVerHalf(refPic.data, lumaPartData,
    //                 xInt, yInt - 2, width, height, partWidth, partHeight);
    //             break;
    //         case 3: /* n */
    //             h264bsdInterpolateVerQuarter(refPic.data, lumaPartData,
    //                 xInt, yInt - 2, width, height, partWidth, partHeight, 1);
    //             break;
    //         case 4: /* a */
    //             h264bsdInterpolateHorQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt, width, height, partWidth, partHeight, 0);
    //             break;
    //         case 5: /* e */
    //             h264bsdInterpolateHorVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 0);
    //             break;
    //         case 6: /* i */
    //             h264bsdInterpolateMidHorQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 0);
    //             break;
    //         case 7: /* p */
    //             h264bsdInterpolateHorVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 2);
    //             break;
    //         case 8: /* b */
    //             h264bsdInterpolateHorHalf(refPic.data, lumaPartData,
    //                 xInt - 2, yInt, width, height, partWidth, partHeight);
    //             break;
    //         case 9: /* f */
    //             h264bsdInterpolateMidVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 0);
    //             break;
    //         case 10: /* j */
    //             h264bsdInterpolateMidHalf(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight);
    //             break;
    //         case 11: /* q */
    //             h264bsdInterpolateMidVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 1);
    //             break;
    //         case 12: /* c */
    //             h264bsdInterpolateHorQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt, width, height, partWidth, partHeight, 1);
    //             break;
    //         case 13: /* g */
    //             h264bsdInterpolateHorVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 1);
    //             break;
    //         case 14: /* k */
    //             h264bsdInterpolateMidHorQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 1);
    //             break;
    //         default: /* case 15, r */
    //             h264bsdInterpolateHorVerQuarter(refPic.data, lumaPartData,
    //                 xInt - 2, yInt - 2, width, height, partWidth, partHeight, 3);
    //             break;
    //     }

        /* chroma */
        // PredictChroma(
        //     data + 16 * 16 + (partY >> 1) * 8 + (partX >> 1),
        //     xA + partX,
        //     yA + partY,
        //     partWidth,
        //     partHeight,
        //     mv,
        //     refPic);
    //}
});