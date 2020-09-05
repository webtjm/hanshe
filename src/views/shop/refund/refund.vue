<template>
<div class="main-box">
    <div class="status-header">
        <div class="status-item active">
            <span class="num">1</span>
            <span>买家申请退款</span>
        </div>
        <div class="status-item" :class="refundDetail.status==0||refundDetail.status==2||refundDetail.status==3||refundDetail.status==1||refundDetail.status==-1?'active':''">
            <span class="num">2</span>
            卖家处理退款申请
        </div>
        <div class="status-item" :class="(refundDetail.status==1&&refundDetail.mobile&&refundDetail.name&&refundDetail.address)||(refundDetail.status==2&&refundDetail.type==1)||refundDetail.status==3?'active':''" v-if="refundWay==1||refundDetail.type==1">
            <span class="num">3</span>
            买家退货
        </div>
        <div class="status-item" :class="refundDetail.status==3?'active':''">
            <span class="num" v-if="refundWay==1||refundDetail.type==1">4</span>
            <span class="num" v-if="refundWay==0||refundDetail.type==0">3</span>
            退款完毕
        </div>
    </div>
    <div class="border">
        <div class="left">
            <div class="item_1" v-if="orderDetail.status != -1&&orderDetail.status!=4">
                <el-form status-icon label-position="left" ref="ruleForm2" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="退款商品:">
                        <div v-for="(item, index) in refundGood" :key="index" class="good-img bg-img" :style="`background-image:url('${imgUrl}${item.picture[0]}')`"></div>
                    </el-form-item>
                    <el-form-item label="服务类型:" class="radio-group" v-if="orderDetail.status==2">
                        <el-radio class="radio" v-model="refundForm.type" :label="0">仅退款</el-radio>
                        <el-radio class="radio" v-model="refundForm.type" :label="1">退货退款</el-radio>
                    </el-form-item>
                    <el-form-item label="货物状态:" class="radio-group" v-if="orderDetail.status==2&&refundWay==0">
                        <el-radio class="radio" v-model="refundForm.goodsStatus" :label="0">未收到货</el-radio>
                        <el-radio class="radio" v-model="refundForm.goodsStatus" :label="1">已收到货</el-radio>
                        <div class="remark" v-if="orderDetail.status == 2">卖家已发货，请先 <span style="color:#ff7044;" @click="seekExpress">查看物流</span> 信息，或联系卖家</div>
                    </el-form-item>
                    <el-form-item label="退款原因:">
                        <el-select v-model="refundForm.reason" placeholder="请选择退款原因">
                            <el-option v-for="item in refundReason" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退款金额:">
                        <el-input :disabled="true" v-model="refundForm.totalPrice" class="price-input"></el-input>
                        <span class="remark">最多￥{{orderDetail.totalPrice}}，含发货运费￥{{orderDetail.expressPrice}}</span>
                    </el-form-item>
                    <el-form-item label="退款说明:">
                        <el-input type="textarea" placeholder="退款说明" v-model="refundForm.remark"></el-input>
                    </el-form-item>
                    <el-form-item label="退款说明">
                        <el-upload :limit="3" :action="`https://hanshe.bflccct.com/file/upload`" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="handleOnchange" :on-exceed="handleOnexceed">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img alt="寒舍" width="100%" :src="dialogImageUrl">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label=''>
                        <div class="btn" @click="sumitRefundForm">提交</div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="item_2" v-if="refundDetail.status==0||(refundDetail.status==2&&refundDetail.type==0)||refundDetail.status==-1||(refundDetail.status==1&&!refundDetail.mobile)">
                <div v-if="refundDetail.status!=3&&refundDetail.status!=-1">
                    <div class="tip-title">
                        <span class="text">请等待商家处理</span>
                        <!-- <i class="el-icon-time"></i>
                    <span class="time">还剩 5天23小时59分</span> -->
                    </div>
                    <div>您已成功发起退款申请，请耐心等待商家处理！</div>
                    <div class="tip">
                        <span>• 商家同意或超时未处理时，系统将退款给您</span>
                        <span>• 如果商家拒绝，你可以再次发起退款申请，商家会重新处理</span>
                    </div>
                    <div class="btn-box">
                        <div class="btn" @click="cancelRefund('edit')">修改申请</div>
                        <div class="cancel" @click="cancelRefund">撤销申请</div>
                    </div>
                </div>
                <div v-if="refundDetail.status == -1">
                    <div class="tip-title">
                        <span class="text">商家拒绝了退款申请</span>
                    </div>
                    <div class="btn-box">
                        <div class="btn" @click="cancelRefund('edit')">重新申请</div>
                    </div>
                </div>
            </div>
            <div class="item_3" v-if="refundDetail.status==3">
                <span class="span_1">退款成功</span>
                <span class="span_2">退款成功时间：{{refundDetail.updTime}}</span>
                <span class="span_3">退款金额:<span>￥{{refundDetail.totalPrice}}</span></span>
                <span class="span_4">退款去向:<span>已退回微信</span></span>
            </div>
            <div class="item_4" v-if="(refundDetail.status==1&&refundDetail.mobile&&refundDetail.name&&refundDetail.address)||(refundDetail.status==2&&refundDetail.type==1)">
                <span class="span_1">卖家已同意您的退货申请</span>
                <span class="span_2">请及时寄出货物并填写物流</span>
                <div class="adress-info">
                    <span class="span_1">退货信息如下:</span>
                    <div class="item">
                        <span class="item-left">收货人:</span>
                        <span>{{refundDetail.name}}</span>
                    </div>
                    <div class="item">
                        <span class="item-left">手机号码:</span>
                        <span>{{refundDetail.mobile}}</span>
                    </div>
                    <div class="item">
                        <span class="item-left">地址:</span>
                        <span>{{refundDetail.address}}</span>
                    </div>
                </div>
                <div class="transport" v-if="reExpressMsg">
                    <div class="span_1">物流信息</div>
                    <div class="items">
                        <div class="item">
                            <span>发货时间</span>
                            <span>{{refundDetail.updTime}}</span>
                        </div>
                        <div class="item">
                            <span>物流公司</span>
                            <span>{{refundDetail.expressName}}</span>
                        </div>
                        <div class="item">
                            <span>快递单号</span>
                            <span>{{refundDetail.expressNum}}</span>
                        </div>
                        <div class="item">
                            <span class="span_1">物流信息</span>
                            <div class="item-content">
                                <p v-for="(item, index) in reExpressMsg" :key="index">
                                    {{item.AcceptTime}} {{item.AcceptStation}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn-box" v-if="!reExpressMsg">
                    <div class="btn" @click="showEditBox = true">填写物流</div>
                    <div class="cancel" @click="cancelRefund">撤销申请</div>
                </div>
                <div class="edit-transport" v-if="showEditBox">
                    <div class="header">退货物流</div>
                    <el-form class="el-form" ref="transport-form" label-width="60px" label-position="left">
                        <el-form-item label="物流公司">
                            <el-input placeholder="请填写物流公司名称" v-model="express.expressName"></el-input>
                        </el-form-item>
                        <el-form-item label="物流单号">
                            <el-input placeholder="请填写物流单号" v-model="express.expressNum"></el-input>
                        </el-form-item>
                        <div class="btns">
                            <div class="confirm" @click="confirmEdit">确定</div>
                            <div class="cancel" @click="showEditBox = false">取消</div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="order">
                <div class="title">订单详情</div>
                <div class="detail" :class="index==refundGood.length-1?'no-border':''" v-for="(item, index) in refundGood" :key="index">
                    <div class="bg-img" :style="`background-image:url('${imgUrl}${item.picture[0]}')`"></div>
                    <div class="info">
                        <span class="name">{{item.title}}</span>
                        <span class="spec" v-for="(spec, idx) in item.spec" :key="idx">{{spec}}</span>
                    </div>
                </div>
                <div class="bottom">
                    <div class="item"><span class="span-left">订单编号：</span>{{orderDetail.id}}</div>
                    <div class="item"><span class="span-left">单价：</span>￥{{(orderDetail.totalPrice - orderDetail.expressPrice).toFixed(2)}}</div>
                    <div class="item"><span class="span-left">运费：</span>￥{{orderDetail.expressPrice}}</div>
                    <div class="item"><span class="span-left">商品总价：</span>￥{{orderDetail.totalPrice}}</div>
                </div>
                <div class="bottom" v-if="orderDetail.status == -1||orderDetail.status ==4">
                    <div class="item"><span class="span-left">退款编号：</span>{{refundDetail.id}}</div>
                    <div class="item"><span class="span-left">退款金额：</span>￥{{refundDetail.totalPrice}}</div>
                    <div class="item"><span class="span-left">原因：</span>{{refundDetail.reason}}</div>
                    <div class="item">
                        <span class="span-left">要求：</span>
                        <span v-if="refundDetail.type == 0">仅退款</span>
                        <span v-else>退货退款</span>
                    </div>
                    <div class="item">
                        <span class="span-left">货物状态：</span>
                        <span v-if="goodStatus == 0">未收到货</span>
                        <span v-if="goodStatus == 1">已收到货</span>
                    </div>
                    <div class="item"><span class="span-left">说明：</span>{{refundDetail.remark}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import DateFormat from '@/config/formTime.js'
import qs from 'qs'
export default {
    data() {
        return {
            express: {
                expressName: null,
                expressNum: null,
                id: null
            },
            reExpressMsg: null,
            refundDetail: {},
            orderDetail: {},
            refundGood: [],
            refundWay: -1,
            id: '',
            showEditBox: false,
            dialogImageUrl: '',
            dialogVisible: false,
            optionVal: '',
            refundReason: [{
                value: '货物破损',
                label: '货物破损'
            }, {
                value: '还没到货',
                label: '还没到货'
            }, {
                value: '货物不对',
                label: '货物不对'
            }, {
                value: '其他原因',
                label: '其他原因'
            }],
            refundForm: {
                id: '',
                goodsSpecId: '',
                totalPrice: 0,
                reason: null,
                remark: null,
                picture: '',
                type: 0,
                goodsStatus: 0
            }
        }
    },
    computed: {
        goodStatus(){
            var status = 0
            status = this.refundDetail.type===1?1:this.refundDetail.goodsStatus
            return status
        }
    },
    watch: {
        'refundForm.type'(newValue, oldValue) {
            this.refundWay = newValue
            console.log(this.refundWay)
        }
    },
    methods: {
        handleRemove(file, fileList) {
            var arr = []
            fileList.forEach(item => {
                if (item.response) {
                    var img = item.response.data
                    arr.push(img)
                }
            })
            this.refundForm.picture = arr.join(',')
        },
        handlePictureCardPreview(file) {
            console.log(file)
            if (file.response.errcode == 0) {
                this.dialogImageUrl = this.imgUrl + file.response.data
                console.log(this.dialogImageUrl)
                this.dialogVisible = true;
            } else {
                this.$message(file.response.errmsg)
            }
        },
        handleOnchange(file, fileList) {
            var arr = []
            fileList.forEach(item => {
                if (item.response) {
                    var img = item.response.data
                    arr.push(img)
                }
            })
            this.refundForm.picture = arr.join(',')
            // console.log(this.refundForm.picture)
        },
        handleOnexceed() {
            this.$message('最多只能上传3张图片!')
        },
        //获取订单详情
        getOrderDetail(id) {
            this.$axios.post(`api/getShopOrderInfo?id=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    // orderDetail
                    var obj = {}
                    for (var key in res.data.data) {
                        obj[key] = res.data.data[key]
                    }
                    obj._address = obj.province + obj.city + obj.region + obj.address
                    obj.orderTime = new DateFormat().setTime(obj.creTime).toString('yyyy-mm-dd hh:ff:ss')
                    this.orderDetail = obj
                    console.log(this.orderDetail)
                    if (obj.status == 1) {
                        // this.refundForm.totalPrice = obj.totalPrice - obj.expressPrice
                        var goodsSpecId = []
                        this.refundGood.forEach(item => {
                            goodsSpecId.push(item.goodsSpecId)
                        })
                        this.refundForm.totalPrice = obj.totalPrice
                        this.refundForm.goodsSpecId = goodsSpecId.join(',')
                    } else if (obj.status == 2) {
                        var price = 0
                        var goodsSpecId = []
                        this.refundGood.forEach(item => {
                            price = price + item.price * item.num
                            goodsSpecId.push(item.goodsSpecId)
                        })
                        // this.refundForm.totalPrice = price
                        this.refundForm.totalPrice = obj.totalPrice
                        this.refundForm.goodsSpecId = goodsSpecId.join(',')
                    } else if (obj.status == -1 || obj.status == 4) {
                        this.getRefunDetail(obj.id)
                    }
                    console.log(this.refundForm)
                }
            })
        },
        //提交退款申请
        sumitRefundForm() {
            this.refundForm.id = this.id
            this.refundForm.type = parseInt(this.refundForm.type)
            if (this.refundForm.reason) {
                this.$axios.post('api/refundOrder', this.refundForm).then(res => {
                    if (res.data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '退款申请提交成功!',
                            type: 'success'
                        })
                    }
                    var that = this
                    var time = setTimeout(function () {
                        that.$router.go(0)
                    }, 1000)
                })
            } else {
                this.$message('请选择退款原因!')
            }
            console.log(this.refundForm)
        },
        //查看物流
        seekExpress() {
            this.$router.push({
                path: '/shopOrderDetail',
                query: {
                    id: this.orderDetail.id
                }
            })
        },
        //查看退款物流
        getReExpressMsg(id) {
            this.$axios.post(`api/getReExpressMsg?id=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    this.reExpressMsg
                    var info = JSON.parse(res.data.data)
                    this.reExpressMsg = info.Traces
                }
            })
        },
        //获取退款订单详情
        getRefunDetail(id) {
            this.$axios.post(`api/getRefundInfo?id=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    this.refundDetail = res.data.data
                    var updTime = this.refundDetail.updTime
                    this.refundDetail.updTime = updTime ? new DateFormat().setTime(updTime).toString('yyyy-mm-dd hh:ff:ss') : ''
                    if (this.refundDetail.status == 2) {
                        this.getReExpressMsg(id)
                    }
                }
            })
        },
        //上传退货信息
        confirmEdit() {
            this.express.id = this.refundDetail.id
            this.$axios.post('api/send', this.$qs.stringify(this.express)).then(res => {
                if (res.data.errcode == 0) {
                    this.$notify({
                        title: '成功',
                        message: '物流信息上传成功',
                        type: 'success'
                    })
                    var that = this
                    var time = setTimeout(function () {
                        that.$router.go(0)
                    }, 1000)
                }
            })
        },
        //撤销退款申请
        cancelRefund(str) {
            if (str && str == "edit") {
                this.$confirm('是否修改退款申请?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this._cancelRefund(false)
                })
            } else {
                this.$confirm('是否撤销退款申请?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    this._cancelRefund(true)
                })
            }

        },
        //撤销退款申请
        _cancelRefund(tip) {
            this.$axios.post(`api/cancelRefund?id=${this.refundDetail.id}`).then(res => {
                if (res.data.errcode === 0) {
                    if (tip) {
                        this.$notify({
                            title: '成功',
                            message: '退款申请撤销成功',
                            type: 'success'
                        })
                        this.$router.push({
                            path: '/shopOrderDetail',
                            query: {
                                id: this.orderDetail.id
                            }
                        })
                    } else {
                        this.$router.go(0)
                    }
                }
            })
        }
    },
    mounted() {
        this.refundWay = parseInt(this.$route.query.refundWay)
        this.refundForm.type = this.refundWay
        this.refundForm.goodsStatus = this.refundWay==1?1:0
        this.id = this.$route.query.id
        var refundGood = localStorage.getItem('refundGood')
        this.refundGood = JSON.parse(refundGood)
        console.log(this.refundGood)
        this.getOrderDetail(this.id)
    }
}
</script>

<style lang="less" scoped>
.main-box {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;

    .remark {
        color: #6a6a6a;
        line-height: 20px;
        font-size: 12px;
    }

    .item_1 /deep/ input {
        width: 200px;
    }

    .item_1 /deep/ textarea {
        width: 40%;
        min-height: 150px !important;
    }

    .item_1 /deep/ .price-input /deep/ input {
        color: #ff7044;
    }

    .btn-box {
        display: flex;
    }

    .btn {
        width: 180px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        color: #fff;
        background: rgb(69, 75, 108);
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        margin: 0 !important;
        margin-right: 20px !important;
    }

    .cancel {
        width: 180px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #bbbbbb;
        background: #fff;
        cursor: pointer;
        color: #818181;
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
    }

    .good-img {
        display: inline-block;
        margin-right: 20px;

        &:last-of-type {
            margin-right: 0;
        }
    }

    .bg-img {
        width: 100px;
        height: 100px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .radio {}

    .status-header {
        display: flex;
        width: 100%;
        margin-top: 20px;
        height: 50px;
        font-size: 16px;

        .status-item {
            display: flex;
            flex: 1;
            background: #eeeeee;
            position: relative;
            color: #818181;
            justify-content: center;
            align-items: center;
            margin: 0 10px;

            &:first-of-type {
                margin-left: 0;
            }

            &:last-of-type {
                margin-right: 0;
            }

            &:first-of-type::after {
                content: " ";
                display: block;
                width: 0;
                height: 0;
                border-top: 25px solid transparent;
                border-bottom: 25px solid transparent;
                border-left: 12px solid #eeeeee;
                position: absolute;
                top: 50%;
                margin-top: -25px;
                right: -12px;
            }

            &:first-of-type::before {
                display: none;
            }

            &:last-of-type::after {
                display: none;
            }

            &::before {
                content: " ";
                display: block;
                width: 0;
                height: 0;
                border-top: 25px solid #eeeeee;
                border-bottom: 25px solid #eeeeee;
                border-left: 12px solid transparent;
                position: absolute;
                top: 50%;
                margin-top: -25px;
                left: -12px;
            }

            &::after {
                content: " ";
                display: block;
                width: 0;
                height: 0;
                border-top: 25px solid transparent;
                border-bottom: 25px solid transparent;
                border-left: 12px solid #eeeeee;
                position: absolute;
                top: 50%;
                margin-top: -25px;
                right: -12px;
            }

            .num {
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                margin-right: 10px;
                border: 2px solid #bbbbbb;
                font-size: 14px;
            }
        }

        .active {
            background: #454B6C;
            color: #fff;

            &::after {
                border-left-color: #454B6C !important;
            }

            &::before {
                border-top-color: #454B6C !important;
                border-bottom-color: #454B6C !important;
            }

            .num {
                background: #fff;
                border: 0;
                color: #454B6C;
            }
        }
    }

    .border {
        color: #000;
        border: 1px solid #eeeeee;
        margin: 30px 0;
        display: flex;
        width: 100%;
        padding: 0 !important;
        font-size: 14px;

        .left {
            padding: 40px;
            width: 70%;

            .item_2 {
                .tip-title {
                    line-height: 30px;
                    margin-bottom: 10px;

                    .text {
                        font-size: 16px;
                        margin-right: 20px;
                    }

                    .el-icon-time {
                        color: #ff7044
                    }

                    .time {
                        color: #ff7044;
                        margin-left: 5px;
                        font-size: 14px;
                    }
                }

                .tip {
                    display: flex;
                    flex-flow: column;
                    font-size: 13px;
                    color: #a2a2a2;
                    margin: 15px 0;

                    span {
                        margin-bottom: 5px;
                    }
                }
            }

            .item_3,
            .item_4 {
                display: flex;
                flex-flow: column;
                position: relative;

                .edit-transport {
                    width: 400px;
                    padding: 20px;
                    border: 1px solid #bbbbbb;
                    padding-top: 0;
                    border-radius: 5px;
                    position: absolute;
                    top: 20px;
                    left: 50%;
                    margin-left: -200px;
                    background: #fff;

                    .header {
                        font-size: 18px;
                        text-align: center;
                        padding: 20px 0;
                        border-bottom: 1px solid #eeeeee;
                        margin-bottom: 20px;
                    }

                    .el-form {
                        display: flex;
                        flex-flow: column;
                        align-items: center;
                    }

                    .btns {
                        display: flex;
                        justify-content: space-around;
                        margin-top: 20px;
                        width: 100%;

                        .confirm {
                            width: 100px;
                            height: 35px;
                            background: #454b6c;
                            color: #fff;
                            cursor: pointer;
                            border-radius: 5px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }

                        .cancel {
                            width: 100px;
                            height: 35px;
                            border: 0.013333rem solid #bbbbbb;
                            background: #bbbbbb;
                            cursor: pointer;
                            color: #000;
                            border-radius: 5px;
                        }
                    }
                }

                .btn-box {
                    margin-top: 20px;
                }

                span {
                    line-height: 30px;
                }

                .span_1 {
                    font-size: 18px;
                }

                .span_2 {
                    font-size: 13px;
                    color: #818181;
                }

                .span_3 {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #eeeeee;
                    font-weight: 600;

                    span {
                        color: #ff7044;
                        margin-left: 10px;
                    }
                }

                .span_4 {
                    span {
                        margin-left: 10px;
                    }
                }

                .transport {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #eeeeee;

                    .items {
                        font-size: 15px;

                        .item {
                            line-height: 40px;
                            display: flex;

                            &:last-of-type {
                                margin-bottom: 0;
                            }

                            span:nth-of-type(1) {
                                display: flex;
                                width: 100px;
                                color: #939393;
                                font-size: 14px;
                            }

                            span:nth-of-type(2) {
                                display: flex;
                                flex: 1;
                            }

                            .item-content {
                                display: flex;
                                flex: 1;
                                flex-flow: column;
                                padding-top: 10px;

                                p {
                                    line-height: 18px;
                                }
                            }
                        }
                    }
                }

            }

            .item_4 {
                .adress-info {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #eeeeee;

                    .item {
                        margin-bottom: 5px;
                        display: flex;
                        height: 20px;
                        align-items: center;
                        color: #6e6e6e;

                        .item-left {
                            width: 80px;
                            display: flex;
                        }
                    }
                }
            }
        }

        .right {
            padding: 40px;
            border-left: 1px solid #eeeeee;

            .title {
                font-size: 18px;
                line-height: 30px;
                border-bottom: 0 !important;
            }

            .detail {
                display: flex;
                padding: 25px 0;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                .bg-img {
                    width: 100px;
                    height: 100px;
                }

                .info {
                    margin-left: 20px;
                    flex: 1;
                    color: #000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-start;
                    flex-flow: column;

                    .name {
                        display: flex;
                        margin-bottom: 10px;
                    }
                }
            }

            .no-border {
                border-top: 0;
            }

            .bottom {
                padding: 20px 0;
                display: flex;
                flex-flow: column;
                border-bottom: 1px solid #eeeeee;

                &:last-of-type {
                    border-bottom: 0;
                }

                .item {
                    line-height: 30px;
                    display: flex;

                    .span-left {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}
</style>
