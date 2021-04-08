import React, { useState } from 'react'
import 'mvp.css'
import './App.css'
import _ from 'lodash'

const divide = '\u00f7'

const medicines = [
    {
        drugName: "",
        units: "mg"
    },
    {
        drugName: "Morphine 1st Line",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 10, volume: 1 },
            { amount: 15, volume: 1 },
            { amount: 20, volume: 1 },
            { amount: 30, volume: 1 },
            { amount: 10, volume: 2 },
            { amount: 15, volume: 2 },
            { amount: 20, volume: 2 },
            { amount: 30, volume: 2 },
        ]
    },
    {
        drugName: "Diamorphine",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 10, volume: 1 },
            { amount: 15, volume: 1 },
            { amount: 30, volume: 1 },
            { amount: 100, volume: 1 },
            { amount: 10, volume: 2 },
            { amount: 15, volume: 2 },
            { amount: 30, volume: 2 },
            { amount: 100, volume: 2 },
        ]
    },
    {
        drugName: "Oxycodone",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 10, volume: 1 },
            { amount: 20, volume: 2 },
            { amount: 50, volume: 1 },
        ]
    },
    {
        drugName: "Fentanyl",
        units: "mcg",
        strengths: [
            { amount: 0 },
            { amount: 50, volume: 1 },
            { amount: 100, volume: 2 },
            { amount: 500, volume: 5 },
        ]
    },
    {
        drugName: "Haloperidol",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 5, volume: 1 },
        ]
    },
    {
        drugName: "Metoclopramide",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 10, volume: 2 },
        ]
    },
    {
        drugName: "Cyclizine",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 50, volume: 1 },
        ]
    },
    {
        drugName: "Levomepromazine",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 25, volume: 1 },
        ]
    },
    {
        drugName: "Midazolam",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 10, volume: 2 },
        ]
    },
    {
        drugName: "Hyoscine Butylbromide",
        units: "mg",
        strengths: [
            { amount: 0 },
            { amount: 20, volume: 1 },
        ]
    },
    {
        drugName: "Hyoscine Hydrobromide",
        units: "mcg",
        strengths: [
            { amount: 0 },
            { amount: 400, volume: 1 },
        ]
    },
]

function formatNumber(n) {
    return parseFloat(n.toFixed(2))
}

function Results({ drugIdx, strengthIdx, prescribedDose, numStatDoses, statDoseStrength }) {
    const units = medicines[drugIdx].units
    const drugStrength = medicines[drugIdx].strengths[strengthIdx]
    const totalDose = prescribedDose + numStatDoses * statDoseStrength
    const totalDoseMl = totalDose / drugStrength.amount * drugStrength.volume
    const numVials = _.ceil(totalDoseMl / drugStrength.volume)
    const waste = numVials * drugStrength.amount - totalDose
    const wasteMl = numVials * drugStrength.volume - totalDoseMl
    return (
        <div class="box">
                <label>Results:</label>
                <p>
                    <span>Total dose ({units}): {prescribedDose} + ({numStatDoses} x {statDoseStrength}) = {totalDose}{units}</span>
                </p>
                <p>
                    <span>Total dose (ml): {totalDose} {divide} {drugStrength.amount} x {drugStrength.volume} = {formatNumber(totalDoseMl)}ml</span>
                </p>
                <p>
                    <span>Number of vials: {numVials}</span>
                </p>
                <p>
                    <span>Waste: {formatNumber(waste)}{units} (= {formatNumber(wasteMl)}ml)</span>
                </p>
        </div>
    )
}

function MainView() {
    const [drugIdx, setDrugIdx] = useState(0)
    const [strengthIdx, setStrengthIdx] = useState(0)
    const [prescribedDoseStr, setPrescribedDoseStr] = useState("")
    const [numStatDoses, setNumStatDoses] = useState(0)
    const [statDoseStrengthStr, setStatDoseStrengthStr] = useState("")
    const [showResults, setShowResults] = useState(false)

    const prescribedDose = Number(prescribedDoseStr)
    const statDoseStrength = Number(statDoseStrengthStr)
    const units = medicines[drugIdx].units
    const showCalc = !showResults && !!(prescribedDose || (statDoseStrength && numStatDoses))

    function selectDrug(i) {
        if (medicines[i].units !== "mg") {
            alert(`NOTE: ${medicines[i].drugName} is measured in micrograms (mcg or μg), not milligrams (mg).\nThere are 1000mcg in 1mg`)
        }
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
        <form>
            <div>
                <label>Drug: </label>
                <select value={drugIdx} disabled={showResults} onChange={e => selectDrug(Number(e.target.value))}>
                    {medicines.map((x, i) => <option key={i} value={i}>{x.drugName}</option>)}
                </select>
            </div>
            {!!drugIdx && <div>
                <label>Strength: </label>
                <select value={strengthIdx} disabled={showResults} onChange={e => selectStrength(parseInt(e.target.value))}>
                    {medicines[drugIdx].strengths.map((x, i) => <option key={i} value={i}>{x.amount ? `${x.amount}${units}/${x.volume}ml` : ""}</option>)}
                </select>
            </div>}
            {!!strengthIdx && <>
                <div>
                    <label>Prescribed dose: </label>
                    <input type="number" disabled={showResults} min={0} value={prescribedDoseStr} onChange={e => setPrescribedDoseStr(e.target.value)} />
                    <span> {units}</span>
                </div>
                <div>
                    <label>Stat/PRN doses: </label>
                    <select value={numStatDoses} disabled={showResults} onChange={e => selectNumStatDoses(parseInt(e.target.value))}>
                        {_.range(7).map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                    <span> x </span>
                    <input type="number" min={0} disabled={showResults || (!numStatDoses)} value={statDoseStrengthStr} onChange={e => setStatDoseStrengthStr(e.target.value)} />
                    <span> {units}</span>
                </div>
                {showResults &&
                    <Results drugIdx={drugIdx} strengthIdx={strengthIdx} prescribedDose={prescribedDose} numStatDoses={numStatDoses} statDoseStrength={statDoseStrength} />}
                <button onClick={() => { selectDrug(0) }}>Reset</button>
                {showCalc && 
                    <button onClick={() => { setShowResults(true) }}>Calculate</button>
                }
            </>}
        </form>
    )
}

function Disclaimer({ callback }) {
    return (
        <div>
            <h3>Disclaimer</h3>
            <p>This application is intended to be used only to cross-check manual drug calculations.</p>
            <p>It is not approved by NHS or any other healthcare body and you should not rely on it to perform drug calculations.</p>
            <p>The authors accept no liability for any errors in the application.</p>
            <button onClick={callback}>OK</button>
        </div>
    )
}

export default function App() {
    const [disclaimerAgreed, setDisclaimerAgreed] = useState(false)
    return <>
        <h2>Drug calculation checker</h2>
        {disclaimerAgreed
            ? <MainView />
            : <Disclaimer callback={() => setDisclaimerAgreed(true)} />
        }
    </>
}
