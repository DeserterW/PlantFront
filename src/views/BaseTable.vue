<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 个人植物信息库
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-" @click="handleAddEdit">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="植物名"></el-table-column>

                <el-table-column prop="plantNums" label="数量"></el-table-column>                

                <el-table-column prop="growPeriod" label="生长期"></el-table-column>
                <el-table-column prop="growStatus" label="健康状态"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
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

         <!-- 环境添加删除 -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 个人环境信息库
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-" @click="handleAddEnv">添加</el-button>
            </div>
            <el-table :data="envData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="envName" label="环境名"></el-table-column>

                <el-table-column prop="temperature" label="温度"></el-table-column>                

                <el-table-column prop="humidity" label="湿度"></el-table-column>
                <el-table-column prop="lightLevel" label="光照强度"></el-table-column>
                <el-table-column prop="fertilizer" label="肥料"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEditEnv(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDeleteEnv(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>


        <!-- 编辑‘编辑’弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="数量">
                    <el-input v-model="form.editNums"></el-input>
                </el-form-item>
                <el-form-item label="生长期">
                    <el-select v-model="form.editPeriod" placeholder="请选择生长期">
                        <el-option
                            v-for="item in options_period"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>  
                </el-form-item>
                <el-form-item label="健康状态">
                    <el-select v-model="form.editStatus" placeholder="请选择健康状态">
                        <el-option
                            v-for="item in options_status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>     
                    <!-- <el-input v-model="form.status"></el-input> -->
                </el-form-item>            
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑‘添加’弹出框-->
        <el-dialog title="添加" v-model="editAddVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="植物">
                    <el-select v-model="form.name" placeholder="请选择植物">
                        <el-option
                            v-for="item in options_name"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                   
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="form.nums" placeholder="请输入数量"></el-input>
                </el-form-item>
                <el-form-item label="生长期">
                    <el-select v-model="form.period" placeholder="请选择生长期">
                        <el-option
                            v-for="item in options_period"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>  
                </el-form-item>
                <el-form-item label="健康状态">
                    <el-select v-model="form.status" placeholder="请选择健康状态">
                        <el-option
                            v-for="item in options_status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>     
                    <!-- <el-input v-model="form.status"></el-input> -->
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editAddVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 编辑‘添加’弹出框-->
        <el-dialog title="添加" v-model="AddEnvVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="环境名称">
                    <el-input v-model="form.envName" placeholder="请输入环境名"></el-input>              
                </el-form-item>
                <el-form-item label="温度(℃)">
                    <el-input v-model="form.envTemperature" placeholder="请输入日常温度"></el-input>
                </el-form-item>
                <el-form-item label="湿度(%)">
                    <el-input v-model="form.envHumidity" placeholder="请输入日常湿度"></el-input>
                </el-form-item>
                <el-form-item label="光照强度">
                    <el-select v-model="form.envLightLevel" placeholder="请选择光照强度">
                        <el-option
                            v-for="item in options_light"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>     
                </el-form-item>
                <el-form-item label="肥力">
                    <el-select v-model="form.envFertilize" placeholder="请选择肥力等级">
                        <el-option
                            v-for="item in options_fertilize"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>                       
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="AddEnvVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAddEnv">确 定</el-button>
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
    name: "basetable",
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
        const envData = ref([])
        // 获取表格数据
        const getData = () => {
            fetchData(query).then((res) => {

                pageTotal.value = res.pageTotal || 50;
                const formData ={
                    userId: userInfo["id"]
                }
                 
                var plantIdNameMap = new Map()
                var plantId = new Set()
                var query_res
                axios.post("http://localhost:8080/personal/plant",
                formData).then(async response => {
                    if(response.data.success == true)
                    {
                        console.log(response.data.data)
                        query_res = response.data.data
                        for(var i = 0 ; i < query_res.length; i++)
                        {
                            plantId.add(query_res[i]["plantId"]);

                            let formNameData = {
                                plantId: query_res[i]["plantId"]
                            }
                            await axios.post("http://localhost:8080/plant/name",
                            formNameData).then(response => {
                                if(response.data.success == true)
                                {
                                    plantIdNameMap.set(query_res[i]["plantId"],response.data.data)
                                }
                            })
                        }
                        var Data=[]

                        for(var i = 0 ; i<query_res.length ;i++)
                        {
                            var id = query_res[i]["plantId"]
                            var item = {
                                id: query_res[i]["id"],
                                name: plantIdNameMap.get(id),
                                plantNums: query_res[i]["plantNums"],
                                growPeriod: query_res[i]["growPeriod"],
                                growStatus: query_res[i]["growStatus"]
                            }
                            Data.push(item)
                        }
                        tableData.value = Data
                        
                        console.log(Data)
                        // console.log(plantIdNameMap)
                        // alert("get data ok")
                    }
                })

                axios.post("http://localhost:8080/env/all",
                formData).then(response => {
                    if(response.data.success == true)
                    {
                        console.log(response.data.data)
                        envData.value = response.data.data
                    }
                })
            });

        };
        getData();

        // 分页导航
        const handlePageChange = (val) => {
            query.pageIndex = val;
            getData();
        };

        // 表格编辑时弹窗和保存
        const editVisible = ref(false);
        let form = reactive({
            id:"",
            // name: "",
            plantNums: "",
            growPeriod:"",
            growStatus:"",
            envName:"",
            envTemperature:"",
            envHumidity:"",
            envLightLevel:"",
            envFertilize:""
        });

        let idx = -1;

            // 删除操作
        const handleDelete = (index,row) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    Object.keys(form).forEach((item) =>{
                        form[item] = row[item]
                    })
                    console.log(form)
                    axios.post("http://localhost:8080/personal/removePlant",
                    form).then(response => {
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

        const handleDeleteEnv = (index, row) => {
                        // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                    Object.keys(form).forEach((item) =>{
                        form[item] = row[item]
                    })
                    console.log(form)
                    axios.post("http://localhost:8080/personal/removeEnv",
                    form).then(response => {
                        if(response.data.success == true)
                        {
                            ElMessage.success("删除成功");
                            envData.value.splice(index, 1);
                        }else
                        {
                            ElMessage.error("删除失败");
                        }
                    })
                })
                .catch(() => {});
        }

        const AddEnvVisible = ref(false)
        const handleAddEnv = () => {
            AddEnvVisible.value = true
        }

        const handleEdit = (index, row) => {
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            form.plantNums = parseInt(form.plantNums)
            editVisible.value = true;
        };
        const editAddVisible = ref(false);

        var options_name=[]     
        const getPlantName = () =>
        {
            axios.get("http://localhost:8080/plant/allName")
            .then(response => {
                console.log(response.data.data)
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
        }
        var checkName = false;
        const handleAddEdit = () => {

            editAddVisible.value = true;
            if(checkName == false)
            {
                getPlantName()
                checkName = true
            }

        };

        const saveEdit = () => {
            editVisible.value = false;
            const editFormData =
            {
                id: form.id,
                plantNums: parseInt(form.editNums ? form.editNums : null),
                growPeriod: form.editPeriod ? form.editPeriod : null,
                growStatus: form.editStatus ? form.editStatus : null,
            }
            console.log(editFormData)
            axios.post("http://localhost:8080/personal/editInfo",
            editFormData).then(response => {
                if(response.data.success == true)
                {
                    ElMessage.success(`修改第 ${idx + 1} 行成功`);
                }else
                {
                    ElMessage.error(`修改第 ${idx + 1} 行失败`);
                }
            })            
        };

        const saveAdd = () => {
            editAddVisible.value = false;
            const addData = {
                userId:JSON.parse(localStorage.getItem("ms_userInfo"))["id"],
                plantId: form.name,
                growStatus: form.status,
                growPeriod: form.period,
                plantNums: form.nums,
            }
            axios.post("http://localhost:8080/personal/addPlant",
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


        const saveAddEnv = () => {
            AddEnvVisible.value = false
            const addData = {
                userId:JSON.parse(localStorage.getItem("ms_userInfo"))["id"],
                temperature: form.envTemperature,
                envName: form.envName,
                humidity: form.envHumidity,
                fertilizer: form.envFertilize,
                lightLevel: form.envLightLevel
            }

            axios.post("http://localhost:8080/personal/env",
            addData).then(response => {
                if(response.data.success == true)
                {

                }else
                {

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

        const options_light =[
            {
                value:0,
                label:"无"
            },
            {
                value:1,
                label:"很弱"                
            },
            {
                value:2,
                label:"弱"   
            },
            {
                value:3,
                label:"强"   
            },
            {
                value:4,
                label:"很强"   
            }
        ]   

        const options_fertilize =[
            {
                value:0,
                label:"无"
            },
            {
                value:1,
                label:"很弱"                
            },
            {
                value:2,
                label:"弱"   
            },
            {
                value:3,
                label:"强"   
            },
            {
                value:4,
                label:"肥沃"   
            }
        ]

        return {
            query,
            tableData,
            envData,
            pageTotal,
            editVisible,
            editAddVisible,
            AddEnvVisible,
            form,
            options_name,
            options_period,
            options_status,
            options_fertilize,
            options_light,
            handleAddEnv,
            handlePageChange,
            handleDelete,
            handleEdit,
            handleAddEdit,
            handleDeleteEnv,
            saveAdd,
            saveEdit,
            saveAddEnv,
            getPlantName,
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
