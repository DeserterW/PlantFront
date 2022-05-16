<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 检测图表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form>
                <el-form-item label="环境">
                    <el-select v-model="env">
                        <el-option
                            v-for="item in optionsEnv"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> 
                </el-form-item>
                <el-form-item label="指标">
                    <el-select v-model="coff">
                        <el-option
                            v-for="item in optionsCoff"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item 阈值>
                    <div class="block">
                        <el-slider
                        v-model="value" :min="min" :max="max"
                        show-input>
                        </el-slider>
                    </div>
                </el-form-item>
                <div>
                    <el-button @click="acquire">获取监控指标</el-button>
                    <el-button>添加监控指标</el-button>
                </div>
            </el-form>
            <!-- <div class="schart-box">
                <div class="content-title">柱状图</div>
                <schart class="schart" canvasId="bar" :options="options1"></schart>
            </div> -->
            <div class="schart-box">
                <div class="content-title">折线图</div>
                <schart class="schart" canvasId="line" :options="optionsHum"></schart>
            </div>
            <div class="schart-box">
                <div class="content-title">饼状图</div>
                <schart class="schart" canvasId="pie" :options="options3"></schart>
            </div>
            <!-- <div class="schart-box">
                <div class="content-title">环形图</div>
                <schart class="schart" canvasId="ring" :options="options4"></schart>
            </div> -->
        </div>


        <el-dialog>

        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import Schart from "vue-schart";
import { ElMessage } from 'element-plus';
export default {
    name: "alertmod",
    components: {
        Schart,
    },

    setup() {
        const info = localStorage.getItem("ms_userInfo")
        const json_info= JSON.parse(info)

    
        var options_env = new Map();
        var env_temp_monitor = new Map();
        var env_humidity_monitor = new Map();
        var optionsEnv = []
        const optionsCoff =[      
            {
                label:"温度",
                value:0
            },
            {
                label:"湿度",
                value:1
            }
        ]
        var optionsTemp = {
            type: "line",
            title: {
                text: "最近时间温度变化图",
            },
            bgColor: "#fbfbfb",
            labels: [],
            datasets: [

            ],
        };
        var optionsHum = {
            type: "line",
            title: {
                text: "最近时间湿度变化图",
            },
            bgColor: "#fbfbfb",
            labels: [],
            datasets: [

            ],
        };

        const getData = () => {

                axios.post("http://localhost:8080/env/all",
                {
                    userId:json_info["id"]
                })
                .then(response => {
                    if(response.data.success == true)
                    {

                        var temp = response.data.data
                        console.log(response.data.data)
                        for(var i = 0 ;i < temp.length; i++)
                        {
                            options_env.set(temp[i]["id"],temp[i]["envName"])
                            env_humidity_monitor.set(temp[i]["id"],temp[i]["humidityAlert"])
                            env_temp_monitor.set(temp[i]["id"],temp[i]["tempAlert"])
                        }
                        options_env.forEach((value,key) =>{
                            const item ={
                                value: value,
                                label:key
                            }
                            optionsEnv.push(item)
                        })    
                    }
                }).then(res =>{
                    env_humidity_monitor.forEach((value,key)=>
                    {
                        if(value != -1)
                        {
                            axios.post("http://localhost:8080/monitor/envMonitor",
                            {
                                id:key
                            }).then(response => {
                                if(response.data.success == true)
                                {
                                    var temp = response.data.data
                                    if(optionsHum["labels"].length< temp.length)
                                    {
                                        for(var i = 0; i< temp.length;i++)
                                        {
                                            
                                            optionsHum["labels"].push(dayjs(temp[i]["recordTime"]).format("HH:mm"))
                                        }
                                    }
                                    var pushValue = {
                                        label: options_env.get(key),
                                        data:[]
                                    }
                                    for(var i = 0; i< temp.length;i++)
                                    {
                                        pushValue["data"].push(temp[i]["humidity"]);
                                    }
                                    optionsHum["datasets"].push(pushValue)
                                    console.log(optionsHum)
                                }
                            })
                        }

                    })
                    for(var i = 0 ; i < env_humidity_monitor.length;i++)
                    {

                    }
                })
        }
        getData()

        const acquire = () =>{
            getData();
        }
        
        const options1 = {
            type: "bar",
            title: {
                text: "最近一周各品类销售图",
            },
            bgColor: "#fbfbfb",
            labels: ["周一", "周二", "周三", "周四", "周五"],
            datasets: [
                {
                    label: "家电",
                    fillColor: "rgba(241, 49, 74, 0.5)",
                    data: [234, 278, 270, 190, 230],
                },
                {
                    label: "百货",
                    data: [164, 178, 190, 135, 160],
                },
                {
                    label: "食品",
                    data: [144, 198, 150, 235, 120],
                },
            ],
        };
        const options2 = {
            type: "line",
            title: {
                text: "最近时间温度变化图",
            },
            bgColor: "#fbfbfb",
            labels: ["6月", "7月", "8月", "9月", "10月"],
            datasets: [
                {
                    label: "家电",
                    data: [234, 278, 270, 190, 230],
                },
                {
                    label: "百货",
                    data: [164, 178, 150, 135, 160],
                },
                {
                    label: "食品",
                    data: [114, 138, 200, 235, 190],
                },
            ],
        };
        const options3 = {
            type: "pie",
            title: {
                text: "服装品类销售饼状图",
            },
            legend: {
                position: "left",
            },
            bgColor: "#fbfbfb",
            labels: [
                "T恤",
                "牛仔裤",
                "连衣裙",
                "毛衣",
                "七分裤",
                "短裙",
                "羽绒服",
            ],
            datasets: [
                {
                    data: [334, 278, 190, 235, 260, 200, 141],
                },
            ],
        };
        const options4 = {
            type: "ring",
            title: {
                text: "环形三等分",
            },
            showValue: false,
            legend: {
                position: "bottom",
                bottom: 40,
            },
            bgColor: "#fbfbfb",
            labels: ["vue", "react", "angular"],
            datasets: [
                {
                    data: [500, 500, 500],
                },
            ],
        };


        return {
            options_env,
            optionsCoff,
            env_temp_monitor,
            env_humidity_monitor,
            optionsHum,
            optionsTemp,
            optionsEnv,
            acquire,
            getData,
            options1,
            options2,
            options3,
            options4,
        };
    },
};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 600px;
    height: 400px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>