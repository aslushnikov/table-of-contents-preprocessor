var fs = require("fs");
var path = require("path");
var assert = require("assert");
var exec = require('child_process').exec;

createTestSuite("generic", []);
createTestSuite("depth-1", ["-d", "1"]);
createTestSuite("depth-2", ["-d", "2"]);

function createTestSuite(workingDir, args) {
    // Extract list of .md test files from working directory.
    var files = fs.readdirSync(path.join(__dirname, workingDir));
    files = files.filter(function(fileName) {
        var tokens = fileName.split(".");
        return tokens.pop() === "md";
    });

    // Create testsuite.
    var testSuiteName = "./toc " + args.join(" ") + " <fileName>    [testsDir: " + workingDir + "]";
    describe(testSuiteName, function() {
        // For every file, generate a test.
        files.forEach(function(fileName) {
            // The test executes command on input file, grabs output, and
            // compares to the golden.
            it(fileName, function(done) {
                // Prepare arguments for running toc.
                var fullFilePath = path.join(__dirname, workingDir, fileName);
                var cmd = path.join(__dirname, "..", "toc.js");
                cmd += " " + args.join(" ") + " " + fullFilePath;
                exec(cmd, {cwd: ".." }, onExecuted);

                var result;

                function onExecuted(err, stdout, stderr) {
                    if (err) return done(err);
                    if (stderr) return done(stderr);
                    result = stdout;
                    var tokens = fullFilePath.split(".");
                    tokens.pop();
                    tokens.push(".expected");
                    var golden = tokens.join("");
                    fs.readFile(golden, "utf-8", onFileRead);
                }

                function onFileRead(err, data) {
                    if (err) return done(err);
                    assert.equal(data, result);
                    done();
                }
            });

        });
    });
}

