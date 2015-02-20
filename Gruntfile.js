module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			src: ['src/*.js', 'test/**/*.js']
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

	grunt.registerTask('analyze', ['jshint']);
	grunt.registerTask('dist', ['analyze', 'uglify:aidi']);
};

