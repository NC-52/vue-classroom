import axios from 'axios'
import { classroom as ClassroomRoutes } from '@/api'

export default {
  namespaced: true,

  state: {
    pageName: '',
    classrooms: [],
    loading: {
      classrooms: false
    }
  },

  getters: {
    classroomMap (state) {
      return Object(state.classrooms)
        .reduce((acc, { id, name }) => {
          acc[id] = name
          return acc
        }, {})
    }
  },

  mutations: {
    updatePageName (state, newPageName) {
      state.pageName = newPageName
    },
    updateClassroom (state, classrooms) {
      state.classrooms = classrooms
    },
    updateLoading (state, { loadingKey, status }) {
      state.loading[loadingKey] = status
    }
  },

  actions: {
    loadClassrooms ({ commit, state }) {
      let apiRoute = ClassroomRoutes.index()

      commit('updateLoading', { loadingKey: 'classrooms', status: true })

      axios.get(apiRoute)
        .then(({ data }) => {
          commit('updateClassroom', data.data)
          commit('updateLoading', { loadingKey: 'classrooms', status: false })
        })
        .catch(_ => {
          commit('updateLoading', { loadingKey: 'classrooms', status: false })
        })
    }
  }
}
