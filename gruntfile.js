'use strict';

module.exports = function (grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/**/*.js', 'modules/**/*.js', 'config/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/mocha/**/*.js', 'test/karma/**/*.js', 'app/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },
        copy: {
            options: {
                punctuation: ''
            },
            js: {
                files: [
                    {cwd: 'bower_components/jquery', src: ['dist/*.js'], dest: 'public/lib/jquery', expand: true},
                    {cwd: 'bower_components/jquery-ui', src: ['*.js'], dest: 'public/lib/jquery-ui', expand: true},
                    {
                        cwd: 'bower_components/jquery.easing', src: ['js/*.js'], dest: 'public/lib/jquery.easing',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/jquery.easy-pie-chart', src: ['dist/*.js'],
                        dest: 'public/lib/jquery.easy-pie-chart', expand: true
                    },
                    {cwd: 'bower_components/chart.js', src: ['dist/*.js'], dest: 'public/lib/chart.js', expand: true},

                    {
                        cwd: 'bower_components/amcharts-stock', src: ['dist/**/*.js'],
                        dest: 'public/lib/amcharts-stock', expand: true
                    },
                    {cwd: 'bower_components/angular', src: ['*.js'], dest: 'public/lib/angular', expand: true},
                    {
                        cwd: 'bower_components/angular-route', src: ['*.js'],
                        dest: 'public/lib/angular-route', expand: true
                    },
                    {cwd: 'bower_components/slimScroll', src: ['*.js'], dest: 'public/lib/slimScroll', expand: true},
                    {
                        cwd: 'bower_components/angular-slimscroll', src: ['*.js'],
                        dest: 'public/lib/angular-slimscroll', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-smart-table', src: ['dist/*.js'],
                        dest: 'public/lib/angular-smart-table', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-toastr', src: ['dist/*.js', 'dist/*.css'],
                        dest: 'public/lib/angular-toastr', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-touch', src: ['*.js'],
                        dest: 'public/lib/angular-touch', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-ui-sortable', src: ['*.js'],
                        dest: 'public/lib/angular-ui-sortable', expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap', src: ['**/*.js', '**/*.css', '**/*.map'],
                        dest: 'public/lib/bootstrap', expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap-select', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/bootstrap-select', expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap-switch', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/bootstrap-switch', expand: true
                    },
                    {
                        cwd: 'bower_components/bootstrap-tagsinput', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/bootstrap-tagsinput', expand: true
                    },
                    {cwd: 'bower_components/moment', src: ['**/*.js'], dest: 'public/lib/moment', expand: true},
                    {
                        cwd: 'bower_components/fullcalendar', src: ['dist/**/*.js', '**/*.css'],
                        dest: 'public/lib/fullcalendar', expand: true
                    },
                    {
                        cwd: 'bower_components/leaflet', src: ['dist/*.js', '**/*.css'],
                        dest: 'public/lib/leaflet', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-progress-button-styles', src: ['dist/**/*.js', '**/*.css'],
                        dest: 'public/lib/angular-progress-button-styles', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-ui-router', src: ['**/*.js'],
                        dest: 'public/lib/angular-ui-router', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-chart.js', src: ['**/*.js'],
                        dest: 'public/lib/angular-chart.js', expand: true
                    },
                    {
                        cwd: 'bower_components/chartist', src: ['**/*.js', '**/*.css', '**/*.map'],
                        dest: 'public/lib/chartist', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-chartist.js', src: ['**/*.js'],
                        dest: 'public/lib/angular-chartist.js', expand: true
                    },
                    {
                        cwd: 'bower_components/eve-raphael', src: ['**/*.js'],
                        dest: 'public/lib/eve-raphael', expand: true
                    },
                    {cwd: 'bower_components/raphael', src: ['**/*.js'], dest: 'public/lib/raphael', expand: true},
                    {cwd: 'bower_components/mocha', src: ['**/*.js'], dest: 'public/lib/mocha', expand: true},
                    {
                        cwd: 'bower_components/morris.js', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/morris.js', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-morris-chart', src: ['**/*.js'],
                        dest: 'public/lib/angular-morris-chart', expand: true
                    },
                    {
                        cwd: 'bower_components/ionrangeslider', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/ionrangeslider', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-bootstrap', src: ['**/*.js'],
                        dest: 'public/lib/angular-bootstrap', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-animate', src: ['**/*.js'],
                        dest: 'public/lib/angular-animate', expand: true
                    },
                    {cwd: 'bower_components/rangy', src: ['**/*.js'], dest: 'public/lib/rangy', expand: true},
                    {
                        cwd: 'bower_components/textAngular', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/textAngular', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-xeditable', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/angular-xeditable', expand: true
                    },
                    {
                        cwd: 'bower_components/jstree', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/jstree', expand: true
                    },
                    {cwd: 'bower_components/ng-js-tree', src: ['**/*.js'], dest: 'public/lib/ng-js-tree', expand: true},
                    {
                        cwd: 'bower_components/angular-ui-select', src: ['**/*.js', '**/*.css'],
                        dest: 'public/lib/angular-ui-select', expand: true
                    },
                    {
                        cwd: 'bower_components/animate.css', src: ['*.css'],
                        dest: 'public/lib/animate.css', expand: true
                    },
                    {
                        cwd: 'bower_components/amcharts',
                        src: ['dist/amcharts/*.js', 'dist/amcharts/plugins/responsive/*.js', 'dist/amcharts/*.map', 'dist/amcharts/plugins/responsive/*.map'],
                        dest: 'public/lib/amcharts',
                        expand: true
                    },
                    {
                        cwd: 'bower_components/ammap', src: ['dist/ammap/*.js', 'dist/ammap/maps/**/*.js'],
                        dest: 'public/lib/ammap', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-local-storage', src: ['dist/*.min.js', 'dist/*.map'],
                        dest: 'public/lib/angular-local-storage', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-resource', src: ['*.min.js'],
                        dest: 'public/lib/angular-resource', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-spinner/dist/', src: ['*.min.js'],
                        dest: 'public/lib/angular-spinner', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-material/', src: ['*.js', '*.css'],
                        dest: 'public/lib/angular-material', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-aria/', src: ['*.js'],
                        dest: 'public/lib/angular-aria', expand: true
                    },
                    {
                        cwd: 'bower_components/angular-google-maps/dist', src: ['*.js'],
                        dest: 'public/lib/angular-google-maps', expand: true
                    },
                    //{cwd: 'bower_components/', src: ['**/*.css'], dest: 'public/lib/', expand: true},
                    //{cwd: 'bower_components/', src: ['**/*.js'], dest: 'public/lib/', expand: true},


                ]
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            distdesk: {
                src: [
                    // JavaScript Files
                    'public/lib/jquery/dist/jquery.js',
                    'public/lib/jquery-ui/jquery-ui.js',
                    'public/lib/jquery.easing/js/jquery.easing.js',
                    'public/lib/jquery.easy-pie-chart/dist/jquery.easypiechart.js',
                    'public/lib/chart.js/dist/Chart.js',
                    'public/lib/amcharts/dist/amcharts/amcharts.js',
                    'public/lib/amcharts/dist/amcharts/plugins/responsive/responsive.min.js',
                    'public/lib/amcharts/dist/amcharts/serial.js',
                    'public/lib/amcharts/dist/amcharts/funnel.js',
                    'public/lib/amcharts/dist/amcharts/pie.js',
                    'public/lib/amcharts/dist/amcharts/gantt.js',
                    'public/lib/amcharts-stock/dist/amcharts/amstock.js',
                    'public/lib/ammap/dist/ammap/ammap.js',
                    'public/lib/ammap/dist/ammap/maps/js/worldLow.js',
                    'public/js/jquery-datatables/jquery-datatables.js',
                    //Angular Modules
                    'public/lib/angular/angular.js',
                    'public/lib/angular-route/angular-route.js',
                    'public/lib/slimScroll/jquery.slimscroll.js',
                    'public/lib/angular-slimscroll/angular-slimscroll.js',
                    'public/lib/angular-smart-table/dist/smart-table.js',
                    'public/lib/angular-toastr/dist/angular-toastr.tpls.js',
                    'public/lib/angular-touch/angular-touch.js',
                    'public/lib/angular-ui-sortable/sortable.js',
                    'public/lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
                    'public/lib/angular-progress-button-styles/dist/angular-progress-button-styles.min.js',
                    'public/lib/angular-ui-router/release/angular-ui-router.js',
                    'public/lib/angular-chart.js/dist/angular-chart.js',
                    'public/lib/chartist/dist/chartist.min.js',
                    'public/lib/ng-file-upload/ng-file-upload.min.js',
                    'public/lib/ng-file-upload/ng-file-upload-shim.min.js',
                    'public/lib/angular-spinner/angular-spinner.min.js',

                    'public/lib/angular-google-maps-geocoder/angular-google-maps-geocoder.min.js',
                    //'https://maps.googleapis.com/maps/api/js?key=AIzaSyDPuDogpDOdK-WmQv9z9b-fTDSMjnj7KFo&v=3.exp',

                    'public/lib/angular-chartist.js/dist/angular-chartist.js',
                    'public/lib/eve-raphael/eve.js',
                    'public/lib/raphael/raphael.min.js',
                    'public/lib/mocha/mocha.js',
                    'public/lib/morris.js/morris.js',
                    'public/lib/angular-morris-chart/src/angular-morris-chart.min.js',
                    'public/lib/ionrangeslider/js/ion.rangeSlider.js',
                    'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                    'public/lib/angular-animate/angular-animate.js',
                    'public/lib/rangy/rangy-core.js',
                    'public/lib/rangy/rangy-classapplier.js',
                    'public/lib/rangy/rangy-highlighter.js',
                    'public/lib/rangy/rangy-selectionsaverestore.js',
                    'public/lib/rangy/rangy-serializer.js',
                    'public/lib/rangy/rangy-textrange.js',
                    'public/lib/textAngular/dist/textAngular.js',
                    'public/lib/textAngular/dist/textAngular-sanitize.js',
                    'public/lib/textAngular/dist/textAngularSetup.js',
                    'public/lib/angular-xeditable/dist/js/xeditable.js',
                    'public/lib/jstree/dist/jstree.js',
                    'public/lib/ng-js-tree/dist/ngJsTree.js',
                    'public/lib/angular-ui-select/dist/select.js',
                    'public/lib/angular-local-storage/dist/angular-local-storage.min.js',
                    'public/lib/ng-tags-input/ng-tags-input.min.js',
                    'public/js/angular-datatables/angular-datatables.js',
                    //Application InIt
                    'public/app/common/config.js',
                    'public/app/pages/pages.module.js',
                    'public/app/theme/theme.module.js',
                    'public/app/common/apiService.js',
                    'public/app/common/common.services.js',
                    'public/app/common/dataSharing.service.js',
                    //Application Module Files for Navigation
                    'public/app/pages/dashboard/dashboard.module.js',
                    'public/app/pages/dashboard/dashboard.controller.js',
                    'public/app/pages/dashboard/dashboard.services.js',
                    //Application Module Files
                    'public/app/theme/components/components.module.js',
                    'public/app/theme/inputs/inputs.module.js',
                    'public/app/app.js',
                    'public/app/theme/theme.config.js',
                    'public/app/theme/theme.configProvider.js',
                    'public/app/theme/theme.constants.js',
                    'public/app/theme/theme.run.js',
                    'public/app/theme/theme.service.js',
                    'public/app/theme/components/toastrLibConfig.js',
                    'public/app/theme/directives/animatedChange.js',
                    'public/app/theme/directives/autoExpand.js',
                    'public/app/theme/directives/autoFocus.js',
                    'public/app/theme/directives/includeWithScope.js',
                    'public/app/theme/directives/ionSlider.js',
                    'public/app/theme/directives/ngFileSelect.js',
                    'public/app/theme/directives/scrollPosition.js',
                    'public/app/theme/directives/trackWidth.js',
                    'public/app/theme/directives/zoomIn.js',
                    'public/app/theme/services/baProgressModal.js',
                    'public/app/theme/services/baUtil.js',
                    'public/app/theme/services/preloader.js',
                    'public/app/theme/services/stopableInterval.js',
                    'public/app/theme/components/backTop/backTop.directive.js',
                    'public/app/theme/components/baPanel/baPanel.directive.js',
                    'public/app/theme/components/baPanel/baPanel.service.js',
                    'public/app/theme/components/baPanel/baPanelSelf.directive.js',
                    'public/app/theme/components/baSidebar/baSidebar.directive.js',
                    'public/app/theme/components/baSidebar/baSidebar.service.js',
                    'public/app/theme/components/baSidebar/BaSidebarCtrl.js',
                    'public/app/theme/components/baSidebar/baSidebarHelpers.directive.js',
                    'public/app/theme/components/contentTop/contentTop.directive.js',
                    'public/app/theme/components/pageTop/pageTop.directive.js',
                    'public/app/theme/components/widgets/widgets.directive.js',
                    'public/app/theme/components/backTop/lib/jquery.backTop.min.js',


                    // SP Module files
                    'public/app/pages/sp/sp.module.js',
                    'public/app/pages/sp/sp.services.js',
                    'public/app/pages/sp/sp.controller.js',
                    'public/app/pages/sp/spListing/spListing.controller.js',

// User Module files
                    'public/app/pages/user/user.module.js',
                    'public/app/pages/user/user.services.js',
                    'public/app/pages/user/user.controller.js',

// Configuration Files
                    'public/app/pages/configuration/configuration.module.js',
                    'public/app/pages/configuration/configuration.services.js',
                    'public/app/pages/configuration/configuration.controller.js',

// Categories Files
                    'public/app/pages/categories/categories.module.js',
                    'public/app/pages/categories/categories.services.js',
                    'public/app/pages/categories/categories.controller.js',


// PromoCodes Module files
                    'public/app/pages/promocode/promocode.module.js',
                    'public/app/pages/promocode/promocode.services.js',
                    'public/app/pages/promocode/promocode.controller.js',

// appointments module files
                    'public/app/pages/jobs/jobs.module.js',
                    'public/app/pages/jobs/jobs.services.js',
                    'public/app/pages/jobs/jobs.controller.js',

// Services Files
                    'public/app/pages/services/services.module.js',
                    'public/app/pages/services/services.services.js',
                    'public/app/pages/services/services.controller.js'

                ],
                dest: 'public/concat.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target_2: {
                files: {
                    'public/concat.min.js': [ 'public/concat.js' ]
                }
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: ['--color'],
                    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                    ext: 'js',
                    watch: ['app', 'config', 'app.js', 'gruntfile.js'],
                    delay: 1000,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    // Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-copy');
    grunt.loadNpmTasks('grunt-execute');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-cache-busting');

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Default task(s).
    grunt.registerTask('default', ['copy', 'jshint', 'concurrent']);

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);
    //concats
    grunt.registerTask('autorun', ['concat:distdesk']);

    grunt.registerTask('build', ['concat:distdesk', 'uglify:my_target_2', 'concat_css', 'cssmin', 'cache-busting']);
};