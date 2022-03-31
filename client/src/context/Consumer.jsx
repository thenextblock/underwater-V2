import React, { Component } from "react";
import Context from "./Context";

class Consumer extends Component {
    render() {
        return <Context.Consumer {...this.props} />;
    }
}
export default Consumer;

