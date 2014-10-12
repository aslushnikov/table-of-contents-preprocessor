#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');

program.version("0.9.0")
       .option("-d, --depth <n>", "Specifies the maximal header depth for the TOC", parseInt)
       .option("-a, --alternativeLinks", "Use alternative links for headings.\n" +
                                        "\tE.g. 1.1. Foo will become 1-1-foo instead of 11-foo. This option also\n" +
                                        "\tstrips all non-Latin and non-numeric characters from the URLs. Useful for\n" +
                                        "\tsome Markdown flavors like the GitLab Flavored Markdown")
       .parse(process.argv);

var FOUR_SPACES = "    ";

var leftIndents = [""];

if(process.argv.length < 3) {
    program.help();
}

for(var i = 1; i < 10; i++) {
    leftIndents.push(leftIndents[i-1] + FOUR_SPACES);
}

fs.readFile(process.argv[process.argv.length-1], 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    processData(data);
});

function processData(data) {
    var lines = data.trimRight().split('\n');

    var titles = [];
    var depths = [];
    var minDepth = 1000000;
    for(var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var headingLine = line.match(/^(#+)(.*)\s*$/);
        if (!headingLine) continue;
        minDepth = Math.min(minDepth, headingLine[1].length);
        addHeadingLine(headingLine, depths, titles);
    }

    for(var i = 0; i < depths.length; i++) {
        depths[i] -= minDepth;
    }

    var toc = createTOC(depths, titles).join('\n');

    var tocRegexp = /^\s*@@TOC@@\s*$/;
    for(var i = 0; i <lines.length; i++) {
        var line = lines[i];
        if (tocRegexp.test(line)) {
            lines[i] = toc;
        }
    }
    console.log(lines.join('\n'));
    //console.log('\n');
}

function addHeadingLine(headingLine, depths, titles) {
    if(program.depth >= headingLine[1].length || !program.depth) {
        depths.push(headingLine[1].length);
        titles.push(headingLine[2]);
    }
}

function createTOC(depths, titles) {
    var ans = [];
    for(var i = 0; i < depths.length; i++) {
        ans.push(tocLine(depths[i], titles[i]));
    }
    return ans;
}

function titleToUrl(title) {
    var trimmedTitle = title.trim()
                            .replace(/[a-z]+/ig, function(match) {
                                return match.toLowerCase();
                            });
    if (program.alternativeLinks) {
        return trimmedTitle.replace(/[^0-9a-z]+/ig, '-');
    } else {
        return trimmedTitle.replace(/\s/g, '-')
                           .replace(/[^-0-9a-zа-яё]/ig, '');
    }
}

function tocLine(depth, title) {
    return leftIndents[depth] + "- [" + title.trim() + "](#" + titleToUrl(title) + ")";
}