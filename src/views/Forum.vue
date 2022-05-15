<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 论坛
                </el-breadcrumb-item>
                <el-breadcrumb-item>富文本编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-table :data="commentData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="title" label="帖子名称"></el-table-column>
                <el-table-column prop="userName" label="作者名"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="checkComment(scope.$index, scope.row)">详情
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="container">
            <el-form>
                <el-form-item label="Title:">
                    <el-input v-model="form.launchTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="mgb20" ref='editor'></div>
                </el-form-item>
                <el-button type="primary" @click="syncHTML">提交</el-button>
            </el-form>
        </div>

        <!-- 编辑‘添加’弹出框-->
        <el-dialog title="添加" v-model="commentDetailVisible" width="100%">
            <el-table :data="commentDetailData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="id" width="55">
                </el-table-column>
                <el-table-column prop="userName" label="作者" width="55" align="center">
                    <img src="src\img\head.jpg" width="16" height="16"/>
                </el-table-column>
                <el-table-column prop="content" label="评论内容"></el-table-column>
                <el-table-column prop="time" label="时间" width="100"></el-table-column>
                <el-table-column prop="likesNums" label="喜欢"  width="55"></el-table-column>

                <el-table-column label="" width="100" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-lx-like" @click="like(scope.$index, scope.row)">点赞
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
            
            <el-form>
                <el-form-item label="回复" prop="commentback">
                    <el-input type="textarea" rows="5" v-model="commentBack" placeholder="请输入回复"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="commentDetailVisible = false">取 消</el-button>
                    <el-button type="primary" @click="comment">回复</el-button>
                </span>
            </template>
        </el-dialog>        



    </div>


</template>

<script>
import WangEditor from "wangeditor";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import axios from 'axios';
import { ElMenu, ElMessage } from 'element-plus';
export default {
    name: "forum",
    data() {
        return {
            commentBack: '',
        }
    },
    setup() {
        const editor = ref(null);
        const content = reactive({
            html: "",
            text: "",
        });
        const commentData = ref([])
        const commentDetailData = ref([])
        var options_userName =  new Map()
        var LocalTargId = ref();
        let instance;
        let form = reactive({
            id:"",
            // name: "",
            launchTitle:""
        });
        const userInfo = JSON.parse(localStorage.getItem("ms_userInfo"))

        onMounted(() => {
            instance = new WangEditor(editor.value);
            instance.config.zIndex = 1;
            instance.create();
        });
        onBeforeUnmount(() => {
            instance.destroy();
            instance = null;
        });
        const syncHTML = () => {
            content.html = instance.txt.html();
            content.text = instance.txt.text();
            console.log(content.text);
            console.log(form.launchTitle)
            axios.post("http://localhost:8080/comment/addNewTitle",
            {
                userId:userInfo["id"],
                title:form.launchTitle,
                content:content.text
            }).then(response =>{
                if(response.data.success == true)
                {
                    ElMessage.success("发布标题成功")
                }else
                {
                    ElMessage.error("发布标题失败")
                }

            })

        };

        const getUserName = () =>{
            axios.post("http://localhost:8080/user/getName",{
                userId:1
            })
            .then(response => {
                if(response.data.success == true)
                {
                    console.log(response.data.data)
                    const commData = response.data.data
                    for(var i =0 ;i < commData.length; i++)
                    {
                        var temp = {
                            userId:response.data.data[i]["id"],
                            name:response.data.data[i]["name"]
                        }
                        options_userName.set(response.data.data[i]["id"],response.data.data[i]["name"])
                        // options_userName.push(temp)
                    }
                    console.log(options_userName)
                }
            })
        }
        getUserName()

        const getComment = () =>{
            axios.post("http://localhost:8080/comment/getAll",{
                userId:1
            })
            .then(response =>{
                if(response.data.success = true)
                {
                    console.log(response.data.data)
                    var temp = response.data.data
                    var push_value = []
                    for( var i = 0;i<temp.length;i++)
                    {
                        var commData = {
                            id: temp[i]["id"],
                            title: temp[i]["title"],
                            userName: options_userName.get(temp[0]["userId"])
                        }
                        push_value.push(commData)
                    }
                    commentData.value = push_value
                }
            })
        }
        getComment()

        const commentDetailVisible = ref(false);
        
        const checkComment = (index, row) => {
            commentDetailVisible.value = true
            LocalTargId = console.log(row["id"]);
            axios.post("http://localhost:8080/comment/getOne",
            {
                id:row["id"]
            }).then(response => {
                if(response.data.success == true)
                {
                    var temp = response.data.data
                    var push_value = []
                    for(var i = 0 ; i< temp.length;i++)
                    {
                        console.log(response.data.data)
                        var detailsdata = {
                            id:temp[i]["id"],
                            userName:options_userName.get(temp[0]["userId"]),
                            content:temp[i]["content"],
                            time:temp[i]["date"],
                            likesNums: temp[i]["likesNums"]
                        }
                        push_value.push(detailsdata)
                    }
                    commentDetailData.value = push_value
                    localStorage.setItem("localTarId", row["id"]);

                }
            })
        }

        const like = (index, row) => {
            console.log(localStorage.getItem("localTarId"))

            axios.post("http://localhost:8080/comment/like",
            {
                id:row["id"]
            }).then(response =>{
                if(response.data.success)
                {
                    ElMessage.success("点赞成功")
                }else
                {
                    ElMessage.error("点赞失败")
                }
            })

        }

        return {
            form,
            LocalTargId,
            like,
            checkComment,
            commentDetailVisible,
            commentDetailData,
            syncHTML,
            editor,
            content,
            commentData,
            getComment,
            getUserName,
        };
    },
    methods:
    {
        comment()
        {
            const userInfo = JSON.parse(localStorage.getItem("ms_userInfo"))
            axios.post("http://localhost:8080/comment/back",
            {
                id:localStorage.getItem("localTarId"),
                userId:userInfo["id"],
                content:this.commentBack        
            }).then(response => {
                if(response.data.success == true)
                {
                    ElMessage.success("评论成功，待审核")
                }else
                {
                    ElMessage.error("评论失败")
                }
            })
        }
    },
};
</script>

<style>
</style>
