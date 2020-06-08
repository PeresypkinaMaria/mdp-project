import React from 'react';
import MdpTable from "./MdpTable";
import "./MdpData.css";

export default class MdpData extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeInitState = this.handleChangeInitState.bind(this);
        this.handleChangeGamma = this.handleChangeGamma.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.clickForUpload = this.clickForUpload.bind(this);
        this.handleUpload = this.handleUpload.bind(this);

        this.state = {};
        this.state.mdpdata = [{id: generateID(), from_state: '', action: '', to_state: '', probability: 0, reward: ''}];
        this.state.init_state = '';
        this.state.gamma = 0.9;
        //this.state.file = null;
    }

    //dataFromTable = this.state.mdpdata;

    handleRemoveRow(dataRow) {
        let index = this.state.mdpdata.indexOf(dataRow);
        this.state.mdpdata.splice(index, 1);
        this.setState(this.state.mdpdata);
    }

    handleAddRow() {
        let mdpItem = {
            id: generateID(),
            from_state: "",
            action: "",
            to_state: "",
            probability: 0,
            reward: ""
        };
        this.state.mdpdata.push(mdpItem);
        this.setState(this.state.mdpdata);
    }

    handleDataTable(evt) {
        let item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };
        let mdpArr = this.state.mdpdata.slice();
        let newArr = mdpArr.map(function (mdpItem) {
            for (let key in mdpItem) {
                if (key === item.name && mdpItem.id === item.id) {
                    mdpItem[key] = item.value;
                }
            }
            return mdpItem;
        });
        this.setState({mdpdata: newArr});
    };

    handleChangeInitState(event) {
        this.setState({init_state: event.target.value});
    };

    handleChangeGamma(event) {
        if (event.target.value < 0 || event.target.value > 1) {
            alert("Please enter a number from 0 to 1!")
        } else {
            this.setState({gamma: event.target.value});
        }
    };

    handleClear() {
        this.setState({
            mdpdata: [{
                id: '111111',
                from_state: '',
                action: '',
                to_state: '',
                probability: 0,
                reward: ''
            }]
        });
        this.setState({init_state: ''});
        this.setState({gamma: 0.9});
        this.props.clear(true);
    };

    handleDownload() {
        let json = JSON.stringify(this.state.mdpdata);
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
        element.setAttribute('download', 'data.txt');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    clickForUpload() {
        let upload = document.getElementById("upload");
        upload.click();
    };

    handleUpload() {
        let file = document.getElementById("upload").files[0];
        let reader = new FileReader();

        reader.onload = function(){
            let text = reader.result;
            let items = JSON.parse(text);
            this.handleClear();
            /*for (let item of items) {
                this.state.mdpdata.push(item);
            }*/
            this.setState({mdpdata: items});
        }.bind(this);

        reader.onerror = function () {
            alert("Reading error!\n" + reader.error);
        };

        reader.readAsText(file);
    };

    render() {
        return (
            <div className="data">
                <div className="mtable">
                    <MdpTable
                        onDataTableUpdate={this.handleDataTable.bind(this)}
                        onAddRow={this.handleAddRow.bind(this)}
                        onRemoveRow={this.handleRemoveRow.bind(this)}
                        mdpData={this.state.mdpdata}/>
                </div>
                <div className="optional">
                    <div>
                        <div className="init-data">
                            <label>
                                Initial state
                                <input type="text" name="init_state" value={this.state.init_state}
                                       onChange={this.handleChangeInitState}/>
                            </label>
                        </div>
                        <div className="init-data">
                            <label>
                                Gamma
                                <input type="number" name="gamma" min="0" max="1" step="0.1" value={this.state.gamma}
                                       onChange={this.handleChangeGamma}/>
                            </label>
                        </div>
                    </div>
                    <div>
                        <button className="green-btn"
                                onClick={() => this.props.updateData(this.state.mdpdata, this.state.init_state, this.state.gamma)}>Create
                            graph
                        </button>
                        <button className="red-btn" onClick={this.handleClear}>Clear</button>
                    </div>
                    <div>
                        <button className="load-btn" onClick={this.handleDownload}>Download</button>
                        <button className="load-btn" onClick={this.clickForUpload}>
                            Upload
                            <input id="upload" type="file" accept=".txt" onChange={this.handleUpload}/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

function generateID() {
    return Math.random().toString(36).substr(2, 6);
}

/*function mdpToString(mdp, init_state, gamma) {
    let result = '';
    for (let item of mdp){
        result += 'id: ' + item.id + ', from_state: ' + item.from_state + ', action: ' + item.action + ', to_state: ' +
            item.to_state + ', probability: ' + item.probability + ', reward: ' + item.reward + '\n';
    };
    result += 'initial_state: ' + init_state + '\n';
    result += 'gamma: ' + gamma;
    return result;
}*/