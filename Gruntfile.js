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
					autoWatch: false,
					background: true
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
		},
		watch: {
			karma: {
				files: ['src/*.js', 'test/specs/*.js'],
				tasks: ['karma:unit:run']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-notify');	

	grunt.registerTask('analyze', ['jshint']);
	grunt.registerTask('test', ['karma:unit_dist']);
	grunt.registerTask('test-dev', ['karma:unit', 'watch']);
	grunt.registerTask('build', ['analyze', 'test', 'uglify:aidi']);
};

