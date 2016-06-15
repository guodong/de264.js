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

    var debug = {
        info: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c Info:', 'color: blue; font-weight: bold; font-style: italic');
            console.log.apply(console, args);
        },
        error: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c Error:', 'color: red; font-weight: bold; font-style: italic');
            console.log.apply(console, args);
        },
        warning: function() {
            var args = [].slice.call(arguments);
            args.unshift('%c Warning:', 'color: #FF6600; font-weight: bold; font-style: italic');
            console.log.apply(console, args);
        },

    };
    
    return {
        min: min,
        max: max,
        matrix: matrix,
        debug: debug
    };
});