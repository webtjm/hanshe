<template>
<div class="form-wrap">
    <div class="form-content pc">
        <div class="box">
            <div class="name">城市</div>
            <div class="ename">City</div>
            <a-select showSearch placeholder size="large" optionFilterProp="children" class="selection" style="width: 200px;" @change="selectCity" :filterOption="filterOption" v-model="city">
                <i class="iconfont" slot="suffixIcon">&#xe60f;</i>
                <a-select-option v-for="(item,idx) in citys" :key="idx" :value="item">{{item}}</a-select-option>
            </a-select>
        </div>
        <div class="box">
            <div class="name">目的地</div>
            <div class="ename">Destination</div>
            <a-select showSearch placeholder size="large" style="width: 200px;" optionFilterProp="children" class="selection" @change="selectHotel" :filterOption="filterOption" v-model="hotel">
                <i class="iconfont" slot="suffixIcon">&#xe60f;</i>
                <a-select-option v-for="(item,idx) in hotels" :key="idx" :value="item.name">{{item.name}}</a-select-option>
            </a-select>
        </div>
        <div class="box">
            <div class="name">套餐类型</div>
            <div class="ename">Package type</div>
            <a-select showSearch placeholder size="large" optionFilterProp="children" class="selection" style="width: 180px;" @change="selectComboType" :filterOption="filterOption" v-model="comboType">
                <i class="iconfont" slot="suffixIcon">&#xe7c6;</i>
                <a-select-option v-for="(item,idx) in comboTypes" :key="idx" :value="item">{{item}}</a-select-option>
            </a-select>
        </div>
        <div class="box">
            <div class="name">人数</div>
            <div class="ename">Number of People</div>
            <input style="width: 130px;" type="number" v-model="peopleNumber" />
        </div>
        <!-- <div class="box">
        <div class="name">天数</div>
        <div class="ename">Days</div>
        <input type="number" v-model="usageDay" />
      </div> -->
        <div class="box">
            <div class="name">最低价格</div>
            <div class="ename">Price</div>
            <input type="number" v-model="price1" />
        </div>
        <div class="box">
            <div class="name">最高价格</div>
            <div class="ename">Price</div>
            <input type="number" v-model="price2" />
        </div>
        <div class="box">
            <div class="name">热度排序</div>
            <div class="ename">Heat sort</div>
            <a-select showSearch placeholder size="large" optionFilterProp="children" class="selection" style="width: 100px;" @change="selectPromotion" :filterOption="filterOption" v-model="promotion">
                <i class="iconfont" slot="suffixIcon">&#xe602;</i>
                <a-select-option v-for="(item,idx) in promotions" :key="idx" :value="item">{{item}}</a-select-option>
            </a-select>
        </div>
    </div>
    <div class="form-content phone">
        <div class="item">
            <div class="box">
                <div class="name">城市</div>
                <div class="ename">City</div>
                <van-field readonly clickable :value="city" placeholder="选择城市" @click="showPickerCity = true" />
                <van-popup v-model="showPickerCity" position="bottom">
                    <van-picker show-toolbar :columns="citys" @cancel="showPickerCity = false" @confirm="selectCity" />
                </van-popup>
            </div>
            <div class="box">
                <div class="name">目的地</div>
                <div class="ename">Destination</div>
                <van-field readonly clickable :value="hotelName" placeholder="选择目的地" @click="showPickerHotel = true" />
                <van-popup v-model="showPickerHotel" position="bottom">
                    <van-picker show-toolbar :columns="hotels" value-key="name" @cancel="showPickerHotel = false" @confirm="selectPhoneHotel" />
                </van-popup>
            </div>
            <div class="box">
                <div class="name">套餐类型</div>
                <div class="ename">Package type</div>
                <van-field readonly clickable :value="comboType" placeholder="选择套餐类型" @click="showPickerCombo = true" />
                <van-popup v-model="showPickerCombo" position="bottom">
                    <van-picker show-toolbar :columns="comboTypes" value-key="name" @cancel="showPickerCombo = false" @confirm="selectComboType" />
                </van-popup>
            </div>
        </div>
        <div class="item">
            <div class="box people">
                <div class="name">人数</div>
                <div class="ename">Number of People</div>
                <van-field readonly clickable :value="peopleNumber" @touchstart.native.stop="showPickerPeople = true" />
                <van-number-keyboard v-model="peopleNumber" :show="showPickerPeople" @blur="showPickerPeople = false" />
            </div>
            <div class="box">
                <div class="name">最低价格</div>
                <div class="ename">Price</div>
                <van-field readonly clickable :value="price1" @touchstart.native.stop="showPickerPrice1 = true" />
                <van-number-keyboard v-model="price1" :show="showPickerPrice1" @blur="showPickerPrice1 = false" />
            </div>
            <div class="box">
                <div class="name">最高价格</div>
                <div class="ename">Price</div>
                <van-field readonly clickable :value="price2" @touchstart.native.stop="showPickerPrice2 = true" />
                <van-number-keyboard v-model="price2" :show="showPickerPrice2" @blur="showPickerPrice2 = false" />
            </div>
            <div class="box">
                <div class="name">热度排序</div>
                <div class="ename">Heat sort</div>
                <van-field readonly clickable :value="promotion" @click="showPickerPromotion = true" />
                <van-popup v-model="showPickerPromotion" position="bottom">
                    <van-picker show-toolbar :columns="promotions" value-key="name" @cancel="showPickerPromotion = false" @confirm="selectPromotion" />
                </van-popup>
            </div>
        </div>
    </div>
    <div class="packageBtn">
        <a-button type="primary" @click="getPackage">查看 Checking</a-button>
        <a-button @click="toClear">重置 Clear</a-button>
    </div>
