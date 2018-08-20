// @flow
import * as React from "react";
import {StyleSheet, css} from "aphrodite";

import {View} from "@khanacademy/wonder-blocks-core";

import data from "../data/output.json";
console.log(data);

type Props = {};
type State = {
    selection: string,
    filter: string,
};

export default class App extends React.Component<Props, State> {
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
        const selectionData = data[this.state.selection];

        return <View style={styles.container}>
            <View style={styles.column}>
                <h1>files</h1>
                <View style={styles.row}>
                    Filter: <input type="text" onChange={this.handleChange} />
                </View>
                <View style={styles.column}>
                    <ul className={css(styles.list)}>
                        {Object.keys(data)
                            .filter(filename => filename.includes(this.state.filter))
                            .filter(filename => data[filename].type === "file")
                            .sort((a, b) => 
                                data[b].results["file-size"] - data[a].results["file-size"])
                            .map(filename => 
                                <li 
                                    key={filename} 
                                    onClick={() => this.setState({selection: filename})}
                                    className={css(
                                        styles.listItem,
                                        filename === this.state.selection && styles.selectedItem,
                                    )}
                                >
                                    {data[filename].results["file-size"]}: {filename}
                                </li>
                            )
                        }
                    </ul>
                </View>
            </View>
            <View style={styles.column}>
                <h1>{this.state.selection}</h1>
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
});
