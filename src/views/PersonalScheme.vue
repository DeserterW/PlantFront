<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 个人植物培养方案
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-button type="primary" icon="el-icon-search" @click="handleAdd">添加</el-button>
                <el-button type="primary" icon="el-icon-lx-text" @click="acquireScheme">获取推荐方案</el-button>

            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="方案名"></el-table-column>
                <el-table-column prop="date" label="加入日期"></el-table-column>                
                <el-table-column prop="exceuteTime" label="执行日期"></el-table-column>
                <el-table-column prop="envrionment" label="环境"></el-table-column>
                <el-table-column prop="growPeriod" label="生长期"></el-table-column>
                <el-table-column prop="likeNums" label="点赞数" ></el-table-column>
                
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-lx-read" @click="handleDetails(scope.$index, scope.row)">详情
                        </el-button>

                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑‘详情’弹出框-->
        <el-dialog title="详情" v-model="editDetailVisible" width="50%">
        
            <el-table :data="detailData"  border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="schemeName" label="方案名" width="55" align="center"></el-table-column>
                <el-table-column prop="temperature" label="温度(℃)"></el-table-column>
                <el-table-column prop="lightTime" label="光照时长(h/天)"></el-table-column>                
                <el-table-column prop="moisture" label="湿度(%)"></el-table-column>
                <el-table-column prop="fertilizer" label="肥料"></el-table-column>
                <el-table-column prop="growPeriod" label="生长期"></el-table-column>
                <el-table-column prop="likesNums" label="点赞数" ></el-table-column>
            </el-table>
            <template #footer>
                <span class="dialog-footer">
                </span>
            </template>
        </el-dialog>

        <!-- 编辑‘添加’弹出框-->
        <el-dialog title="添加" v-model="editAddVisible" width="50%">

            <el-form label-width="70px">
                <el-form-item label="方案名">
                    <el-input v-model="form.schemeName"></el-input>
                </el-form-item>
                <el-form-item label="植物">
                    <el-select v-model="form.plant" placeholder="请选择植物">
                        <el-option
                            v-for="item in options_name"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>  
                </el-form-item>
                <el-form-item label="温度">
                    <el-input v-model="form.temperature"></el-input>

                </el-form-item>
                <el-form-item label="光照时长">
                    <el-input v-model="form.lightTime"></el-input>

                </el-form-item>
                <el-form-item label="湿度">
                    <el-input v-model="form.moisture"></el-input>

                </el-form-item>                         
                <el-form-item label="肥料">
                    <el-input v-model="form.fertilizer"></el-input>
                </el-form-item>

                <el-form-item label="环境">
                    <el-select v-model="form.envName" placeholder="请选择环境">
                        <el-option
                            v-for="item in options_envName"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>  
                </el-form-item>
                <el-form-item label="生长期">
                    <el-select v-model="form.growPeriod" placeholder="请选择生长期">
                        <el-option
                            v-for="item in options_period"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>  
                </el-form-item>              
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editAddVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑‘推荐框’弹出框-->
        <el-dialog title="培养方案" v-model="acquireSchemeVisible" width="80%">
            <div class="handle-box">
                <el-form class="form">
                    <el-form-item>
                        <el-select v-model="form.personalPlant" placeholder="请选择植物">
                            <el-option
                                v-for="item in options_name"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>  
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="form.personalEnv" placeholder="请选择环境">
                            <el-option
                                v-for="item in options_envName"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-search" @click="recommendationScheme">推荐</el-button>
                
            </div>

            <el-table :data="schemeData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="schemeName" label="方案名"></el-table-column>
                <el-table-column prop="plantName" label="植物名"></el-table-column>                
                <el-table-column prop="lightTime" label="光照时长"></el-table-column>
                <el-table-column prop="moisture" label="湿度（%）"></el-table-column>
                <el-table-column prop="temperature" label="温度（℃）"></el-table-column>
                <el-table-column prop="fertilizer" label="肥料"></el-table-column>
                <el-table-column prop="growPeriod" label="生长期"></el-table-column>
                <el-table-column prop="likesNums" label="点赞数"></el-table-column>
                
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-lx-like" @click="putALike(scope.$index, scope.row)"></el-button>
                        <el-button type="text" icon="el-icon-lx-read" @click="addSchemeToPersonal(scope.$index, scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="acquireSchemeVisible = false">取 消</el-button>
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
    name: "personalscheme",
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
                 
                axios.post("http://localhost:8080/personal/scheme",
                formData).then(async response => {
                    if(response.data.success == true)
                    {
                        console.log(response.data.data)
                        tableData.value = response.data.data
                    }
                })
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

        const acquireSchemeVisible = ref(false);

        const acquireScheme = () => {
            acquireSchemeVisible.value = true
            getPlantName()
            getPersonalEnv(userInfo["id"])
            axios.post("http://localhost:8080/scheme/all",
            {passed:true}).then(response => {
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
        const handleDelete = (index,row) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    console.log(row)
                    axios.post("http://localhost:8080/personal/removePersonalScheme",
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
                userId:JSON.parse(localStorage.getItem("ms_userInfo"))["id"],
                plantId: form.plant,
                schemeName: form.schemeName,
                temperature: form.temperature,
                moisture: form.moisture,
                envId: form.envName,
                lightTime: form.lightTime,
                fertilizer: form.fertilizer,
                growPeriod: form.growPeriod,
            }
            console.log(addData)
            axios.post("http://localhost:8080/personal/addScheme",
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


        const recommendationScheme = () =>
        {
            if(form.personalPlant == null || form.personalEnv == null)
            {
                ElMessage.error("你必须选择方案和环境")
                return
            }
            const sendData = {
                plantId: form.personalPlant,
                envId: form.personalEnv              
            }

            axios.post("http://localhost:8080/scheme/recommandation",
                sendData).then(response => {
                    if(response.data.success == true)
                    {
                        var showSchemeData = response.data.data
                        for(var i = 0 ; i <showSchemeData.length ; i++)
                        {
                            var plantName = getPlantNameById(showSchemeData[i]["plantId"])
                            showSchemeData[i]["plantName"] = plantName
                        }
                        schemeData.value = showSchemeData
                        ElMessage.success("获取推荐方案")
                    }else
                    {
                        ElMessage.error("获取推荐失败")
                    }
                })
        }

        const addSchemeToPersonal = (index,row) =>
        {
            idx = index;
            var envId = form.personalEnv
            if(envId == "")
            {
                ElMessage.error("请选择环境")
            }else
            {
                var schemeId = row["id"]
                const addSchemeToPerData = 
                {
                    userId: userInfo["id"],
                    envId: envId,
                    schemeId: schemeId
                }
                console.log(addSchemeToPerData)
                axios.post("http://localhost:8080/personal/addSchemeToPersonal",
                addSchemeToPerData).then(response =>{
                    
                })

                ElMessage.success("添加成功")
            }
        }


        const putALike = (index,row) => {
            console.log(row)
            axios.post("http://localhost:8080/scheme/like",
            {id:row.id}).then(response =>{
                if(response.data.success == true)
                {
                    ElMessage.success("点赞成功")
                    location.reload()
                }else
                {
                    ElMessage.error("点赞失败")
                }
            })
        }

        const options_period =[
            {
                value:0,
                label:"幼苗期"                 
            },
            {
                value:1,
                label:"缓苗期"  
            },
            {
                value:2,
                label:"生长旺盛期"  
            },
            {
                value:3,
                label:"开花期"
            },
            {
                value:4,
                label:"休眠期"
            }
        ]

        const options_status =[
            {
                value:0,
                label:"健康"
            },
            {
                value:1,
                label:"亚健康"                
            },
            {
                value:2,
                label:"营养不良"   
            },
            {
                value:3,
                label:"不健康"   
            },
            {
                value:4,
                label:"将枯萎"   
            }
        ]        




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
            options_period,
            options_status,
            options_envName,
            getPlantNameById,
            getPersonalEnv,
            recommendationScheme,
            addSchemeToPersonal,
            handleAdd,
            handleSearch,
            handlePageChange,
            handleDelete,
            acquireScheme,
            saveAdd,
            handleDetails,
            putALike,
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
