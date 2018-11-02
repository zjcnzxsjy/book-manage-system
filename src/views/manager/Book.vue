<template>
    <div>
        <div class='wrapper-top'>
            <el-row :gutter='10'>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Burnt-Sienna'>
                                    <i class='el-icon-third-yuedu'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.total}}</p>
                                <p class='card-title'>图书总量</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Cornflower-Blue'>
                                    <i class='el-icon-third-tubiaozhizuomoban'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.borrow}}</p>
                                <p class='card-title'>借阅数量</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class='card-wrapper'>
                            <div class='card-left'>
                                <div class='card-img-icon bg-Malachite'>
                                    <i class='el-icon-third-shujia'></i>
                                </div>
                            </div>
                            <div class='card-right'>
                                <p class='card-num'>{{card_num.statistic}}</p>
                                <p class='card-title'>图书统计</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class='wrapper-main'>
            <div class='main-title'>
                <i class='el-icon-menu menu-info'></i>
                <span>图书信息</span>
            </div>
            <div class='search-form'>
                <el-form :inline='true' :model='formValues'>
                    <el-form-item label="ISBN" prop='ISBN'>
                        <el-input v-model="formValues.ISBN" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="图书名称" prop='name'>
                        <el-input v-model="formValues.name" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="图书状态" prop='status'>
                        <el-select v-model="formValues.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="架上" value="1"></el-option>
                        <el-option label="借阅中" value="2"></el-option>
                        <el-option label="超时未还" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click='getBookByISBN'>查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class='list-wrapper'>
                <div class='list-title'>
                    <i class='el-icon-menu menu-info'></i>
                    <span>图书列表</span>
                    <el-button-group class='toolbar'>
                        <el-button type="primary" icon="el-icon-plus" @click="addBook">添加</el-button>
                        <!-- <el-button type="primary" icon="el-icon-edit" @click='modifyBook'>修改</el-button> -->
                        <el-button type="primary" icon="el-icon-delete" @click='deleteBook' :disabled='"" === book_id'>下架</el-button>
                    </el-button-group>
                </div>
                <div class='list-main'>
                    <div class='list-nav'>
                        <div class='menu-content'>
                            <el-menu
                            ref="menu"
                            class='siderbar'
                            background-color='#dcdfe6'
                            text-color='#333333'
                            active-text-color="#ffd04b"
                            @select='selectMenu'
                            @open='clickMenu'
                            @close='clickMenu'>
                                <template v-for="(item, key) in bookList">
                                    <el-submenu :index="item.ISBN" :key="key">
                                        <template slot="title">
                                            {{item.list[0].title}}
                                        </template>
                                        <el-menu-item v-for="(subItem,index) in item.list"
                                                        :key="index"
                                                        :index="subItem.bookId">
                                            <div class='borrow-status-info'>
                                                <span>编号：{{subItem.bookId}}</span>
                                                <el-tag type="info">{{subItem.timeout | f1}}</el-tag>
                                            </div>
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                            </el-menu>
                        </div>
                        <el-pagination
                        small
                        :current-page="currentPage"
                        :page-size="pageSize"
                        @current-change='handlePageChange'
                        layout="total, prev, pager, next, jumper"
                        :total="total">
                        </el-pagination>
                    </div>
                    <title-info 
                        v-if='showSummary' 
                        :bookInfo='bookInfo' 
                        class='list-content'
                        :commentData='commentData'
                        :commentTitle='commentTitle'
                        :likeData='likeData'
                        :likeTitle='likeTitle'
                        >
                    </title-info>
                    <borrow-info v-else class='list-content' ref='borrowInfo' :book_id='book_id'></borrow-info>
                </div>
            </div>
        </div>
        <book-dialog ref="dialog"
        :form="form"
        ></book-dialog>
        <el-dialog :visible.sync="dialogPullOfVisible" title='下架' width='400px'>
            <div class='pull-off-wrapper'>
                <i class='el-icon-info'></i>
                <p class='pull-off-info'>
                    <span>下架该图书</span>
                    <span>下架后，该图书处于“已下架”状态</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPullOfVisible = false">取消</el-button>
                <el-button type="primary" @click='confirmDelete'>确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import bookDialog from './Dialog';
