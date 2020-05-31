import React from 'react';
//import '../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
//import 'bootstrap/dist/css/bootstrap.min.css'
import '../MdpTable.css';

function addRow(){
    var tab = document.getElementById('my_table');
    var cnt_row = tab.rows.length;
    var tr = tab.insertRow(cnt_row);

    var cnt_head = 6; //count of column
    for (var c = 0; c < cnt_head; c++){
        var td = document.createElement('td');
        td = tr.insertCell(c);
        if (c == 0){
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'Remove');
            button.setAttribute('onclick', 'remove(this)');
            td.appendChild(button);
        }
        else{
            var ele = document.createElement('input');
            ele.setAttribute('type', 'text');
            ele.setAttribute('value', '');
            td.appendChild(ele);
        }
    }
}

function removeRow(oButton) {
    var tab = document.getElementById('table');
    tab.deleteRow(oButton.parentNode.parentNode.rowIndex);
}

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickAdd = this.handleClickAdd.bind(this);
    }

    handleClickAdd(){
        addRow();
    }

    render() {
        return (
            <div>
                <div>
                    <input type="button" id="addRow" value="Add row" onClick={() => this.handleClickAdd()}/>
                </div>
                <div>
                    <table id="my_table">
                        <thead>
                        <tr>
                            <th data-field='btn_remove'></th>
                            <th data-field='from_state'>From state</th>
                            <th data-field='action'>Action</th>
                            <th data-field='to_state'>To state</th>
                            <th data-field='probability'>Probability</th>
                            <th data-field='reward'>Reward</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        );
    }
}

export default Table;