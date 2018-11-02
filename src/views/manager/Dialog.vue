<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="680px">
        <el-form :model="form" ref="editForm" :rules='rules'>
            <div class='basic-title'>基础信息</div>
            <el-col :span='12'>
                <el-form-item label="图书编号" prop="ISBN" label-width='100px'>
                    <el-input v-model="form.ISBN"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="库存数量" prop="size" label-width='100px'>
                    <el-input-number v-model="form.size" controls-position="right" :min="1"></el-input-number>
                </el-form-item>
            </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click='save' v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>

export default {
    name:"bookDialog", //添加图书dialog
    props: {
        form: Object
    },
    data() {
        return {
            //添加dialog标志位
            dialogFormVisible: false,
            rules: {
                ISBN: {
                    required: true,
                    message: "请输入图书编号",
                    trigger: "blur"
                }
            },
            title: '',
            fullscreenLoading: false
        }
    },
    methods: {
        //打开dialog
        open(title) {
            this.dialogFormVisible = true;
            this.title = title;            
        },
        //保存添加图书
        save() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.fullscreenLoading = true;
                    this.$axios.post('/api/admin/saveBook', this.form)
                    .then((res) => {
                        this.fullscreenLoading = false;
                        if (0 === res.data.code) {
                            this.$parent.getBookByISBN();
                            this.dialogFormVisible = false;
                        }
                        this.$message({
                            message: res.data.message,
                            type: 0 === res.data.code? 'success' : 'error'
                        });
                    })
                    .catch((res) => {
                        this.$message({
                            message: '请求失败',
                            type: 'error'
                        });
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss">
.basic-title {
    padding: 5px 0 5px 15px;
    border-left: 4px solid $Dodger-Blue;
}
</style>

