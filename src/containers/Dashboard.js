import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

/**
 * It filters the bills based on the status and the user's email
 * @param data - the data to be filtered
 * @param status - the status of the bill
 * @returns An array of bills that have the status of the argument passed in.
 */
export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
      else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition
    }) : []
}

/**
 * It takes a bill object and returns a string of HTML that represents a bill card
 * @param bill - the bill object
 * @returns A string of HTML code.
 */
export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[1] : firstAndLastNames

  return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}

/**
 * It takes an array of bills and returns a string of HTML
 * @param bills - an array of bill objects
 * @returns A string of HTML elements
 */
export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

/**
 * It takes an index and returns a status
 * @param index - the index of the status
 * @returns The status of the request
 */
export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}

/* A class that is exported by default. */
export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    new Logout({ localStorage, onNavigate })
  }

  /* A function that is called when the user clicks on the eye icon. */
  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }

  /**
   * It handles the click event on the bill's edit button
   * @param e - the event
   * @param bill - the bill object
   * @param bills - an array of objects that contains all the bills
   */
  handleEditTicket(e, bill, bills) {
    /* Checking if the counter is undefined or if the id of the bill is not equal to the id of the bill
    that was clicked. If so, it will set the counter to 0. */
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id
    if (this.counter % 2 === 0) {
      /* Setting the background color of all the bills to blue. */
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' })
      })
      /* Changing the background color of the bill to a dark blue. */
      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
      /* Setting the html of the div with the class 'dashboard-right-container' to the html of the
      DashboardFormUI function. */
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({ height: '150vh' })
      $('#icon-eye-d').click(this.handleClickIconEye)
      $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
      $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
      this.counter++
    } else {
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' })

      $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `)
      $('.vertical-navbar').css({ height: '120vh' })
      this.counter++
    }
  }

  /* A function that is called when the user clicks on the accept button. */
  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  /* A function that is called when the user clicks on the refuse button. */
  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  /**
   * This function is called when a user clicks on a status header. It checks if the user has clicked
   * on the same status header twice in a row. If so, it will hide the tickets associated with that
   * status. If not, it will show the tickets associated with that status
   * @param e - the event
   * @param bills - an array of objects that contain all the information about the tickets
   * @param index - the index of the status button that was clicked
   * @returns The bills array is being returned.
   */
  handleShowTickets(e, bills, index) {
    if (this.counter === undefined || this.index !== index) this.counter = 0
    if (this.index === undefined || this.index !== index) this.index = index
    if (this.counter % 2 === 0) {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)' })
      $(`#status-bills-container${this.index}`)
        .html(cards(filteredBills(bills, getStatus(this.index))))
      this.counter++
    } else {
      $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)' })
      $(`#status-bills-container${this.index}`)
        .html("")
      this.counter++
    }

    bills.forEach(bill => {

      // $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
      $(`#status-bills-container${index} #open-bill${bill.id}`).click((e) => {
        this.handleEditTicket(e, bill, bills)
      })
    })

    return bills

  }

  /* A function that returns a promise. */
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => ({
              id: doc.id,
              ...doc,
              date: doc.date,
              status: doc.status
            }))
          return bills
        })
        .catch(error => {
          throw error;
        })
    }
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
  /* Updating the bill in the database. */
  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then(bill => bill)
        .catch(console.log)
    }
  }
}
