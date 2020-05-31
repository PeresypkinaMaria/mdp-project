import React from 'react';
import './App.css';
//import MdpTable from "./MdpTable";
import BuildGraph from "./BuildGraph";

/*var data = [
    {id: 1, from_state: 's0', action: 'a0', to_state: 's0', probability: 0.5, reward: 0},
    {id: 2, from_state: 's0', action: 'a0', to_state: 's2', probability: 0.5, reward: 0},
    {id: 3, from_state: 's1', action: 'a0', to_state: 's0', probability: 0.7, reward: 5}
];*/

function App() {
  return (
      <div className="App">
          <BuildGraph></BuildGraph>
      </div>
  );
}

export default App;
