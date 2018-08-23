// @flow
import * as React from "react";
import {StyleSheet} from "aphrodite";

import {View} from "@khanacademy/wonder-blocks-core";
import {HeadingLarge, HeadingMedium, LabelLarge, LabelMedium} from "@khanacademy/wonder-blocks-typography";
import {Strut} from "@khanacademy/wonder-blocks-layout";

type Props = {
    data: any,
};

export default class Stats extends React.Component<Props> {
    getRawResults(pluginName) {
        return Object.values(this.props.data)
            .filter(file => file.results)
            .map(file => file.results[pluginName]);
    }

    getFlowResults() {
        const results = this.getRawResults("flow");
        const usingFlow = results.filter(x => x).length;
        const total = results.length;

        return <tr>
             <th>    
                <LabelLarge>
                    flow:
                </LabelLarge>
            </th>
            <td>
                <LabelMedium>
                    {`${usingFlow} of ${total} files using flow`}
                </LabelMedium>
            </td>
        </tr>;
    }

    getFileSizeResults() {
        const results = this.getRawResults("file-size");
        const total = results.reduce((a, x) => a + x, 0);

        return <tr>
            <th>    
                <LabelLarge>
                    bytes:
                </LabelLarge>
            </th>
            <td>
                <LabelMedium>
                    {total} bytes
                </LabelMedium>
            </td>
        </tr>;
    }

    getEslintDisableResults() {
        const results = this.getRawResults("eslint-disable");

        const histogram = {};
        for (const rules of results) {
            for (const rule of rules) {
                if (!histogram.hasOwnProperty(rule)) {
                    histogram[rule] = 0;
                }
                histogram[rule]++;
            }
        }

        return <tr>
            <LabelLarge tag="th">
                eslint-disable:
            </LabelLarge>
            <td>
                {Object.entries(histogram)
                    .map(([rule, count]) => 
                        <LabelMedium key={rule}>
                            {`${rule}: ${count}`}
                        </LabelMedium>)}
            </td>
        </tr>;
    }

    render() {
        return <View style={styles.container}>
            <HeadingLarge>Package Stats</HeadingLarge> 
            <table>
                <tbody>
                    {this.getFlowResults()}
                    {this.getFileSizeResults()}
                    {this.getEslintDisableResults()}
                </tbody>
            </table>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
    },
});
