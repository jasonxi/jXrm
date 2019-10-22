module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      requirejs: {
        build: {
          options: {
            baseUrl: 'src/scripts',
            out: 'src/<%= pkg.name %>.js',
            name: 'main',
            optimize: 'none',
            mainConfigFile: 'config/main.js',
            useStrict: true,
            wrap: false,
            onModuleBundleComplete: function (data) {
                var fs = require('fs'),
                  amdclean = require('amdclean'),
                  outputFile = data.path;
     
                fs.writeFileSync(outputFile, amdclean.clean({
                  'filePath': outputFile
                }));
              }
          }
        }
      },
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>.min.js'
        }
      },
      clean: {
          start: [
              'build/*'
          ]
      },
      // mocha: {
      //   all: {
      //     src: ['test/*.test.ts'],
      //   },
      //   options: {
      //     run: true
      //   }
      // }
  
    });
  
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
//    grunt.loadNpmTasks('grunt-mocha');

    // Default task(s).
    grunt.registerTask('default', [
      'clean:start',
      'requirejs:build',
//      'mocha',
      'uglify'
    ]);
  
  };