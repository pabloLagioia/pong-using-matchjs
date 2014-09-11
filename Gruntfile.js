module.exports = function (grunt)
{
    grunt.initConfig({
        "copy": {
            all: {
                src: "./pre-index.html",
                dest: "./public/index.html"
            }
        },
        "string-replace": {
            dev: {
                files: {
                    "./public/index.html": "./public/index.html"
                },
                options: {
                    replacements: [{
                        pattern: /\$\{match\}/g,
                        replacement: "http://localhost:8086/match/merged"
                    }]
                }
            },
            prod: {
                files: {
                    "./public/index.html": "./public/index.html"
                },
                options: {
                    replacements: [{
                        pattern: /\$\{match\}/g,
                        replacement: "Match.js"
                    }]
                }
            }
        },
        "githooks": {
            all: {
              "pre-push": "copy string-replace:prod"
            }
          }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-string-replace");
    grunt.registerTask("default", ["copy", "string-replace:dev"]);
    grunt.registerTask("prod", ["copy", "string-replace:prod"]);

};