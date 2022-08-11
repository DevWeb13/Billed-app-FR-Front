import { ROUTES_PATH } from '../constants/routes.js'

/* It clears the local storage and navigates to the login page when the user clicks on the disconnect
button */
export default class Logout {
  constructor({ document, onNavigate, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.localStorage = localStorage
    $('#layout-disconnect').click(this.handleClick)
  }
  
  /* Clearing the local storage and navigating to the login page. */
  handleClick = (e) => {
    this.localStorage.clear()
    this.onNavigate(ROUTES_PATH['Login'])
  }
} 