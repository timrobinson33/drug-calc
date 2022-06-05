import React, { useState } from 'react'
import 'mvp.css'
import './App.css'
import _ from 'lodash'
import { version as appVersion }  from './autobuild_version'

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

function Results({ drugIdx, strengthIdx, dose }) {
    const units = medicines[drugIdx].units
    const drugStrength = medicines[drugIdx].strengths[strengthIdx]
    const doseMl = dose / drugStrength.amount * drugStrength.volume
    const numVials = _.ceil(doseMl / drugStrength.volume)
    const waste = numVials * drugStrength.amount - dose
    const wasteMl = numVials * drugStrength.volume - doseMl
    return (
        <div className="box">
            <label>Results:</label>
            <p>
                <span>Dose (ml): {dose} {divide} {drugStrength.amount} x {drugStrength.volume} = {formatNumber(doseMl)}ml</span>
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
    const [doseStr, setDoseStr] = useState("")
    const [showResults, setShowResults] = useState(false)

    const dose = Number(doseStr)
    const units = medicines[drugIdx].units
    const showCalc = !showResults && !!dose 

    function selectDrug(i) {
        if (medicines[i].units !== "mg") {
            alert(`NOTE: ${medicines[i].drugName} is measured in micrograms (mcg or μg), not milligrams (mg).\nThere are 1000mcg in 1mg`)
        }
        setDrugIdx(i)
        selectStrength(0)
    }

    function selectStrength(i) {
        setStrengthIdx(i)
        setDoseStr("")
        setShowResults(false)
    }

    return (
        <form>
            <div>
                <label htmlFor="drug">Drug:</label>
                <select id="drug" value={drugIdx} disabled={showResults} onChange={e => selectDrug(Number(e.target.value))}>
                    {medicines.map((x, i) => <option key={i} value={i}>{x.drugName}</option>)}
                </select>
            </div>
            {!!drugIdx && <div>
                <label htmlFor="strength">Strength:</label>
                <select id="strength" value={strengthIdx} disabled={showResults} onChange={e => selectStrength(parseInt(e.target.value))}>
                    {medicines[drugIdx].strengths.map((x, i) => <option key={i} value={i}>{x.amount ? `${x.amount}${units}/${x.volume}ml` : ""}</option>)}
                </select>
            </div>}
            {!!strengthIdx && <>
                <div>
                    <label htmlFor="dose">Dose:</label>
                    <input
                        id="dose"
                        type="number"
                        step="any"
                        disabled={showResults}
                        min={0}
                        value={doseStr}
                        onChange={event => {
                            if (event.target.validity.valid) {
                                setDoseStr(event.target.value)
                            }
                        }}
                    />
                    <span> {units}</span>
                </div>
                {showResults &&
                    <Results
                        drugIdx={drugIdx}
                        strengthIdx={strengthIdx}
                        dose={dose}
                    />}
                <button type="button" onClick={() => { selectDrug(0) }}>Reset</button>
                {showCalc &&
                    <button type="button" onClick={() => { setShowResults(true) }}>Calculate</button>
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
            <button type="button" onClick={callback}>OK</button>
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
        <div className="copyright">
            Version {appVersion}. Copyright (c) Tim Robinson https://github.com/timrobinson33
        </div>
    </>
}
