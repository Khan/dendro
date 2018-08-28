// @flow
import * as React from "react";
import {StyleSheet, css} from "aphrodite";

import Color from "@khanacademy/wonder-blocks-color";
import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, HeadingSmall, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";
import plugins from "../plugins/all-plugins.js";

type Props = {
    data: any,
};

const config = [
    {
        label: "General",
        stats: ["files", "bytes"],
    },
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
        stats: ["backboneModel", "redux", "apollo"],
    },
    {
        label: "Styling",
        stats: ["legacyCss"],
    },
];

type State = {
    stat: string,
}

export default class Stats extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.state = {
            stat: "flow",
        };
    }

    getRawResults(pluginName) {
        return Object.values(this.props.data)
            .filter(file => file.results)
            .map(file => file.results[pluginName]);
    }

    renderSection(section) {
        return <React.Fragment>
            <tr>
                <td className={css(styles.cell, styles.section)} colSpan={2}>
                    <HeadingSmall>{section.label}</HeadingSmall>
                </td>
            </tr>
            {section.stats.map(key => {
                return <tr key={key} className={css(styles.row, key === this.state.stat && styles.selected)}>
                    <th 
                        className={
                            css(
                                styles.cell, 
                                styles.label, 
                                styles.stat,
                            )
                        }
                        onClick={() => this.setState({stat: key})}
                    >
                        <LabelLarge>{plugins[key].label}</LabelLarge>
                    </th>
                    <td className={css(styles.cell, styles.stat)}>
                        <LabelMedium>
                            {plugins[key].getResult(this.getRawResults(key))}
                        </LabelMedium>
                    </td>
                </tr>;
            })}
        </React.Fragment>;
    }

    render() {
        const {data} = this.props;
        return <View style={styles.container}>
            <View style={styles.column}>
                <HeadingLarge>Package Stats</HeadingLarge>
                <table className={css(styles.table)}>
                    <tbody>
                        {config.map(section => this.renderSection(section))}
                    </tbody>
                </table>
            </View>
            <View style={styles.column}>
                <table>
                    <tbody>
                        {Object.keys(data).sort().map(filename => {
                            const value = data[filename];
                            if (value.results && value.results[this.state.stat]) {
                                let stat = value.results[this.state.stat];
                                stat = Array.isArray(stat) ? stat.length : stat;
                                if (!stat) {
                                    return null;
                                }
                                return <tr key={filename}>
                                    <td className={css(styles.cell)}>
                                        <LabelMedium>{filename}</LabelMedium>
                                    </td>
                                </tr>;
                            } else {
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </View>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        flexDirection: "row",
        color: Color.offBlack,
        flexGrow: 1,
        height: "100%",
    },
    column: {
        flexShrink: 0,
        paddingRight: 48,
        overflow: "auto",
    },
    table: {
        borderCollapse: "collapse",
        marginLeft: 16,
    },
    row: {
        cursor: "pointer",
        ":hover": {
            background: Color.offBlack16,
        },
    },
    cell: {
        padding: 2,
    },
    section: {
        paddingTop: 16,
    },
    stat: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    label: {
        textAlign: 'left',
    },
    selected: {
        background: Color.teal,
        ":hover": {
            background: Color.teal,
        },
    },
});
