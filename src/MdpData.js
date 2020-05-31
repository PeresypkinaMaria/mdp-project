import React from 'react';
import MdpTable from "./MdpTable";
import "./MdpData.css";

function generateID() {
    return Math.random().toString(36).substr(2, 6);
}

export default class MdpData extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeInitState = this.handleChangeInitState.bind(this);
        this.handleChangeGamma = this.handleChangeGamma.bind(this);

        this.state = {};
        this.state.mdpdata = [{id:'111111', from_state: '', action: '', to_state: '', probability: '', reward: ''}];
        this.state.init_state = '';
        this.state.gamma = 0;
    }

    //dataFromTable = this.state.mdpdata;

    handleRemoveRow(dataRow){
        var index = this.state.mdpdata.indexOf(dataRow);
        this.state.mdpdata.splice(index, 1);
        this.setState(this.state.mdpdata);
    }

    handleAddRow(){
        var mdpItem = {
            id: generateID(),
            from_state: "",
            action: "",
            to_state: "",
            probability: "",
            reward: ""
        };
        this.state.mdpdata.push(mdpItem);
        this.setState(this.state.mdpdata);
    }

    handleDataTable(evt){
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };
        var mdpArr = this.state.mdpdata.slice();
        var newArr = mdpArr.map(function (mdpItem) {
            for (var key in mdpItem){
                if (key == item.name && mdpItem.id == item.id){
                    mdpItem[key] = item.value;
                }
            }
            return mdpItem;
        });
        this.setState({mdpdata:newArr});
    };

    handleChangeInitState(event){
        this.setState({init_state: event.target.value});
    };

    handleChangeGamma(event){
        if (event.target.value < 0 || event.target.value > 1){
            alert("Please enter a number from 0 to 1!")
        }else {
            this.setState({gamma: event.target.value});
        }
    };

    render() {
        return(
            <div className="data">
                <div className="mtable">
                    <MdpTable
                        onDataTableUpdate={this.handleDataTable.bind(this)}
                        onAddRow={this.handleAddRow.bind(this)}
                        onRemoveRow={this.handleRemoveRow.bind(this)}
                        mdpData={this.state.mdpdata}/>
                </div>

                <div className="optional">
                    <div className="init-data">
                        <label>
                        Initial state
                        <input type="text" name="init_state"  value={this.state.init_state} onChange={this.handleChangeInitState}/>
                        </label>
                    </div>
                    <div className="init-data">
                        <label>
                            Gamma
                            <input type="number" name="gamma" min="0" max="1" step="0.1" value={this.state.gamma} onChange={this.handleChangeGamma} />
                        </label>
                    </div>
                    <div>
                        <button type="button" className="green-btn" onClick={() => this.props.updateData(this.state.mdpdata, this.state.init_state, this.state.gamma)}>Create graph</button>
                    </div>
                </div>
            </div>
        );
    }
}