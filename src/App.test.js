import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const _drug = () => screen.queryByLabelText("Drug:")
const _diamorphine = () => screen.queryByText("Diamorphine")
const _strength = () => screen.queryByLabelText("Strength:")
const _15mg_2ml = () => screen.queryByText("15mg/2ml")
const _prescribedDose = () => screen.queryByLabelText("Prescribed dose:")
const _statDose = () => screen.queryByLabelText("+ Stat/PRN doses:")
const _reset = () => screen.queryByText("Reset")
const _calculate = () => screen.queryByText("Calculate")
const _statDoseStrength = () => screen.queryByTestId("stat-dose-strength")
const _results = () => screen.queryByText("Results:")

test('happy path', () => {
  render(<App />)

  // disclaimer
  screen.getByText("Disclaimer")
  expect(_drug()).toBeFalsy()
  expect(_diamorphine()).toBeFalsy()
  userEvent.click(screen.getByText("OK"))
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
  expect(_statDose()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  userEvent.selectOptions(_strength(), _15mg_2ml())
  expect(_prescribedDose()).toBeTruthy()
  expect(_statDose()).toBeTruthy()
  expect(_statDoseStrength()).toBeTruthy()
  expect(_statDoseStrength()).toBeDisabled()
  expect(_reset()).toBeTruthy()
  
  // enter a dose
  expect(_calculate()).toBeFalsy()
  userEvent.type(_prescribedDose(), "25")
  expect(_calculate()).toBeTruthy()
  userEvent.selectOptions(_statDose(), "3")
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
  expect(_statDose()).toBeFalsy()
  expect(_statDoseStrength()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})


