<template>
<div class="package">
    <img alt="寒舍" :src="imgUrl+data.picture" @click="linkTo">
    <div>
        <div class="money">
            <span>RMB</span>
            {{data.price}}
        </div>
        <div class="border"></div>
        <div class="title">{{data.name}}</div>
        <div class="content">{{data.introduction}}</div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    methods: {
        linkTo() {
            this.$emit('link', this.data.id)
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';

@media screen and (max-width: 1000px) {
    .package {

        img {}

        &>div {

            .money {

                span {}
            }

            .border {}

            .title {
                margin: 0;
                margin-bottom: 20px;
                font-family: hansans !important;
                font-size: 20px !important;
            }

            .content {
                display: none !important;
            }
        }
    }
}

.package {
    display: flex;
    margin-bottom: 25px;

    img {
        width: 501px;
        height: 264px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
    }

    &>div {
        flex: 1;
        margin-left: 38px;
        color: @color;

        .money {
            font-size: 26px;

            span {
                padding-right: 6px;
            }
        }

        .border {
            width: 58px;
            height: 10px;
            margin: 16px 0;
            background-color: @color;
        }

        .title {
            font-size: 28px;
            margin-bottom: 38px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            font-family: hanzhen;
        }

        .content {
            font-size: 16px;
            font-weight: 500;
            line-height: 31px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
}
</style>
