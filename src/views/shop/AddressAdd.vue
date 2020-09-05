<template>
<div class="box">
    <div class="form-content">
        <div class="title" style="margin-top:0">联系信息</div>
        <el-form label-position="top" label-width="100px" :model="address" status-icon :rules="rules" ref="addressForm">
            <el-form-item label="姓名" prop="username">
                <el-input v-model="address.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="moblie">
                <el-input v-model="address.moblie"></el-input>
            </el-form-item>
            <el-form-item label="地址信息" prop="hsCity">
                <el-cascader :options="options" v-model="selectedOptions" @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="detail">
                <el-input v-model="address.detail"></el-input>
            </el-form-item>
            <div>
                <el-switch v-model="address.isDefault" active-text="设为默认">
                </el-switch>
            </div>
            <div class="btn-box">
                <div class="btn-save" v-if="isAdd" @click="submitForm('addressForm')">保存地址</div>
                <div class="btn-save" v-else @click="submitForm('addressForm')">保存修改</div>
                <router-link to="/personal/addressManage/myAddress" tag="div" class="btn-save">返回</router-link>
            </div>
        </el-form>
    </div>
</div>
</template>

<script>
import qs from "qs";
import VDistpicker from 'v-distpicker'
import {
    mapState,
    mapActions
} from 'vuex'
import Options from '@/assets/js/country-data.js'
export default {
    data() {
        var validcodeName = (rule, value, callback) => {
            console.log('姓名' + value)
            if (value === '' || value) {
                callback(new Error('姓名不能为空！'));
            } else {
                callback();
            }
        };

        var validcodeMoblie = (rule, value, callback) => {
            console.log('moblie' + value)
            var phone = value
            if (!(/^1[3456789]\d{9}$/.test(phone))) {
                callback(new Error('手机号码有误，请重填！'));
            } else {
                callback()
            }
        };
        var validcodeHsCity = (rule, value, callback) => {
            if (value == 0) {
                callback(new Error('请选择省市区信息'));
            } else {
                callback();
            }
        };
        var validcodeName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('详细地址不能为空！'));
            } else {
                callback();
            }
        };
        return {
            id: null,
            options: Options,
            selectedOptions: [],
            isAdd: true,
            test: 'false',
            visible: false,
            address: {
                username: null,
                moblie: null,
                province: null,
                city: null,
                contry: null,
                detail: null,
                isDefault: null,
                hsCity: 0
            },
            rules: {
                username: [{
                    required: true,
                    message: '姓名不能为空'
                }, {
                    validator: validcodeName,
                    trigger: 'blur'
                }],
                moblie: [{
                    required: true,
                    message: '请填写正确的手机号码'
                }, {
                    validator: validcodeMoblie,
                    trigger: 'blur'
                }],
                hsCity: [{
                    required: true,
                    message: '请选择省市区信息'
                }, {
                    validator: validcodeHsCity,
                    trigger: 'blur'
                }],
                detail: [{
                    required: true,
                    message: '请填写详细地址'
                }, {
                    validator: validcodeName,
                    trigger: 'blur'
                }]
            }
        };
    },
    components: {
        VDistpicker
    },
    methods: {
        handleChange(val){
            this.address.province = val[0]
            this.address.city = val[1]
            this.address.contry = val[2]
        },
        //表单验证
        submitForm(formName) {
            console.log(this.address)
            var province = this.address.province
            var city = this.address.city
            var contry = this.address.contry
            if (province && city && contry) {
                // console.log('sss1')
                this.address.hsCity = 1
                this.$nextTick(() => {
                    // console.log(this.address.hsCity)
                })
            } else {
                // console.log('sss0')
                this.address.hsCity = 0
                this.$nextTick(() => {
                    // console.log(this.address.hsCity)
                })
            }
            this.$refs[formName].validate((valid) => {
                console.log(valid)
                if (valid) {
                    if (!this.id) {
                        //添加地址
                        this.addAddress()
                    } else {
                        //修改地址
                        this.editAddress()
                    }
                } else {
                    this.$message.error('请将地址信息填写完整！');
                    return false;
                }
            });
        },

        //添加地址
        addAddress() {
            var address = {}
            for (var key in this.address) {
                address[key] = this.address[key]
            }
            address.isDefault = address.isDefault ? 1 : 0
            this.$axios.post(`api/addAddrres`, address).then(res => {
                // console.log(res.data.data)
                if (res.data.errcode == 0) {
                    this.$notify({
                        title: '成功',
                        message: '地址信息添加成功！',
                        type: 'success'
                    });
                    this.$router.push('/personal/addressManage/myAddress')
                }
            })
        },

        //获取单一地址信息
        getAddressDetail(id) {
            this.$axios.post(`api/getAddress?id=${id}`).then(res => {
                // console.log(res.data.data)
                if (res.data.errcode == 0) {
                    var address = res.data.data
                    address.isDefault = address.isDefault == 1 ? true : false
                    for (var key in address) {
                        this.address[key] = address[key]
                    }
                    this.$nextTick()
                }
            })
        },

        //修改地址
        editAddress() {
            var address = {}
            for (var key in this.address) {
                address[key] = this.address[key]
            }
            address.id = this.id
            address.isDefault = address.isDefault ? 1 : 0
            console.log(address)
            this.$axios.post(`api/editAddress`, address).then(res => {
                // console.log(res.data.data)
                if (res.data.errcode == 0) {
                    this.$notify({
                        title: '成功',
                        message: '地址信息修改成功！',
                        type: 'success'
                    });
                    this.$router.push('/personal/addressManage/myAddress')
                }
            })
        },
    },
    watch: {},
    mounted() {
        this.id = this.$route.query.id?this.$route.query.id:null
        if (this.id) {
            this.isAdd = false
            this.getAddressDetail(this.id)
        }
    }
};
</script>

