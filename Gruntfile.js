module.exports = function(grunt) {
    
    grunt.initConfig({
        concat: {
            js: {
                src: ['scripts/*.js', 'scripts/**/*.js'],
              dest: 'build/scripts/game.js',
            },
          },
        watch: {
            scripts: {
                files: ['scripts/**/*.js'],
                tasks: ['concat', 'copy'],
            },
        },
        uglify: {
            my_target: {
                options: {
                    mangle: true
                },
                files: {
                    'build/scripts/game.min.js': ['build/scripts/game.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    // includes files within path 
                    {expand: true, src: ['build/scripts/game.js'], dest: 'C:/wamp/www/TD', filter: 'isFile'},
                    {expand: true, src: ['index.html'], dest: 'C:/wamp/www/TD', filter: 'isFile'},
                    {expand: true, src: ['styles.css'], dest: 'C:/wamp/www/TD', filter: 'isFile'},
                    {expand: true, src: ['images/*'], dest: 'C:/wamp/www/TD', filter: 'isFile'},
                    {expand: true, src: ['audio/*'], dest: 'C:/wamp/www/TD', filter: 'isFile'},
                ],
            },
        },
        
        complexity: {
            generic: {
                src: ['scripts/**/*.js'],
                exclude: [],
                options: {
                    breakOnErrors: false,
                    jsLintXML: 'report.xml',         // create XML JSLint-like report 
                    checkstyleXML: 'checkstyle.xml', // create checkstyle report 
                    pmdXML: 'pmd.xml',               // create pmd report 
                    errorsOnly: false,               // show only maintainability errors 
                    cyclomatic: [3, 7, 12],          // or optionally a single value, like 3 
                    halstead: [8, 13, 20],           // or optionally a single value, like 8 
                    maintainability: 100,
                    hideComplexFunctions: false,     // only display maintainability 
                    broadcast: false                 // broadcast data over event-bus 
                }
            }
        }
    });
    
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-complexity');
    
};