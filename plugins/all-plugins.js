const matchAll = require("./match-all.js");

const count = (data) => data.filter(Boolean).length;
const sum = (data) => data.reduce((a, x) => a + x, 0);

module.exports = {
    bytes: {
        label: "bytes",
        processFile: (content) => content.length,
        getResult: (data) => `${sum(data)} bytes`,
    },
    files: {
        label: "files",
        processFile: (content) => true,
        getResult: (data) => `${count(data)} files`,
    },

    // code quality
    flow: {
        label: "not using @flow",
        processFile: (content) => !/\/\/ @flow/g.test(content),
        getResult: (data) => `${count(data)} files`,
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

    // data
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

    // rendering
    backboneView: {
        label: "Backbone.View",
        processFile: (content) => /Backbone\.View\.extend/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    component: {
        label: "defines a component",
        processFile: (content) => /(createClass\(\{|extends (React\.)?Component)/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    createClass: {
        label: "React.createClass",
        processFile: (content) => /createClass\(\{/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    propTypes: {
        label: "prop-types",
        processFile: (content) => /\"prop-types\"/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    extendComponent: {
        label: "extends React.Component",
        processFile: (content) => /extends (React\.)?Component/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },

    // state
    backboneModel: {
        label: "Backbone.Model",
        processFile: (content) => /Backbone\.Model\.extend/g.test(content),
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

    // styling
    legacyCss: {
        label: "importLegacyCSS",
        processFile: (content) => /importLegacyCSS/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },

    // navigation
    deprecatedLink: {
        label: "Link (deprecated)",
        processFile: (content) => /link-package\/link\.jsx/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    deprecatedClientLink: {
        label: "ClientLink (deprecated)",
        processFile: (content) => /link-package\/client-link\.jsx/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    wonderBlocksLink: {
        label: "wonder-blocks-link",
        processFile: (content) => /\"@khanacademy\/wonder-blocks-link\"/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    
    // shared components
    wonderBlocks: {
        label: "wonder-blocks", 
        processFile: (content) => /@khanacademy\/wonder-blocks-/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
    sharedComponents: {
        label: "shared-components",
        processFile: (content) => /\.\.\/components\/([^-]+-)+package/g.test(content),
        getResult: (data) => `${count(data)} files`,
    },
};
