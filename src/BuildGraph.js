import React from 'react';
import MdpData from "./MdpData";
import MdpLogic from "./MdpLogic";
import MyGraph from "./MyGraph";
import "./BuildGraph.css"

export default class BuildGraph extends React.Component{
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.state = {};
        this.state.dataFromTable = [];
        this.state.initState = '';
        this.state.gamma = 0;
    }

    updateData = (evt, init_state, g) => {
        /*this.setState({dataFromTable: evt});
        this.setState({initState: init_state});
        this.setState({gamma: g});*/
        //временные переменные
        let arr_data = evt;
        let initstate = init_state;
        let gamma = g;
        //var mdpLogic = new MdpLogic(arr_data, init_state, gamma);
        var my_g = new MyGraph(arr_data, initstate, gamma);
        my_g.createGraph();
    };

    render() {
        return(
            <div>
                <div className="mdp-table">
                    <MdpData id="table" updateData={this.updateData}></MdpData>
                </div>
                <div id="cy"></div>
            </div>
        )
    }
}

function submitData() {
    var dataTable = document.getElementById('table');

}