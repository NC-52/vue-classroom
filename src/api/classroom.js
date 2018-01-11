const domain = `${process.env.API_DOMAIN}/classrooms`

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
