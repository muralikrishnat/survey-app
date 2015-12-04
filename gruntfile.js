module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.loadNpmTasks('grunt-ng-annotate');


    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 5635,
                    base: 'public'
                }
            },
            dev: {
                options: {
                    port: 5634,
                    base: 'app'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: "public/css",
                    src: ['*.css', '!*.min.css'],
                    dest: 'public/css',
                    ext: '.min.css'
                }]
            }
        },
        concat: {
            css: {
                src: ['app/css/*.css'],
                dest: 'public/css/app.css'
            },
            vendorjs: {
                src: [
                    'app/js/vendor/jquery.js',
                    'app/js/vendor/bootstrap.js',
                    'app/js/vendor/vendor.js'
                ],
                dest: 'public/js/vendor.js'
            },
            appjs: {
                src: ['app/js/*.js'],
                dest: 'public/js/app.js'
            }
        },
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/images',
                        src: '**',
                        dest: 'public/images'
                    }
                ]
            },
            all: {
                files: [
                    {
                        expand: true,
                        cwd: 'app',
                        src: '**',
                        dest: 'public'
                    }
                ]
            },
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/css',
                        src: '**',
                        dest: 'public/css'
                    }
                ]
            },
            pages: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/pages',
                        src: '**',
                        dest: 'public/pages'
                    }
                ]
            }
        },
        ngtemplates: {
            app: {
                cwd: 'app',
                src: 'pages/**.html',
                dest: 'public/js/sampleApp.templates.js'
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            all: {
                files: {
                    'app/js/vendor/vendor.js': [
                        'app/js/vendor/angular.js',
                        'app/js/vendor/angular.route.js',
                        'app/js/vendor/angular.resource.js'
                    ]
                }
            }
        }
    });


    //grunt.registerTask('default', ['ngAnnotate:all','concat:vendorjs','concat:appjs', 'copy:css','copy:images'])
    grunt.registerTask('default', ['copy:all'])
};
