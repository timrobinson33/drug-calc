import React, { useState } from 'react'
import './App.css';
import _ from 'lodash'

const medicines = [
    { drugName: "" },
    {
        drugName: "Morphine 1st Line",
        strengths: [
            { mg: 10, ml: 1 },
            { mg: 15, ml: 1 },
            { mg: 30, ml: 1 },
            { mg: 30, ml: 1 },
            { mg: 10, ml: 2 },
            { mg: 15, ml: 2 },
            { mg: 30, ml: 2 },
            { mg: 30, ml: 2 },
        ]
    },
    {
        drugName: "Diamorphine",
        strengths: [
            { mg: 10, ml: 1 },
            { mg: 15, ml: 1 },
            { mg: 30, ml: 1 },
            { mg: 100, ml: 1 },
            { mg: 10, ml: 2 },
            { mg: 15, ml: 2 },
            { mg: 30, ml: 2 },
            { mg: 100, ml: 2 },
        ]
    },
    {
        drugName: "Haloperidol",
        strengths: [
            { mg: 5, ml: 1 },
        ]
    },
    {
        drugName: "Metoclopramide",
        strengths: [
            { mg: 10, ml: 2 },
        ]
    },
    {
        drugName: "Cyclizine",
        strengths: [
            { mg: 50, ml: 1 },
        ]
    },
    {
        drugName: "Levomepromazine",
        strengths: [
            { mg: 25, ml: 1 },
        ]
    },
    {
        drugName: "Midazolam",
        strengths: [
            { mg: 10, ml: 2 },
        ]
    },
    {
        drugName: "Haloperidol",
        strengths: [
            { mg: 5, ml: 1 },
        ]
    },
    {
        drugName: "Levomepromazine",
        strengths: [
            { mg: 25, ml: 1 },
        ]
    },
    {
        drugName: "Hyoscine Butylbromide",
        strengths: [
            { mg: 20, ml: 1 },
        ]
    },
    {
        drugName: "Hyoscine Hydrobromide",
        strengths: [
            { mg: 0.4, ml: 1 },
        ]
    },
]

function App() {
    const [drugIdx, setDrugIdx] = useState(0)
    const [strengthIdx, setStrengthIdx] = useState(0)
    const [prescribedDoseStr, setPrescribedDoseStr] = useState("")
    const [numStatDoses, setNumStatDoses] = useState(0)
    const [statDoseStrengthStr, setStatDoseStrengthStr] = useState("")

    const statDoseStrength = Number(statDoseStrengthStr)
    const prescribedDose = Number(prescribedDoseStr)

    const showCalc = !!(drugIdx && prescribedDoseStr)

    const totalDoseMg = showCalc && prescribedDose + numStatDoses * statDoseStrength
    const drugStrength = showCalc && medicines[drugIdx].strengths[strengthIdx]
    const totalDoseMl = showCalc && totalDoseMg / drugStrength.mg * drugStrength.ml
    const numVials = _.ceil(totalDoseMl / drugStrength.ml)
    const wasteMl = numVials * drugStrength.ml - totalDoseMl
    const wasteMg = numVials * drugStrength.mg - totalDoseMg

    const selectDrug = x => {
        setDrugIdx(x)
        setStrengthIdx(0)
        setPrescribedDoseStr("")
        setNumStatDoses(0)
        setStatDoseStrengthStr("")
    }

    const formatNumber = n => parseFloat(n.toFixed(2))

    return (
        <div>
            <div>
                <span>Drug: </span>
                <select value={drugIdx} onChange={e => selectDrug(Number(e.target.value))}>
                    {medicines.map((x, i) => <option key={i} value={i}>{x.drugName}</option>)}
                </select>
            </div>
            {!!drugIdx &&
                <div>
                    <span>Strength: </span>
                    <select value={strengthIdx} onChange={e => setStrengthIdx(parseInt(e.target.value))}>
                        {medicines[drugIdx].strengths.map((x, i) => <option key={i} value={i}>{`${x.mg}mg/${x.ml}ml`}</option>)}
                    </select>
                </div>
            }
            {!!drugIdx && <>
                <div>
                    <span>Prescribed dose: </span>
                    <input type="number" min={0} value={prescribedDoseStr} onChange={e => setPrescribedDoseStr(e.target.value)} />
                    <span> mg</span>
                </div>
                <div>
                    <span>Stat/PRN doses: </span>
                    <select onChange={e => setNumStatDoses(Number(e.target.value))}>
                        {_.range(7).map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                    {!!numStatDoses && <>
                        <span> x </span>
                        <input type="number" min={0} value={statDoseStrengthStr} onChange={e => setStatDoseStrengthStr(e.target.value)} />
                        <span> mg</span>
                    </>}
                </div>
                {showCalc && <>
                    <div>
                        <span>Total dose: {totalDoseMg}mg = {formatNumber(totalDoseMl)} ml</span>
                    </div>
                    <div>
                        <span>Number of vials: {numVials}</span>
                    </div>
                    <div>
                        <span>Waste: {wasteMg}mg = {formatNumber(wasteMl)}ml</span>
                    </div>
                </>}
                <button onClick={() => setDrugIdx(0)}>Clear</button>
            </>}
        </div>
    );
}

export default App;

/*
bug - select morphine, select strength not in list, select different drug, select amount
deal with change drug
layout
text boxes smaller

*/
