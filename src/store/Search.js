import axios from 'axios'
import { search as SearchRoute } from '@/api'

export default {
  namespaced: true,
  state: {
    keyword: '',
    timeout: null,
    rawResult: []
  },
  getters: {
    result (state) {
      return Object.entries(state.rawResult)
        .reduce((acc, [role, list]) => {
          return list.reduce((ac, item) => {
            acc.push({
              value: role === 'students' ? `${item.first_name} ${item.last_name}` : item.name,
              role,
              data: { ...item }
            })
            return acc
          }, acc)
        }, [])
    }
  },
  mutations: {
    setRawResult (state, result) {
      state.rawResult = result
    },
    setKeyword (state, keyword) {
      state.keyword = keyword
    },
    setSearchTimeout (state, timeout) {
      state.timeout = timeout
    }
  },
  actions: {
    search ({ commit, state }) {
      let apiRoute = SearchRoute.index()
      axios.get(`${apiRoute}?keyword=${state.keyword}`)
        .then(({ data }) => {
          commit('setRawResult', data.data)
        })
    }
  }
}
