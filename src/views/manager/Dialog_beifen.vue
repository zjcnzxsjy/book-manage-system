<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="680px">
        <el-row>
            <el-form :model="form" ref="editForm" :rules='rules'>
                <div class='basic-title'>基础信息</div>
                <el-col :span='12'>
                    <el-form-item label="书名" prop="title" label-width='100px'>
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="封面图片" prop="image" label-width='100px'>
                        <el-input v-model="form.image"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="作者" prop="author" label-width='100px'>
                        <el-input v-model="form.author"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上架时间" prop="addtime" label-width='100px'>
                        <el-date-picker
                        v-model="form.addtime"
                        type="datetime"
                        placeholder="选择日期时间"
                        align="right"
                        :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span='24'>
                    <el-form-item label="推荐" label-width='80px'>
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox :label="0">首页</el-checkbox>
                            <el-checkbox :label="1">图书借阅</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col> -->
                <el-col :span='24'>
                    <el-form-item
                    v-for='(item, index) in form.bookids'
                    :key='index'
                    label="图书编码" 
                    :prop="'bookids.' + index + '.bookid'" 
                    :rules="{
                        required: true, message: '请输入图书编号', trigger: 'blur'
                    }"
                    label-width='100px'>
                        <el-input 
                        v-model="item.bookid" 
                        class='id-input'>
                        <el-button 
                        slot="append" 
                        icon="el-icon-circle-close" 
                        v-if='0 !== index'
                        @click='deleteId(index)'>
                        </el-button>
                        </el-input>   
                    </el-form-item>
                    <el-form-item label='' label-width='100px'>
                        <el-button type='primary' @click='add' class='continue-add'>继续添加</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-row>
            <div class='introduction-title'>图书简介</div>
            <quill-editor 
            v-model="content"  
            ref="quillEditor">
            </quill-editor>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click='save'>确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'

export default {
    name:"bookDialog",
    props: {
        title: String,
        form: Object,
        content: {
            type: String,
            default: ''
        }
    },
    components: {
        quillEditor
    },
    data() {
        return {
            dialogFormVisible: false,
            pickerOptions: {
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                    picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                    }
                }]
            },
            other_options: {
                height: 360
            },
            rules: {
                title: {
                    required: true,
                    message: "请输入书名",
                    trigger: "blur"
                },
                image: {
                    required: true,
                    message: "请输入封面url",
                    trigger: "blur"
                },
                author: {
                    required: true,
                    message: "请输入作者名字",
                    trigger: "blur"
                },
                addtime: {
                    required: true,
                    message: "请输入上架时间",
                    trigger: "blur"
                }
                
            },
        }
    },
    methods: {
        open() {
            this.dialogFormVisible = true;            
        },
        save() {
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    let params = Object.assign(this.form, {
                        content: this.content ? this.content : ''
                    });
                    this.$axios.post('/api/admin/saveBook', params)
                    .then((res) => {
                        console.log(res)
                    })
                }
            })
        },
        add() {
            let obj = {
                bookid: ''
            };
            this.form.bookids.push(obj);
        },
        deleteId(index) {
            this.form.bookids.splice(index, 1);
        }
    }
}
</script>
<style lang="scss">
@import '../../../node_modules/quill/dist/quill.core.css';
@import '../../../node_modules/quill/dist/quill.snow.css';
@import '../../../node_modules/quill/dist/quill.bubble.css';
.basic-title {
    padding: 5px 0 5px 15px;
    border-left: 4px solid $Dodger-Blue;
}
.introduction-title {
    padding: 5px 0 5px 15px;
    border-left: 4px solid $Dodger-Blue;
    margin-bottom: 10px;
}
.quill-editor {
    height: 200px;
    .ql-container {
        height: 134px;
    }
}
.id-input + .id-input, .id-input + button {
    margin-top: 10px;
}
</style>

