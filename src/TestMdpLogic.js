import MdpLogic from "./MdpLogic.js";
//import {getMaxOfArray} from "./MdpLogic.js";

var data = [
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

var gamma = 0.9;
var logic = new MdpLogic(data, 's0', gamma);

console.log(logic.mdp.getAllStates());

let act_arr = new Map();
let i = 0;
for (let state of logic.mdp.getAllStates()){
    let act = logic.getOptimalAction(state);
    act_arr.set(state, act);
    //console.log(state, act);
}

for (let key of act_arr.keys()){
    console.log(key, act_arr.get(key));
}
