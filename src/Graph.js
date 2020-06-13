import cytoscape from 'cytoscape';

export default class Graph {
    constructor(mdpLogic, visual_method, only_opt) {
        this.mdpLogic = mdpLogic;
        this.visualMethod = visual_method;
        this.onlyOptimal = only_opt;
    }

    createGraph(){
        let cy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {
                    selector: 'node',
                    style: {
                        shape: 'ellipse',
                        label: 'data(name)',
                        'text-halign': 'center',
                        'text-valign': 'center',
                        'text-wrap': 'wrap'
                    }
                },
                {
                    selector: '.states',
                    style: {
                        'background-color': '#a5ff92',
                        width: '120px',
                        height: '120px',
                        'font-size': '26px',
                        'text-max-width': '10px'
                    },
                },
                {
                    selector: '.actions',
                    style: {
                        'background-color': '#ffa59d',
                        width: '80px',
                        height: '80px',
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
            userZoomingEnabled: true, //увеличение или уменьшение графа
            userPanningEnabled: true //перемещение всего графа
        });

        let optimalActions = this.mdpLogic.valueIteration();

        if (this.onlyOptimal){
            cy = this.createOnlyOptimalGraph(cy, optimalActions);
        } else {
            cy = this.createFullGraph(cy, optimalActions);
        }

        this.graph = cy;
        cy.minZoom(0.2);
        cy.maxZoom(1);
        cy.fit();
        let layout;
        switch (this.visualMethod) {
            case 'circle':
                layout = cy.layout({name: 'circle'});
                break;
            case 'grid':
                layout = cy.layout({name: 'grid'});
                break;
            case 'random':
                layout = cy.layout({name: 'random'});
                break;
            default:
                layout = cy.layout({name: 'circle'});
        }

        layout.run();
    };

    createOnlyOptimalGraph(cyt, opt_act){
        let cy = cyt;
        let optimalActions = opt_act;
        let i = 0;
        let j = 0;
        let created_nodes = [];
        for (let state of this.mdpLogic.mdp.getAllStates()) {
            if (!(created_nodes.includes(state))) {
                cy.add({
                    group: 'nodes',
                    data: {id: state, name: state + ' ' + this.mdpLogic.stateValues.get(state).toFixed(2)},
                    classes: 'states'
                });
                created_nodes.push(state);
            }
            for (let action of this.mdpLogic.mdp.getPossibleActions(state)) {
                if (this.checkOptimal(state, action, optimalActions)) {
                    let new_act = action + j;
                    cy.add({
                        group: 'nodes',
                        data: {id: new_act, name: action},
                        classes: 'actions',
                        parent: state
                    });
                    j++;

                    let cl = 'from_state';
                    if (optimalActions.has(state) && this.checkOptimal(state, action, optimalActions)) {
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
                                data: {id: ns, name: ns + ' ' + this.mdpLogic.stateValues.get(ns).toFixed(2)},
                                classes: 'states'
                            });
                            created_nodes.push(ns);
                        }
                        let a_to_s = action + ns + i;
                        i++;
                        let prob = 'P: ' + this.mdpLogic.mdp.getTransitionProb(state, action, ns);
                        let reward = '; R: ' + this.mdpLogic.mdp.getReward(state, action, ns);
                        let edge_name = (this.mdpLogic.mdp.getReward(state, action, ns) === 0) ? prob : prob + reward;
                        cy.add({
                            group: 'edges',
                            data: {id: a_to_s, name: edge_name, source: new_act, target: ns, label: prob},
                            classes: 'to_state'
                        });
                    }
                }
            }
        }
        return cy;
    };

    checkOptimal(state, action, optimal_actions){
        let actions = optimal_actions.get(state);
        for (let i = 0; i < actions.length; i++){
            if (actions[i] === action){
                return true;
            }
        }
        return false;
    }

    createFullGraph(cyt, opt_act){
        let cy = cyt;
        let optimalActions = opt_act;
        let i = 0;
        let j = 0;
        let created_nodes = [];
        for (let state of this.mdpLogic.mdp.getAllStates()){
            if (!(created_nodes.includes(state))) {
                cy.add({
                    group: 'nodes',
                    data: {id: state, name: state + ' ' + this.mdpLogic.stateValues.get(state).toFixed(2)},
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

                let cl = 'from_state';
                if (this.checkOptimal(state, action, optimalActions)){
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
                            data: {id: ns, name: ns + ' ' + this.mdpLogic.stateValues.get(ns).toFixed(2)},
                            classes: 'states'
                        });
                        created_nodes.push(ns);
                    }
                    let a_to_s = action + ns + i;
                    i++;
                    let prob = 'P: ' + this.mdpLogic.mdp.getTransitionProb(state, action, ns);
                    let reward = '; R: ' + this.mdpLogic.mdp.getReward(state, action, ns);
                    let edge_name = (this.mdpLogic.mdp.getReward(state, action, ns) === 0) ? prob : prob + reward;
                    cy.add({
                        group: 'edges',
                        data: {id: a_to_s, name: edge_name, source: new_act, target: ns, label: prob},
                        classes: 'to_state'
                    });
                }
            }
        }
        return cy;
    };

    destroyGraph(){
        this.graph.destroy();
    };
}