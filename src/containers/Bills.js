import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

/* A class that is being exported. */
export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }

  /* A function that is being called when the user clicks on the button "New Bill". */
  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  /* A function that is being called when the user clicks on the icon "Eye". */
  handleClickIconEye = (icon) => {
    const billUrl = $(icon).attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
    if (typeof $('#modaleFile').modal === 'function') $('#modaleFile').modal('show')
  }

  /* A function that is being called when the user clicks on the button "New Bill". */
  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
          .map(doc => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                rawDate: doc.date,
                status: formatStatus(doc.status)
              }
            } catch(e) {
              // console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
          
          // console.log('length', bills)
        return bills
      })
    }
  }
}
