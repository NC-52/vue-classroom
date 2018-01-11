import axios from 'axios'
import { classroom as ClassroomRoutes } from '@/api'

export default {
  namespaced: true,

  state: {
    pageName: '',
    classrooms: [],
    students: [],
    loading: {
      classrooms: false,
      studentList: false,
      edit: false
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
    setClassrooms (state, classrooms) {
      state.classrooms = classrooms
    },
    updateClassroom (state, classroom) {
      state.classroom = classroom
    },
    updateLoading (state, { loadingKey, status }) {
      state.loading[loadingKey] = status
    },
    updateStudents (state, students) {
      state.students = students
    }
  },

  actions: {
    loadClassrooms ({ commit, state }) {
      let apiRoute = ClassroomRoutes.index()

      commit('updateLoading', { loadingKey: 'classrooms', status: true })

      axios.get(apiRoute)
        .then(({ data }) => {
          commit('setClassrooms', data.data)
          commit('updateLoading', { loadingKey: 'classrooms', status: false })
        })
        .catch(_ => {
          commit('updateLoading', { loadingKey: 'classrooms', status: false })
        })
    },
    createClassroom ({ commit, state }, { payload, successCallback, errorCallback }) {
      let apiRoute = ClassroomRoutes.create()

      commit('updateLoading', { loadingKey: 'edit', status: true })

      axios.post(apiRoute, payload)
        .then(({ data }) => {
          setTimeout(_ => {
            commit('updateClassroom', data.data)
            commit('updateLoading', { loadingKey: 'edit', status: false })
            typeof successCallback === 'function' && successCallback(data)
          }, 500)
        })
        .catch(({ response }) => {
          commit('updateLoading', { loadingKey: 'edit', status: false })
          typeof errorCallback === 'function' && errorCallback(response)
        })
    },
    updateClassroom ({ commit, state }, { payload, id, successCallback, errorCallback }) {
      let apiRoute = ClassroomRoutes.update(id || payload.id)

      commit('updateLoading', { loadingKey: 'edit', status: true })

      axios.put(apiRoute, payload)
        .then(({ data }) => {
          setTimeout(_ => {
            commit('updateClassroom', data.data)
            commit('updateLoading', { loadingKey: 'edit', status: false })
            typeof successCallback === 'function' && successCallback(data)
          }, 500)
        })
        .catch(({ response }) => {
          commit('updateLoading', { loadingKey: 'edit', status: false })
          typeof errorCallback === 'function' && errorCallback(response)
        })
    },
    loadClassStudents ({ commit, state }, id) {
      let apiRoute = ClassroomRoutes.show(id)

      commit('updateLoading', { loadingKey: 'studentList', status: true })

      axios.get(apiRoute)
        .then(({ data }) => {
          commit('updateStudents', data.data)
          commit('updateLoading', { loadingKey: 'studentList', status: false })
        })
        .catch(_ => {
          commit('updateLoading', { loadingKey: 'studentList', status: false })
        })
    }
  }
}
