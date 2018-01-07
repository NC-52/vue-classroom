import axios from 'axios'
import { student as StudentRoutes } from '@/api'

export default {
  namespaced: true,
  state: {
    studentForm: {},
    isFormNew: false
  },

  mutations: {
    // createStudent () {
    //   axios.post()
    // }
  },

  actions: {
    updateStudent (context, { id, payload, successCallback, errorCallback }) {
      let apiRoute = StudentRoutes.update(id)
      axios.put(apiRoute, payload)
        .then(({ data }) => {
          successCallback(data)
        })
        .catch(({ response }) => {
          errorCallback(response)
        })
    }
  }
}
