import MdpStructure from './MdpStructure.js';

export default class MdpLogic {
    constructor(data, init_state, gamma) {
        this.mdp = new MdpStructure(data, init_state);
        this.gamma = gamma;
        this.stateValues = [];
        //this.optimalActions = this.getOptimalActions();
    };

    //state-action value function Q(s, a)
    getActionValue(state_values, state, action) {
        let q = 0;
        let next_states = this.mdp.getNextStates(state, action);
        for (let next_state of next_states) {
            q += this.mdp.getTransitionProb(state, action, next_state) * (this.mdp.getReward(state, action, next_state) + this.gamma * state_values.get(next_state));
        }
        return q;
    };

    //get next V(s) ~ V(s) for i+1 ~ maxQ(s, a) for i
    getNewStateValue(state_values, state) {
        if (this.mdp.isTerminal(state))
            return 0;
        let q = [];
        let actions = this.mdp.getPossibleActions(state);
        for (let action of actions) {
            q.push(this.getActionValue(state_values, state, action));
        }
        return getMaxOfArray(q);
    };

    getFinalStateValue(){
        var num_iter = 100;
        var min_diff = 0.001;
        var state_values = new Map();

        for (let state of this.mdp.getAllStates()){
            state_values.set(state, 0);
        }

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

    getOptimalAction(state){
        let next_actions = this.mdp.getPossibleActions(state);
        let q_values = new Map();
        let q_arr = [];
        let i = 0;
        for (let action of next_actions){
            let action_value = this.getActionValue(this.stateValues, state, action);
            q_values.set(action_value, action);
            q_arr[i] = action_value;
            i++;
        }
        let max_q = getMaxOfArray(q_arr);
        return q_values.get(max_q);
    };

    getOptimalActions(){
        this.getFinalStateValue();
        let actions = new Map();
        for (let state of this.mdp.getAllStates()){
            if (!(this.mdp.isTerminal(state))){
                let act = this.getOptimalAction(state);
                actions.set(state, act);
            }

        }
        return actions;
    };

    checkData(){
        //check for initial state
        if (this.mdp.initial_state === '' || !this.mdp.checkInitState){
            alert("Please, enter the correct Initial state!");
            return false;
        }

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

/*var m_data = [
    {id: 1, from_state: 's0', action: 'a0', to_state: 's0', probability: 0.5, reward: 1},
    {id: 2, from_state: 's0', action: 'a0', to_state: 's2', probability: 0.5, reward: -1},
    {id: 2, from_state: 's0', action: 'a1', to_state: 's2', probability: 0.5, reward: 0},
    {id: 3, from_state: 's1', action: 'a0', to_state: 's0', probability: 0.7, reward: 5},
    {id: 3, from_state: 's1', action: 'a2', to_state: 's0', probability: 0.7, reward: 2},
    {id: 3, from_state: 's2', action: 'a2', to_state: 's0', probability: 0.7, reward: 0}
];*/