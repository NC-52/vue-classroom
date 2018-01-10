import axios from 'axios'
import { student as StudentRoutes } from '@/api'

export default {
  namespaced: true,
  state: {
    student: {
      first_name: '',
      last_name: '',
      email: '',
      class_id: ''
    },
    isFormNew: false,
    loading: {
      edit: false,
      list: false,
      show: false
    }
  },

  mutations: {
    updateLoading (state, { loadingKey, status }) {
      state.loading[loadingKey] = status
    },
    updateStudent (state, student) {
      state.student = student
    }
  },

  actions: {
    createStudent ({ commit, state }, { payload, successCallback, errorCallback }) {
      let apiRoute = StudentRoutes.create()

      // Set loading for experience
      commit('updateLoading', { loadingKey: 'edit', status: true })

      axios.post(apiRoute, payload)
        .then(({ data }) => {
          // Wait for 500ms as smooth experience
          setTimeout(_ => {
            commit('updateLoading', { loadingKey: 'edit', status: false })
            typeof successCallback === 'function' && successCallback(data)
          }, 500)
        })
        .catch(({ response }) => {
          commit('updateLoading', { loadingKey: 'edit', status: false })
          typeof errorCallback === 'function' && errorCallback(response)
        })
    },
    updateStudent ({ commit }, { id, payload, successCallback, errorCallback }) {
      let apiRoute = StudentRoutes.update(id || payload.id)

      // Set loading for experience
      commit('updateLoading', { loadingKey: 'edit', status: true })

      axios.put(apiRoute, payload)
        .then(({ data }) => {
          // Wait for 500ms as smooth experience
          setTimeout(_ => {
            commit('updateLoading', { loadingKey: 'edit', status: false })
            typeof successCallback === 'function' && successCallback(data)
          }, 500)
        })
        .catch(({ response }) => {
          commit('updateLoading', { loadingKey: 'edit', status: false })
          typeof errorCallback === 'function' && errorCallback(response)
        })
    },
    showStudent ({ commit }, {id, successCallback, errorCallback}) {
      let apiRoute = StudentRoutes.show(id)

      // Set loading for experience
      commit('updateLoading', { loadingKey: 'show', status: true })

      axios.get(apiRoute)
        .then(({ data }) => {
          commit('updateStudent', data.data)
          commit('updateLoading', { loadingKey: 'show', status: false })
          typeof successCallback === 'function' && successCallback(data)
        })
        .catch(({ response }) => {
          commit('updateLoading', { loadingKey: 'show', status: false })
          typeof errorCallback === 'function' && errorCallback(response)
        })
    }
  }
}
