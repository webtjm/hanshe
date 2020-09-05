import {_axios} from '@/config/axios';
import qs from 'qs'
import {Message} from 'element-ui'
const state = {
    shopcart: [],
    nowPayGood: []
}

const mutations = {
    getShopcartData(state, data){
        data.forEach(item => {
            item.picture = item.picture.split(',')
        })
        state.shopcart = data
        console.log(state.shopcart)
    },
    changeShopcartData(state, data){
        // state.shopcart = data
    },
    getNowPayGood(state, data){
        if(JSON.stringify(data) == "{}"){
            state.nowPayGood = []
        }else{
            state.nowPayGood.push(data)
        }
        console.log(state.nowPayGood)
    }
}

const actions = {
    //查询用户购物车
    commitShopcartData({commit}) {
        var token = localStorage.getItem('hsToken')
        _axios.get('api/findAllCart', {
            headers: {
                'token': token
            }
        }).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('getShopcartData', res.data.data)
            }
        })
    },

    //修改商品数量
    commitChangeShopcartData({dispatch, commit}, {goodSpecId, num}) {
        var params = {
            goodSpecId,
            num
        }
        _axios.post('api/changeNum', qs.stringify(params)).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                dispatch('commitShopcartData')
            }
        })
    },

    //删除购物车商品
    commitDeleteShopcartData({dispatch, commit}, {id, specId, showMsg}){
        var params = {
            id,
            specId
        }
        showMsg = showMsg===null||showMsg===undefined?true:false
        _axios.post('api/delCart', qs.stringify(params)).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                if(showMsg){
                    Message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
                dispatch('commitShopcartData')
            }
        })
    }
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}