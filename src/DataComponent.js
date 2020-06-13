import React from 'react';
import TableComponent from "./TableComponent";
import "./css/DataComponent.css";
let img_state = require('./images/state_value.png');
let img_action = require('./images/action.png');
let img_optimal = require('./images/optimal.png');
let img_from_state = require('./images/from_state.png');
let img_to_state = require('./images/to_state.png');

export default class DataComponent extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeGamma = this.handleChangeGamma.bind(this);
        this.handleVisualMethodChange = this.handleVisualMethodChange.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.clickForUpload = this.clickForUpload.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleChangeOnlyOptimal = this.handleChangeOnlyOptimal.bind(this);

        this.state = {};
        this.state.mdpdata = [{id: generateID(), from_state: '', action: '', to_state: '', probability: 0, reward: ''}];
        this.state.gamma = 0.9;
        this.state.visualMethod = 'circle';
        this.state.onlyOptimal = false;
    }

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

    handleChangeGamma(event) {
        if (event.target.value < 0 || event.target.value > 1) {
            alert("Please enter a number from 0 to 1!")
        } else {
            this.setState({gamma: event.target.value});
        }
    };

    handleChangeOnlyOptimal(event){
        this.setState({onlyOptimal: event.target.checked});
    };

    handleVisualMethodChange(event){
        this.setState({visualMethod: event.target.value});
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
        //this.setState({init_state: ''});
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
                    <TableComponent
                        onDataTableUpdate={this.handleDataTable.bind(this)}
                        onAddRow={this.handleAddRow.bind(this)}
                        onRemoveRow={this.handleRemoveRow.bind(this)}
                        mdpData={this.state.mdpdata}/>
                </div>
                <div className="optional">
                    <div className="init-data">
                        <label>
                            Gamma
                            <input type="number" name="gamma" className="gamma" min="0" max="1" step="0.1" value={this.state.gamma}
                                   onChange={this.handleChangeGamma}/>
                        </label>
                        <label className="only-opt">
                            <input type="checkbox" name="only_optimal"
                                   checked={this.state.onlyOptimal}
                                   onChange={this.handleChangeOnlyOptimal}/>
                            Display only optimal actions
                        </label>
                    </div>
                    <div className="radio-choice">
                        Graph visualization method
                        <p>
                            <label>
                                <input type="radio" name="circle" value="circle"
                                       checked={this.state.visualMethod === 'circle'}
                                       onChange={this.handleVisualMethodChange}/>
                                       Circle
                            </label>
                        </p>
                        <p>
                            <label>
                                <input type="radio" name="grid" value="grid"
                                       checked={this.state.visualMethod === 'grid'}
                                       onChange={this.handleVisualMethodChange}/>
                                Grid
                            </label>
                        </p>
                        <p>
                            <label>
                                <input type="radio" name="random" value="random"
                                       checked={this.state.visualMethod === 'random'}
                                       onChange={this.handleVisualMethodChange}/>
                                Random
                            </label>
                        </p>
                    </div>
                    <div className="buttons">
                        <button className="green-btn"
                                onClick={() => this.props.updateData(this.state.mdpdata, this.state.gamma,
                                    this.state.visualMethod, this.state.onlyOptimal)}>
                            Create graph
                        </button>
                        <button className="red-btn" onClick={this.handleClear}>Clear</button>
                        <button className="load-btn" onClick={this.handleDownload}>Download</button>
                        <button className="load-btn" onClick={this.clickForUpload}>
                            Upload
                            <input id="upload" type="file" accept=".txt" onChange={this.handleUpload}/>
                        </button>
                    </div>
                    <hr/>
                    <div className="graph-info">
                        <div className="info-item">
                            <img src={img_state} alt="State"/>
                            <div className="info-text">- state with its value</div>
                        </div>
                        <div className="info-item">
                            <img src={img_action} alt="Action"/>
                            <div className="info-text">- action</div>
                        </div>
                        <div className="info-item">
                            <img src={img_optimal} alt="Optimal"/>
                            <div className="info-text">- optimal action for this state</div>
                        </div>
                        <div className="info-item">
                            <img src={img_from_state} alt="From_state"/>
                            <div className="info-text">- line from state to its action</div>
                        </div>
                        <div className="info-item">
                            <img src={img_to_state} alt="To_state"/>
                            <div className="info-text">- line from action to next state</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function generateID() {
    return Math.random().toString(36).substr(2, 6);
}