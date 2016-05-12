/**
 * Created by gd on 16/5/9.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['Gruntfile.js', 'src/**/*.js']
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    paths: {
                        de264: './'
                    },
                    include: ['main'],
                    name: '../bower_components/almond/almond',
                    out: 'build/de264.min.js',
                    wrap: {
                        startFile: 'src/begin.frag',
                        endFile: 'src/end.frag'
                    }
                }
            }
        },
        watch: {
            src: {
                files: ['src/**'],
                tasks: ['jshint', 'requirejs']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8917
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'requirejs']);
    grunt.registerTask('test', ['connect', 'watch']);

};