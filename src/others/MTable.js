import React from 'react';
import MaterialTable from "material-table";
//import { AddBox, ArrowDownward } from "@material-ui/icons";

export default class MTable extends React.Component{
    render(){
        return(
            <div style={{maxWidth:"100%"}}>
            <MaterialTable columns={[
                {title:"From state", field:"from_state"},
                {title:"Action", field:"action"},
                {title:"To state", field:"to_state"},
                {title:"Probability", field:"probability"},
                {title:"Reward", field:"reward"}
            ]} data={[{from_state:"1", action:"1", to_state:"1", probability:"1", reward:"1"}]}
            title="DEMO"/>
            </div>
        )
    }
}