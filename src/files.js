// @flow
import * as React from "react";
import {StyleSheet, css} from "aphrodite";

import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";



type Props = {
    data: any
};

type State = {
    selection: string,
    filter: string,
};

export default class Files extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selection: "javascript/content-library-package/modules/subject-progress.jsx",
            filter: "",
        };
    }

    handleChange = (e) => {
        this.setState({filter: e.target.value});
    }

    render() {
        const {data} = this.props;
        const selectionData = data[this.state.selection];

        return <View style={styles.container}>
            <View style={styles.column}>
                <HeadingLarge>Files</HeadingLarge>
                <View style={styles.row}>
                    <LabelLarge>
                        Filter:
                    </LabelLarge>
                    <input type="text" onChange={this.handleChange} />
                </View>
                <View style={styles.column}>
                    <table>
                        <tr className={css(styles.stickyHeader)}>
                            <th>bytes</th>
                            <th>filename</th>
                        </tr>
                        {Object.keys(data)
                            .filter(filename => filename.includes(this.state.filter))
                            .filter(filename => data[filename].type === "file")
                            .sort((a, b) => 
                                data[b].results["file-size"] - data[a].results["file-size"])
                            .map(filename => 
                                <tr 
                                    key={filename}
                                    onClick={() => this.setState({selection: filename})}
                                    className={css(
                                        styles.listItem,
                                        filename === this.state.selection && styles.selectedItem,
                                    )}
                                >
                                    <th>
                                        {data[filename].results["file-size"]}
                                    </th>
                                    <td>
                                        {filename}
                                    </td>
                                </tr>
                            )
                        }
                    </table>
                </View>
            </View>
            <View style={styles.column}>
                <ul>
                    <li className={css(styles.item)}>type: {selectionData.type}</li>
                    <li className={css(styles.item)}>
                        dependents:
                        <ul>
                            {selectionData.dependents.map((dep, i) => 
                                <li 
                                    key={i}
                                    className={css(styles.listItem)}
                                    onClick={() => this.setState({selection: dep})}
                                >
                                    {dep}
                                </li>)}
                        </ul>
                    </li>
                    <li className={css(styles.item)}>
                        dependencies:
                        <ul>
                            {selectionData.dependencies.map((dep, i) => 
                                <li 
                                    key={i}
                                    className={css(styles.listItem)}
                                    onClick={() => this.setState({selection: dep})}
                                >
                                    {dep}
                                </li>)}
                        </ul>
                    </li>
                    <li className={css(styles.item)}>
                        results:
                        <ul>
                            {Object.entries(selectionData.results)
                                .map(([name, value]) => 
                                    <li key={name} className={css(styles.item)}>
                                        {name}: {value.toString()}
                                    </li>
                                )
                            }
                        </ul>
                    </li>
                </ul>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flexDirection: "row",
        paddingLeft: 8,
        paddingRight: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
    },
    column: {
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
    },
    list: {
        listStyleType: "none",
        padding: 0,
    },
    item: {
        fontFamily: "sans-serif",
        padding: 2,
    },
    listItem: {
        fontFamily: "sans-serif",
        padding: 4,
        cursor: "pointer",
        ":hover": {
            background: "lightgray",
        },
    },
    selectedItem: {
        background: "yellow",
        ":hover": {
            background: "yellow",
        },
    },
    results: {
        marginTop: 8,
        marginBottom: 24,
    },
    stickyHeader: {
        position: "sticky",
        backgroundColor: "white",
        zIndex: 1,
        top: 0,
    },
});
