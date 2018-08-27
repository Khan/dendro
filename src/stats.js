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

export default class Stats extends React.Component<Props> {
    getRawResults(pluginName) {
        return Object.values(this.props.data)
            .filter(file => file.results)
            .map(file => file.results[pluginName]);
    }

    render() {
        return <View style={styles.container}>
            <HeadingLarge>Package Stats</HeadingLarge> 
            <table>
                <tbody>
                    {Object.entries(plugins).map(([key, value]) => 
                        <tr key={key}>
                            <th className={css(styles.label)}>
                                {value.label}
                            </th>
                            <td>
                                {value.getResult(this.getRawResults(key))}
                            </td>
                        </tr>)}
                </tbody>
            </table>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 0,
    },
    label: {
        textAlign: 'right',
    },
});
