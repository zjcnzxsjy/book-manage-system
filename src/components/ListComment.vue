<template>
    <div>
        <div class='comment-left'>
            <div class='img-wrapper'>
                <img :src='data.userhead' />
            </div>
        </div>
        <div class='comment-right'>
            <h4>{{data.username}}</h4>
            <span>{{data.date | f1}}</span>
        </div>
        <div class='comment-content'>
            <span class='rating'>9.4分</span>
            <span>这本书太赞了，值得看一看!</span>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    name: 'listComment',  //评论列表
    props: {
        data: Object
    },
    filters: {
        f1(val) {
            return moment(val).format('YYYYMMDD hh:mm:ss');
        }
    }
}
</script>

<style lang="scss" scoped>
.comment-left {
    float: left;
    margin-right: 15px;
    .img-wrapper {
        img{
            height: 80px;
            width: 70px;
        }
    }
}
.comment-right {
    overflow:hidden;
    height: 84px;
    h4 {
        font-size: 20px;
        margin-bottom: 10px;
    }
}
.comment-content {
    margin-top: 10px;
    .rating {
        display: inline-block;
        width: 70px;
        text-align: center;
        margin-right: 15px;
    }
}
</style>

