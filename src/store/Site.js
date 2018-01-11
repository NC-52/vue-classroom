export default {
  namespaced: true,
  state: {
    windowSize: {
      width: window.innerWidth,
      height: window.innerHeight
    }
  },
  getters: {
    isMobile: state => state.windowSize.width < 768
  },
  mutations: {
    updateWindow (state, newWindowSize) {
      state.windowSize = newWindowSize
    }
  }
}
