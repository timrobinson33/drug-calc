import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const _ok = () => screen.getByText("OK")
const _drug = () => screen.queryByLabelText("Drug:")
const _diamorphine = () => screen.queryByText("Diamorphine")
const _strength = () => screen.queryByLabelText("Strength:")
const _15mg_2ml = () => screen.queryByText("15mg/2ml")
const _prescribedDose = () => screen.queryByLabelText("Prescribed dose:")
const _statDoses = () => screen.queryByLabelText("+ Stat/PRN doses:")
const _reset = () => screen.queryByText("Reset")
const _calculate = () => screen.queryByText("Calculate")
const _statDoseStrength = () => screen.queryByTestId("stat-dose-strength")
const _results = () => screen.queryByText("Results:")

// used to set up most tests
function fillInEverything() {
  render(<App />)
  userEvent.click(_ok())
  userEvent.selectOptions(_drug(), _diamorphine())
  userEvent.selectOptions(_strength(), _15mg_2ml())
  userEvent.type(_prescribedDose(), "25")
  userEvent.selectOptions(_statDoses(), "3")
  userEvent.type(_statDoseStrength(), "5")
}

test('happy path', () => {
  render(<App />)

  // disclaimer
  screen.getByText("Disclaimer")
  expect(_drug()).toBeFalsy()
  expect(_diamorphine()).toBeFalsy()
  userEvent.click(_ok())
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()

  // select a drug
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  userEvent.selectOptions(_drug(), _diamorphine())
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeTruthy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()

  // select a strength
  expect(_prescribedDose()).toBeFalsy()
  expect(_statDoses()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  userEvent.selectOptions(_strength(), _15mg_2ml())
  expect(_prescribedDose()).toBeTruthy()
  expect(_statDoses()).toBeTruthy()
  expect(_statDoseStrength()).toBeTruthy()
  expect(_statDoseStrength()).toBeDisabled()
  expect(_reset()).toBeTruthy()

  // enter a dose
  expect(_calculate()).toBeFalsy()
  userEvent.type(_prescribedDose(), "25")
  expect(_calculate()).toBeTruthy()
  userEvent.selectOptions(_statDoses(), "3")
  expect(_calculate()).toBeFalsy()
  userEvent.type(_statDoseStrength(), "5")
  expect(_calculate()).toBeTruthy()
  expect(_reset()).toBeTruthy()

  // click calculate
  expect(_results()).toBeFalsy()
  userEvent.click(_calculate())
  expect(_results()).toBeTruthy()
  screen.getByText("Total dose (mg): 25 + (3 x 5) = 40mg")
  screen.getByText("Total dose (ml): 40 ÷ 15 x 2 = 5.33ml")
  screen.getByText("Number of vials: 3")
  screen.getByText("Waste: 5mg (= 0.67ml)")
  expect(_reset()).toBeTruthy()

  // click reset
  userEvent.click(_reset())
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  expect(_prescribedDose()).toBeFalsy()
  expect(_statDoses()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})


test('select a blank drug -> everything clears', () => {
  fillInEverything()
  userEvent.selectOptions(_drug(), "0")
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  expect(_prescribedDose()).toBeFalsy()
  expect(_statDoses()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select a different drug -> everything clears and strength shows new values', () => {
  fillInEverything()
  userEvent.selectOptions(_drug(), screen.getByText("Oxycodone"))
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeFalsy() // oxycodone not available in 15mg/2ml
  screen.getByText("20mg/2ml")  // oxycodone is available in 20mg/2ml
  expect(_prescribedDose()).toBeFalsy()
  expect(_statDoses()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select blank strength -> everything below clears', () => {
  fillInEverything()
  userEvent.selectOptions(_strength(), "0")
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeTruthy()
  expect(_prescribedDose()).toBeFalsy()
  expect(_statDoses()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select different strength -> doses reset to blank', () => {
  fillInEverything()
  userEvent.selectOptions(_strength(), screen.getByText("10mg/1ml"))
  expect(_prescribedDose()).toHaveValue(null)
  expect(_statDoses()).toHaveValue("0")
  expect(_statDoseStrength()).toHaveValue(null)
  expect(_reset()).toBeTruthy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('Set stat prn to zero -> clears stat dose', () => {
  fillInEverything()
  userEvent.selectOptions(_statDoses(), "0")
  expect(_statDoseStrength()).toHaveValue(null)
  expect(_statDoseStrength()).toBeDisabled()

  // now select it again -> control is re-enabled but value still blank
  userEvent.selectOptions(_statDoses(), "3")
  expect(_statDoseStrength()).not.toBeDisabled()
  expect(_statDoseStrength()).toHaveValue(null)
})

