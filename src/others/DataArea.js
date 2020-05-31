import React from 'react';
import Table from './BSTable.js';
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

//var data = [];
//[{id:'', from_state:'', action:'', to_state:'', probability:'', reward:''}]

export default class DataArea extends React.Component{
    constructor(props) {
        super(props);
        this.state = {value: []};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        var data = document.getElementById("bs-table");
        alert("Data: " + data);
        event.preventDefault();
    }

    /*to_transition_probs(){
        //this.state.value
    }*/

    render(){
        const options = {
            //afterInsertRow: onInsertRow,
            noDataText: 'Click New to add row',
            insertText: 'Add row'
        };

        const selectRowProp = {
            mode: 'checkbox'
        };

        return(
            <form onSubmit={this.handleSubmit}>
                <BootstrapTable id="bs-table"
                                data={this.state.value}
                                insertRow={true}
                                deleteRow={true}
                                selectRow={selectRowProp}
                                options={options}
                                className="table-bordered">
                    <TableHeaderColumn isKey={true} dataField='id' autoValue={true}>№</TableHeaderColumn>
                    <TableHeaderColumn dataField='from_state'>
                        From state
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='action'>
                        Action
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='to_state'>
                        To state
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='probability'>
                        Probability
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='reward'>
                        Reward
                    </TableHeaderColumn>
                </BootstrapTable>
                <input type="submit" value="Create"/>
            </form>
        )
    }
}