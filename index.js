#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const program = require('commander');

const cwd = process.cwd();

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-o, --output [file]', 'save output to a JSON file')
  .parse(process.argv);

if (program.args.length < 1) {
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
        processFile: (content) => /\/\/ @flow/.test(content),
        type: "boolean",
    },
    "eslint-disable": {
        processFile: (content) => {
            // TODO(kevinb): find all eslint disable messages in a file
            const match = content.match(/\/\* eslint-disable ([^\*]+)\*\//);
            return match
                ? match[1].trim().split(", ")
                : [];
        },
        type: "boolean",
    },
    "file-size": {
        processFile: (content) => content.length,
        type: "number",
    }
};

const map = {};
const pluginResults = {};

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
            if (!pluginResults[filename]) {
                pluginResults[filename] = {};
            }
            pluginResults[filename][name] = plugin.processFile(content);
        }
    }
}

walk(entry);

const output = Object.keys(map).reduce((accum, file) => {
    const type = fs.existsSync(path.join(cwd, file))
        ? "file"
        : "module";

    return {
        ...accum,
        [file]: {
            type: type,
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

Object.keys(pluginResults).forEach(file => {
    output[file].results = pluginResults[file];
})

for (const [name, plugin] of Object.entries(plugins)) {
    const values = Object.values(pluginResults).map(result => result[name]);
    // const results = pluginResults[name];
    // const values = Object.values(results);
    const sum = values.reduce((a, x) => a + x, 0);
    if (plugin.type === "boolean") {
        console.log(`${name}: ${sum} / ${values.length} = ${sum / values.length} (average)`);
    } else if (plugin.type === "number") {
        console.log(`${name}: ${sum} (total)`);
    }
}

console.log(output);

if (program.output) {
    fs.writeFileSync(path.join(cwd, program.output), JSON.stringify(output, null, 4), "utf-8");
    console.log(`wrote: ${program.output}`);
}
