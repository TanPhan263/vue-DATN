import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false
  
}

const getDefaultState = () => {
  return {
    token: '',
    user: {},
    inforID:''
  };
};

const mutations = {
  SET_INFORID: (state,inforID) => {
    state.inforID = inforID;
  },
  SET_TOKEN: (state, token) => {
      state.token = token;
    },
  SET_USER: (state, user) => {
      state.user = user;
    },
  RESET: state => {
      Object.assign(state, getDefaultState());
    },
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
}

export default new Vuex.Store({
  state,
  mutations,
  strict: true,
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    inforID: state => {
      return state.inforID;
    }
  },
  actions: {
    login: ({ commit, dispatch }, { token, user }) => {
      debugger;
      commit('SET_TOKEN', token);
      commit('SET_USER', user);
      // set auth header
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout: ({ commit }) => {
      commit('RESET', '');
    }
  }
})