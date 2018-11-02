<template>
    <div class='wrapper'>
        <div class='user-info' v-if="1 !== borrowUser.borrowstatus">
            <div class='user-image'>
                <img :src='borrowUser.userhead' />
            </div>
            <div class='borrow-info'>
                <div class='user-author'>{{borrowUser.username}}</div>
                <div class='time-info'>
                    <span>开始借阅时间:{{borrowUser.borrowtime | f1}}</span>
                    <span>结束借阅时间:{{borrowUser.returntime | f1}}</span>
                </div>
            </div>
            <!-- <div class='tips'>提示</div> -->
        </div>
        <div class='form-wrapper'>
            <span>历史借阅</span>
            <el-form :inline='true'>
                <el-form-item label="借阅日期">
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
                        value-format="yyyyMMdd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click='getHistory'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='list-main'>
            <div class='table-wrapper'>
                <el-table border :data="tableData" height="100%">
                    <el-table-column prop="userid" label="借阅人ID" align="left" width="120"></el-table-column>
                    <el-table-column prop="title" label="昵称" align="left" width="120"></el-table-column>
                    <el-table-column label="借阅日期" align="left" width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.borrowtime | f1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="returntime" label="还书日期" align="left" width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.returntime | f1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="borrowstatus" label="状态" align="left" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.borrowstatus | f2}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="延期扣费" align="left" width="100">
                        <!-- <template slot-scope="scope">
                            <span>{{scope.row | f3}}</span>
                        </template> -->
                    </el-table-column>
                    <!-- <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button size="small" class='el-icon-delete' @click='deleteRecord(scope.row)'></el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
            </div>
            <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change='handlePageChange'
            layout="total, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'borrowInfo',
    props: {
        book_id: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
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
            value: '', //绑定的时间值
            currentPage: 1,
            pageSize: 10,
            tableData: [], //历史借阅数据
            total: 0,
            borrowUser: {
                userhead: '',
                username: '',
                borrowtime: '',
                returntime: '',
                borrowstatus: ''
            } //借阅人借阅信息
        }
    },
    filters: {
        //时间格式化
        f1(val) {
            if ('' === val) {
                return '';
            }
            return moment(val).format('YYYY-MM-DD');
        },
        //状态值格式化
        f2(val) {
            let status = {
                0: "已过期",
                1: "待取书",
                2: "未还书",
                3: "待评价",
                4: "已还书",
                8: "已取消" /*被动取消*/,
                9: "已取消" /*主动取消*/
            };
            return status[val];
        }
    },
    methods: {
        //获取历史借阅信息
        getHistory() {
            this.$axios.get('/api/admin/history', {
                params: {
                    book_id: this.book_id,
                    begin_date: this.value[0]? this.value[0] : '',
                    end_date: this.value[1]? this.value[1] : '',
                    start: this.currentPage - 1,
                    limit: this.pageSize
                }
            })
            .then((res) => {
                this.tableData = res.data.list;
                this.total = res.data.total;
            })
        },
        //获取借阅人借阅信息
        getUserDetail() {
            this.$axios.get('/api/admin/borrowUserDetails', {
                params: {
                    book_id: this.book_id,
                }
            })
            .then((res) => {
                if (1 === res.data.code) {
                    this.borrowUser.borrowstatus = 1;
                } else {
                    this.borrowUser = res.data;
                }
            })
        },
        handlePageChange(val) {
            this.currentPage = val;
            this.getHistory();
        }
        // deleteRecord(row) {
        //     this.dialogVisible = true;
        // },
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    .user-info{
        display: flex;
        background-color: $Hawkes-Blue;
        height: 60px;
        .user-image {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            width: 60px;
            img{ 
                width: 50px;
                height: 50px;
            }
        }
        .borrow-info {
            flex: 1;
            height: 60px;
            display: flex;
            flex-direction: column;
            .user-author {
                flex: 1;
            }
            .time-info {
                flex: 1;
                span + span {
                    margin-left: 15px;
                }
            }
        }
        .tips {
            width: 60px;
            height: 60px;
        }
    }
    .form-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        border: 1px solid $Catskill-White;
        border-bottom: none;
        span {
            padding-top: 10px;
        }
    }
    .list-main {
        flex: 1;
        .table-wrapper {
            height: calc(100% - 47px);
        }
    }
}
.pull-off-wrapper {
    display: flex;
    i {
        font-size: 40px;
        color: $Dodger-Blue;
    }
    .pull-off-info {
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>
