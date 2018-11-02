<template>
    <div class='rank-list'>
        <h3 class='wrapper-title'>
            <span>{{title}}</span>
            <el-button type="text" @click='handleClick'>查看全部</el-button>
        </h3>
        <div class='book-list'>
            <ul>
                <li v-for='(item, index) in data' :key='index'>
                    <div class='num-box'>
                        <span :class="'num' + (index + 1)">{{index + 1}}</span>
                    </div>
                    <div class='name-box'>
                        <span class='name'>{{item.title}}</span>
                    </div>
                    <div class='like-button'>
                        <el-button v-if='1 === type' type='text'>{{item.wannaall}}</el-button>
                        <el-button v-else-if='3 === type' type='text'>{{item.likeAll}}</el-button>
                        <el-button v-else-if='4 === type' type='text'>{{item.scoreall}}</el-button>
                        <el-button v-else-if='5 === type' type='text'>{{item.commentall}}</el-button>
                    </div>
                    
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

export default {
    name: 'rankList',  //图书榜单
    props: {
        //榜单类型
        type: {
            type: Number,
            default: 0
        },
        title: String
    },
    data() {
        return {
            data: []
        }
    },
    created() {
        this.init();
    },
    methods: {
        //提供外部调用的点击事件
        handleClick() {
            this.$emit('click');
        },
        //获取数据
        getData() {
            return this.$axios.get('/api/user/getList', {
                params: {
                    type: this.type,
                    start: 0,
                    limit: 10
                }
            })
        },
        //初始化
        init() {
            this.getData()
            .then((res) => {
                this.data = res.data;
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.rank-list {
    position: relative;
    z-index: 1;
    width: 100%;
    background-color: $White;
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
        button {
            position: absolute;
            right: 10px;
        }
    }
    .book-list {
        height: 410px;
        ul {
            -webkit-padding-start: 0;
        }
        li {
            display: flex;
            list-style: none outside none;
            height: 40px;
            border-bottom: 1px solid $Mercury;
        }
        .num-box {
            width: 28px;
            height: 40px;
            span {
                font: 700 14px/16px Arial;
                display: block;
                overflow: hidden;
                width: 19px;
                height: 19px;
                margin-top: 10px;
                text-align: center;
                letter-spacing: -1px;
                color: #666;
                background: #ededed;
            }
            .num1, .num2, .num3 {
                color: #fff;
                background: #bf2c24;
            }
        }
        .name-box {
            flex: 1;
            height: 40px;
            line-height: 40px;
            .name {
                overflow: hidden;
                width: 178px;
                padding-right: 10px;
                white-space: normal;
                text-overflow: ellipsis;
            }
        }
        .like-button {
            width: 60px;
        }
    }
}
</style>
