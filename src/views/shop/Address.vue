<template>
<div class="main-box">
    <div class="adress-list-box">
        <div class="title-item">收货地址</div>
        <ul class="address-list">
            <li class="address-item" :class="(index+1)%3===0?'no-margin':''" v-for="(item, index) in addressList" :key="index">
                <span class="username">{{item.username}}</span>
                <span class="mobile">{{item.moblie}}</span>
                <span class="address">{{item.province}} {{item.city}} {{item.contry}}</span>
                <span class="detail">{{item.detail}}</span>
                <span class="btn-content">
                    <span class="btn-default default" v-if="item.isDefault">默认地址</span>
                    <span class="btn-default" @click="deleteAddress(item.id)">删除地址</span>
                    <span class="btn-default" v-if="!item.isDefault" @click="setDefaultAddress(index)">设为默认</span>
                    <span class="btn-default" @click="toEdit(item.id)">修改地址</span>
                </span>
            </li>
            <router-link to="/personal/addressManage/addAddress" tag="li" class="address-add">
                <span class="icon"></span>
                <span>添加地址</span>
            </router-link>
        </ul>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions
} from 'vuex'
export default {
    data() {
        return {
            addressId: null
        }
    },
    computed: {
        ...mapState('address', [
            'addressList'
        ])
    },
    methods: {
        ...mapActions('address', [
            'commitGetAddressData',
            'commitEditaddressData'
        ]),
        //设为默认地址
        setDefaultAddress(idx) {
            var address = {}
            for (var key in this.addressList[idx]) {
                address[key] = this.addressList[idx][key]
            }
            address.isDefault = 1
            this.$axios.post(`api/editAddress`, address).then(res => {
                // console.log(res.data.data)
                if (res.data.errcode == 0) {
                    this.$notify({
                        title: '成功',
                        message: '设置成功！',
                        type: 'success'
                    });
                    this.commitGetAddressData()
                }
            })
        },
        //删除地址
        deleteAddress(id) {
            this.$confirm('确定删除此地址信息吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('sss')
                this.$axios.post(`api/delAddress?id=${id}`).then(res => {
                    // console.log(res.data.data)
                    if (res.data.errcode == 0) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.commitGetAddressData()
                    }
                })
            }).catch(() => {
                console.log('sss')
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //显示修改地址模块
        toEdit(id) {
            this.$router.push({
                path: '/personal/addressManage/addAddress',
                query: {
                    id
                }
            })
        }
    },
    mounted() {
        this.commitGetAddressData()
    }
}
</script>

<style lang="less" scoped>
.main-box {

    .adress-list-box {
        .title-item {
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
            margin: 26px 0;
            margin-top: 0;
        }

        .address-list {
            display: flex;
            flex-wrap: wrap;
            padding: 0;

            li {
                width: 30%;
                box-sizing: border-box;
            }

            .address-item {
                display: flex;
                flex-direction: column;
                border: 1px solid #eeeeee;
                margin-right: 10px;
                padding: 15px 20px;
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                text-align: left;
                margin-bottom: 10px;
                height: 180px;

                // font-family: SourceHanSansSC-bold;
                .username {
                    font-weight: 600;
                    line-height: 30px;
                }

                .mobile,
                .address,
                .detail {
                    line-height: 30px;
                }

                .btn-content {
                    width: 100%;
                    color: rgba(58, 37, 123, 1);
                    font-size: 14px;
                    text-align: right;
                    font-family: SourceHanSansSC-regular;
                    line-height: 30px;

                    .btn-default {
                        margin-left: 16px;
                        cursor: pointer;
                    }

                    .default {
                        font-weight: 600;
                    }
                }
            }

            .no-margin {
                margin-right: 0;
            }

            .address-add:hover {
                border: 1px solid #3a257b;
                color: #3a257b;

                .icon {
                    content: url("../../assets/img/icon-address-add-active.png");
                }
            }

            .address-add {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                border: 1px solid #eeeeee;
                font-size: 14px;
                color: #101010;
                height: 180px;
                cursor: pointer;

                .icon {
                    width: 50px;
                    height: 50px;
                    margin-bottom: 13px;
                    content: url("../../assets/img/icon-address-add.png");
                }
            }
        }
    }

}
</style>
