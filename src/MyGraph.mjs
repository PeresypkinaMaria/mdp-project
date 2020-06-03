//import React from 'react';
import cytoscape from 'cytoscape';
//import cytoscape from "../node_modules/cytoscape/dist/cytoscape.min.js"
//import cytoscape from "dist/cytoscape.cjs.js";
import MdpLogic from "./MdpLogic.mjs";

export default class MyGraph {
    constructor(g_data, i_state, gam) {
        this.mdpLogic = new MdpLogic(g_data, i_state, gam);
        this.optimalActions = this.mdpLogic.optimalActions;
    }

    createGraph(){
        var cy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {
                    selector: 'node',
                    style: {
                        shape: 'ellipse',
                        label: 'data(name)',
                        'text-halign': 'center',
                        'text-valign': 'center'
                    }
                },
                {
                    selector: '.states',
                    style: {
                        'background-color': '#a5ff92',
                        width: '70px',
                        height: '70px',
                        'font-size': '30px'
                    },
                },
                {
                    selector: '.actions',
                    style: {
                        'background-color': '#ffa59d',
                        width: '40px',
                        height: '40px',
                        'font-size': '20px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        label: 'data(name)',
                        'curve-style': 'unbundled-bezier',
                        'target-arrow-shape': 'triangle',
                        'text-rotation': 'autorotate',
                        'text-halign': 'center',
                        'text-valign': 'center',
                        'control-point-step-size': '70px' //под вопросом
                    }
                },
                {
                    selector: '.from_state',
                    style: {
                        'line-color': '#FFCC00',
                        'line-style': 'solid',
                        width: '6px',
                        'target-arrow-color': '#FFCC00'
                    }
                },
                {
                    selector: '.to_state',
                    style: {
                        'line-color': '#0000CC',
                        'line-style': 'dashed',
                        width: '2px',
                        'target-arrow-color': '#0000CC',
                        'text-background-color': '#FFFFFF',
                        'text-background-opacity': '1',
                        'text-background-shape': 'round-rectangle'
                    }
                },
                {
                    selector: '.optimal',
                    style: {
                        'line-color': '#66FF66',
                        'line-style': 'solid',
                        width: '8px',
                        'target-arrow-color': '#66FF66'
                    }
                }],
            //zoom: 1,
            userZoomingEnabled: true, //увеличение или уменьшение графа
            //minZoom:
            userPanningEnabled: false //перемещение всего графа
        });

        let i = 0;
        let j = 0;
        let created_nodes = new Array();
        for (let state of this.mdpLogic.mdp.getAllStates()){
            if (!(created_nodes.includes(state))) {
                cy.add({
                    group: 'nodes',
                    data: {id: state, name: state},
                    classes: 'states'
                });
                created_nodes.push(state);
            }
            for (let action of this.mdpLogic.mdp.getPossibleActions(state)){
                let new_act = action + j;
                cy.add({
                    group: 'nodes',
                    data: {id: new_act, name: action},
                    classes: 'actions',
                    parent: state
                });
                j++;

                let cl = 'from_state'
                if (this.checkOptimal(state, action)){
                    cl = 'optimal'
                }
                let s_to_a = state + action;
                cy.add({
                    group: 'edges',
                    data: {id: s_to_a, source: state, target: new_act},
                    classes: cl
                });
                let next_states = this.mdpLogic.mdp.getNextStates(state, action);
                for (let ns of next_states) {
                    if (!(created_nodes.includes(ns))) {
                        cy.add({
                            group: 'nodes',
                            data: {id: ns, name: ns},
                            classes: 'states'
                        });
                        created_nodes.push(ns);
                    }
                    let a_to_s = action + ns + i;
                    i++;
                    let prob = 'P: ' + this.mdpLogic.mdp.getTransitionProb(state, action, ns);
                    let reward = '; R: ' + this.mdpLogic.mdp.getReward(state, action, ns);
                    let edge_name = (this.mdpLogic.mdp.getReward(state, action, ns) == 0) ? prob : prob + reward;
                    cy.add({
                        group: 'edges',
                        data: {id: a_to_s, name: edge_name, source: new_act, target: ns, label: prob},
                        classes: 'to_state'
                    });
                }
            }
        }
        this.graph = cy;
        let layout = cy.layout({name:'circle'});
        //cy.center();
        layout.run();
    }

    destroyGraph(){
        this.graph.destroy();
    }

    checkOptimal(state, action){
        return this.optimalActions.has(state) && this.optimalActions.get(state) == action;
    }
}

/*var g_data = [
    {from_state: 's0', action: 'a0', to_state: 's0', probability: 0.5, reward: 0},
    {from_state: 's0', action: 'a0', to_state: 's2', probability: 0.5, reward: 0},
    {from_state: 's0', action: 'a1', to_state: 's2', probability: 1, reward: 0},
    {from_state: 's1', action: 'a0', to_state: 's0', probability: 0.7, reward: 5},
    {from_state: 's1', action: 'a0', to_state: 's1', probability: 0.1, reward: 0},
    {from_state: 's1', action: 'a0', to_state: 's2', probability: 0.2, reward: 0},
    {from_state: 's1', action: 'a1', to_state: 's1', probability: 0.95, reward: 0},
    {from_state: 's1', action: 'a1', to_state: 's2', probability: 0.05, reward: 0},
    {from_state: 's2', action: 'a0', to_state: 's0', probability: 0.4, reward: 0},
    {from_state: 's2', action: 'a0', to_state: 's2', probability: 0.6, reward: 0},
    {from_state: 's2', action: 'a1', to_state: 's0', probability: 0.3, reward: -1},
    {from_state: 's2', action: 'a1', to_state: 's1', probability: 0.3, reward: 0},
    {from_state: 's2', action: 'a1', to_state: 's2', probability: 0.4, reward: 0},
];

var my_g = new MyGraph(g_data, 's0', 0.9);
my_g.createGraph();*/