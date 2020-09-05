<template>
<div class="form-wrap">
    <div class="form-content pc">
        <div class="box">
            <div class="name">省份</div>
            <div class="ename">Province</div>
            <a-select showSearch placeholder size="large" optionFilterProp="children" class="selection" @change="selectProvince" :filterOption="filterOption" v-model="province">
                <i class="iconfont" slot="suffixIcon">&#xe72f;</i>
                <a-select-option v-for="(item,idx) in provinces" :key="idx" :value="item">{{item}}</a-select-option>
            </a-select>
        </div>
        <div class="box">
            <div class="name">城市</div>
            <div class="ename">City</div>
            <a-select showSearch placeholder size="large" optionFilterProp="children" class="selection" @change="selectCity" :filterOption="filterOption" v-model="city">
                <i class="iconfont" slot="suffixIcon">&#xe636;</i>
                <a-select-option v-for="(item,idx) in citys" :key="idx" :value="item">{{item}}</a-select-option>
            </a-select>
        </div>
        <div class="box">
            <div class="name">入住日期</div>
            <div class="ename">Check-in date</div>
            <a-date-picker size="large" @change="changeStart" v-model="start" :disabledDate="disabledStart">
                <i slot="suffixIcon" class="iconfont">&#xe6be;</i>
            </a-date-picker>
        </div>
        <div class="box">
            <div class="name">退房日期</div>
            <div class="ename">Check-out date</div>
            <a-date-picker size="large" @change="changeEnd" v-model="end" :disabledDate="disabledStart">
                <i slot="suffixIcon" class="iconfont">&#xe6be;</i>
            </a-date-picker>
        </div>
        <div class="box">
            <div class="name">晚</div>
            <div class="ename">Nights</div>
            <div class="inp">
                <span>{{days}}</span>
            </div>
        </div>
    </div>
    <div class="form-content phone">
        <div class="box">
            <div class="name">省份</div>
            <div class="ename">Province</div>
            <van-field readonly clickable :value="province" placeholder="选择省份" @click="showPickerProvince = true" />
            <van-popup v-model="showPickerProvince" position="bottom">
                <van-picker show-toolbar :columns="provinces" @cancel="showPickerProvince = false" @confirm="selectProvince" />
            </van-popup>
        </div>
        <div class="box">
            <div class="name">城市</div>
            <div class="ename">City</div>
            <van-field readonly clickable :value="city" placeholder="选择城市" @click="showPickerCity = true" />
            <van-popup v-model="showPickerCity" position="bottom">
                <van-picker show-toolbar :columns="citys" @cancel="showPickerCity = false" @confirm="selectCity" />
            </van-popup>
        </div>
        <div class="box">
            <div class="name">入住日期</div>
            <div class="ename">Check-in date</div>
            <!-- <a-date-picker size="large" @change="changeStart" v-model="start" :disabledDate="disabledStart">
                <i slot="suffixIcon" class="iconfont">&#xe6be;</i>
            </a-date-picker> -->
            <van-field readonly clickable :value="phoneStarString" placeholder="选择入住日期" @click="showPickerIn = true" />
            <van-popup v-model="showPickerIn" position="bottom">
                <van-datetime-picker v-model="phoneStar" type="date" @cancel="showPickerIn = false" @confirm="changeStartPhone" />
            </van-popup>
        </div>
        <div class="box">
            <div class="name">退房日期</div>
            <div class="ename">Check-out date</div>
            <van-field readonly clickable :value="phoneEndString" placeholder="选择退房日期" @click="showPickerOut = true" />
            <van-popup v-model="showPickerOut" position="bottom">
                <van-datetime-picker v-model="phoneEnd" type="date" @cancel="showPickerOut = false" @confirm="changeEndPhone" />
            </van-popup>
        </div>
        <div class="box">
            <div class="name">晚</div>
            <div class="ename">Nights</div>
            <van-field readonly clickable :value="days" />
        </div>
    </div>
    <a-button type="primary" @click="getReHotel">查看空房情况 Check Avialbility</a-button>
</div>
</template>

<script>
import moment from "moment";
import {
    mapState,
    mapMutations
} from 'vuex'