import titleInfo from './TitleInfo';
import borrowInfo from './BorrowInfo';
export default {
    name: 'book', //图书管理
    components: {
        bookDialog,
        titleInfo,
        borrowInfo
    },
    data() {
        return {
            //图书信息表单查询数据
            formValues: {
                ISBN: '',
                name: '',
                status: ''
            },
            //添加图书的dialog标志位
            dialogFormVisible: false,
            //添加图书表单数据
            form: {
                ISBN: '',
                size: 1,
            },
            card_num: {
                total: 0, //图书总量
                borrow: 0, //借阅数量
                statistic: 0 //到期未还数量
            },
            bookList: [], //图书列表数据
            currentPage: 1,
            pageSize: 5,
            total: 0,
            showSummary: true, //是否显示图书介绍内容信息
            bookInfo: {},  //图书j简介信息
            commentData: [], //读者评论信息
            commentTitle: '评论（0）',
            likeData: [], //读者喜欢信息
            likeTitle: '喜欢（0）',
            book_id: '', //图书ID
            dialogPullOfVisible: false //图书下架dialog标志位
        }
    },
    filters: {
        f1(val) {
            let timeout = {
                "-100": "锁定",
                "-99": "未还",
                "-98": "架上"
            }
            return timeout[val]? timeout[val]: '延期'+ val +'天';
        }
    },
    created() {
        this.getTotal();
        this.getBorrow();
        this.getStatistic();
        this.getBookByISBN();
    },
    methods: {
        //添加图书
        addBook() {
            this.form = {
                ISBN: '',
                size: 1,
            };
            this.$refs.dialog.open("添加图书");
        },
        //图书信息修改
        modifyBook() {
            this.form = {
                ISBN: this.bookInfo.ISBN,
                size: this.bookList.length,
            };
            this.$refs.dialog.open("修改图书");
        },
        //打开图书下架dialog
        deleteBook() {
            this.dialogPullOfVisible = true;
        },
        //确认图书下架
        confirmDelete() {
            this.$axios.post('/api/admin/pullOffBook', {
                book_id: this.book_id
            })
            .then((res) => {
                if(0 === res.data.code) {
                    this.getBookByISBN();
                    this.dialogPullOfVisible = false;
                }
                this.$message({
                    message: res.data.message,
                    type: 0 === res.data.code? 'success' : 'error'
                });
            })
        },
        //获取图书总量
        getTotal() {
            this.$axios.get('/api/count/book')
            .then(res => {
                this.card_num.total = res.data;
            })
        },
        //获取借阅数量
        getBorrow() {
            this.$axios.get('/api/count/borrow')
            .then(res => {
                this.card_num.borrow = res.data;
            })
        },
        //获取到期未还书数量信息
        getStatistic() {
            this.$axios.get('/api/count/haveBook')
            .then(res => {
                this.card_num.statistic = res.data;
            })
        },
        //获取图书列表信息
        getBookByISBN() {
            this.$axios.get('/api/admin/getBooksByISBN', {
                params: {
                    ISBN: this.formValues.ISBN,
                    name: this.formValues.name,
                    status: this.formValues.status,
                    start: (this.currentPage - 1) * this.pageSize,
                    end: this.currentPage * this.pageSize
                }
            })
            .then(res => {
                this.bookList = res.data.data;
                this.total = res.data.all;
                this.$nextTick(() => {
                    this.showSummary = true;
                    this.bookInfo = res.data.data[0].list[0];
                    this.getComment(this.bookInfo.ISBN);
                    this.getUserLike(this.bookInfo.ISBN)
                })
                
            })
        },
        //获取读者评论信息
        getComment(ISBN) {
            this.$axios.get('/api/book/comment', {
                params: {
                    ISBN: ISBN,
                    start: 0,
                    limit: 5
                }
            })
            .then(res => {
                this.commentData = res.data.list;
                this.commentTitle = '评论（'+ res.data.total + '）';
            })
        },
        //获取读者喜欢信息
        getUserLike(ISBN) {
            this.$axios.get('/api/admin/userLike', {
                params: {
                    ISBN: ISBN
                }
            })
            .then(res => {
                if (1 !== res.data.code) {
                    this.likeData = res.data;
                    this.likeTitle = '喜欢（'+ res.data.length + '）';
                } else {
                    this.likeData = [];
                    this.likeTitle = '喜欢（0）';
                }
            })
        },
        //图书编号点击事件回调
        selectMenu(bookId) {
            this.book_id = bookId;
            this.showSummary = false;
            this.$nextTick(() => {
                this.$refs.borrowInfo.getHistory();
                this.$refs.borrowInfo.getUserDetail();
            })
            
        },
        //一级菜单点击事件回调
        clickMenu(ISBN) {
            this.showSummary = true;
            this.book_id = '';
            this.bookInfo = this.bookList.filter((item) => {
                return ISBN == item.ISBN
            })[0].list[0];
            this.getComment(ISBN);
            this.getUserLike(ISBN);
        },
        handlePageChange(val) {
            console.log(val);
            this.currentPage = val;
            this.getBookByISBN();
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
            height: 600px;
            .list-nav {
                width: 500px;
                height: 100%;
                display: flex;
                flex-direction: column;
                .menu-content {
                    width: 500px;
                    flex: 1;
                    overflow-y: auto;
                    .borrow-status-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                }
            }
            .list-content {
                flex: 1;
                width: calc(100% - 510px);
                height: 600px;
                padding: 15px 0 0 10px;
            }
        }
    }
}
.el-submenu {
    background-color:$White !important;
}
.menu-info {
    margin: 0 5px;
    color: $Dodger-Blue;
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

