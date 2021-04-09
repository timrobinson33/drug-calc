import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

test('happy path', () => {
  render(<App />)

  // disclaimer
  expect(screen.queryByText("Disclaimer")).toBeTruthy()
  expect(screen.queryByText("Drug:")).toBeFalsy()
  expect(screen.queryByText("Diamorphine")).toBeFalsy()
  fireEvent.click(screen.getByText("OK"))
  expect(screen.queryByText("Drug:")).toBeTruthy()
  expect(screen.queryByText("Diamorphine")).toBeTruthy()

  // select a drug
  expect(screen.queryByText("Strength:")).toBeFalsy()
  expect(screen.queryByText("30mg/2ml")).toBeFalsy()
  userEvent.selectOptions(screen.getByLabelText("Drug:"), screen.getByText("Diamorphine"))
  expect(screen.queryByText("Strength:")).toBeTruthy()
  expect(screen.queryByText("30mg/2ml")).toBeTruthy()

  // select a strength
  expect(screen.queryByLabelText("Prescribed dose:")).toBeFalsy()
  expect(screen.queryByText("+ Stat/PRN doses:")).toBeFalsy()
  userEvent.selectOptions(screen.getByLabelText("Strength:"), screen.getByText("15mg/2ml"))
  expect(screen.queryByText("Prescribed dose:")).toBeTruthy()
  expect(screen.queryByText("+ Stat/PRN doses:")).toBeTruthy()
})
