<template>
    <div class='wrapper'>
        <div class='list-info'>
            <div class='list-image'>
                <img :src='bookInfo.image' />
            </div>
            <div class='list-info-content'>
                <h1>{{bookInfo.title}}</h1>
                <div class='list-author'>作者: {{bookInfo.author}}</div>
                <div class='list-introduction'>{{bookInfo.summary}}</div>
            </div>
        </div>
        <el-tabs type="border-card" class='list-card'>
            <el-tab-pane :label="commentTitle">
                <list-comment :data='list' v-for='(list, index) in commentData' :key='index'></list-comment>
            </el-tab-pane>
            <el-tab-pane :label="likeTitle">
                <div class='user-wrapper'>
                    <div class='user-info' v-for='(item, index) in likeData' :key='index'>
                        <img :src='item.userhead' />
                        <div class='user-name'>{{item.username}}</div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import listComment from '@/components/ListComment';
export default {
    name: 'titleInfo', //图书介绍
    components: {
        listComment
    },
    props: {
        bookInfo: Object,
        commentData: Array,
        commentTitle: {
            type: String,
            default: '评论（0）'
        },
        likeData: Array,
        likeTitle: {
            type: String,
            default: '喜欢（0）'
        }
    }
}
</script>
<style lang="scss" scoped>
.wrapper {
    .list-info {
        margin-bottom: 20px;
        .list-image {
            float: left;
            width: 170px;
            height: 180px;
            margin-right: 10px;
            img {
                height: 100%;
                width: 100%;
            }
        }
        .list-info-content {
            overflow: hidden;
            height: 180px;
            display: flex;
            flex-direction: column;
            h1 {
                font-size: 20px;
                font-weight: 400;
            }
            .list-author {
                height: 40px;
                line-height: 40px;
            }
            .list-introduction {
                flex: 1;
                overflow-y: auto;
            }
        }
    }
    .list-card {
        height: 384px;
        .user-wrapper {
            display: flex;
            flex-wrap: wrap;
            .user-info {
                margin-right: 10px;
                img {
                    width: 60px;
                    height: 60px;
                }
                .user-name {
                    text-align: center;
                }
            }
            // .user-info + .user-info {
            //     margin-left: 10px;
            // }
        }
    }
}
</style>
