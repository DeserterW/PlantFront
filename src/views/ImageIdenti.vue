<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <!-- <i class="el-icon-lx-calendar"></i> 表单 -->
                </el-breadcrumb-item>
                <el-breadcrumb-item>图片上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="content-title">图像识别</div>
            <div class="plugins-tips">
                <!-- Element UI自带上传组件。
                访问地址：
                <a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a> -->
            </div>
            <!-- <el-upload class="upload-demo" drag action="http://jsonplaceholder.typicode.com/api/posts/" multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
                </template>
            </el-upload> -->
            <el-form class="upload">
                <el-form-item>
                    <div class="content-title">图片</div>
                    <el-upload drag
                    action=""
                    list-type="picture" :file-list="fileList" :on-change="handleChange"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <span class="dialog-footer">
                    <el-button @click="submit">识别</el-button>
                </span>
                <el-form-item prop="desc" class="returnRes" label-width="300px">
                    <div class="content-title">搜索结果</div>

                    <el-table :data="recognizeResData">
                        <el-table-column prop="score" label="相似度"  min-width="200%"></el-table-column>
                        <el-table-column prop="name" label="种类" min-width="500%"></el-table-column>   
                    </el-table>
                </el-form-item>                
            </el-form>

            <!-- <div class="content-title">支持裁剪</div> -->
            <!-- <div class="plugins-tips"> -->
                <!-- vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：
                <a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a> -->
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import defaultSrc from "../assets/img/img.jpg";
import axios from 'axios';
import { ElMessage } from 'element-plus';
export default {
    name: "imageidenti",
    components: {
        VueCropper,
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList:[],
        picBase64:'',
        recognizeResData:[],
      };
    },
    setup() {
        const imgSrc = ref("");
        const cropImg = ref(defaultSrc);
        const dialogVisible = ref(false);
        const cropper = ref(null);
        const setImage = (e) => {
            const file = e.target.files[0];
            if (!file.type.includes("image/")) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                dialogVisible.value = true;
                imgSrc.value = event.target.result;
                cropper.value && cropper.value.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        };

        const cropImage = () => {
            cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
        };

        const cancelCrop = () => {
            dialogVisible.value = false;
            cropImg.value = defaultSrc;
        };


        return {
            cropper,
            imgSrc,
            cropImg,
            dialogVisible,
            setImage,
            cropImage,
            cancelCrop,
        };
    },

    methods: {
        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
        
            console.log(file);
        },
        handleChange(file, fileList) {
            this.getBase64(file.raw).then(res => {

                this.picBase64 = res
                // console.log(this.picBase64)
            });
        },
        getBase64(file) {
            return new Promise(function(resolve, reject) {
                let reader = new FileReader();
                let imgResult = "";
                reader.readAsDataURL(file);
                reader.onload = function() {
                imgResult = reader.result;
                };
                reader.onerror = function(error) {
                reject(error);
                };
                reader.onloadend = function() {
                resolve(imgResult);
                };
            });
        },
        submit(){
            axios.post("http://localhost:8080/img/identi",
            {
                img:this.picBase64
            }).then (response => {
                if(response.data.success == true)
                {  
                    var temp = JSON.parse(response.data.data)
                    console.log(temp["result"])
                                        
                    ElMessage.success("识别成功")
                    return temp["result"]
                }else
                {
                    ElMessage.error("识别失败")
                }
            }).then(temp => {
                this.recognizeResData = temp
            })
        }        
    }
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}

.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.upload {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}

.returnRes{
     label-position:top;
}

</style>