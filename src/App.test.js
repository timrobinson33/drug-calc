import { render, screen, fireEvent } from '@testing-library/react'
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

// userEvent.type is difficult to use with number fields, so we use this instead
export function fireChangeEvent(field, value) {
  fireEvent.change(field, { target: { value } });
}

// used to set up most tests
function fillInEverything() {
  render(<App />)
  userEvent.click(_ok())
  userEvent.selectOptions(_drug(), _diamorphine())
  userEvent.selectOptions(_strength(), _15mg_2ml())
  fireChangeEvent(_prescribedDose(), "25")
  userEvent.selectOptions(_statDoses(), "3")
  fireChangeEvent(_statDoseStrength(), "5")
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
  fireChangeEvent(_prescribedDose(), "25")
  expect(_calculate()).toBeTruthy()
  userEvent.selectOptions(_statDoses(), "3")
  expect(_calculate()).toBeFalsy()
  fireChangeEvent(_statDoseStrength(), "5")
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
  expect(screen.queryAllByText(/mg/)).toHaveLength(12)
  expect(screen.queryAllByText(/mcg/)).toHaveLength(0)
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

test('prescribed dose valid and invalid values', () => {
  fillInEverything()
  fireChangeEvent(_prescribedDose(), "9.9973")
  expect(_prescribedDose()).toHaveValue(9.9973)
  fireChangeEvent(_prescribedDose(), "0.0004")
  expect(_prescribedDose()).toHaveValue(0.0004)
  fireChangeEvent(_prescribedDose(), "999")
  expect(_prescribedDose()).toHaveValue(999)
  fireChangeEvent(_prescribedDose(), "-7")
  expect(_prescribedDose()).toHaveValue(999)
  fireChangeEvent(_prescribedDose(), "abc")
  expect(_prescribedDose()).toHaveValue(null)
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

test('stat dose strength valid and invalid values', () => {
  fillInEverything()
  fireChangeEvent(_statDoseStrength(), "9.9973")
  expect(_statDoseStrength()).toHaveValue(9.9973)
  fireChangeEvent(_statDoseStrength(), "0.0004")
  expect(_statDoseStrength()).toHaveValue(0.0004)
  fireChangeEvent(_statDoseStrength(), "999")
  expect(_statDoseStrength()).toHaveValue(999)
  fireChangeEvent(_statDoseStrength(), "-7")
  expect(_statDoseStrength()).toHaveValue(999)
  fireChangeEvent(_statDoseStrength(), "abc")
  expect(_statDoseStrength()).toHaveValue(null)
})

test('0 treated the same as blank in prescribed dose', () => {
  fillInEverything()
  userEvent.selectOptions(_statDoses(), "0")
  expect(_calculate()).toBeTruthy()
  fireChangeEvent(_prescribedDose(), "0")
  expect(_calculate()).toBeFalsy()
})

test('0 treated the same as blank in stat dose strength', () => {
  fillInEverything()
  fireChangeEvent(_prescribedDose(), "0")
  expect(_calculate()).toBeTruthy()
  fireChangeEvent(_statDoseStrength(), "0")
  expect(_calculate()).toBeFalsy()
})

test('calculation with no stat dose', () => {
  fillInEverything()
  fireChangeEvent(_statDoses(), "0")
  userEvent.click(_calculate())
  screen.getByText("Total dose (mg): 25 + (0 x 0) = 25mg")
  screen.getByText("Total dose (ml): 25 ÷ 15 x 2 = 3.33ml")
  screen.getByText("Number of vials: 2")
  screen.getByText("Waste: 5mg (= 0.67ml)")
})

test('calculation with no prescribed dose', () => {
  fillInEverything()
  fireChangeEvent(_prescribedDose(), "")
  userEvent.click(_calculate())
  screen.getByText("Total dose (mg): 0 + (3 x 5) = 15mg")
  screen.getByText("Total dose (ml): 15 ÷ 15 x 2 = 2ml")
  screen.getByText("Number of vials: 1")
  screen.getByText("Waste: 0mg (= 0ml)")
})

test('micrograms', () => {
  const windowAlertMock = jest.spyOn(window, "alert")
  windowAlertMock.mockImplementation(() => { })
  fillInEverything()
  expect(windowAlertMock).not.toHaveBeenCalled()

  // as soon as you select fentanyl, the alert is shown
  userEvent.selectOptions(_drug(), screen.getByText("Fentanyl"))
  expect(windowAlertMock).toHaveBeenCalledWith(expect.stringContaining("is measured in micrograms"))

  // fill in the fields and calculate
  userEvent.selectOptions(_strength(), screen.getByText("100mcg/2ml"))
  fireChangeEvent(_prescribedDose(), "25")
  userEvent.selectOptions(_statDoses(), "3")
  fireChangeEvent(_statDoseStrength(), "5")
  userEvent.click(_calculate())

  // everything is shown in mcg
  screen.getByText("Total dose (mcg): 25 + (3 x 5) = 40mcg")
  screen.getByText("Total dose (ml): 40 ÷ 100 x 2 = 0.8ml")
  screen.getByText("Number of vials: 1")
  screen.getByText("Waste: 60mcg (= 1.2ml)")
  expect(screen.queryAllByText(/mcg/)).toHaveLength(7)
  expect(screen.queryAllByText(/mg/)).toHaveLength(0)
})
