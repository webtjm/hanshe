<template>
<div>
    <div class="breadCrumb">
        <a-breadcrumb>
            <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/">HANSHE HOTEL</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/reservations">预订</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link :to="{path:'/singleStore',query: {id: hotelId}}">{{hotel.name}}</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item class="actived">预订详情</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
    <div class="main">
        <div class="detail">
            <a-card title="预订信息">
                <div class="line">
                    <span>房型信息</span>
                    <div>{{house.name}}</div>
                </div>
                <div class="line">
                    <span>入住时间</span>
                    <div>
                        {{residentTime}}
                        <span>入住 -</span>
                        {{exitTime}}
                        <span>离店</span>
                        共{{days}}晚
                    </div>
                </div>
                <div class="line">
                    <span>房间数量</span>
                    <div>1间</div>
                </div>
                <div class="line">
                    <span>是否可取消</span>
                    <div>{{house.isCancelTime ? '' : '不'}}可取消</div>
                </div>
            </a-card>
            <a-card title="户型选择" v-if="room.length>0">
                <div class="line select-room-box">
                    <div class="select-room">
                        <el-select v-model="selectRoom" placeholder="请选择" @change="roomChange">
                            <el-option v-for="item in room" :key="item.id" :label="item.name" :value="item.id" :disabled="item.reserveStatus&&item.reserveStatus==1">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-room-price">
                        价格：{{house.relPrice}}元 起
                    </div>
                    <div class="select-room-pType">
                        <span>平日价格(周日至周四)：{{house.price}}元/晚</span>
                        <span>周末价格(周五至周六)：{{house.weekPrice}}元/晚</span>
                        <span v-for="(item, idx) in jrList" :key="idx">
                            <span v-if="item.begin===item.end">{{item.name}}({{item.begin}})：{{item.price}}元/晚</span>
                            <span v-else>{{item.name}}({{item.begin}}~{{item.end}})：{{item.price}}元/晚</span>
                        </span>
                    </div>
                </div>
                <div class="select-room-img">
                    <img alt="寒舍" :src="`${imgUrl}${selectRoomImg}`" v-if="selectRoomImg">
                </div>
                <div class="line select-room-box-bottom">
                    {{selectRoom}}
                    <p>{{residentTime}}入住 - {{exitTime}}离店</p>
                    <p>共{{days}}晚</p>小计：{{totalPrice}}元
                </div>
            </a-card>
            <a-card title="入住信息">
                <div class="line">

                    <span><span class="red">*</span>住客姓名</span>
                    <input type="text" v-model="name" />
                    <div class="tips">填写姓名必须与入住时所持有有效证件姓名保持一致</div>
                </div>
                <div class="line">

                    <span><span class="red">*</span>手机号码</span>
                    <input type="text" v-model="phone" />
                    <div class="tips">订单提交后，我们将会把预订信息发送至您的手机</div>
                </div>
                <div class="line">
                    <span>电子邮箱</span>
                    <div>
                        <input type="text" v-model="email" />
                    </div>
                </div>
                <div class="line">

                    <span><span class="red">*</span>入住人数</span>
                    <div>{{peopleNumber}}人</div>
                    <div style="margin-left:20px;">提示：入住人数最多为10人</div>
                </div>
                <div class="line">
                    <span>成人人数</span>
                    <input style="margin-right: 20px;" type="number" v-model="adult" :min="0" :max="10" />
                    <span>儿童人数</span>
                    <input type="number" v-model="child" :min="0" :max="10" />
                </div>
                <div class="line">

                    <span><span class="red">*</span>身份证号码</span>
                    <div>
                        <input type="text" v-model="idcard" style="width: 200px;" />
                    </div>
                </div>
                <div class="line">
                    <span>到店时间</span>
                    <input type="text" v-model="time" />
                    <div class="tips">酒店入住时间为15:00，如提前入住或推迟离店，均须酌情加收一定的费用。</div>
                </div>
                <div class="line">
                    <span>备注信息</span>
                    <div>
                        <input type="text" v-model="remarks" />
                    </div>
                </div>
                <div class="line">
                    <span>特殊需求</span>
                    <div style="flex: 1;color:#888;">
                        <a-checkbox-group :options="specialList" v-model="specialRequest" />
                        <span class="tips elseTip">如有其它特殊需求，请在备注中填写</span>
                    </div>

                </div>
            </a-card>
            <!-- <a-card title="优惠信息">
          <span>暂无优惠信息</span>
        </a-card> -->
            <a-card title="发票信息">
                <span>如需开票请到前台开具，暂不支持线上开票</span>
            </a-card>
        </div>
        <div class="about">
            <img alt="寒舍" :src="imgUrl+`${hotel.pictureUrl?hotel.pictureUrl[0]:''}`" />
            <div class="name">{{hotel.name}}</div>
            <div class="name">{{hotel.eName}}</div>
            <div class="address">
                <div>地址：{{common.formatCity(hotel.province, hotel.city)+hotel.address}}</div>
                <div>电话：{{hotel.phone}}</div>
            </div>
            <div class="secTitle">{{house.name}}</div>
            <div class="content">床型：{{house.bedType}}</div>
            <div class="content">面积：{{house.area}}</div>
            <div class="content">接机：{{house.isAirport===1?'包含':'不包含'}}</div>
            <div class="content">早餐：{{house.isBreakfast===1?'包含':'不包含'}}</div>
            <div class="content">标准入住人数：{{house.residence}}人</div>
            <div class="secTitle">入住提示</div>
            <div class="content">
                <div>1.酒店标准入住时间为 15:00，离店时间为 12:00；</div>
                <div>2.山里寒舍所提供床位尺寸均为 1.8m×2m；</div>
                <div>3.为确保入住体验，山里寒舍按照酒店户型所对应标准居住人数做接待服务； </div>
                <div>4.3 岁以下身高不超过 90 公分视为幼儿，可享受标准居住人数内所包含的餐食，3-12 岁儿童可享受成人餐标半价；</div>
                <div>5.平日入住至少提前 7 天预订，周末入住至少提前 15 天预订，假日入住至少提前 30 天预订；为确保您的假期体验，请尽早安排订房。</div>
            </div>
            <div class="priceWrapper">
                <div class="tips">
                    <span>房费</span>
                    <span>￥{{totalPrice}}</span>
                </div>
                <div class="tips" v-for="(item, idx) in fareDetail" :key="idx">
                    <span>{{item.date}}</span>
                    <span>{{item.price}}</span>
                </div>
                <!-- <div class="tips">
                    <span>优惠券</span>
                    <span>无</span>
                </div> -->
                <div class="price">
                    <span>总金额</span>
                    <span class="total">
                        ￥
                        <span>{{totalPrice}}</span>
                    </span>
                </div>
            </div>
            <button class="payBtn" @click="reserveHouse">支付 Pay</button>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations,
    mapGetters
} from "vuex"

