const state = {
    loginState: false,
    showLogin: false,
    personalIdx: 0,
    secIdx: 0,
    token: '',
    user: {},
    reData: {},
    vxShowSec: false,
}

const mutations = {
    setLoginState(state, val) {
        state.loginState = val;
    },
    setShowLogin(state, val) {
        state.showLogin = val;
    },
    setPersonalIdx(state, val) {
        state.personalIdx = val;
    },
    setSecIdx(state, val) {
        state.secIdx = val
    },
    setToken(state, val) {
        state.token = val;
    },
    setUserInfor(state, val) {
        state.user = val;
    },
    setReData(state, val) {
        state.reData = val
        console.log(val)
    },
    setVxShowSec(state, status){
        state.vxShowSec = status
    }
}

const actions = {}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}