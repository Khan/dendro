// @flow
import * as React from "react";
import {StyleSheet, css} from "aphrodite";

import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";
import plugins from "../plugins/all-plugins.js";

type Props = {
    data: any,
};

const config = [
    {
        label: "Code Quality",
        stats: ["flow", "any", "eslintDisable", "$FlowFixMe"],
    },
    {
        label: "Data",
        stats: ["gql", "fetch", "ajax"],
    },
    {
        label: "Navigation",
        stats: ["deprecatedLink", "deprecatedClientLink", "wonderBlocksLink"],
    },
    {
        label: "Rendering",
        stats: ["backboneView", "component", "createClass", "propTypes", "extendComponent"],
    },
    {
        label: "Shared Components",
        stats: ["sharedComponents", "wonderBlocks"],
    },
    {
        label: "State",
        stats: ["backboneModel", "apollo", "redux"],
    },
    {
        label: "Styling",
        stats: ["legacyCss"],
    },
];

export default class Stats extends React.Component<Props> {
    getRawResults(pluginName) {
        return Object.values(this.props.data)
            .filter(file => file.results)
            .map(file => file.results[pluginName]);
    }

    renderSection(section) {
        return <React.Fragment>
            <tr>
                <td className={css(styles.cell, styles.section)} colSpan={2}>
                    <HeadingMedium>{section.label}</HeadingMedium>
                </td>
            </tr>
            {section.stats.map(key => 
                <tr key={key}>
                    <th className={css(styles.cell, styles.label)}>
                        <LabelLarge>{plugins[key].label}</LabelLarge>
                    </th>
                    <td className={css(styles.cell)}>
                        <LabelMedium>
                            {plugins[key].getResult(this.getRawResults(key))}
                        </LabelMedium>
                    </td>
                </tr>)
            }
        </React.Fragment>;
    }

    render() {
        return <View style={styles.container}>
            <HeadingLarge>Package Stats</HeadingLarge>
            <table className={css(styles.table)}>
                <tbody>
                    {config.map(section => this.renderSection(section))}
                </tbody>
            </table>
            
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
    },
    table: {
        borderCollapse: "collapse",
        marginLeft: 16,
    },
    cell: {
        // border: `1px solid gray`,
        padding: 2,
    },
    section: {
        paddingTop: 16,
    },
    label: {
        textAlign: 'left',
        paddingLeft: 16,
    },
});
