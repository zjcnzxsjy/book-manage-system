<template>
    <div class='rank-view-list'>
        <div class='book-list'>
            <ul>
                <li v-for='(item, index) in data' :key='index'>
                    <div class='num-box'>
                        <span :class="'num' + (index + 1)">{{index + 1}}</span>
                    </div>
                    <div class='name-box'>
                        <span class='name' :title='item.title'>{{item.title}}</span>
                    </div>
                    <div class='author-box'>
                        <span class='author' :title='item.author'>{{item.author}}</span>
                    </div>
                    <div class='like-button'>
                        <el-button type='text'>{{item.like}}</el-button>
                    </div>
                </li>
            </ul>
            <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: 'rankviewList',  //详细图书榜单
    data() {
        return {
            data: [],
            currentPage: 1,
            pageSize: 15,
            /*榜单类型：1-想看年榜单 3-喜欢年榜单 4-高分年榜单 5-评论年榜单 6-想看月榜单 8-喜欢月榜单
                       9-高分月榜单 10-评论月榜单 11-想看周榜单 13-喜欢周榜单 14-高分周榜单 15-评论周榜单
            */
            type: 0, 
            total: 0
        }
    },
    methods: {
        //获取数据
        getData(start) {
            return this.$axios.get('/api/user/getList', {
                params: {
                    type: this.type,
                    start: start,
                    limit: this.pageSize
                }
            })
        },
        //初始化操作
        initData(type) {
            this.type = type;
            this.currentPage = 1;
            this.data = [];
            this.getData(0)
            .then((res) => {
                this.data = res.data;
                this.total = res.data.length;
            })
        },
        //分页组件处理页数跳转事件
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData(this.currentPage)
            .then((res) => {
                console.log(res)
                this.data = res.data;
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.rank-view-list {
    position: relative;
    z-index: 1;
    width: 100%;
    background-color: $White;
    .book-list {
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
                color: $Shuttle-Gray;
                background: $Gallery;
            }
            .num1, .num2, .num3 {
                color: $White;;
                background: $Tall-Poppy;
            }
        }
        .name-box {
            flex: 1;
            height: 40px;
            line-height: 40px;
            .name {
                display: inline-block;
                overflow: hidden;
                width: 100%;
                height: 100%;
                padding-right: 10px;
                white-space: normal;
                text-overflow: ellipsis;
            }
        }
        .author-box {
            flex: 1;
            height: 40px;
            line-height: 40px;
            .author {
                display: inline-block;
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin-right: 10px;
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
