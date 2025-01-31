/**
 * Dronesmith Cloud
 *
 * Principle Engineer: Geoff Gardner <geoff@dronesmith.io>
 *
 * Copyright (C) 2016 Dronesmith Technologies Inc, all rights reserved.
 * Unauthorized copying of any source code or assets within this project, via
 * any medium is strictly prohibited.
 *
 * Proprietary and confidential.
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-injector');

  grunt.initConfig({

    // Any meta data settings should be included within the package.json, and
    // can be used here.
    pkg: grunt.file.readJSON('package.json'),

    run: {
      options: {
        // Task-specific options go here.
      },
      init: {
        cmd: 'npm',
        args: [
          'start'
        ]
      }
    },

    watch: {
      files: ["app/**/*.less", "theme/**/*.less"],
      tasks: ["less", "wiredep", "injector:styles"]
    },

    // For injecting bower dependencies
    wiredep: {
      task: {

        // Point to the files that should be updated when
        // you run `grunt wiredep`
        src: [
          'index.html'
        ]
      }
    },

    less: {
      development: {
        options: {
          // Specifies directories to scan for @import directives when parsing.
          // Default value is the directory of the source, which is probably what you want.
          paths: [
            "public/bower_components/font-awesome/less/**/*.less",
            "public/theme/**/*.less"
          ],
        },
        files: {
          // compilation.css  :  source.less
          "public/app/app.css": "public/app/app.less"
        }
      }
    },

    injector: {
      options: {

      },
      scripts: {
        options: {
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'index.html': [
            'app/**/*.js'
          ]
        }
      },

      styles: {
        options: {
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          'index.html': [
            'app/**/*.css'
          ]
        }
      },

      prestyle: {
        options: {
          // less is not supported by default, unforunately.
          transform: function(filePath) {
            filePath = filePath.replace('/app/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '//injector:less',
          endtag: '//endinjector'
        },
        files: {
          'app/app.less': [
            'app/**/*.less'
          ]
        }
      }
    }
  });


  grunt.registerTask('default',
    ["injector:prestyle", "less", "wiredep",
    "injector:styles", "injector:scripts", 'watch']);
}
