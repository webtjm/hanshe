<template>
<div class="main-box">
    <div class="content-box">
        <a-breadcrumb>
            <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/">HANSHE HOTEL</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/personal/myorder/shopOrder">我的订单</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/shopOrderDetail">退换</router-link>
            </a-breadcrumb-item>
        </a-breadcrumb>
        <router-view />
    </div>
</div>
</template>

<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>

<style lang="less" scoped>
.main-box {
    width: 100%;
    display: flex;
    justify-content: center;

    .content-box {
        width: 75%;
    }
}
</style>