</div>
</template>

<script>
function formatObj(obj, key) {
    return obj.map(item => {
        return item[key];
    });
}
export default {
    data() {
        return {
            page: 1,
            size: 5,
            citys: [],
            city: "",
            hotels: [],
            hotel: "",
            hotelName: null,
            peopleNumber: "1",
            usageDay: 1,
            promotions: ["否", "是"],
            promotion: "",
            comboTypes: ["乐享套餐", "普通套餐"],
            comboType: "",
            price1: "",
            price2: "",
            priceWrap: false,
            showPickerCity: false,
            showPickerHotel: false,
            showPickerCombo: false,
            showPickerPeople: false,
            showPickerPrice1: false,
            showPickerPrice2: false,
            showPickerPromotion: false
        };
    },
    computed: {
        price() {
            return this.price1 + '-' + this.price2
        }
    },
    async created() {
        // 获取所有城市
        let {
            data
        } = await this.$axios.get("/api/getCity");
        if (data.errcode === 0 && data.data.length > 1) {
            this.citys = formatObj(data.data, "city");
        }

    },
    methods: {
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        async selectCity(val) {
            this.showPickerCity = false
            this.city = val;
            this.hotel = ''
            let hotel = await this.$axios.post('/api/getHotelByCity?city=' + this.city);
            if (hotel.data.errcode === 0 && hotel.data.data.length > 0) {
                this.hotels = hotel.data.data;
                console.log(this.hotels)
            }
        },
        selectHotel(val) {
            this.hotel = val;
        },
        selectPhoneHotel(picker, val) {
            // console.log(picker, val)
            this.showPickerHotel = false
            this.hotel = picker;
            this.hotelName = picker.name
        },
        selectComboType(val) {
            this.showPickerCombo = false
            this.comboType = val;
        },
        selectPromotion(val) {
            this.showPickerPromotion = false
            this.promotion = val;
        },
        getPackage() {
            let obj = {
                city: this.city,
                hotel: this.hotel,
                comboType: this.comboType === "乐享套餐" ? 0 : 1,
                peopleNumber: this.peopleNumber,
                usageDay: this.usageDay,
                price1: this.price1,
                price2: this.price2,
                promotion: this.promotion === "否" ? 0 : 1
            };
            this.$emit("sort", obj);
        },
        showPrice() {
            console.log(this.priceWrap)
            this.priceWrap = this.priceWrap ? false : true
        },
        toClear() {
            this.city = ''
            this.hotel = ''
            this.comboType = ''
            this.peopleNumber = 1
            this.usageDay = 1
            this.price1 = ''
            this.price2 = ''
            this.promotion = ''
            this.$emit("clear");
        }
    }
};
</script>

<style lang="less" scoped>
@import "./form.less";

.phone {
    display: none !important;
}

@media screen and (max-width: 1000px) {

    .pc {
        display: none !important;
    }

    .phone {
        display: flex !important;
        flex-flow: column;

        .item {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
        }

        .box {
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;

            input {
                border: 1px solid #d9d9d9;
                padding: 20px !important;
                height: fit-content !important;
            }

            &.people {
                input {
                    width: fit-content !important;
                }
            }

            .ename {
                display: none !important;
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

            /deep/ .van-number-keyboard {
                height: fit-content !important;

                .van-number-keyboard__body {
                    .van-hairline {
                        display: inline-flex;
                        height: fit-content !important;
                        line-height: unset !important;
                        padding: 100px 0;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }

    .packageBtn {
        button {
            width: fit-content!important;
            height: 100px;
        }
    }
}

.selection {
    width: 200px;
}

.packageBtn {
    button {
        margin: 38px 15px 0;
        width: 200px;
    }
}
</style>
