// @flow
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./app.js";

const container = document.createElement("container");
document.body.appendChild(container);

ReactDOM.render(<App />, container);
