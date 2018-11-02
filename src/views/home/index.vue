<template>
    <div class='wrapper'>
        <h1>恒生图书借阅管理平台</h1>
        <img src='../../assets/home.gif' />
    </div>
</template>
<script>
export default {
    name: 'home' //首页
}
</script>
<style lang="scss" scoped>
.wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    h1 {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 110px;
        font-size: 32px;
        font-weight: 400;
    }
    img {
        width: 100%;
        height: 100%;
    }
}

</style>