<style lang="less" scoped>
body /deep/ .el-popper /deep/ .el-cascader-panel{
    height: 400px;
}
.box {
    flex: 1;
    font-size: 16px;
    color: #484848;
    min-width: 400px;
}

.address-list {
    display: flex;
    flex-wrap: wrap;

    .address-item {
        display: flex;
        flex-direction: column;
        border: 1px solid #eeeeee;
        margin-right: 11px;
        margin-bottom: 20px;
        padding: 21px 16px 5px 16px;
        width: 240px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: left;

        // font-family: SourceHanSansSC-bold;
        .username {
            font-weight: 600;
        }

        span {
            margin-top: 8px;
        }

        .btn-content {
            width: 100%;
            color: rgba(58, 37, 123, 1);
            font-size: 14px;
            text-align: right;
            font-family: SourceHanSansSC-regular;
            margin-bottom: 16px;
            margin-top: 8px;

            .btn-default {
                margin-left: 16px;
            }
        }
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
        text-align: center;
        border: 1px solid #eeeeee;
        margin-right: 11px;
        margin-bottom: 20px;
        padding: 21px 16px 5px 16px;
        width: 240px;
        font-size: 14px;
        color: #101010;

        .icon {
            width: 50px;
            height: 50px;
            margin-top: 43px;
            margin-bottom: 13px;
            content: url("../../assets/img/icon-address-add.png");
        }
    }
}

input[type="text"] {
    height: 35px;
    border: 1px solid #eeeeee;
    padding: 0 10px;
}

:focus {
    outline: -webkit-focus-ring-color auto 0px;
}

select {
    height: 35px;
    border: 1px solid #eeeeee;
}

.form-content /deep/ .el-form-item {
    margin-bottom: 40px;
}

.form-content /deep/ .el-form-item__label {
    line-height: 20px;
}

.form-content /deep/ .is-success /deep/ .el-input__inner {
    border-color: #67c23a;
}

.form-content /deep/ .is-success /deep/ .el-input__validateIcon {
    color: #67c23a;
}

.form-content /deep/ .el-input__inner {
    height: 35px;
    line-height: 35px;
    border-radius: 0;
}

.form-content /deep/ .el-input {
    width: 350px;
}

.form-content {
    .title {
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        text-align: left;
        margin-top: 36px;
        margin-bottom: 11px;
    }

    .row {
        display: flex;

        .form-item {
            width: 160px;

            select {
                width: 100px;
            }
        }
    }

    .row /deep/ .distpicker-address-wrapper /deep/ select {
        height: 35px;
        border: 1px solid #eeeeee;
        border-radius: 0;
        font-size: 14px;
        padding: 0px 10px;
        margin-right: 20px;
    }

    .form-item {
        display: flex;
        flex-direction: column;
        width: 480px;

        input[type="text"] {
            width: 160px;
        }

        .label {
            margin-top: 17px;
            margin-bottom: 11px;
        }
    }

    .btn-box {
        display: flex;

        .btn-save {
            width: 142px;
            height: 40px;
            line-height: 40px;
            border-radius: 0px;
            background-color: rgba(69, 75, 108, 1);
            color: rgba(255, 255, 255, 1);
            font-size: 18px;
            text-align: center;
            font-family: Roboto;
            border: 1px solid rgba(69, 75, 108, 1);
            margin-top: 30px;
            margin-right: 20px;
            cursor: pointer;

            &:last-of-type {
                margin-right: 0;
            }
        }
    }
}
</style>
