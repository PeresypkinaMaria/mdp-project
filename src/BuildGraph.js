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
    }

    updateData = (arr, init_state, g) => {
        let mdpLogic = new MdpLogic(arr, init_state, g);
        if (mdpLogic.checkData() == true) {
            let my_graph = new MyGraph(mdpLogic);
            this.setState({graph: my_graph});
            my_graph.createGraph();
        }else{
            alert("Please, fix data to create data!");
        }
    };

    clear = (event) => {
        if (event) {
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