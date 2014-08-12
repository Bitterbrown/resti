module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      dev: {
        files: ["src/*.js"],
        tasks: ["concat", "jasmine:pivotal", "uglify"]
      },
      jasmine: {
        files: ["specs/*.js"],
        tasks: ["jasmine:pivotal"]
      }
    },

    concat: {
      dist: {
        src: ['src/bitter.js','src/bitter.events.js', 'src/bitter.models.js','src/bitter.collections.js'],
        dest: 'dist/resti.js'
      }
    },

    uglify: {
      dev: {
        files: {
          'dist/resti.min.js': ['dist/resti.js']
        }
      }
    },

    jshint: {
      all: ["src/*.js", "specs/*.js"],
      options: {
        strict: false
      }
    },

    jasmine: {
      pivotal: {
        src: "dist/resti.js",
        options: {
          specs: 'specs/*.js',
          summary: true,
          version: '1.3.1',
          display: 'full',
          vendor: ["dependencies/*.js", "specs/libs/jquery-1.9.1.min.js", "specs/libs/prolific.min.js"],
          keepRunner: true
        }
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jasmine");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("dev", [ "watch" ]);
  grunt.registerTask("deploy", [ "jshint", "jslint" ]);
  grunt.registerTask("specs", [ "jasmine:pivotal" ]);
};