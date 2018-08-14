#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const program = require('commander');

const cwd = process.cwd();

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-f, --foo', 'does nothing')
  .parse(process.argv);

if (program.args.length !== 1) {
    program.outputHelp();
    process.exit(1);
}

const matchAll = (str, regex) => {
    const matches = [];
    
    while (true) {
        const match = regex.exec(str);
        if (match) {
            matches.push(match);
        } else {
            break;
        }
    }

    return matches;
};

const entry = program.args[0];

const isModule = x => !x.startsWith(".");
const isFile = x => x.startsWith(".");

const plugins = {
    flow: {
        processFile: (content) => {
            return  /\/\/ @flow/.test(content);
        },
        aggregateResults: (results) => {
            const values = Object.values(results);
            const total = values.length;
            const flowCount = values.filter(value => value).length;
            return flowCount / total;
        },
    },
    "eslint-disable": {
        processFile: (content) => {
            return /\/\* eslint-disable/.test(content);
        },
        aggregateResults: (results) => {
            const values = Object.values(results);
            const total = values.length;
            const eslintCount = values.filter(value => value).length;
            return eslintCount / total;
        },
    },
};

const map = {};
const pluginResults = Object.keys(plugins).reduce((accum, key) => {
    return {
        ...accum,
        [key]: {},
    };
}, {});

const walk = function(filename, depth = 0) {
    if (filename in map) {
        return;
    } else {
        // console.log("  ".repeat(depth) + filename.replace("javascript/", ""));

        // TODO: rewrite with a line reader if this doesn't work
        const content = fs.readFileSync(path.join(cwd, filename)).toString();

        const requireRegex = /require\(["']\s*([^"']+)\s*["']\)/g;
        const requires = matchAll(content, requireRegex).map(m => m[1]);
        
        const importRegex = /import\s+(\{[^\}]+\}|[a-zA-Z$][a-zA-Z0-9$]*|\*\s+as[a-zA-Z$][a-zA-Z0-9$]*)\s+from\s+['"]([^'"]+)['"]/g;
        const imports = matchAll(content, importRegex).map(m => m[2]);

        const modules = [
            ...requires.filter(isModule),
            ...imports.filter(isModule),
        ];

        const dirname = path.dirname(filename);
        const files = [
            ...requires.filter(isFile),
            ...imports.filter(isFile),
        ].map(x => path.join(dirname, x));

        map[filename] = [
            ...files,
            ...modules,
        ];

        for (const mod of modules) {
            map[mod] = [];
        }

        for (const file of files) {
            walk(file, depth + 1);
        }

        for (const [name, plugin] of Object.entries(plugins)) {
            pluginResults[name][filename] = plugin.processFile(content);
        }
    }
}

walk(entry);

const output = Object.keys(map).reduce((accum, file) => {
    return {
        ...accum,
        [file]: {
            dependents: [],
            dependencies: [],
        },
    };
}, {});

// We create a two way map so that we can look at both dependents
// and dependencies of any file in the tree
for (const [file, dependencies] of Object.entries(map)) {
    output[file].dependencies = dependencies;
    for (const dep of dependencies) {
        output[dep].dependents.push(file);
    }
}

for (const [name, plugin] of Object.entries(plugins)) {
    console.log(`results for ${name}`);
    const results = pluginResults[name];
    const result = plugin.aggregateResults(results);
    console.log(result);
}

// console.log(pluginResults);

// const reverseResults = {};
