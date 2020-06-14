import React from 'react';
import './css/TableComponent.css';

export default class TableComponent extends React.Component{
    render() {
        let onDataUpdate = this.props.onDataUpdate;
        let removeRow = this.props.onRemoveRow;
        let mdpItem = this.props.mdpData.map(function (mdpItem) {
            return (
                <DataRow
                    onDataUpdate={onDataUpdate}
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
                <button className="green-btn add-row" onClick={this.props.onAddRow}>Add row</button>
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
                <EditableTextCell
                    onDataUpdate={this.props.onDataUpdate}
                    cellData={{
                        "type": "from_state",
                        value: this.props.mdpItem.from_state,
                        id: this.props.mdpItem.id}}
                />
                <EditableTextCell
                    onDataUpdate={this.props.onDataUpdate}
                    cellData={{
                        "type": "action",
                        value: this.props.mdpItem.action,
                        id: this.props.mdpItem.id}}
                />
                <EditableTextCell
                    onDataUpdate={this.props.onDataUpdate}
                    cellData={{
                        "type": "to_state",
                        value: this.props.mdpItem.to_state,
                        id: this.props.mdpItem.id}}
                />
                <EditableNumberCell
                    onDataUpdate={this.props.onDataUpdate}
                    cellData={{
                        "type": "probability",
                        value: this.props.mdpItem.probability,
                        id: this.props.mdpItem.id}}
                />
                <EditableTextCell
                    onDataUpdate={this.props.onDataUpdate}
                    cellData={{
                        "type": "reward",
                        value: this.props.mdpItem.reward,
                        id: this.props.mdpItem.id}}
                />
                <td>
                    <button className="red-btn remove-row" onClick={this.onRemoveEvent.bind(this)}>X</button>
                </td>
            </tr>
        );
    }
}

class EditableTextCell extends React.Component{
    render() {
        return(
            <td>
                <input
                    type="text"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onDataUpdate}/>
            </td>
        );
    }
}

//for Probability field
class EditableNumberCell extends React.Component{
    render() {
        return(
            <td>
                <input
                    type="number"
                    min="0.001" max="1" step="0.1"
                    name={this.props.cellData.type}
                    id={this.props.cellData.id}
                    value={this.props.cellData.value}
                    onChange={this.props.onDataUpdate}/>
            </td>
        );
    }
}