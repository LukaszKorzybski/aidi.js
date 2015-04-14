module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			src: ['src/*.js', 'test/**/*.js']
		},
		karma: {
			options: {
				frameworks: ['jasmine'],
				files: ['src/*.js', 'test/specs/*.js'],
				browsers: ['Chrome']
			},
			unit: {
				options: {
					autoWatch: true,
					singleRun: false
				}
			},
			unit_dist: {
				options: {
					autoWatch: false,
					singleRun: true
				}
			}
		},
		uglify: {
			aidi: {
				options: {					
					sourceMap: true
				},
				files: {
					'dist/aidi.min.js': ['src/aidi.js']
				}
			}	
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('analyze', ['jshint']);
	grunt.registerTask('test', ['karma:unit_dist']);
	grunt.registerTask('test-dev', ['karma:unit']);	
	grunt.registerTask('dist', ['analyze', 'test', 'uglify:aidi']);
};

