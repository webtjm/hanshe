import {_axios} from '@/config/axios';
import qs from 'qs'
const state = {
    addressList: [],
    defaultAddress: {},
    addressDetail: {}
}

const mutations = {
    getAddressData(state, data){
        state.addressList = data
    },
    getDefaultAddressData(state, data){
        state.defaultaddress = data
    },
    getAddressDetailData(state, data){
        state.addressDetail = data
    },
}

const actions = {
    //查询用户地址
    commitGetAddressData({commit}){
        var token = localStorage.getItem('hsToken')
        _axios.get('api/findAllAddress', {
            headers: {
                'token': token
            }
        }).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('getAddressData', res.data.data)
            }
        })
    },
    //查询默认地址
    commitGetDefaultAddressData({commit}){
        var token = localStorage.getItem('hsToken')
        _axios.get('api/getDeAddress', {
            headers: {
                'token': token
            }
        }).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('getDefaultAddressData', res.data.data)
            }
        })
    },
    //查询单个地址信息
    commitGetAddressDetailData({commit}, id){
        _axios.post(`api/getAddress?id=${id}`).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('getAddressDetailData', res.data.data)
            }
        })
    },
    //修改地址信息
    commitEditaddressData({commit}, address){
        _axios.post(`api/editAddress`, address).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('editaddressData', res.data.data)
            }
        })
    },
    //删除地址
    commitDeleteaddressData({commit}, id){
        _axios.post(`api/delAddress?id=${id}`).then(res => {
            // console.log(res.data.data)
            if(res.data.errcode == 0){
                commit('deleteaddressData', res.data.data)
            }
        })
    },
}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
}