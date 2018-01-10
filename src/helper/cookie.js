export default {
  write (name, value, days, path = '/') {
    let date = new Date()
    days = days || 730
    date.setTime(date.getTime() + (days * 60 * 60 * 24 * 1000))
    let expires = '; expires=' + date.toGMTString()
    let cookieValue = name + '=' + value + expires + `; path=${path}`

    document.cookie = cookieValue
  },

  read (name) {
    let allCookie = ' ' + document.cookie
    let index = allCookie.indexOf(name)
    if (name === undefined || name === '' || index === -1) return ''

    let ind1 = allCookie.indexOf(';', index)
    if (ind1 === -1) ind1 = allCookie.length
    return unescape(allCookie.substring(index + name.length + 1, ind1))
  },

  remove (name) {
    if (this.read(name)) {
      this.write(name, '', -1)
    }
  }
}
