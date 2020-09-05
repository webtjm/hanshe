<template>
<div class="feedbackWrapper">
    <div class="feedback">
        <div class="title">
            <span>反馈内容</span>
            <span class="add">添加本地图片></span>
        </div>
        <div class="imgWrapper">
            <img alt="寒舍" v-for="item in feedImg" :key="item" :src="item">
            <div class="addWrapper">
                <img alt="寒舍" src="@/assets/img/add.png">
                <input type="file" name="file" @change="addFeedImg($event)">
            </div>
        </div>
        <textarea cols="80" rows="10" placeholder="请在此输入您需要反馈的问题。" v-model="feedDetail"></textarea>
    </div>
    <button @click="newFeedback">提 交</button>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 上传的
            feedPhoto: [],
            // 显示的img
            feedImg: [],
            feedDetail: "",
        }
    },
    methods: {
        async addFeedImg(e) {
            let self = this;
            const files = e.target.files[0];
            if (!e || !window.FileReader) return; // 看支持不支持FileReader
            let reader = new FileReader();
            reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
                self.feedImg.push(this.result);
            };
            let photo = await this.uploadFile(files);
            if (photo) {
                this.feedPhoto.push(photo);
            } else {
                this.$message.info("上传文件失败");
            }
        },
        // 添加意见反馈
        async newFeedback() {
            let photo = this.feedPhoto.join(",");

            let {
                data
            } = await this.$axios.post("/api/feedback/addFeedBack", {
                picture: photo,
                details: this.feedDetail
            });
            if (data.errcode === 0) {
                this.$message.info("添加成功");
                this.feedPhoto = [];
                this.feedImg = [];
                this.feedDetail = "";
                // 获取意见反馈
                // this.getFeedback();
            } else {
                this.$message.info("添加失败");
            }
        },
        // 上传文件
        async uploadFile(files) {
            let self = this;
            let data = new FormData();
            data.append("file", files, files.name);
            let res = await this.$axios.post("/file/upload", data, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });
            if (res.data.errcode === 0) {
                return res.data.data;
            } else {
                return "";
            }
        },
    },
    mounted() {
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
.feedbackWrapper {
    flex: 1;

    .feedback {
        width: 100%;

        .title {
            border-bottom: 2px dashed #cacaca;
            padding-bottom: 12px;
            color: #8d8d8d;
            font-size: 16px;

            .add {
                color: @color;
                text-decoration: underline;
                margin-left: 38px;
                font-weight: bold;
                cursor: pointer;
            }
        }

        .imgWrapper {
            margin-top: 22px;

            img {
                width: 80px;
                height: 80px;
                margin-right: 8px;
                object-fit: cover;
                
            }

            .addWrapper {
                display: inline-block;
                position: relative;
                cursor: pointer;
                input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 80px;
                    height: 80px;
                    opacity: 0;
                }
            }
        }

        textarea {
            font-size: 14px;
            margin-top: 22px;
            border: 0;
            outline: 0;
        }
    }

    button {
        padding: 12px 38px;
        border-radius: 8px;
        border: 0;
        color: #fff;
        font-size: 16px;
        margin: 38px auto;
        background-color: @color;
        display: block;
    }
}
</style>
