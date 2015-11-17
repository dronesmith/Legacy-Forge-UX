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
      files: ["app/**/*.less", "bower_components/bootstrap/less/**/*.less"],
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
            "bower_components/font-awesome/less/**/*.less",
            "bower_components/bootstrap/less/**/*.less",
            "app/**/*.less"
          ],
        },
        files: {
          // compilation.css  :  source.less
          "app/app.css": "app/app.less"
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
