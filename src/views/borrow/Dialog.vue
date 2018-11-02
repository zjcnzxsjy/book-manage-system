<template>
    <div class='dialog-wrapper'>
        <el-dialog :visible.sync="dialogVisible" :title='title'>
            <el-row>
                <el-form :model="form" ref="editForm">
                    <el-col :span='12'>
                        <el-form-item label="图书编号" prop="ISBN" label-width='100px'>
                            <el-input v-model="form.ISBN" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="借阅人ID" prop="userid" label-width='100px'>
                            <el-input v-model="form.userid" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="图书名称" prop="title" label-width='100px'>
                            <el-input v-model="form.title" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="昵称" prop="name" label-width='100px'>
                            <el-input v-model="form.name" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="借阅时间" prop="borrowtime" label-width='100px'>
                            <el-input :value="form.borrowtime | f1" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if='1 !== form.borrowstatus'>
                        <el-form-item label="归还时间" prop="returtime" label-width='100px'>
                            <el-input :value="form.returntime | f1" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="手机号" prop="telephone" label-width='100px'>
                            <el-input v-model="form.telephone" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12'>
                        <el-form-item label="邮箱" prop="email" label-width='100px'>
                            <el-input v-model="form.email" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='12' v-if='2 === form.borrowstatus'>
                        <el-form-item label="过期情况" prop="borrowstatus" label-width='100px'>
                            <el-input :value="form | f2" readonly></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span='24' v-if='showReason'>
                        <el-form-item label="取消原因" label-width='100px'>
                            <el-input v-model="reason" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click='save' v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'borrowDialog',
    props: {
        form: {
            type: Object,
            default: []
        }
    },
    data() {
        return {
            dialogVisible: false,
            showReason: false,
            reason: '',
            title: '',
            fullscreenLoading: false
        }
    },
    filters: {
        f1(val) {
            if ('' === val) {
                return '';
            }
            return moment(+val).format('YYYY-MM-DD');
        },
        f2(form) {
            moment.locale('zh-CN');
            if (2 === form.borrowstatus) {
                let time = moment(+form.returntime).toNow(true);
                if (time.replace(/[\u4e00-\u9fa5]/, "") > 0) {
                    return '过期' + time;
                }
                return '未过期';
            }
        }
    },
    methods: {
        open(title, showReason) {
            this.dialogVisible = true;
            this.title = title;
            this.showReason = showReason;
        },
        save() {
            if("取消借阅" === this.title) {
                this.cancelBorrow();
            } else if("确认出库" === this.title) {
                this.confirmBorrow()
            } else if ("确认还书" === this.title) {
                this.confirmReturn();
            }
        },
        cancelBorrow() {
            this.fullscreenLoading = true;
            this.$axios.post('/api/user/cancelBorrow', {
                borrow_id: this.form.borrowid
            })
            .then((res) => {
                this.fullscreenLoading = false;
                this.dialogVisible = false;
                this.$parent.getTableData();
                this.$message({
                    message: res.data.message,
                    type: 0 === res.data.code? 'success' : 'error'
                });
            })
        },
        confirmBorrow() {
            this.fullscreenLoading = true;
            this.$axios.post('/api/admin/confirmBorrow', {
                borrow_id: this.form.borrowid,
                book_id: this.form.bookid
            })
            .then((res) => {
                this.fullscreenLoading = false;
                this.dialogVisible = false;
                this.$parent.getTableData();
                this.$message({
                    message: res.data.message,
                    type: 0 === res.data.code? 'success' : 'error'
                });
            })
        },
        confirmReturn() {
            this.fullscreenLoading = true;
            this.$axios.post('/api/admin/confirmReturn', {
                borrow_id: this.form.borrowid
            })
            .then((res) => {
                this.fullscreenLoading = false;
                this.dialogVisible = false;
                this.$parent.getTableData();
                this.$message({
                    message: res.data.message,
                    type: 0 === res.data.code? 'success' : 'error'
                });
            })
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
