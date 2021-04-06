import React, { useState } from 'react'
import './App.css';
import _ from 'lodash'

const divide = '\u00f7'

const medicines = [
    { drugName: "" },
    {
        drugName: "Morphine 1st Line",
        strengths: [
            { mg: 0 },
            { mg: 10, ml: 1 },
            { mg: 15, ml: 1 },
            { mg: 20, ml: 1 },
            { mg: 30, ml: 1 },
            { mg: 10, ml: 2 },
            { mg: 15, ml: 2 },
            { mg: 20, ml: 2 },
            { mg: 30, ml: 2 },
        ]
    },
    {
        drugName: "Diamorphine",
        strengths: [
            { mg: 0 },
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
        drugName: "Oxycodone",
        strengths: [
            { mg: 0 },
            { mg: 10, ml: 1 },
            { mg: 20, ml: 2 },
            { mg: 50, ml: 1 },
        ]
    },
    {
        drugName: "Fentanyl",
        strengths: [
            { mg: 0 },
            { mg: 0.05, ml: 1 },
            { mg: 0.1, ml: 2 },
            { mg: 0.5, ml: 5 },
        ]
    },
    {
        drugName: "Haloperidol",
        strengths: [
            { mg: 0 },
            { mg: 5, ml: 1 },
        ]
    },
    {
        drugName: "Metoclopramide",
        strengths: [
            { mg: 0 },
            { mg: 10, ml: 2 },
        ]
    },
    {
        drugName: "Cyclizine",
        strengths: [
            { mg: 0 },
            { mg: 50, ml: 1 },
        ]
    },
    {
        drugName: "Levomepromazine",
        strengths: [
            { mg: 0 },
            { mg: 25, ml: 1 },
        ]
    },
    {
        drugName: "Midazolam",
        strengths: [
            { mg: 0 },
            { mg: 10, ml: 2 },
        ]
    },
    {
        drugName: "Hyoscine Butylbromide",
        strengths: [
            { mg: 0 },
            { mg: 20, ml: 1 },
        ]
    },
    {
        drugName: "Hyoscine Hydrobromide",
        strengths: [
            { mg: 0 },
            { mg: 0.4, ml: 1 },
        ]
    },
]

function formatNumber(n) {
    return parseFloat(n.toFixed(2))
}

function Results({ drugIdx, strengthIdx, prescribedDose, numStatDoses, statDoseStrength }) {
    const drugStrength = medicines[drugIdx].strengths[strengthIdx]
    const totalDoseMg = prescribedDose + numStatDoses * statDoseStrength
    const totalDoseMl = totalDoseMg / drugStrength.mg * drugStrength.ml
    const numVials = _.ceil(totalDoseMl / drugStrength.ml)
    const wasteMl = numVials * drugStrength.ml - totalDoseMl
    const wasteMg = numVials * drugStrength.mg - totalDoseMg
    return <>
        <div>
            <span>Total dose (mg): {prescribedDose} + ({numStatDoses} x {statDoseStrength}) = {totalDoseMg}mg</span>
        </div>
        <div>
            <span>Total dose (ml): {totalDoseMg} {divide} {drugStrength.mg} x {drugStrength.ml} = {formatNumber(totalDoseMl)}ml</span>
        </div>
        <div>
            <span>Number of vials: {numVials}</span>
        </div>
        <div>
            <span>Waste: {formatNumber(wasteMg)}mg (= {formatNumber(wasteMl)}ml)</span>
        </div>
    </>
}

export default function App() {
    const [drugIdx, setDrugIdx] = useState(0)
    const [strengthIdx, setStrengthIdx] = useState(0)
    const [prescribedDoseStr, setPrescribedDoseStr] = useState("")
    const [numStatDoses, setNumStatDoses] = useState(0)
    const [statDoseStrengthStr, setStatDoseStrengthStr] = useState("")
    const [showResults, setShowResults] = useState(false)

    const prescribedDose = Number(prescribedDoseStr)
    const statDoseStrength = Number(statDoseStrengthStr)
    const showCalc = !showResults && !!(prescribedDose || (statDoseStrength && numStatDoses))

    function selectDrug(i) {
        setDrugIdx(i)
        selectStrength(0)
    }

    function selectStrength(i) {
        setStrengthIdx(i)
        setPrescribedDoseStr("")
        selectNumStatDoses(0)
        setShowResults(false)
    }

    function selectNumStatDoses(n) {
        setNumStatDoses(n)
        if (!n) {
            setStatDoseStrengthStr("")
        }
    }

    return (
        <div>
            <div>
                <span>Drug: </span>
                <select value={drugIdx} disabled={showResults} onChange={e => selectDrug(Number(e.target.value))}>
                    {medicines.map((x, i) => <option key={i} value={i}>{x.drugName}</option>)}
                </select>
            </div>
            {!!drugIdx && <div>
                <span>Strength: </span>
                <select value={strengthIdx} disabled={showResults} onChange={e => selectStrength(parseInt(e.target.value))}>
                    {medicines[drugIdx].strengths.map((x, i) => <option key={i} value={i}>{x.mg ? `${x.mg}mg/${x.ml}ml` : ""}</option>)}
                </select>
            </div>}
            {!!strengthIdx && <>
                <div>
                    <span>Prescribed dose: </span>
                    <input type="number" disabled={showResults} min={0} value={prescribedDoseStr} onChange={e => setPrescribedDoseStr(e.target.value)} />
                    <span> mg</span>
                </div>
                <div>
                    <span>Stat/PRN doses: </span>
                    <select value={numStatDoses} disabled={showResults} onChange={e => selectNumStatDoses(parseInt(e.target.value))}>
                        {_.range(7).map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                    <span> x </span>
                    <input type="number" min={0} disabled={showResults || (!numStatDoses)} value={statDoseStrengthStr} onChange={e => setStatDoseStrengthStr(e.target.value)} />
                    <span> mg</span>
                </div>
                {showCalc && <div>
                    <button onClick={() => { setShowResults(true) }}>Calculate</button>
                </div>}
                {showResults &&
                    <Results drugIdx={drugIdx} strengthIdx={strengthIdx} prescribedDose={prescribedDose} numStatDoses={numStatDoses} statDoseStrength={statDoseStrength} />}
                <button onClick={() => { selectDrug(0) }}>Clear</button>
            </>}
        </div>
    );
}
