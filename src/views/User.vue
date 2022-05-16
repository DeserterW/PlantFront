<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>基础信息</span>
                        </div>
                    </template>
                    <div class="info">
                        <div class="info-image" @click="showDialog">
                            <img :src="avatarImg" />
                            <span class="info-edit">
                                <i class="el-icon-lx-camerafill"></i>
                            </span>
                        </div>
                        <div class="info-name">{{ name }}</div>
                        <div class="info-desc">不可能！我的代码怎么可能会有bug！</div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>账户编辑</span>
                        </div>
                    </template>
                    <el-form label-width="90px">
                        <el-form-item label="用户名：">{{name}}
                            <el-input type="text" v-model="form.name" v-bind:disabled="form.change" placeholder="名字"></el-input> 
                        </el-form-item>
                        <el-form-item label="邮箱:">{{email}}
                            <el-input type="text" v-model="form.email" v-bind:disabled="form.change" placeholder="邮箱"> ></el-input>
                        </el-form-item>
                        <el-form-item label="性别:">{{gender}}
                            <el-radio v-model="form.gender" label="1" v-bind:disabled="form.change">男</el-radio>
                            <el-radio v-model="form.gender" label="0" v-bind:disabled="form.change">女</el-radio>
                            <!-- <el-input type="radio" v-model="form.gender" v-bind:disabled="form.change" placeholder="性别">></el-input> -->
                        </el-form-item>
                        <el-form-item label="从业年龄">{{employYear}}年
                            <el-input type="text" v-model="form.employYear" v-bind:disabled="form.change" placeholder="从业年龄"></el-input>
                        </el-form-item>
                        <el-form-item label="旧密码：">
                            <el-input type="password" v-model="form.old"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码：">
                            <el-input type="password" v-model="form.new"></el-input>
                        </el-form-item>
                        <el-form-item label="个人简介：">
                            <el-input v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onChange">修改</el-button>
                            <el-button type="primary" @click="onSubmit">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
            <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                style="width: 100%; height: 400px"></vue-cropper>

            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                    </el-button>
                    <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import axios from 'axios';
import { ElMessage } from 'element-plus';
export default {
    name: "user",
    components: {
        VueCropper,
    },

    setup() {
        const name = localStorage.getItem("ms_username");
        const info = localStorage.getItem("ms_userInfo")
        const json_info= JSON.parse(info)

        console.log(json_info)
        const email = json_info["email"]
        const gender = json_info["gender"] == 1 ? "男":"女"
        const employYear = json_info["employYears"]
        var form = reactive({
            old: "",
            new: "",
            desc: "十年经验，植物专家",
            change: true,
            name: "",
            email: "",
            gender: json_info["gender"],
            employYear: "",
        });
        const onSubmit = () => {
            const submit_form = ref(form)
            const name = submit_form.value.name
            const gender = submit_form.value.gender
            const email = submit_form.value.email
            const employYear = submit_form.value.employYear

            if(name == null && gender == null && email == null && employYear == null)
            {
                return;
            }

            const formData = {
                id: json_info["id"],
                email: email == "" ? null : email,
                gender: parseInt(gender),
                name: name == "" ? null : name,
                employYear: parseInt(employYear)
            }
            console.log(formData)
            axios.post("http://localhost:8080/user/info_change",
            formData
            ).then(response =>{
                if(response.data.success == true)
                {
                    ElMessage.success("已发送修改信息")
                }else
                {
                    ElMessage.success("发送失败")
                }
                form.change = true;
            })
        };
        
        const onChange = () => {
            form.change = false;
        };

        const avatarImg = ref(avatar);
        const imgSrc = ref("");
        const cropImg = ref("");
        const dialogVisible = ref(false);
        const cropper = ref(null);

        const showDialog = () => {
            dialogVisible.value = true;
            imgSrc.value = avatarImg.value;
        };

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

        const saveAvatar = () => {
            avatarImg.value = cropImg.value;
            dialogVisible.value = false;
        };

        return {
            name,
            gender,
            email,
            employYear,
            form,
            onSubmit,
            onChange,
            cropper,
            avatarImg,
            imgSrc,
            cropImg,
            showDialog,
            dialogVisible,
            setImage,
            cropImage,
            saveAvatar,
        };
    },
};
</script>

<style scoped>
.info {
    text-align: center;
    padding: 35px 0;
}
.info-image {
    position: relative;
    margin: auto;
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50px;
    overflow: hidden;
}
.info-image img {
    width: 100%;
    height: 100%;
}
.info-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.info-edit i {
    color: #eee;
    font-size: 25px;
}
.info-image:hover .info-edit {
    opacity: 1;
}
.info-name {
    margin: 15px 0 10px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;
}
.crop-demo-btn {
    position: relative;
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
</style>