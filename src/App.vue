<template>
<div id="app">
    <HeaderNav />
    <a-locale-provider :locale="zh_CN">
        <router-view />
    </a-locale-provider>

    <Tool />
    <BottomNav />
    <!-- 控制器的显示和隐藏 -->
    <div v-show="showLogin">
        <Login />
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
import HeaderNav from "@/components/public/HeaderNav";
import BottomNav from "@/components/public/BottomNav";
import Tool from "@/components/public/Tool";
import Login from "@/components/public/Login";
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
export default {
    name: "App",
    data() {
        return {
            zh_CN,
        }
    },
    components: {
        HeaderNav,
        Tool,
        BottomNav,
        Login
    },
    methods: {
        ...mapMutations('main', [
            'setLoginState',
            'setUserInfor'
        ])
    },
    computed: {
        ...mapState('main', [
            'showLogin'
        ])
    },

    async mounted() {
        let token = localStorage.getItem("hsToken");
        if (token) {
            this.$axios
                .get("/api/userInfo")
                .then(async ({
                    data
                }) => {
                    if (data.errcode === 0 && data.user) {
                        this.setLoginState(true)
                        this.setUserInfor(data.user);
                    } else {
                        this.setLoginState(false)
                    }
                })
                .catch(err => {
                    this.setLoginState(false)
                });
        } else {
            this.setLoginState(false)
        }
    }
};
</script>

<style lang="less">
@import "assets/less/common.less";
@import "assets/font/font.less";

html {
    overflow-y: scroll;
}

body /deep/ .el-popper /deep/ .el-cascader-panel {
    height: 300px;
}

.pointer {
    cursor: pointer;
}

.rest-time {
    // width: 204px;
    color: rgba(255, 112, 68, 1);
    font-size: 18px;
}

.el-loading-mask /deep/ .el-loading-spinner /deep/ .el-icon-loading {
    color: #fff;
    font-size: 50px;
}

.el-loading-mask /deep/ .el-loading-spinner /deep/ .el-loading-text {
    color: #fff;
    font-size: 20px;
}

.detailBtn,
button {
    cursor: pointer;
}

#app {
    font-family: hansans;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
    padding: 0;
    margin: 0;
}

.fullImg {
    width: 100%;
}

.detailBtn {
    width: 188px;
    font-size: 24px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #ebedf2;
    color: @color;

    div {
        font-size: 18px;
    }
}

.breadCrumb {
    border-top: 2px solid @color;
    padding-top: 25px;
    padding-bottom: 37px;

    .ant-breadcrumb {
        width: 70%;
        margin: 0 auto;
        font-size: 14px;

        &>span:last-child {
            color: @color;
        }
    }
}

button {
    outline: 0;
}

.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

@font-face {
    font-family: "iconfont";
    /* project id 1218036 */
    src: url("//at.alicdn.com/t/font_1218036_r06xzltlehf.eot");
    src: url("//at.alicdn.com/t/font_1218036_r06xzltlehf.eot?#iefix") format("embedded-opentype"),
        url("//at.alicdn.com/t/font_1218036_r06xzltlehf.woff2") format("woff2"),
        url("//at.alicdn.com/t/font_1218036_r06xzltlehf.woff") format("woff"),
        url("//at.alicdn.com/t/font_1218036_r06xzltlehf.ttf") format("truetype"),
        url("//at.alicdn.com/t/font_1218036_r06xzltlehf.svg#iconfont") format("svg");
}

.ant-pagination {
    text-align: center;
    margin: 30px 0 !important;
}

.ant-select-lg .ant-select-selection--single {
    height: 56px !important;
}

.ant-select-lg .ant-select-selection__rendered {
    height: 56px !important;
}

.ant-calendar-picker .ant-input-lg {
    height: 56px !important;
    line-height: 56px !important;
}

.ant-select-lg .ant-select-selection-selected-value {
    line-height: 50px !important;
}

.detail .ant-checkbox-group-item {
    color: #888 !important;
}
</style>
