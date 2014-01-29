#!/usr/bin/env node

var fs = require('fs');

var FOUR_SPACES = "    ";

var leftIndents = [""];

for(var i = 1; i < 10; i++) {
    leftIndents.push(leftIndents[i-1] + FOUR_SPACES);
}

fs.readFile(process.argv[2], 'utf-8', function(err, data) {
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
        var m = line.match(/^\s*(#+)(.*)\s*$/);
        if (!m) continue;
        minDepth = Math.min(minDepth, m[1].length);
        depths.push(m[1].length);
        titles.push(m[2]);
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

function createTOC(depths, titles) {
    var ans = [];
    for(var i = 0; i < depths.length; i++) {
        ans.push(tocLine(depths[i], titles[i]));
    }
    return ans;
}

function titleToUrl(title) {
    return title.trim()
                .replace(/[a-z]+/ig, function(match) {
                    return match.toLowerCase();
                })
                .replace(/\s/g, '-')
                .replace(/[^-0-9a-zа-яё]/ig, '');
}

function tocLine(depth, title) {
    return leftIndents[depth] + "- [" + title.trim() + "](#" + titleToUrl(title) + ")";
}