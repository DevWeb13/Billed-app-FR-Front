/**
 * @jest-environment jsdom
 */

import '@testing-library/dom';
import {
  getByRole,
  getByTestId,
  getByLabelText, fireEvent, screen, waitFor
} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import mockStore from "../__mocks__/store"

import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore)


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
      expect(mailIcon.classList.contains('active-icon')).toBe(true) // vérifie si l'icone est en surbrillance 


    })
    // test de la fonction handleSubmit dans le fichier NewBill.js
    test("Then, when I click on submit button, the bill should be created", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      
      
      
      const newBill = new NewBill({
        document, onNavigate, store: null, localStorage: localStorageMock
      })

      document.body.innerHTML = NewBillUI()


      const handleSubmit = jest.fn(newBill.handleSubmit)


      const dateInput = screen.getByTestId('datepicker')
      const amountInput = screen.getByTestId('amount')
      const TVAInput = screen.getByTestId('pct')
      const justificatifInput = screen.getByTestId('file')
      const submitButton = screen.getByTestId('btn-send-bill')
      userEvent.type(dateInput, '2020-01-01')
      userEvent.type(amountInput, '100')
      userEvent.type(TVAInput, '20')
      userEvent.type(justificatifInput, 'justificatif.jpg')
      
      submitButton.addEventListener('click', handleSubmit)
      userEvent.click(submitButton)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(handleSubmit).toHaveBeenCalledWith({
        date: '2020-01-01',
        amount: '100',
        pct: '20',
        file: 'justificatif.jpg'
      })
    })
  })
})



