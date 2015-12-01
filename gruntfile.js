module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 5634,
                    base: 'public'
                }
            },
            dev: {
                options: {
                    port: 5634,
                    base: 'app'
                }
            }
        }
    });
};
