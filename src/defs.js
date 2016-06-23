/**
 * Created by gd on 16/5/12.
 */
define(function() {

    var MB_A = 0, MB_B = 1, MB_C = 2, MB_D = 3, MB_CURR = 4, MB_NA = 0xFF;

    //noinspection JSAnnotator
    return {
        NA: -1,

        /* nal types */
        NAL_SLICE: 1,
        NAL_SLICE_IDR: 5,
        NAL_SPS: 7,
        NAL_PPS: 8,

        /* slice types */
        P_SLICE: 0,
        I_SLICE: 2,

        /* macroblock types */
        I_MB: 0,
        P_MB: 1,

        /* MbPartPredMode */
        Intra_4x4: 0,
        Intra_16x16: 1,
        Pred_L0: 2,
        Pred_Na: 3,

        PRED_MODE_INTRA4x4: 0,
        PRED_MODE_INTRA16x16: 1,
        PRED_MODE_INTER: 2,

        /* mb_type names of P mb */
        P_Skip: -1,
        P_L0_16x16: 0,
        P_L0_L0_16x8: 1,
        P_L0_L0_8x16: 2,
        P_8x8: 3,
        P_8x8ref0: 4,

        P_L0_8x8: 0,
        P_L0_8x4: 1,
        P_L0_4x8: 2,
        P_L0_4x4: 3,

        /* mb_type names of I mb */
        I_4x4: 0,
        I_16x16_0_0_0: 1,
        I_PCM: 25,

        /* neighbourMb */
        MB_A: MB_A,
        MB_B: MB_B,
        MB_C: MB_C,
        MB_D: MB_D,
        MB_CURR: MB_CURR,
        MB_NA: MB_NA,


        /* neighbour maps
         * Following four tables indicate neighbours of each block of a macroblock.
         * First 16 values are for luma blocks, next 4 values for Cb and last 4
         * values for Cr. Elements of the table indicate to which macroblock the
         * neighbour block belongs and the index of the neighbour block in question.
         * Indexing of the blocks goes as follows
         *
         *          Y             Cb       Cr
         *      0  1  4  5      16 17    20 21
         *      2  3  6  7      18 19    22 23
         *      8  9 12 13
         *     10 11 14 15
         */
        NA_MAP: [
            [MB_A, 5], [MB_CURR, 0], [MB_A, 7], [MB_CURR, 2],
            [MB_CURR, 1], [MB_CURR, 4], [MB_CURR, 3], [MB_CURR, 6],
            [MB_A, 13], [MB_CURR, 8], [MB_A, 15], [MB_CURR, 10],
            [MB_CURR, 9], [MB_CURR, 12], [MB_CURR, 11], [MB_CURR, 14],
            [MB_A, 17], [MB_CURR, 16], [MB_A, 19], [MB_CURR, 18],
            [MB_A, 21], [MB_CURR, 20], [MB_A, 23], [MB_CURR, 22]
        ],
        NB_MAP: [
            [MB_B, 10], [MB_B, 11], [MB_CURR, 0], [MB_CURR, 1],
            [MB_B, 14], [MB_B, 15], [MB_CURR, 4], [MB_CURR, 5],
            [MB_CURR, 2], [MB_CURR, 3], [MB_CURR, 8], [MB_CURR, 9],
            [MB_CURR, 6], [MB_CURR, 7], [MB_CURR, 12], [MB_CURR, 13],
            [MB_B, 18], [MB_B, 19], [MB_CURR, 16], [MB_CURR, 17],
            [MB_B, 22], [MB_B, 23], [MB_CURR, 20], [MB_CURR, 21]
        ],
        NC_MAP: [
            [MB_B, 11], [MB_B, 14], [MB_CURR, 1], [MB_NA, 4],
            [MB_B, 15], [MB_C, 10], [MB_CURR, 5], [MB_NA, 0],
            [MB_CURR, 3], [MB_CURR, 6], [MB_CURR, 9], [MB_NA, 12],
            [MB_CURR, 7], [MB_NA, 2], [MB_CURR, 13], [MB_NA, 8],
            [MB_B, 19], [MB_C, 18], [MB_CURR, 17], [MB_NA, 16],
            [MB_B, 23], [MB_C, 22], [MB_CURR, 21], [MB_NA, 20]
        ],
        ND_MAP: [
            [MB_D, 15], [MB_B, 10], [MB_A, 5], [MB_CURR, 0],
            [MB_B, 11], [MB_B, 14], [MB_CURR, 1], [MB_CURR, 4],
            [MB_A, 7], [MB_CURR, 2], [MB_A, 13], [MB_CURR, 8],
            [MB_CURR, 3], [MB_CURR, 6], [MB_CURR, 9], [MB_CURR, 12],
            [MB_D, 19], [MB_B, 18], [MB_A, 17], [MB_CURR, 16],
            [MB_D, 23], [MB_B, 22], [MB_A, 21], [MB_CURR, 20]
        ],

        /* Intra4x4PredMode */
        Intra_4x4_Vertical: 0,
        Intra_4x4_Horizontal: 1,
        Intra_4x4_DC: 2,
        Intra_4x4_Diagonal_Down_left: 3,
        Intra_4x4_Diagonal_Down_Right: 4,
        Intra_4x4_Vertical_Right: 5,
        Intra_4x4_Horizontal_Down: 6,
        Intra_4x4_Vertical_Left: 7,
        Intra_4x4_Horizontal_Up: 8,

        /* Intra16x16PredMode */
        Intra_16x16_Vertical: 0,
        Intra_16x16_Horizontal: 1,
        Intra_16x16_DC: 2,
        Intra_16x16_Plane: 3,

        /* array to block map */
        abmap: [
            [0, 0], [0, 1], [1, 0], [1, 1],
            [0, 2], [0, 3], [1, 2], [1, 3],
            [2, 0], [2, 1], [3, 0], [3, 1],
            [2, 2], [2, 3], [3, 2], [3, 3]
        ],

        /* 4x4 block coordinate to 16x16
         *      0  1  4  5  to 0  1  2  3
         *      2  3  6  7     4  5  6  7
         *      8  9 12 13     8  9  10 11
         *     10 11 14 15     12 13 14 15
         */
        map4x4to16x16: [0, 1, 4, 5, 2, 3, 6, 7, 8, 9, 12, 13, 10, 11, 14, 15],

        /* image status in dpb */
        UNUSED: 0,
        NON_EXIST: 1,
        SHORT_TERM: 2,
        LONG_TERM: 3,

        N_A_SUB_PART: [
            [[[MB_A, 5], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 5], [MB_A, 7], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 5], [MB_CURR, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 5], [MB_CURR, 0], [MB_A, 7], [MB_CURR, 2]]],

            [[[MB_CURR, 1], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 1], [MB_CURR, 3], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 1], [MB_CURR, 4], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 1], [MB_CURR, 4], [MB_CURR, 3], [MB_CURR, 6]]],

            [[[MB_A, 13], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 13], [MB_A, 15], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 13], [MB_CURR, 8], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 13], [MB_CURR, 8], [MB_A, 15], [MB_CURR, 10]]],

            [[[MB_CURR, 9], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 9], [MB_CURR, 11], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 9], [MB_CURR, 12], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 9], [MB_CURR, 12], [MB_CURR, 11], [MB_CURR, 14]]]],
        N_B_SUB_PART: [
            [[[MB_B, 10], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 10], [MB_CURR, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 10], [MB_B, 11], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 10], [MB_B, 11], [MB_CURR, 0], [MB_CURR, 1]]],

            [[[MB_B, 14], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 14], [MB_CURR, 4], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 14], [MB_B, 15], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 14], [MB_B, 15], [MB_CURR, 4], [MB_CURR, 5]]],

            [[[MB_CURR, 2], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 2], [MB_CURR, 8], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 2], [MB_CURR, 3], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 2], [MB_CURR, 3], [MB_CURR, 8], [MB_CURR, 9]]],

            [[[MB_CURR, 6], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 6], [MB_CURR, 12], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 6], [MB_CURR, 7], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 6], [MB_CURR, 7], [MB_CURR, 12], [MB_CURR, 13]]]],

        N_C_SUB_PART: [
            [[[MB_B, 14], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 14], [MB_NA, 4], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 11], [MB_B, 14], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 11], [MB_B, 14], [MB_CURR, 1], [MB_NA, 4]]],

            [[[MB_C, 10], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_C, 10], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 15], [MB_C, 10], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 15], [MB_C, 10], [MB_CURR, 5], [MB_NA, 0]]],

            [[[MB_CURR, 6], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 6], [MB_NA, 12], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 3], [MB_CURR, 6], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 3], [MB_CURR, 6], [MB_CURR, 9], [MB_NA, 12]]],

            [[[MB_NA, 2], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_NA, 2], [MB_NA, 8], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 7], [MB_NA, 2], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 7], [MB_NA, 2], [MB_CURR, 13], [MB_NA, 8]]]],

        N_D_SUB_PART: [
            [[[MB_D, 15], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_D, 15], [MB_A, 5], [MB_NA, 0], [MB_NA, 0]],
                [[MB_D, 15], [MB_B, 10], [MB_NA, 0], [MB_NA, 0]],
                [[MB_D, 15], [MB_B, 10], [MB_A, 5], [MB_CURR, 0]]],

            [[[MB_B, 11], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 11], [MB_CURR, 1], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 11], [MB_B, 14], [MB_NA, 0], [MB_NA, 0]],
                [[MB_B, 11], [MB_B, 14], [MB_CURR, 1], [MB_CURR, 4]]],

            [[[MB_A, 7], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 7], [MB_A, 13], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 7], [MB_CURR, 2], [MB_NA, 0], [MB_NA, 0]],
                [[MB_A, 7], [MB_CURR, 2], [MB_A, 13], [MB_CURR, 8]]],

            [[[MB_CURR, 3], [MB_NA, 0], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 3], [MB_CURR, 9], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 3], [MB_CURR, 6], [MB_NA, 0], [MB_NA, 0]],
                [[MB_CURR, 3], [MB_CURR, 6], [MB_CURR, 9], [MB_CURR, 12]]]]


    };
});