function isWeekEnd(day) {
    if ("天一二三四五六".charAt(day.getDay()) == "五") {
        return true
    } else if ("天一二三四五六".charAt(day.getDay()) == "六") {
        return true
    } else {
        return false
    }
}

import FormDate from '@/config/formTime.js'
import moment from 'moment'

export default {
    data() {
        return {
            showJrPrice: false,
            jrPrice: 0,
            jrName: '',
            jrBegin: '',
            jrEnd: '',
            room: [],
            selectRoom: '',
            selectRoomId: '',
            selectRoomImg: '',
            userId: "",
            hotelId: "",
            houseId: "",
            hotel: {},
            house: {},
            id: "",
            name: "",
            phone: "",
            email: "",
            adult: 1,
            child: 0,
            idcard: "",
            time: "15:00",
            remarks: "无",
            price: "",
            residentTime: null,
            exitTime: null,
            days: 1,
            specialList: [
                '叫车服务',
                '行李寄存',
                '中餐厅',
                '西餐厅',
                '会议室',
                '充电桩',
                '其他'
            ],
            specialRequest: [],
            jrList: [],
            fareDetail: []
        };
    },
    computed: {
        ...mapState('main', [
            'reData'
        ]),
        totalPrice() {
            if (this.exitTime && this.residentTime) {
                var price = 0
                var dates = new FormDate().getAll(this.residentTime, this.exitTime)
                for (var i = 0; i < dates.length - 1; i++) {
                    var relPrice = 0
                    var jrPrice = 0
                    var isweek = isWeekEnd(new Date(dates[i]))
                    if (this.house.vacationHouseList) {
                        var jrList = this.house.vacationHouseList
                        for (var j = 0; j < jrList.length; j++) {
                            var begin = moment(jrList[j].useTime).format("YYYY-MM-DD")
                            var end = moment(jrList[j].escTime).format("YYYY-MM-DD")
                            var arr = new FormDate().getAll(begin, end)
                            if (arr.indexOf(dates[i]) != -1) {
                                jrPrice = jrList[j].price
                                this.jrList.push({
                                    name: jrList[j].name,
                                    price: jrList[j].price,
                                    begin,
                                    end
                                })
                                break
                            }
                        }
                    }
                    relPrice = jrPrice != 0 ? jrPrice : (isweek ? this.house.weekPrice : this.house.price)
                    price = price + relPrice
                    if (relPrice) {
                        this.fareDetail.push({
                            date: dates[i],
                            price: `1×￥${relPrice.toFixed(2)}`
                        })
                    }

                }
                return price.toFixed(2);
            }
        },
        peopleNumber() {
            var num = parseInt(this.adult) + parseInt(this.child)
            if (num > 10) {
                this.$message('入住人数最多为10人')
                return 10
            } else {
                return num
            }
        }
    },
    mounted() {
        let {
            id,
            hid
        } = this.$route.query;
        this.hotelId = hid;
        this.id = id;
        this.getHotel();
        this.getHouse();
        this.getDate();
    },
    methods: {
        ...mapMutations('main', [
            'setShowLogin'
        ]),
        /* 户型切换事件 */
        roomChange(val) {
            this.room.forEach(item => {
                if (item.id === val) {
                    this.selectRoomImg = item.picture
                    this.selectRoomId = item.id
                    this.selectRoom = item.name
                }
            })
        },
        /* 获取户型信息 */
        async getRoom(id) {
            let {
                data
            } = await this.$axios.get(
                `/api/getRoom?id=${id}&residentTime=${this.residentTime}&exitTime=${this.exitTime}`
            );
            if (data.errcode === 0 && data.data.length > 0) {
                this.room = data.data;
                for (var i = 0; i < data.data.length; i++) {
                    if (!data.data[i].reserveStatus) {
                        this.selectRoom = data.data[i].name
                        this.selectRoomId = data.data[i].id
                        this.selectRoomImg = data.data[i].picture
                        break
                    }
                }
            } else {
                this.$message.info(data.errmsg);
            }
        },
        async getHotel() {
            let {
                data
            } = await this.$axios.post(
                `/api/getHotelInfo?id=${this.hotelId}`
            );
            if (data.errcode === 0) {
                data.data.pictureUrl = data.data.pictureUrl.split(",");
                this.hotel = data.data;
            } else {
                this.$message.info(data.errmsg);
            }
        },
        async getHouse() {
            let {
                data
            } = await this.$axios.post(`/api/getHouseInfo?id=${this.id}`);
            if (data.errcode === 0) {
                this.house = data.data
                if (this.house.vacationStatus === 0) {
                    var day = new Date()
                    var isweek = isWeekEnd(day)
                    this.house.relPrice = isweek ? this.house.weekPrice : this.house.price
                } else {
                    this.house.relPrice = this.house.price
                }
                this.getRoom(this.house.id);
                // 房费明细
                // var today = moment().format('YYYY-MM-DD') 
                // var jrList = this.house.vacationHouseList
                // for (var j = 0; j < jrList.length; j++) {
                //     var begin = moment(jrList[j].useTime).format("YYYY-MM-DD")
                //     var end = moment(jrList[j].escTime).format("YYYY-MM-DD")

                //     if (nextDay===begin||today===begin) {
                //         this.showJrPrice = true
                //         this.jrPrice = jrList[j].price
                //         this.jrName = jrList[j].name
                //         this.jrBegin = begin
                //         this.jrEnd = end
                //         break
                //     }
                // }
            }
        },
        getDate() {
            let {
                date,
                days
            } = this.reData;
            let today = this.common.today();
            let tomorrow = this.common.tomorrow();
            // console.log(this.common)
            if (date && date[0]) {
                this.residentTime = date[0];
                this.exitTime = date[1];
                this.days = days;
                // console.log(this.days)
            } else {
                this.residentTime = today;
                this.exitTime = tomorrow;
                this.days = 1;
            }
        },
        reserveHouse() {
            let token = localStorage.getItem("hsToken");
            if (!token) {
                this.setShowLogin(true);
            } else {
                let res = this.$axios.get("/api/userInfo");
                console.log(res);
            }
            let houseId = this.id;
            let hotelId = this.hotelId;
            let totalPrice = this.totalPrice;
            let price = this.house.relPrice;
            let residentsName = this.name;
            let phone = this.phone;
            let email = this.email;
            let adultNumber = this.adult;
            let childNumber = this.child;
            let identity = this.idcard;
            let arriveTime = this.time;
            let remarks = this.remarks;
            let residentTime = this.residentTime;
            let exitTime = this.exitTime;
            let specialRequest = this.specialRequest.join()
            if (!this.common.phone(phone)) {
                this.$message.info('手机号码不规范');
                return false
            }
            if (email && !this.common.email(email)) {
                this.$message.info('邮箱不规范');
                return false
            }
            if (!this.common.idcard(identity)) {
                this.$message.info('身份证号不规范');
                return false
            }
            if (residentsName && phone && identity) {
                this.$axios
                    .post(
                        `/api/reserve?houseId=${houseId}
        &hotelId=${hotelId}
        &totalPrice=${totalPrice}
        &price=${price}
        &residentsName=${residentsName}
        &phone=${phone}
        &email=${email}
        &adultNumber=${adultNumber}
        &childNumber=${childNumber}
        &identity=${identity}
        &arriveTime=${arriveTime}
        &remarks=${remarks}
        &residentTime=${residentTime}
        &exitTime=${exitTime}
        &specialRequest=${specialRequest}
        &roomId=${this.selectRoomId}`
                    )
                    .then(({
                        data
                    }) => {
                        if (data.errcode === 0) {
                            this.$message.info(data.errmsg);
                            this.$router.push("/confirmPay?id=" + data.data);
                            // this.$router.push("/orderDetail?id=" + data.data);
                        } else {
                            this.$message.info(data.errmsg);
                            // this.setShowLogin(true);
                        }
                    })
                    .catch(err => {
                        // this.setShowLogin(true);
                        this.$message.info("请求错误，请稍后再试");
                    });
            } else {
                this.$message.info("数据填写不完全");
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "../assets/less/main.less";

button {
    cursor: pointer;
}

.about img {
    object-fit: cover;
}

.elseTip {
    display: inline-block;
    margin-top: 2px;
    margin-left: -8px;
}

.ant-checkbox-group-item {
    color: #888;
}

.select-room-img {
    width: 100%;

    img {
        width: 100%;
    }
}

.select-room-box {
    justify-content: space-between;
    margin-bottom: 10px;

    .select-room-price {
        color: #454B6C !important;
        font-weight: 600 !important;
    }

    .select-room-pType {
        display: flex;
        flex-flow: column;
        color: #888;
        font-size: 14px !important;
    }
}

.select-room-box-bottom {
    justify-content: center;
    border-top: 1px solid #e8e8e8;
    margin-top: 0.266667rem;
    padding-top: 0.266667rem;

    p {
        margin: 0 20px;
    }

    p:last-of-type {
        margin-left: 0;
    }
}
</style>
