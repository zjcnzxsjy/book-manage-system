<template>
    <div>
        <div class='wrapper-top'>
            <el-row :gutter='10'>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Burnt-Sienna'>
                                    <i class='el-icon-third-danganjieyue'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.haveBorrow}}</p>
                                <p class='card-title'>已借阅</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Cornflower-Blue'>
                                    <i class='el-icon-third-daiqujian'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.waitBorrow}}</p>
                                <p class='card-title'>待取书</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Malachite'>
                                    <i class='el-icon-third-huanshu'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.hadBorrow}}</p>
                                <p class='card-title'>已还书</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class='wrapper-main'>
            
            <div class='main-title'>
                <i class='el-icon-menu menu-info'></i>
                <span>订单信息</span>
            </div>
            <div class='search-form'>
                <el-form :inline='true' :model='formValues'>
                    <el-form-item label="ISBN" prop='ISBN'>
                        <el-input v-model="formValues.ISBN" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="图书名称" prop='name'>
                        <el-input v-model="formValues.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="借阅状态" prop='status'>
                        <el-select v-model="formValues.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待取书" value="1"></el-option>
                        <el-option label="已取消" value="7"></el-option>
                        <el-option label="未还书" value="2"></el-option>
                        <el-option label="已过期" value="0"></el-option>
                        <el-option label="已还书" value="4"></el-option>
                        <el-option label="待评价" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click='getTableData'>查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class='list-wrapper'>
                <div class='list-title'>
                    <i class='el-icon-menu menu-info'></i>
                    <span>订单列表</span>
                    <!-- <el-button-group class='toolbar'>
                        <el-button type="primary" icon="el-icon-plus">导出Excel</el-button>
                    </el-button-group> -->
                </div>
                <div class='list-main'>
                    <el-table :data="tableData" height="350" :fit='false'>
                        <el-table-column prop="ISBN" label="ISBN" align="left" width='150'></el-table-column>
                        <el-table-column prop="bookid" label="图书编号" align="left" width='200'></el-table-column>
                        <el-table-column prop="title" label="图书名称" align="left" width='200'></el-table-column>
                        <el-table-column prop="userid" label="借阅人" align="left"></el-table-column>
                        <el-table-column prop="telephone" label="手机号" align="left" width='150'></el-table-column>
                        <el-table-column prop="email" label="邮箱地址" align="left" width='200'></el-table-column>
                        <el-table-column label="借阅日期" align="left" width='120'>
                            <template slot-scope="scope">
                                <span>{{scope.row.borrowtime | f1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="returntime" label="还书日期" align="left" width='120'>
                            <template slot-scope="scope" v-if='4 === scope.row.borrowstatus'>
                                <span>{{scope.row.returntime | f1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="renew" label="续借" align="left"></el-table-column>
                        <el-table-column label="状态" align="left" width='100'>
                            <template slot-scope="scope">
                                <span>{{scope.row.borrowstatus | f2}}</span>
                                <br/>
                                <span v-if='0 === scope.row.borrowstatus' style='color: red;'>
                                    {{scope.row.returntime | f3}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width='150'>
                            <template slot-scope="scope">
                                <el-button size='small' 
                                class='el-icon-circle-close'
                                style='font-size: 16px;' 
                                v-if='1 === scope.row.borrowstatus'
                                @click='openDialog(scope.row, "取消借阅", true)'>
                                </el-button>
                                <el-button size="small"
                                 class='el-icon-third-jiebei' 
                                 v-if='1 === scope.row.borrowstatus'
                                 @click='openDialog(scope.row, "确认出库", false)'>
                                 </el-button>
                                <el-button size="small" 
                                class='el-icon-third-huanshu' 
                                v-if='2 === scope.row.borrowstatus'
                                @click='openDialog(scope.row, "确认还书")'>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>  
        <borrow-dialog ref='dialog' :form='dialogForm'></borrow-dialog>    
    </div>
</template>
<script>
import moment from 'moment';
import borrowDialog from './Dialog';
export default {
    name: 'borrow',
    components: {
        borrowDialog
    },
    data() {
        return {
            formValues: {
                ISBN: '',
                name: '',
                status: ''
            },
            data: [],
            currentPage: 1,
            total: 0,
            card_num: {
                haveBorrow: 0, //已借阅
                waitBorrow: 0, //待取书
                hadBorrow: 0  //已还书
            },
            tableData: [],
            dialogForm: {}
        }
    },
    filters: {
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
        },
        f3(val) {
            moment.locale('zh-CN');
            return '过期' + moment(+val).toNow(true);
        }
    },
    created() {
        this.getHaveBorrow();
        this.getWaitBorrow();
        this.getHadBorrow();
        this.getTableData();
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
            this.getDatas().then(res => {
                this.tableData = res.data;
            });
        },
        //分页页数跳转事件
        handlePageChange(val) {
            this.currentPage = val;
            this.getDatas().then(res => {
                this.tableData = res.data;
            });
        },
        //获取已借阅图书数量
        getHaveBorrow() {
            this.$axios.get('/api/count/haveBorrow')
            .then(res => {
                this.card_num.haveBorrow = res.data;
            })
        },
        //获取待取书图书数量
        getWaitBorrow() {
            this.$axios.get('/api/count/waitBorrow')
            .then(res => {
                this.card_num.waitBorrow = res.data;
            })
        },
        //获取已还书图书数量
        getHadBorrow() {
            this.$axios.get('/api/count/hadBorrow')
            .then(res => {
                this.card_num.hadBorrow = res.data;
            })
        },
        //获取订单列表数据
        getTableData() {
            let params = Object.assign(this.formValues, {
                start: 0,
                end: 10
            });
            this.$axios.get('/api/admin/searchBorrow', {
                params: params
            })
            .then((res) => {
                this.tableData = res.data;
                this.total = res.data.length;
            })
        },
        openDialog(row, title, showReason) {
            this.dialogForm = row;
            this.$refs.dialog.open(title, showReason);
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper-top {
    padding: 0 5px;
    .card-wrapper {
        display: flex;
        align-items: stretch;
        .card-left {
            padding: 10px 30px;
            .card-img-icon {
                width: 90px;
                height: 90px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                    font-size: 60px;
                    color: $White;
                }
            }
        }
        .card-right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            .card-num {
                font-size: 20px;
                font-weight: 600;
            }
        }
    }
}

.bg-Burnt-Sienna {
    background-color: $Burnt-Sienna;
}
.bg-Cornflower-Blue {
    background-color: $Cornflower-Blue;
}
.bg-Malachite {
    background-color: $Malachite;
}
.wrapper-main {
    margin: 10px 5px 0;
    background-color: $White;
    border: 1px solid $Mischka;
    .main-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid $Mischka;
    }
    .search-form {
        margin: 10px 10px;
    }
    .list-wrapper {
        border-top: 1px solid $Mischka;
        .list-title {
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid $Mischka;
            position: relative;
            .toolbar {
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        .list-main {
            display: flex;
            flex-direction: column;
            height: 600px;
        }
    }
}
.el-submenu {
    background-color: $White !important;
}
.menu-info {
    margin: 0 5px;
    color: $Dodger-Blue;
}
</style>

