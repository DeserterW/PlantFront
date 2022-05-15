<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 评论管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <!-- <el-button type="primary" icon="el-icon-lx-text" @click="acquireNotPassScheme">查看未审核方案</el-button> -->

            </div>

                <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="userName" label="名称" width="80"></el-table-column>                
                    <el-table-column prop="content" label="留言"></el-table-column>
                    <el-table-column prop="date" label="时间" width="200"></el-table-column>
                    
                    <el-table-column label="操作" width="180" align="center">
                        <template #default="scope">
                            <el-button type="text" icon="el-icon-lx-roundclose" @click="checkComment(scope.$index, scope.row,false)">不通过</el-button>
                            <el-button type="text" icon="el-icon-lx-roundcheck" @click="checkComment(scope.$index, scope.row,true)">通过</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>



        <el-dialog title="确认" v-model="addSchemeVisible" width="50%">

            <template #footer>
                <span class="dialog-footer">
                </span>
            </template>
        </el-dialog>        

    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import axios from 'axios';
import { getAdditionalMeta } from "@intlify/core-base";
import { slotFlagsText } from "@vue/shared";
import { map } from "lodash";

export default {
    name: "commentCheck",
    setup() {
        const query = reactive({
            address: "",
            name: "",
            pageIndex: 1,
            pageSize: 10,
        });
        const userInfo = JSON.parse(localStorage.getItem("ms_userInfo"))
    
        const tableData = ref([]);
        const pageTotal = ref(0);

        // 获取表格数据
        const getData = () => {
            fetchData(query).then((res) => {

                pageTotal.value = res.pageTotal || 50;
                const formData ={
                    userId: userInfo["id"]
                }
                 

            });

        };
        getData();

        var options_name = new Map()
        var checkName = false     
        const getUserName = () =>
        {   
            if(checkName == false)
            {
                axios.post("http://localhost:8080/user/getName",{
                    id:-1
                })
                .then(response => {
                    const Info = response.data.data
                    for(var i = 0 ;i < Info.length ; i++)
                    {
                        const item = {
                            id : Info[i]["id"],
                            name : Info[i]["name"]
                        }
                        options_name.set(Info[i]["id"],Info[i]["name"])
                        
                    }
                })
                checkName = true
            }

        }


        const acquireComment = () => {
            getUserName()
            axios.get("http://localhost:8080/comment/getAllNotPassed").then(response => {
                var showSchemeData = response.data.data
                for(var i = 0 ; i <showSchemeData.length ; i++)
                {
                    showSchemeData[i]["userName"] = options_name.get(showSchemeData[i]["userId"])
                }
                console.log(showSchemeData)
                tableData.value = showSchemeData
            })

        }
        acquireComment()


        // 查询操作
        const handleSearch = () => {
            query.pageIndex = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.pageIndex = val;
            getData();
        };
        


        // 表格编辑时弹窗和保存
        const checkComment = (index,row, passed) =>{
            axios.post("http://localhost:8080/comment/checkComment",
            {
                id:row["id"],
                passed: passed,
            }).then(response =>{
                if(response.data.success == true)
                {
                    if(response.data.data == "passed")
                    {
                        ElMessage.success("审核通过")
                    }else{
                        ElMessage.error("审核不通过")
                    }
                }else
                {
                    ElMessage.error("发生未知错误")
                }
                tableData.value.splice(index,1)
            })

        } 


        return {
            query,
            tableData,
            pageTotal,
            checkComment,
            options_name,
            handleSearch,
            handlePageChange,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}
.form {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
