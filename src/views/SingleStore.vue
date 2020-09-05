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
            <a-breadcrumb-item class="actived">{{infor.name}}</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
    <Introduction :data="infor" />
    <Determine />
    <!--  -->
    <div class="classifyTitle" id="order">
        <div class="active" href="#order">
            寒舍预订
            <span class="border"></span>
        </div>
    </div>
    <OrderItem v-for="item in house" :data="item" :key="item.id" />
    <div class="classifyTitle" id="infor">
        <div class="active" href="#infor">
            寒舍信息
            <span class="border"></span>
        </div>
    </div>
    <div class="introWrapper">
        <div class="introTitle">酒店简介：</div>
        <div class="introContent">{{infor.sketch}}</div>
        <div class="introTitle">酒店特色：</div>
        <!-- <div class="introContent">乐享：{{infor.comboName?infor.comboName:'无'}}</div> -->
        <div class="introContent">特色：{{infor.characteristic?infor.characteristic:'无'}}</div>
        <div class="introContent">美食：{{infor.food?infor.food:'无'}}</div>
        <div class="introContent">房型：{{infor.houseName?infor.houseName:'无'}}</div>
    </div>
</div>
</template>

<script>
import Introduction from "@/components/detail/Introduction";
import OrderItem from "@/components/detail/OrderItem";
import Determine from '@/components/form/Determine'

function isWeekEnd() {
    if ("天一二三四五六".charAt(new Date().getDay()) == "五") {
        return true
    } else if ("天一二三四五六".charAt(new Date().getDay()) == "六") {
        return true
    } else {
        return false
    }
}
export default {
    data() {
        return {
            id: '',
            infor: {},
            house: []
        }
    },
    async mounted() {
        let {
            id
        } = this.$route.query;
        this.id = id;
        this.getInfor();
        // 获取单个酒店的房型信息
        let {
            data
        } = await this.$axios.post(`/api/getHouse?id=${id}`);
        if (data.errcode === 0) {
            var house = data.data;
            house.forEach(item => {
                if (item.vacationStatus === 0) {
                    var isweek = isWeekEnd()
                    item.relPrice = isweek ? item.weekPrice : item.price
                } else {
                    item.relPrice = item.price
                }
            })
            this.house = house
        }
    },
    methods: {
        async getInfor() {
            let {
                data
            } = await this.$axios.post(`/api/getHotelInfo?id=${this.id}`)
            if (data.errcode === 0) {
                data.data.pictureUrl = data.data.pictureUrl.split(',')
                this.infor = data.data;
            } else {
                this.$message.info(data.errmsg);
            }
        },
        determine(obj) {
            console.log(obj)
        }
    },
    components: {
        Introduction,
        OrderItem,
        Determine
    }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";

.breadCrumb {
    border-top: 2px solid @color;
    padding-top: 25px;
    padding-bottom: 37px;

    .ant-breadcrumb {
        width: 62.5%;
        margin: 0 auto;
        font-size: 14px;

        &>span:last-child {
            color: @color;
        }
    }
}

.classifyTitle {
    margin: 0 auto;
    width: 62.5%;
    border-bottom: 2px solid #cacaca;
    padding-bottom: 8px;

    div {
        font-size: 20px;
        color: #cacaca;
        position: relative;
        display: inline-block;
    }

    .active {
        color: @color;

        .border {
            .litterBorder(29px, 5px);
            position: absolute;
            left: 30%;
            bottom: -9px;
        }
    }
}

.introWrapper {
    width: 62.5%;
    margin: 0 auto 80px;

    .introTitle {
        margin-top: 22px;
        font-size: 18px;
        color: @color;
    }

    .introContent {
        font-size: 14px;
        color: @color;
        line-height: 30px;
    }
}
</style>
