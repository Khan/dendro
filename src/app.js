// @flow
import * as React from "react";
import {StyleSheet, css} from "aphrodite";

import data from "../data/output.json";
console.log(data);

type Props = {};
type State = {
    selection: string,
};

export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selection: "javascript/content-library-package/modules/subject-progress.jsx",
        };
    }

    render() {
        const selectionData = data[this.state.selection];

        return <div className={css(styles.row)}>
            <div className={css(styles.column)}>
                <h1>files</h1>
                <ul>
                    {Object.keys(data)
                        .filter(filename => data[filename].type === "file")
                        .sort((a, b) => 
                            data[b].results["file-size"] - data[a].results["file-size"])
                        .map(filename => 
                            <li key={filename} onClick={() => this.setState({selection: filename})}>
                                {data[filename].results["file-size"]}: {filename}
                            </li>
                        )
                    }
                </ul>
            </div>
            <div className={css(styles.column)}>
                <h1>{this.state.selection}</h1>
                <ul>
                    <li>type: {selectionData.type}</li>
                    <li>
                        dependents:
                        <ul>
                            {selectionData.dependents.map((dep, i) => 
                                <li key={i}>{dep}</li>)}
                        </ul>
                    </li>
                    <li>
                        dependencies:
                        <ul>
                            {selectionData.dependencies.map((dep, i) => 
                                <li key={i}>{dep}</li>)}
                        </ul>
                    </li>
                    <li>
                        results:
                        <ul>
                            {Object.entries(selectionData.results)
                                .map(([name, value]) => 
                                    <li key={name}>
                                        {name}: {value.toString()}
                                    </li>
                                )
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    }
}

const styles = StyleSheet.create({
    row: {
        display: "flex",
        flexDirection: "row",
    },
    column: {
        display: "flex",
        flexDirection: "column",
    },
});