function formatObj(obj, key) {
    return obj.map(item => {
        return item[key];
    });
}
export default {
    data() {
        return {
            showPickerCity: false,
            showPickerProvince: false,
            showPickerIn: false,
            showPickerOut: false,
            provinces: [],
            province: "",
            citys: [],
            city: "",
            date: [],
            moment: [],
            days: 1,
            start: null,
            end: null,
            phoneStar: null,
            phoneEnd: null,
            phoneStarString: null,
            phoneEndString: null
        };
    },
    computed: {
        ...mapState('main', [
            'reData'
        ])
    },
    async created() {
        let {
            city,
            province,
            date,
            days
        } = this.reData;
        this.city = city ? city : "";
        this.province = province ? province : "";
        let today = this.common.today()
        let tomorrow = this.common.tomorrow()
        this.date = date ? date : [today, tomorrow];
        this.moment = [
            moment(this.date[0], "YYYY-MM-DD"),
            moment(this.date[1], "YYYY-MM-DD")
        ];
        this.start = moment(this.date[0])
        this.end = moment(this.date[1])
        this.phoneStar = new Date(this.date[0])
        this.phoneEnd = new Date(this.date[1])
        this.phoneStarString = moment(this.date[0]).format("YYYY-MM-DD")
        this.phoneEndString = moment(this.date[1]).format("YYYY-MM-DD")
        this.days = days ? days : 1;

        let {
            data
        } = await this.$axios.get("/api/getProvince");
        this.provinces = formatObj(data.data, "province");
    },
    methods: {
        ...mapMutations('main', [
            'setReData'
        ]),
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        selectProvince(val) {
            this.showPickerProvince = false
            this.province = val;
            this.city = "";
            this.$axios
                .post(`/api/getCityByProvince?province=${val}`)
                .then(({
                    data
                }) => {
                    if (data.errcode === 0) {
                        this.citys = formatObj(data.data, "city");
                    }
                })
                .catch(e => {
                    this.$message.info("出错了，请稍后再试");
                });
        },
        // 根据city跟province去获取酒店
        selectCity(val) {
            this.showPickerCity = false
            this.city = val;
        },
        changeStart(date, dateString) {
            this.end = moment(date).add(1, 'days')
            this.date[0] = dateString
            this.date[1] = moment(date).add(1, 'days').format('YYYY-MM-DD')
            this.moment[0] = date
            this.moment[1] = moment(date).add(1, 'days')
            this.days = this.common.compareData(this.date);
        },
        changeStartPhone(val) {
            this.showPickerIn = false
            this.phoneStar = val
            this.phoneStarString = moment(val).format('YYYY-MM-DD')
            this.phoneEnd = new Date(moment(val).add(1, 'days'))
            this.phoneEndString = moment(val).add(1, 'days').format('YYYY-MM-DD')
            this.end = moment(val).add(1, 'days')
            this.date[0] = moment(val).format('YYYY-MM-DD')
            this.date[1] = moment(val).add(1, 'days').format('YYYY-MM-DD')
            this.moment[0] = moment(val)
            this.moment[1] = moment(val).add(1, 'days')
            this.days = this.common.compareData(this.date);
            this.$forceUpdate()
        },
        changeEnd(date, dateString) {
            this.date[1] = dateString
            this.moment[1] = date
            this.days = this.common.compareData(this.date);
        },
        changeEndPhone(val) {
            if (val < this.phoneStar) {
                this.showPickerOut = false
                this.$message.info('退房日期只能在入住日期之后')
            } else if (moment(val).format('YYYY-MM-DD') === this.phoneStarString) {
                this.showPickerOut = false
                this.$message.info('退房日期只能在入住日期之后')
            } else {
                this.showPickerOut = false
                this.phoneEnd = val
                this.phoneEndString = moment(val).format('YYYY-MM-DD')
                this.date[1] = moment(val).format('YYYY-MM-DD')
                this.moment[1] = moment(val)
                this.days = this.common.compareData(this.date);
            }
        },
        getReHotel() {
            this.setReData({
                city: this.city,
                province: this.province,
                date: this.date,
                moment: this.moment,
                days: this.days
            });
            this.$emit("change");
        },
        disabledStart(current) {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
        },
        disabledEnd(current) {
            // Can not select days before today and today
            return current && current < moment().endOf('day');
        },
    }
};
</script>

<style lang="less" scoped>
@import "./form.less";

.form-wrap {
    /deep/ button {
        height: fit-content;
        padding-top: 10px;
        padding-bottom: 10px;
    }
}

.phone {
    display: none !important;
}

@media screen and (max-width: 1000px) {
    .pc {
        display: none !important;
    }

    .phone {
        display: flex !important;
        .box{
            display: flex;
            flex-flow: column;
            align-items: center;
            .ename{
                display: none!important;
            }
        }

        /deep/ .van-picker__toolbar {
            padding: 20px 0;
            height: fit-content;
            line-height: unset;
        }

        /deep/ .van-field__body {
            input {
                border: 1px solid #d9d9d9;
                padding: 20px;
            }
        }
    }
}
</style>
