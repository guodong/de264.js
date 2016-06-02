/**
 * Created by gd on 16/6/1.
 */
define(function() {
    function min(a, b) {
        return (a < b) ? a : b;
    }
    
    function max(a, b) {
        return (a < b) ? b : a;
    }

    var matrix = {
        multiply: function(m1, m2) {
            var result = [];
            for (var i = 0; i < m1.length; i++) {
                result[i] = [];
                for (var j = 0; j < m2[0].length; j++) {
                    var sum = 0;
                    for (var k = 0; k < m1[0].length; k++) {
                        sum += m1[i][k] * m2[k][j];
                    }
                    result[i][j] = sum;
                }
            }
            return result;
        }
    };

    
    return {
        min: min,
        max: max,
        matrix: matrix
    };
});