<template>
    <el-row type='flex' align='middle' class='nav-bar'>
        <el-col :span='1' style='min-width:40px;'>
            <i class='el-icon-third-arrowleft' v-show='isShowArrow' @click='handleScroll(80, $event)'></i>
        </el-col>
        <el-col :span='22'>
            <div ref='navContainer' class='nav-container' @wheel.prevent='onMouseWheel'>
                <div ref='scrollWrapper' class='tags-view-wrapper' :style='{left: left + "px"}'>
                    <div
                        class="nav-view"
                        :class="isActive('/home')?'active':''"
                        @click='changeTab("/home")'>
                        <i class='el-icon-third-dashboard' style='font-size:14px;'></i>
                        首页
                    </div><div
                        v-for="tag in visitedViews"
                        :key="tag.path"
                        class="nav-view"
                        :class="isActive(tag.path)?'active':''"
                        @click.self='changeTab(tag.path)'>
                        {{tag.name}}
                        <i class='el-icon-close tab-close' @click='removeTab(tag, $event)'></i>
                    </div>                    
                </div>
            </div>
        </el-col>
        <el-col :span='1' style='min-width:40px;'>
            <i class='el-icon-third-arrowright' v-show='isShowArrow' @click='handleScroll(-80, $event)'
            ></i><el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <i class='el-icon-third-arrowdown'></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='closeOthersTags'>关闭其他</el-dropdown-item>
                    <el-dropdown-item command='closeAllTags'>关闭所有</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
        </el-col>
    </el-row>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: "appNav", //导航栏
    data() {
        return {
            isShowArrow: false, //页签数量多时出现左右滚动的图标
            left: 0 //页签向右滚动的距离
        }
    },
    computed: {
        ...mapGetters(['visitedViews']) //也打开的页签
        
    },
    methods:{
        //新开页签的信息
        generateRoute() {
            if (this.$route.path && this.$route.path !== '/home') {
                return this.$route
            }
            return false;
        },
        //添加打开页签的信息
        addViewTabs() {
            this.watchScroll();
            this.$store.dispatch('addVisitedViews', this.generateRoute());
        },
        //页签点击事件
        onTabClick(thisTab, eve) {
            this.$router.push(thisTab.$attrs.path);
        },
        //页签切换事件
        changeTab(path) {
            this.$router.replace(path);
        },
        //删除页签
        removeTab(tag, $event) {
            this.$store.dispatch('delVisitedViews', tag).then(views => {
                if (this.isActive(tag.path)) {
                    let latestView = views.slice(-1)[0];
                    if (latestView) {
                        this.$router.push(latestView);
                    } else {
                        this.$router.push('/home');
                    }
                }
            });
            this.watchScroll();
            $event.preventDefault();           
        },
        //所有页签宽度大于导航栏宽度是出现滚动图标
        watchScroll() {
            let navWidth = this.$refs.navContainer.offsetWidth;
            let scrollWidth = this.$refs.scrollWrapper.offsetWidth; 
            this.isShowArrow = (navWidth - scrollWidth) >= 0 ? false : true;
        },
        //选中页签
        isActive(path) {
            return path === this.$route.path;
        },
        //鼠标滚轮事件
        onMouseWheel($event) {
            let delta = 
            // chrome & ie
            ($event.wheelDelta &&
            ($event.wheelDelta > 0 ? 120 : -120)) ||
            // firefox
            ($event.detail && ($event.detail > 0 ? -120 : 120));
            this.handleScroll(delta, $event);
            
        },
        //点击滚动图标事件
        handleScroll(delta, $event) {
            let navWidth = this.$refs.navContainer.offsetWidth;
            let scrollWidth = this.$refs.scrollWrapper.offsetWidth; 
            if (delta > 0) {
                this.left = Math.min(0, this.left + delta);
            } else {
                if (navWidth < scrollWidth) {
                    if (this.left < -(scrollWidth - navWidth)) {
                        this.left = this.left;
                    } else {
                        this.left = Math.max(this.left + delta, navWidth - scrollWidth)
                    }
                } else {
                    this.left = 0;
                }
            }
            $event.preventDefault();
        },
        //dropdown下拉事件
        handleCommand(command) {
            this[command]();
        },
        //关闭其他页签事件回调
        closeOthersTags() {
            this.$route.path !== '/home'? this.$store.dispatch('delOthersViews', this.$route) : this.$store.dispatch('delAllViews');
        },
        //关闭所有页签事件回调
        closeAllTags() {
            this.$store.dispatch('delAllViews');
            this.$router.push('/home');
        }
    },
    watch: {
        $route() {
            this.addViewTabs();
        }
    },
    mounted() {
        this.addViewTabs();        
    }
}
</script>
<style lang='scss' scoped>
    .nav-bar{
        //border: 1px solid #d8dce5;
        .el-col{
            &:first-child{
                text-align: center;
            }
            &:last-child{
                text-align: center;
            }
            i{
                cursor: pointer;
                font-size: 20px;
            }
        }
        .nav-container{
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            height: 40px;
            .tags-view-wrapper{
                overflow: hidden;
                transition: left .3s ease;
                height: 40px;
                line-height: 40px;
                position: absolute;
            }
            .nav-view{
                text-decoration: none;
                position: relative;
                display: inline-block;
                padding-left: 12px;
                height: 40px;
                cursor: pointer;
                box-sizing: border-box;
                .tab-close {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                    opacity: 0;
                    &:hover {
                        color: red;
                    }
                }
                &:hover {
                    .tab-close {
                        opacity: 1;
                    }
                }
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 0;
                    height: 100%;
                    border-bottom: 3px solid #4a94fa;
                    transition: all .2s linear;
                    box-sizing: border-box;
                    z-index: -1;
                }
                &:hover::before {
                    width: 100%;
                    left: 0;
                    
                }
                &:first-child {
                    padding-right: 12px;
                    &:before {
                        left: 0;
                    }
                }
                &:last-child {
                    &:before{
                        left: 100%;
                    }
                    &:hover:before {
                        left: 0;
                    }
                }
            }
            // 往前一个li移动的动画 
            &:hover {
                .nav-view:before {
                    left: 100%;
                }
                .nav-view:hover:before {
                    left: 0;
                }
            }
            .nav-view:hover + .nav-view::before {
                left: 0;
            }
            .active{
                border-bottom: 3px solid #4a94fa;
                color: #4a94fa;
                &:hover:before {
                    box-sizing: content-box;
                    width: 0;
                }
            }
        }
    }    
</style>