import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, Color} from 'ink';
global.fetch = require("node-fetch");

/// This is my command description

class Main extends Component {
    async componentDidMount(props) {
        fetch(`http://localhost:8000/api/unipool/exchange/${this.props.exchange}/update`).then(response => response.json())
    }

    render() {
        return(<Color green>Indexing of data for {this.props.exchange} in progress.</Color>)
    }
}

const HelloPerson = ({name}) => <Color green>Hello, {name}</Color>;

Main.propTypes = {
	/// This is "name" option description
	exchange: PropTypes.string.isRequired
};

export default Main;