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
        let my_graph = new MyGraph(arr_data, initstate, gamma);
        this.setState({graph: my_graph});
        my_graph.createGraph();
    };

    clear = (event) => {
        if (event) {
            //let my_graph = document.getElementById('cy');
            this.state.graph.destroyGraph();
        }
    };

    render() {
        return(
            <div>
                <div>
                    <MdpData id="table"
                             updateData={this.updateData}
                             clear={this.clear}>
                    </MdpData>
                </div>
                    <div id="cy"></div>
            </div>
        )
    }
}

function submitData() {
    var dataTable = document.getElementById('table');

}