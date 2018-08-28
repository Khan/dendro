// @flow
import * as React from "react";
import {StyleSheet} from "aphrodite";
import {HashRouter, Route, Link, Switch} from "react-router-dom";

import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";
import {SingleSelect, OptionItem} from "@khanacademy/wonder-blocks-dropdown";

import Stats from "./stats.js";
import Files from "./files.js";

import data from "../data/output.json";
console.log(data);

const getAllDeps = (entry) => {
    const allDeps = [];
    const walk = (mod) => {
        if (allDeps.includes(mod)) {
            return;
        } else {
            allDeps.push(mod);
            if (mod in data) {
                data[mod].dependencies.map(walk);
            }
        }
    };
    walk(entry);
    return allDeps;
}   

const entryPoints = [
    "javascript/content-library-package/modules/topic-progress.jsx",
    "javascript/content-library-package/modules/subject-progress.jsx",
    "javascript/content-library-package/modules/dual-intro.jsx",
]
entryPoints.forEach(entry => {
    console.log(entry);
    console.log(getAllDeps(entry));
})

type Props = {};
type State = {
    selectedValue: ?string,
};

export default class App extends React.Component<{}> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedValue: null,
        };
    }

    handleChange = (value) => {
        this.setState({selectedValue: value});
    }

    render() {
        const filteredData = {};
        if (this.state.selectedValue) {
            const deps = getAllDeps(this.state.selectedValue);
            deps.forEach(dep => {
                filteredData[dep] = data[dep];
            });
        }

        return <HashRouter>
            <View style={styles.container}>
                <View style={styles.row}>
                    <SingleSelect
                        style={styles.select}
                        onChange={this.handleChange}
                        placeholder="Choose a entry point"
                        selectedValue={this.state.selectedValue}
                    >
                        {entryPoints.map(entry => 
                            <OptionItem key={entry} label={entry} value={entry}/>)}
                    </SingleSelect>
                </View>
                <Stats data={filteredData}/>
            </View>
        </HashRouter>;
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    row: {
        flexDirection: "row",
        flexShrink: 0,
        padding: 16,
    },
    select: {
        flexShrink: 0,
    },
});
