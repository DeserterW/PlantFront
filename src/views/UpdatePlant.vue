<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 植物库管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加</el-button>
                <!-- <el-button type="primary" icon="el-icon-lx-text" @click="acquireNotPassScheme">查看未审核方案</el-button> -->

            </div>

                <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="name" label="植物名"></el-table-column>                
                    <el-table-column prop="appearance" label="外貌描述"></el-table-column>
                    <el-table-column prop="price" label="价格"></el-table-column>
                    <el-table-column prop="varity" label="科目"></el-table-column>
                    
                    <el-table-column label="操作" width="180" align="center">
                        <template #default="scope">
                            <el-button type="text" icon="el-icon-lx-delete" @click="deletePlant(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>


        <!-- 编辑‘添加’弹出框-->
        <el-dialog title="添加" v-model="editAddVisible" width="50%">

            <el-form label-width="70px">
                <el-form-item label="植物名">
                    <el-input v-model="form.plantName"></el-input>
                </el-form-item>
                <el-form-item label="外貌描述">
                    <el-input v-model="form.appearance"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>

                </el-form-item>
                <el-form-item label="科目种属">
                    <el-input v-model="form.varity"></el-input>
                </el-form-item>
         
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editAddVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>


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

export default {
    name: "updatePlant",
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
        const detailData = ref([]);
        const schemeData = ref([]);
        const envData = ref([]);

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

        var options_name=[]
        var checkName = false     
        const getPlantName = () =>
        {   
            if(checkName == false)
            {
                axios.get("http://localhost:8080/plant/allName")
                .then(response => {
                    const plantInfo = response.data.data
                    for(var i = 0 ;i < plantInfo.length ; i++)
                    {
                        const item = {
                            value : plantInfo[i]["id"],
                            label : plantInfo[i]["name"]
                        }
                        
                        options_name.push(item)
                    }
                })
                checkName = true
            }

        }
        var checkEnvName = false
        var options_envName =[]
        const getPersonalEnv = (id) =>
        {
            if(checkEnvName == false)
            {
                axios.post("http://localhost:8080/env/all",
                    {
                        userId:id
                    }).then(response => {
                    {   
                        if(response.data.success == true)
                        {
                            envData.value = response.data.data;
                            var tempData = response.data.data
                            for(var i = 0 ; i < tempData.length ; i++)
                            {
                                var envItem = {
                                    value: tempData[i]["id"],
                                    label: tempData[i]["envName"]
                                }
                                options_envName.push(envItem)
                            }
                            console.log(options_envName)
                        }
                    }
                })
                checkEnvName = true
            }
        }


        const getPlantNameById = (id) =>
        {
            // console.log(options_name)

            for(var i = 0; i < options_name.length ;i++)
            {
                if(options_name[i].value == id)
                {
                    return options_name[i].label
                }
            }
        }

        const editDetailVisible = ref(false);

        // 查询方案详情
        const handleDetails =(index,row) => {
            editDetailVisible.value = true
            Object.keys(form).forEach((item) =>{
                form[item] = row[item]
            })
            const formData = {
                personalSchemeId: form["id"]
            }

            axios.post("http://localhost:8080/scheme/detail",
            formData).then(response =>{
                if(response.data.success == true)
                {
                    detailData.value = [response.data.data]
                }
            })
        }


        const acquireScheme = () => {
            getPlantName()
            getPersonalEnv(userInfo["id"])
            axios.get("http://localhost:8080/plant/allName").then(response => {
                var showSchemeData = response.data.data
                console.log(showSchemeData)
                for(var i = 0 ; i <showSchemeData.length ; i++)
                {
                    var plantName = getPlantNameById(showSchemeData[i]["plantId"])
                    
                    showSchemeData[i]["plantName"] = plantName
                }
                tableData.value = showSchemeData
            })

        }
        acquireScheme()
        const acquireSchemeVisible = ref(false);

        const acquireNotPassScheme = () => {
            acquireSchemeVisible.value = true
            getPlantName()
            getPersonalEnv(userInfo["id"])
            axios.post("http://localhost:8080/scheme/all",
            {passed:false}).then(response => {
                var showSchemeData = response.data.data
                for(var i = 0 ; i <showSchemeData.length ; i++)
                {
                    var plantName = getPlantNameById(showSchemeData[i]["plantId"])
                    showSchemeData[i]["plantName"] = plantName
                }
                schemeData.value = showSchemeData
            })
        }
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
        
        const editAddVisible = ref(false)
        const handleAdd = () =>{
            getPlantName()
            getPersonalEnv(userInfo["id"])
            editAddVisible.value = true
        }

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            id:"",
            // name: "",
            personalPlant:"",
            personalEnv:""
        });
        let idx = -1;

        // 删除操作
        const deletePlant = (index,row) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    axios.post("http://localhost:8080/plant/removePlant",
                    {id:row["id"]}).then(response => {
                        if(response.data.success == true)
                        {
                            ElMessage.success("删除成功");
                            tableData.value.splice(index, 1);
                        }else
                        {
                            ElMessage.error("删除失败");
                        }
                    })
                })
                .catch(() => {});
        };


        const saveAdd = () => {
            editAddVisible.value = false;
            const addData = {
                name: form.plantName,
                appearance: form.appearance,
                price: form.price,
                varity: form.varity,
            }
            console.log(addData)
            axios.post("http://localhost:8080/plant/addPlant",
            addData).then(response => {
                if(response.data.success == true)
                {
                    ElMessage.success("添加数据成功")
                }else
                {
                    ElMessage.error("添加数据失败")
                }
            })
        }








        return {
            query,
            tableData,
            detailData,
            schemeData,
            pageTotal,
            editVisible,
            editAddVisible,
            editDetailVisible,
            acquireSchemeVisible,
            form,
            options_name,
            getPlantNameById,
            getPersonalEnv,
            handleAdd,
            handleSearch,
            handlePageChange,
            acquireNotPassScheme,
            deletePlant,
            acquireScheme,
            saveAdd,
            handleDetails,
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
