import React from 'react';
import MdpData from "./MdpData.js";
import MdpLogic from "./MdpLogic.js";
import MyGraph from "./MyGraph.js";
import "./BuildGraph.css"

export default class BuildGraph extends React.Component{
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.state = {};
        this.state.graph = null;
    }

    updateData = (arr, init_state, g) => {
        let mdpLogic = new MdpLogic(arr, init_state, g);
        if (mdpLogic.checkData() === true) {
            let my_graph = new MyGraph(mdpLogic);
            my_graph.createGraph();
            this.setState({graph: my_graph});
        }else{
            alert("Please, fix data to create data!");
        }
    };

    clear = (event) => {
        if (event && this.state.graph !== null) {
            this.state.graph.destroyGraph();
            this.setState({graph: null});
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