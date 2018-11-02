<template>
    <div class='book-wrapper'>
        <el-row type="flex" :gutter='20'>
            <el-col :span='8'>
                <rank-list :type='1' title='最想看图书榜' @click='handleClick("wanna","最想看图书榜")'></rank-list>
            </el-col>
            <el-col :span='16'>
                <h3 class='wrapper-title'>
                    <span>用户活跃度</span>
                    <el-date-picker
                        v-model='value'
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        size="mini"
                        @change='pickDate'
                        value-format="yyyyMMdd"
                        
                        >
                    </el-date-picker>
                </h3>
                <div id='active-chart' class="active-chart"></div>
            </el-col>
        </el-row>
        <el-row type="flex" :gutter='20'>
            <el-col :span='8'>
                <rank-list :type="3" title='最喜爱图书榜' @click='handleClick("like", "最喜爱图书榜")'></rank-list>
            </el-col>
            <el-col :span='8'>
                <rank-list :type="4" title='高分图书榜' @click='handleClick("score", "高分图书榜")'></rank-list>
            </el-col>
            <el-col :span='8'>
                <rank-list :type="5" title='最多评论图书榜' @click='handleClick("comment", "最多评论图书榜")'></rank-list>
            </el-col>
        </el-row>
        <el-dialog :title='dialogTitle' :visible.sync="dialogFormVisible" width="640px" @open='handleOpen'>
            <el-tabs type="border-card" class='list-card' v-model='selected'>
                <el-tab-pane label="周榜" name='week'>
                    <rankview-list ref='week'></rankview-list>
                </el-tab-pane>
                <el-tab-pane label="月榜" name='month'>
                    <rankview-list ref='month'></rankview-list>
                </el-tab-pane>
                <el-tab-pane label="年榜" name='year'>
                    <rankview-list ref='year'></rankview-list>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import rankList from '@/components/RankList';
import rankviewList from '@/components/RankviewList';
import echarts from "echarts";
import moment from 'moment';

export default {
    name: "bookStatistics",
    components: {
        rankList,
        rankviewList
    },
    data() {
        return {
            //data: [],
            //时间组件初始值,本周时间
            value: [new Date(moment().isoWeekday(1)), new Date(moment().isoWeekday(7))],
            //时间组件快速选择时间选项
            pickerOptions: {
                shortcuts: [{
                    text: '本周',
                    onClick(picker) {
                        const start = new Date(moment().isoWeekday(1));
                        const end = new Date(moment().isoWeekday(7));
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本月',
                    onClick(picker) {
                        const start = new Date(moment().year(),moment().month(),1);
                        const end = new Date(moment().year(),moment().month(),moment().daysInMonth());
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '本年',
                    onClick(picker) {
                        const start = new Date(moment().year(), 0, 1);
                        const end = new Date(moment().year(), 11, 31);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            dialogFormVisible: false, ////打开dialog标志位
            selected: 'week', //选择图书榜单页签
            chartData: {},  //用户活跃度chart数据
            option: {}, //echarts option
            myChart: null, //存放echarts对象
            moreType: '', //榜单类型
            dialogTitle: '' //dialog title
        }
    },
    mounted() {
        this.$nextTick(() => {
            let time = [
                moment(this.value[0]).format('YYYYMMDD'),
                moment(this.value[1]).format('YYYYMMDD'),
            ]
            this.myChart = echarts.init(document.getElementById('active-chart'));
             this.getData(time)
            .then((res) => {
                this.chartData = res.data;
                this.setChartOption();
                this.myChart.setOption(this.option);
            })
        });
    },
    methods: {
        //获取用户活跃度数据
        getData(value) {
            return this.$axios.get('/api/count/login', {
                params: {
                    beginDate: value[0],
                    endDate: value[1]
                }
            })
        },
        //时间选择事件回调
        pickDate(val) {
            this.getData(val)
            .then((res) => {
                this.chartData = res.data;
                this.setChartOption();
                this.myChart.setOption(this.option);
            })
        },
        //查看全部事件回调
        handleClick(type, title) {
            this.dialogFormVisible = true;
            this.moreType = type;
            this.dialogTitle = title;
        },
        //dialog打开回调
        handleOpen() {
            this.selected = 'week';
            let options = {
                wanna: {
                    year: 1,
                    month: 6,
                    week: 11 
                },
                like: {
                    year: 3,
                    month: 8,
                    week: 13
                },
                score: {
                    year: 4,
                    month: 9,
                    week: 14
                },
                comment: {
                    year: 5,
                    month: 10,
                    week: 15
                }
            }
            this.$nextTick(() => {
                this.$refs['week'].initData(options[this.moreType].week);
                this.$refs['month'].initData(options[this.moreType].month);
                this.$refs['year'].initData(options[this.moreType].year);
            })
            
        },
        //设置echarts option
        setChartOption() {
            this.option = {
                tooltip : {
                    trigger: 'item'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.chartData.date
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.chartData.count,
                    type: 'line',
                    areaStyle: {}
                }]
            };
        }
    }
}
</script>
<style lang="scss" scoped>
.el-row + .el-row {
    margin-top: 20px;
}
.el-row {
    align-items: stretch;
}
.book-wrapper {
    padding: 0 10px;
    h3.wrapper-title {
        font-size: 18px;
        font-weight: 400;
        line-height: 40px;
        overflow: hidden;
        height: 40px;
        padding-bottom: 4px;
        color: #1a1a1a;
        border-bottom: 1px solid $Mercury;
        position: relative;
        background-color: $White;
        .el-date-editor {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY((-50%));
        }
    }
    .active-chart {
        width:100%;
        height: calc(100% - 50px);
        background-color: $White;
    }
}
</style>
