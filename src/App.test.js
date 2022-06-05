import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const _ok = () => screen.getByText("OK")
const _drug = () => screen.queryByLabelText("Drug:")
const _diamorphine = () => screen.queryByText("Diamorphine")
const _strength = () => screen.queryByLabelText("Strength:")
const _15mg_2ml = () => screen.queryByText("15mg/2ml")
const _dose = () => screen.queryByLabelText("Dose:")
const _reset = () => screen.queryByText("Reset")
const _calculate = () => screen.queryByText("Calculate")
const _results = () => screen.queryByText("Results:")

const typeInField = (field, value) => user.type(field, value, { initialSelectionStart: 0, initialSelectionEnd: 999 })

const user = userEvent.setup()

// used to set up most tests
async function fillInEverything() {
  render(<App />)
  await user.click(_ok())
  await user.selectOptions(_drug(), _diamorphine())
  await user.selectOptions(_strength(), _15mg_2ml())
  await typeInField(_dose(), "25")
}

test('happy path', async () => {
  render(<App />)

  // disclaimer
  screen.getByText("Disclaimer")
  expect(_drug()).toBeFalsy()
  expect(_diamorphine()).toBeFalsy()
  await userEvent.click(_ok())
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()

  // select a drug
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  await user.selectOptions(_drug(), _diamorphine())
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeTruthy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()

  // select a strength
  expect(_dose()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  await user.selectOptions(_strength(), _15mg_2ml())
  expect(_dose()).toBeTruthy()
  expect(_reset()).toBeTruthy()

  // enter a dose
  expect(_calculate()).toBeFalsy()
  await user.type(_dose(), "25")
  expect(_calculate()).toBeTruthy()
  expect(_reset()).toBeTruthy()

  // click calculate
  expect(_results()).toBeFalsy()
  await user.click(_calculate())
  expect(_results()).toBeTruthy()
  screen.getByText("Dose (ml): 25 ÷ 15 x 2 = 3.33ml")
  screen.getByText("Number of vials: 2")
  screen.getByText("Waste: 5mg (= 0.67ml)")
  expect(screen.queryAllByText(/mg/)).toHaveLength(10)
  expect(screen.queryAllByText(/mcg/)).toHaveLength(0)
  expect(_reset()).toBeTruthy()

  // click reset
  await user.click(_reset())
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  expect(_dose()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select a blank drug -> everything clears', async () => {
  await fillInEverything()
  await user.selectOptions(_drug(), "0")
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeFalsy()
  expect(_15mg_2ml()).toBeFalsy()
  expect(_dose()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select a different drug -> everything clears and strength shows new values', async () => {
  await fillInEverything()
  await user.selectOptions(_drug(), screen.getByText("Oxycodone"))
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeFalsy() // oxycodone not available in 15mg/2ml
  screen.getByText("20mg/2ml")  // oxycodone is available in 20mg/2ml
  expect(_dose()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select blank strength -> everything below clears', async () => {
  await fillInEverything()
  await user.selectOptions(_strength(), "0")
  expect(_drug()).toBeTruthy()
  expect(_diamorphine()).toBeTruthy()
  expect(_strength()).toBeTruthy()
  expect(_15mg_2ml()).toBeTruthy()
  expect(_dose()).toBeFalsy()
  expect(_reset()).toBeFalsy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('select different strength -> doses reset to blank', async () => {
  await fillInEverything()
  await user.selectOptions(_strength(), screen.getByText("10mg/1ml"))
  expect(_dose()).toHaveValue(null)
  expect(_reset()).toBeTruthy()
  expect(_calculate()).toBeFalsy()
  expect(_results()).toBeFalsy()
})

test('dose valid and invalid values', async () => {
  await fillInEverything()
  await typeInField(_dose(), "9.9973")
  expect(_dose()).toHaveValue(9.9973)
  await typeInField(_dose(), "0.0004")
  expect(_dose()).toHaveValue(0.0004)
  await typeInField(_dose(), "999")
  expect(_dose()).toHaveValue(999)
  await typeInField(_dose(), "-7")
  expect(_dose()).toHaveValue(null)
  await typeInField(_dose(), "999")
  expect(_dose()).toHaveValue(999)
  await typeInField(_dose(), "abc")
  expect(_dose()).toHaveValue(999)
})

test('0 treated the same as blank in dose', async () => {
  await fillInEverything()
  expect(_calculate()).toBeTruthy()
  await typeInField(_dose(), "0")
  expect(_calculate()).toBeFalsy()
  await typeInField(_dose(), "10")
  expect(_calculate()).toBeTruthy()
  await user.click(_dose())
  await user.keyboard("{Control>}a{/Control}")
  await user.keyboard("[Delete]")
  expect(_calculate()).toBeFalsy()
})

test('micrograms', async () => {
  const windowAlertMock = jest.spyOn(window, "alert")
  windowAlertMock.mockImplementation(() => { })
  await fillInEverything()
  expect(windowAlertMock).not.toHaveBeenCalled()

  // as soon as you select fentanyl, the alert is shown
  await user.selectOptions(_drug(), screen.getByText("Fentanyl"))
  expect(windowAlertMock).toHaveBeenCalledWith(expect.stringContaining("is measured in micrograms"))

  // fill in the fields and calculate
  await user.selectOptions(_strength(), screen.getByText("100mcg/2ml"))
  await typeInField(_dose(), "25")
  await user.click(_calculate())

  // everything is shown in mcg
  screen.getByText("Dose (ml): 25 ÷ 100 x 2 = 0.5ml")
  screen.getByText("Number of vials: 1")
  screen.getByText("Waste: 75mcg (= 1.5ml)")
  expect(screen.queryAllByText(/mcg/)).toHaveLength(5)
  expect(screen.queryAllByText(/mg/)).toHaveLength(0)
})
