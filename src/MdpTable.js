import React from 'react';
import './MdpTable.css';

export default class MdpTable extends React.Component{
    render() {
        var onDataTableUpdate = this.props.onDataTableUpdate;
        var removeRow = this.props.onRemoveRow;
        var mdpItem = this.props.mdpData.map(function (mdpItem) {
            return (
                <DataRow
                    onDataTableUpdate={onDataTableUpdate}
                    mdpItem={mdpItem}
                    onRemoveEvent={removeRow.bind(this)}
                    key={mdpItem.id}/>)
        });

        return (
            <div className="my-table">
                <table>
                    <thead>
                        <tr>
                            <th>From state</th>
                            <th>Action</th>
                            <th>To state</th>
                            <th>Probability</th>
                            <th>Reward</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{mdpItem}</tbody>
                </table>
                <button className="green-btn" onClick={this.props.onAddRow}>Add row</button>
            </div>
        );
    }
}

class DataRow extends React.Component{
    onRemoveEvent(){
        this.props.onRemoveEvent(this.props.mdpItem);
    }

    render() {
        return(
            <tr>
                <EditableCell
                    onDataTableUpdate={this.props.onDataTableUpdate}
                    cellData={{
                        "type": "from_state",
                        value: this.props.mdpItem.from_state,
                        id: this.props.mdpItem.id}}
                />
                <EditableCell
                    onDataTableUpdate={this.props.onDataTableUpdate}
                    cellData={{
                        "type": "action",
                        value: this.props.mdpItem.action,
                        id: this.props.mdpItem.id}}
                />
                <EditableCell
                    onDataTableUpdate={this.props.onDataTableUpdate}
                    cellData={{
                        "type": "to_state",
                        value: this.props.mdpItem.to_state,
                        id: this.props.mdpItem.id}}
                />
                <EditableCell
                    onDataTableUpdate={this.props.onDataTableUpdate}
                    cellData={{
                        "type": "probability",
                        value: this.props.mdpItem.probability,
                        id: this.props.mdpItem.id}}
                />
                <EditableCell
                    onDataTableUpdate={this.props.onDataTableUpdate}
                    cellData={{
                        "type": "reward",
                        value: this.props.mdpItem.reward,
                        id: this.props.mdpItem.id}}
                />
                <td className="btn-field">
                    <button className="remove-row" onClick={this.onRemoveEvent.bind(this)}>X</button>
                </td>
            </tr>
        );
    }
}

class EditableCell extends React.Component{
    render() {
        return(
            <td className="data-fields">
                <input
                    type="text"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onDataTableUpdate}/>
            </td>
        );
    }
}