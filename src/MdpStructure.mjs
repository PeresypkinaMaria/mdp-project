export default class MdpStructure {
    constructor(data, init_state) {
        //тут проверка transition_probs
        this.transition_probs = createTransitionProbs(data);
        this.rewards = createRewards(data);
        this.initial_state = init_state;
        this.n_states = this.transition_probs.size;
    }

    getAllStates() {
        return this.transition_probs.keys();
    }

    getPossibleActions(state) {
        return this.transition_probs.get(state).keys();
    }

    //проверка, является ли state конечным
    isTerminal(state) {
        return this.getPossibleActions(state).size == 0;
    }

    getNextStates(state, action) {
        return this.transition_probs.get(state).get(action).keys();
    }

    getTransitionProb(state, action, next_state) {
        return this.transition_probs.get(state).get(action).get(next_state);
    }

    getReward(state, action, next_state) {
        if (this.rewards.has(state) && this.rewards.get(state).has(action) && this.rewards.get(state).get(action).has(next_state)){
            return this.rewards.get(state).get(action).get(next_state);
        }else{
            return 0;
        }
    }

    checkInitState(){
        for (let state of this.getAllStates()){
            if (state == this.initial_state)
                return true;
        }
        return false;
    }

    reset() {
    } //??
}

function createTransitionProbs(mdp_data) {
    let tp = new Map();
    for (let mdp_d of mdp_data) {
        var probs;
        var actions = tp.get(mdp_d.from_state);
        //если новый state (которого еще нет в tp)
        if (typeof actions == "undefined") {
            actions = new Map();
            probs = new Map();
            probs.set(mdp_d.to_state, Number(mdp_d.probability));
            actions.set(mdp_d.action, probs);
            tp.set(mdp_d.from_state, actions);
        } else { //если в tp есть такой state
            probs = actions.get(mdp_d.action);
            //если новый action (которого нет у данного state)
            if (typeof probs == "undefined") {
                probs = new Map();
                probs.set(mdp_d.to_state, Number(mdp_d.probability));
                actions.set(mdp_d.action, probs);
            } else { //если action для данного state есть
                if (!(probs.has(mdp_d.to_state))) { //если нет to_state для данного action
                    probs.set(mdp_d.to_state, Number(mdp_d.probability));
                } else {
                    //дублирование данных
                }
            }
        }
    }
    return tp;
}

function createRewards(mdp_data) {
    let rwd = new Map();
    for (let mdp_d of mdp_data) {
        if (Number(mdp_d.reward) != 0) {
            var rews;
            var actions = rwd.get(mdp_d.from_state);
            //если новый state (которого еще нет в tp)
            if (typeof actions == "undefined") {
                actions = new Map();
                rews = new Map();
                rews.set(mdp_d.to_state, Number(mdp_d.reward));
                actions.set(mdp_d.action, rews);
                rwd.set(mdp_d.from_state, actions);
            } else { //если в tp есть такой state
                rews = actions.get(mdp_d.action);
                //если новый action (которого нет у данного state)
                if (typeof rews == "undefined") {
                    rews = new Map();
                    rews.set(mdp_d.to_state, Number(mdp_d.reward));
                    actions.set(mdp_d.action, rews);
                } else { //если action для данного state есть
                    if (!(rews.has(mdp_d.to_state))) { //если нет to_state для данного action
                        rews.set(mdp_d.to_state, Number(mdp_d.reward));
                    } else {
                        //дублирование данных
                    }
                }
            }
        }
    }
    return rwd;
}