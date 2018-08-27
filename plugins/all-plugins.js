const matchAll = require("./match-all.js");

const count = (data) => data.filter(Boolean).length;
const sum = (data) => data.reduce((a, x) => a + x, 0);
const not = x => !x;

module.exports = {
    bytes: {
        label: "bytes",
        processFile: (content) => content.length,
        getResult: (data) => {
            return data.reduce((a, x) => a + x, 0);
        },
    },

    flow: {
        label: "not using @flow",
        processFile: (content) => /\/\/ @flow/g.test(content),
        getResult: (data) => `${count(data.map(not))} files`,
    },
    any: {
        label: "any",
        processFile: (content) => matchAll(content, /(: any\W|<any>)/g).length,
        getResult: (data) => `${count(data)} files (${sum(data)} uses)`,
    },

    eslintDisable: {
        label: "eslint-disable",
        processFile: (content) => {
            // TODO(kevinb): find all eslint disable messages in a file
            const match = content.match(/\/\* eslint-disable ([^\*]+)\*\//);
            return match
                ? match[1].trim().split(", ")
                : [];
        },
        getResult: (data) => {
            const ruleCounts = data.map(count);
            return `${count(ruleCounts)} files (${sum(ruleCounts)} rules)`;
        },
    },

    // TODO(kevinb): update to track other $Flow comments we have
    $FlowFixMe: {
        label: "$FlowFixMe",
        processFile: (content) => matchAll(content, /\$FlowFixMe/g).length,
        getResult: (data) => `${count(data)} files (${sum(data)} uses)`,
    },
    gql: {
        label: "gql`",
        processFile: (content) => /gql`/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    fetch: {
        label: "khanFetch()",
        processFile: (content) => /khanFetch\(/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    ajax: {
        label: "$.ajax(), et al",
        processFile: (content) => /(\$\.get\(|\$\.post\(|\$\.ajax\()/g.test(content),
        getResult: (data) => `${count(data)} files (${sum(data)} uses)`,
    },
    backbone: {
        label: "Backbone",
        processFile: (content) => /Backbone\./g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    createClass: {
        label: "React.createClass",
        processFile: (content) => /createClass\(\{/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    extendComponent: {
        label: "extends React.Component",
        processFile: (content) => /extends (React\.)?Component/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    legacyCss: {
        label: "importLegacyCSS",
        processFile: (content) => /importLegacyCSS/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    wonderBlocks:{
        label: "wonder-blocks", 
        processFile: (content) => /@khanacademy\/wonder-blocks-/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    component: {
        label: "defines a component",
        processFile: (content) => /(createClass\(\{|extends (React\.)?Component)/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    apollo: {
        label: "uses apollo", 
        processFile: (content) => /(apollo-wrapper\.jsx|react-apollo)/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    redux: {
        label: "uses redux",
        processFile: (content) => /(\"redux\"|\"react-redux\")/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    deprecatedLink: {
        label: "uses deprecated Link",
        processFile: (content) => /link-package\/link\.jsx/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    deprecatedClientLink: {
        label: "uses deprecated ClientLink",
        processFile: (content) => /link-package\/client-link\.jsx/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    wonderBlocksLink: {
        label: "wonder-blocks-link",
        processFile: (content) => /\"@khanacademy\/wonder-blocks-link\"/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    deprecatedButtons: {
        label: "uses deprecated Buttons",
        processFile: (content) => /\/button-package\//g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    wonderBlocksButton: {
        label: "wonder-blocks-button",
        processFile: (content) => /\"@khanacademy\/wonder-blocks-button\"/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
};
