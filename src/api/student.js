// const domain = 'https://still-everglades-62877.herokuapp.com/api/students'
const domain = `${process.env.API_DOMAIN}/students`

export default {
  index () {
    return `${domain}`
  },
  show (id = '') {
    return `${domain}/${id}`
  },
  create () {
    return `${domain}`
  },
  update (id = '') {
    return `${domain}/${id}`
  },
  delete (id = '') {
    return `${domain}/${id}`
  }
}
