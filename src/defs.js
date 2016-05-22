/**
 * Created by gd on 16/5/12.
 */
define(function() {

    var MB_A = 0, MB_B = 1, MB_C = 2, MB_D = 3, MB_CURR = 4, MB_NA = 0xFF;

    //noinspection JSAnnotator
    return {
        P_SLICE: 0,
        I_SLICE: 2,
        
        PRED_MODE_INTRA4x4: 0,
        PRED_MODE_INTRA16x16: 1,
        PRED_MODE_INTER: 2,
        
        P_L0_16x16: 0,
        P_L0_L0_16x8: 1,
        P_L0_L0_8x16: 2,
        P_8x8: 3,
        P_8x8ref0: 4,
        P_Skip: 5,

        /* Name of mb_type */
        I_4x4: 0,
        I_16x16_0_0_0: 1,
        I_PCM: 25,

        B_Direct_8x8: 0,

        /* neighbourMb */
        MB_A: MB_A,
        MB_B: MB_B,
        MB_C: MB_C,
        MB_D: MB_D,
        MB_CURR: MB_CURR,
        MB_NA: MB_NA,
        
        

        /* neighbour maps */
        NA_MAP: [
            [MB_A, 5], [MB_CURR, 0], [MB_A, 7], [MB_CURR, 2],
            [MB_CURR, 1], [MB_CURR, 4], [MB_CURR, 3], [MB_CURR, 6],
            [MB_A, 13], [MB_CURR, 8], [MB_A, 15], [MB_CURR, 10],
            [MB_CURR, 9], [MB_CURR, 12], [MB_CURR, 11], [MB_CURR, 14],
            [MB_A, 17], [MB_CURR, 16], [MB_A, 19], [MB_CURR, 18],
            [MB_A, 21], [MB_CURR, 20], [MB_A, 23], [MB_CURR, 22]
        ],
        NB_MAP: [
            [MB_B,10],   [MB_B,11],   [MB_CURR,0], [MB_CURR,1],
            [MB_B,14],   [MB_B,15],   [MB_CURR,4], [MB_CURR,5],
            [MB_CURR,2], [MB_CURR,3], [MB_CURR,8], [MB_CURR,9],
            [MB_CURR,6], [MB_CURR,7], [MB_CURR,12],[MB_CURR,13],
            [MB_B,18],   [MB_B,19],   [MB_CURR,16],[MB_CURR,17],
            [MB_B,22],   [MB_B,23],   [MB_CURR,20],[MB_CURR,21]
        ]
    };
});