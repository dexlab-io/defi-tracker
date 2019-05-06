import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, Color} from 'ink';
global.fetch = require("node-fetch");

/// This is my command description

class UpdateAll extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exchanges: [],
            logs: []
        }
    }

    async componentDidMount(props) {
        const exchanges = await fetch(`http://localhost:8000/api/unipools`).then(response => response.json())
        this.startJobs(exchanges)
    }

    async startJobs(exchanges) {
        let logs = [];
        exchanges.map( e => {
            if(!e.lastBlockCheck) {
                fetch(`http://localhost:8000/api/unipool/exchange/${this.props.exchange}/update`).then(response => response.json());
                logs.push(`Indexing of data for ${e.symbol} in progress.`);
            }
        })
        this.setState({
            logs
        })
    }

    render() {
        const { logs } = this.state;
        return(logs.map(l => <Color green>{l}</Color>))
    }
}

UpdateAll.propTypes = {
};

export default UpdateAll;