import MdpStructure from './MdpStructure.js';

export default class MdpLogic {
    constructor(data, gamma) {
        this.mdp = new MdpStructure(data);
        this.gamma = gamma;
        this.stateValues = new Map();
        for (let state of this.mdp.getAllStates()) {
            this.stateValues.set(state, 0);
        }
    };

    getValue(state_values, state, action){
        let v = 0;
        let next_states = this.mdp.getNextStates(state, action);
        for (let next_state of next_states){
            v += this.mdp.getTransitionProb(state, action, next_state) * (this.mdp.getReward(state, action, next_state) + this.gamma * state_values.get(next_state));
        }
        return v;
    }

    //for policy iteration
    getNewStateValue(state_values, state){
        if (this.mdp.isTerminal(state))
            return 0;
        let sv_p = 0;
        let sv_v = [];
        let actions = this.mdp.getPossibleActions(state);
        let act_prob = (1 / this.mdp.transition_probs.get(state).size).toFixed(2);
        for (let action of actions){
            sv_v.push(this.getValue(state_values, state, action));
        }
        return getMaxOfArray(sv_v);
    };

    iterativePolicyEvaluation(){
        let num_iter = 100;
        let min_diff = 0.001;

        //инициализация
        let state_values = this.stateValues;

        for (let i = 0; i < num_iter; i++){
            let new_state_values = new Map();
            for (let state of state_values.keys()){
                new_state_values.set(state, this.getNewStateValue(state_values, state));
            }

            let arr_diff = [];
            let j = 0;
            for (let state of state_values.keys()){
                arr_diff[j] = Math.abs(new_state_values.get(state) - state_values.get(state));
                j++;
            }
            let diff = getMaxOfArray(arr_diff);

            console.log(`iter ${i}    |    diff: ${diff.toFixed(5)}    |`);
            console.group();
            for (let state of state_values.keys()){
                console.log(`V(${state}) = ${state_values.get(state).toFixed(3)}`);
            }
            console.groupEnd();

            state_values = new_state_values;

            if (diff < min_diff){
                console.log("Terminated");
                break;
            }
        }

        for (let s of state_values.keys()){
            console.log(s, state_values.get(s));
        }

        this.stateValues = state_values;
    };

    getOptimalAction(state) {
        let actions = this.mdp.getPossibleActions(state);
        let q_values = new Map();
        let q_arr = [];
        let i = 0;
        for (let action of actions){
            let action_value = this.getValue(this.stateValues, state, action);
            if (q_values.has(action_value)){
                q_values.get(action_value).push(action);
            } else {
                let opt_act = [];
                opt_act.push(action);
                q_values.set(action_value, opt_act);
                q_arr[i] = action_value;
                i++;
            }
        }
        let max_q = getMaxOfArray(q_arr);
        return q_values.get(max_q);
    };

    getOptimalActions(){
        let actions = new Map();
        for (let state of this.mdp.getAllStates()){
            if (!(this.mdp.isTerminal(state))){
                let act = this.getOptimalAction(state);
                actions.set(state, act);
            }
        }
        return actions;
    };

    valueIteration(){
        this.iterativePolicyEvaluation();
        return this.getOptimalActions();
    }

    checkData(){
        //check for gamma
        if (isNaN(this.gamma) === true || this.gamma === ""){
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
                if (sum_probs !== 1){
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
    return Math.max.apply(null, numArray);
}