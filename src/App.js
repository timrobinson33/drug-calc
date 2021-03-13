import './App.css';

const medicines = [
  { drugName: "Morphine 1st Line"},
  { drugName: "Diamorphine" },
  { drugName: "Haloperidol" },
  { drugName: "Metoclopramide" },
  { drugName: "Cyclizine" },
  { drugName: "Levomepromazine" },
  { drugName: "Midazolam" },
  { drugName: "Haloperidol" },
  { drugName: "Levomepromazine" },
  { drugName: "Hyoscine Butylbromide" },
  { drugName: "Hyoscine Hydrobromide" },
]

function App() {
  return (

    <div>
      <select>
      {medicines.map(o => <option value={o.drugName}>{o.drugName}</option>)}
      </select>
      </div>

  );
}

export default App;

