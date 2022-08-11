/**
 * It takes a date string, converts it to a date object, then formats it to a french date string
 * @param dateStr - The date string to be formatted.
 * @returns A string with the date in the format: "DD MMM. YY"
 */
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  const month = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
}
 
/**
 * It takes a string as an argument and returns a string
 * @param status - the status of the request
 * @returns A function that takes a status and returns a string
 */
export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}