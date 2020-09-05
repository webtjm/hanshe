import Vue from 'vue'
import Vuex from 'vuex'
import shopcart from './modules/shopcart'
import main from './modules/main'
import address from './modules/address'
Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        shopcart: {
            namespaced: true,
            ...shopcart
        },
        main: {
            namespaced: true,
            ...main
        },
        address: {
            namespaced: true,
            ...address
        }
    }
})

export default store