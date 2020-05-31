import React from 'react';
import {BootstrapTable,
    TableHeaderColumn} from 'react-bootstrap-table';
import 'bootstrap/dist/css/bootstrap.css';
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
//import '../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
//import Row from "./Row";

export default class Table extends React.Component {
    render() {
        const options = {
            //afterInsertRow: onInsertRow,
            noDataText: 'Click New to add row',
            insertText: 'Add row'
        };

        const selectRowProp = {
            mode: 'checkbox'
        }

        return (
            <div>
                <BootstrapTable data={this.props.data}
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
            </div>
        );
    }
}