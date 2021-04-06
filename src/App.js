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

const STATUS_INITIAL = 0
const STATUS_DISCLAIMER_AGREED = 1
const STATUS_DRUG_SELECTED = 2
const STATUS_STRENGTH_SELECTED = 3
const STATUS_DOSE_ENTERED = 4
const STATUS_RESULT_DISPLAYED = 5

function formatNumber(n) {
    return parseFloat(n.toFixed(2))
}

function Results({ state }) {
    const prescribedDose = Number(state.prescribedDoseStr ?? 0)
    const drugStrength = medicines[state.drugIdx ?? 0].strengths[state.strengthIdx ?? 0]
    const statDoseStrength = Number(state.statDoseStrengthStr ?? 0)
    const totalDoseMg = prescribedDose + (state.numStatDoses ?? 0) * (statDoseStrength ?? 0)
    const totalDoseMl = totalDoseMg / drugStrength.mg * drugStrength.ml
    const numVials = _.ceil(totalDoseMl / drugStrength.ml)
    const wasteMl = numVials * drugStrength.ml - totalDoseMl
    const wasteMg = numVials * drugStrength.mg - totalDoseMg
    return <>
        <div>
            <span>Total dose (mg): {prescribedDose} + ({state.numStatDoses ?? 0} x {statDoseStrength}) = {totalDoseMg}mg</span>
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
    const [state, setState] = useState({ status: STATUS_INITIAL })

    const showResults = (state.status === STATUS_RESULT_DISPLAYED)

    const selectDrug = drugIdx => {
        setState({
            status: drugIdx ? STATUS_DRUG_SELECTED : STATUS_DISCLAIMER_AGREED,
            drugIdx,
        })
    }

    const mutateState = (status, rest) => setState({ ...state, status, ...rest })

    return (
        <div>
            <div>
                <span>Drug: </span>
                <select value={state.drugIdx ?? 0} disabled={showResults} onChange={e => selectDrug(Number(e.target.value))}>
                    {medicines.map((x, i) => <option key={i} value={i}>{x.drugName}</option>)}
                </select>
            </div>
            {state.status >= STATUS_DRUG_SELECTED &&
                <div>
                    <span>Strength: </span>
                    <select value={state.strengthIdx ?? 0} disabled={showResults} onChange={e => mutateState(STATUS_STRENGTH_SELECTED, { strengthIdx: parseInt(e.target.value) })}>
                        {medicines[state.drugIdx].strengths.map((x, i) => <option key={i} value={i}>{x.mg ? `${x.mg}mg/${x.ml}ml` : ""}</option>)}
                    </select>
                </div>
            }
            {state.status >= STATUS_STRENGTH_SELECTED && <>
                <div>
                    <span>Prescribed dose: </span>
                    <input type="number" disabled={showResults} min={0} value={state.prescribedDoseStr ?? ""} onChange={e => mutateState(STATUS_DOSE_ENTERED, { prescribedDoseStr: e.target.value })} />
                    <span> mg</span>
                </div>
                <div>
                    <span>Stat/PRN doses: </span>
                    <select value={state.numStatDoses ?? 0} disabled={showResults} onChange={e => mutateState(STATUS_DOSE_ENTERED, { numStatDoses: (parseInt(e.target.value)) })}>
                        {_.range(7).map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                    <span> x </span>
                    <input type="number" min={0} disabled={showResults} value={state.statDoseStrengthStr ?? ""} onChange={e => mutateState(STATUS_DOSE_ENTERED, { statDoseStrengthStr: e.target.value })} />
                    <span> mg</span>
                </div>
                {state.status === STATUS_DOSE_ENTERED && <div>
                    <button onClick={() => { mutateState(STATUS_RESULT_DISPLAYED) }}>Calculate</button>
                </div>}
                {showResults && <Results state={state} />}
                <button onClick={() => { selectDrug(0) }}>Clear</button>
            </>}
        </div>
    );
}
