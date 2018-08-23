// @flow
import * as React from "react";
import {StyleSheet} from "aphrodite";
import {HashRouter, Route, Link, Switch} from "react-router-dom";

import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";

import Stats from "./stats.js";
import Files from "./files.js";

import data from "../data/output.json";
console.log(data);

export default class App extends React.Component<{}> {
    handleChange = (e) => {
        this.setState({filter: e.target.value});
    }

    render() {
        return <HashRouter>
            <View>
                <View style={styles.row}>
                    <Link to="/files">
                        Files
                    </Link>
                    <Link to="/stats">
                        Stats
                    </Link>
                </View>
                <Switch>
                    <Route path="/files">
                        <Files data={data}/>
                    </Route>
                    <Route path="/stats">
                        <Stats data={data}/>
                    </Route>
                </Switch>
            </View>
        </HashRouter>;
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
    },
});
