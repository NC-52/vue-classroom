// const domain = 'https://still-everglades-62877.herokuapp.com/api/classrooms'
const domain = 'http://localhost:3000/api/classrooms'

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
