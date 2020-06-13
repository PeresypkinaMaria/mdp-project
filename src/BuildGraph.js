import React from 'react';
import DataComponent from "./DataComponent.js";
import MdpLogic from "./MdpLogic.js";
import Graph from "./Graph.js";
import "./css/BuildGraph.css"

export default class BuildGraph extends React.Component{
    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.state = {};
        this.state.graph = null;
    }

    updateData = (arr, g, visual_method, only_opt) => {
        let mdpLogic = new MdpLogic(arr, g);
        if (mdpLogic.checkData() === true) {
            let my_graph = new Graph(mdpLogic, visual_method, only_opt);
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
                    <DataComponent id="table"
                             updateData={this.updateData}
                             clear={this.clear}>
                    </DataComponent>
                </div>
                <div id="cy"></div>
            </div>
        )
    }
}