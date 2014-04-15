// Generated on 2014-03-24 using generator-angular-fullstack 1.3.2
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    directory: {
      // configurable paths
      dist: 'dist',
      coverage: 'coverage',
      src: 'src',
      test: 'test'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: '<%= directory.src %>/server.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= directory.dist %>/server.js',
          node_env: 'production'
        }
      }
    },
    watch: {
      jsServer: {
        files: ['<%= directory.src %>/{,*/}*.js'],
        tasks: ['mochaTest'],
        //        options: {
        //          livereload: true
        //        }
      },
      mochaTest: {
        files: ['<%= directory.test %>/{,*/}*.js'],
        tasks: ['mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: [
          '<%= directory.src %>/**/*.{js,json}'
        ],
        tasks: ['newer:jshint:server', 'express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: '<%= directory.src %>/.jshintrc'
        },
        src: ['<%= directory.src %>/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= directory.dist %>/*',
            '!<%= directory.dist %>/.git*',
            '!<%= directory.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp',
      coverage: {
        src: ['<%= directory.coverage %>/']
      },
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: '<%= directory.src %>/server.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dest: '<%= directory.dist %>',
          src: [
            '<%= directory.src %>/**/*'
          ]
        }]
      },
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['<%= directory.test %>/**/*.js']
    },

    // start - code coverage settings

    instrument: {
      files: ['<%= directory.src %>/**/*.js'],
      options: {
        lazy: true,
        basePath: '<%= directory.coverage %>/instrument/'
      }
    },

    storeCoverage: {
      options: {
        dir: '<%= directory.coverage %>/reports'
      }
    },

    makeReport: {
      src: '<%= directory.coverage %>/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: '<%= directory.coverage %>/reports',
        print: 'detail'
      }
    },

    coveralls: {
      options: {
        force: true
      },
      server: {
        src: '<%= directory.coverage %>/reports/lcov.info'
      },
    },

    // end - code coverage settings
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../<%= directory.coverage %>/instrument/'
      },
      test: {
        NODE_ENV: 'test'
      }
    },
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'express-keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'express:dev',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('coverage', [
    'clean:coverage',
    'env:coverage',
    'instrument',
    'mochaTest',
    'storeCoverage',
    'makeReport',
    'coveralls'
  ]);

  grunt.registerTask('test', [
      'env:test',
      'coverage',
      'clean:server',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'express:dev',
    'clean:dist',
    'copy:dist'
  ]);
};