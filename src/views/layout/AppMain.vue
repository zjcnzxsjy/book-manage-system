<template>
    <section class='app-main'>
        <transition name="move" mode="out-in">
            <router-view></router-view>
        </transition>
    </section>
</template>
<script>
export default {
    name: 'appMain'
}
</script>

<style lang="scss" scoped>
.app-main{
    
    overflow: auto;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>
