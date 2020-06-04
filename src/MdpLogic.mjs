import MdpStructure from './MdpStructure.mjs';

export default class MdpLogic {
    constructor(data, init_state, gamma) {
        this.mdp = new MdpStructure(data, init_state);
        this.gamma = gamma;
        this.stateValues = [];
        this.optimalActions = this.getOptimalActions();
    };

    getActionValue(state_values, state, action) {
        let q = 0;
        let next_states = this.mdp.getNextStates(state, action);
        for (let ns of next_states) {
            q += this.mdp.getTransitionProb(state, action, ns) * (this.mdp.getReward(state, action, ns) + this.gamma * state_values.get(ns));
        }
        return q;
    };

    getNewStateValue(state_values, state) {
        if (this.mdp.isTerminal(state))
            return 0;
        let q = [];
        let actions = this.mdp.getPossibleActions(state);
        for (let act of actions) {
            q.push(this.getActionValue(state_values, state, act, this.gamma));
        }
        return getMaxOfArray(q);
    };

    getFinalStateValue(){
        var num_iter = 100;
        var min_diff = 0.001;
        var state_values = new Map();

        for (let s of this.mdp.getAllStates()){
            state_values.set(s, 0);
        }

        for (let i = 0; i < num_iter; i++){
            let new_state_values = new Map();
            for (let s of this.mdp.getAllStates()){
                new_state_values.set(s, this.getNewStateValue(state_values, s, this.gamma));
            }

            let arr_diff = [];
            let j = 0;
            for (let s of this.mdp.getAllStates()){
                arr_diff[j] = Math.abs(new_state_values.get(s) - state_values.get(s));
                j++;
            }
            let diff = getMaxOfArray(arr_diff);

            console.log(`iter ${i}    |    diff: ${diff.toFixed(5)}    |`);
            console.group();
            for (let s of state_values.keys()){
                console.log(`V(${s}) = ${state_values.get(s).toFixed(3)}`);
            }
            console.groupEnd();
            state_values = new_state_values;

            if (diff < min_diff){
                console.log("Terminated");
                break;
            }
        }

        /*for (let s of state_values.keys()){
            console.log(s, state_values.get(s));
        }*/
        this.stateValues = state_values;
    };

    getOptimalAction(state){
        this.getFinalStateValue();
        if (this.mdp.isTerminal(state)){
            return NaN;
        }
        let next_actions = this.mdp.getPossibleActions(state);
        let q_values = new Map();
        let q_arr = [];
        let i = 0;
        for (let action of next_actions){
            q_values.set(this.getActionValue(this.stateValues, state, action), action);
            q_arr[i] = this.getActionValue(this.stateValues, state, action);
            i++;
        }
        let max_q = getMaxOfArray(q_arr);
        let act = q_values.get(max_q);
        return act;
    };

    getOptimalActions(){
        let act_arr = new Map();
        let i = 0;
        for (let state of this.mdp.getAllStates()){
            let act = this.getOptimalAction(state);
            act_arr.set(state, act);
        }
        return act_arr;
    };

    checkData(){
        //check for initial state
        if (this.mdp.initial_state == '' || !this.mdp.checkInitState){
            alert("Please, enter the correct Initial state!");
            return false;
        }

        //check for gamma
        if (isNaN(this.gamma) === true || this.gamma == ""){
            alert("Please, enter the correct Gamma!");
            return false;
        }

        for (let state of this.mdp.getAllStates()){
            for (let action of this.mdp.getPossibleActions(state)){
                let sum_probs = 0;
                for (let next_state of this.mdp.getNextStates(state, action)) {
                    sum_probs += this.mdp.getTransitionProb(state, action, next_state);

                    //check for rewards
                    if (isNaN(this.mdp.getReward(state, action, next_state)) === true) {
                        alert("Please, input only numbers to rewards! Please, check reward with data: state - " + state
                        + "; action -  " + action + "; to state - " + next_state);
                        return false;
                    }
                }

                //check for probabilities
                if (sum_probs != 1){
                    alert("The sum of the probabilities for one state should be equal to 1! Please, check actions like "
                    + action + " for state " + state);
                    return false;
                }
            }
        }
        return true;
    };
}

export function getMaxOfArray(numArray){
    let max = Math.max.apply(null, numArray);
    return max;
}

/*var m_data = [
    {id: 1, from_state: 's0', action: 'a0', to_state: 's0', probability: 0.5, reward: 1},
    {id: 2, from_state: 's0', action: 'a0', to_state: 's2', probability: 0.5, reward: -1},
    {id: 2, from_state: 's0', action: 'a1', to_state: 's2', probability: 0.5, reward: 0},
    {id: 3, from_state: 's1', action: 'a0', to_state: 's0', probability: 0.7, reward: 5},
    {id: 3, from_state: 's1', action: 'a2', to_state: 's0', probability: 0.7, reward: 2},
    {id: 3, from_state: 's2', action: 'a2', to_state: 's0', probability: 0.7, reward: 0}
];*/