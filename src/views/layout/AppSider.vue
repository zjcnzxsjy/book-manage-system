<template>
  <el-menu router
           class='sidebar'
           background-color='#242f42'
           text-color='#BFCBD9'
           active-text-color="#ffd04b"
           :default-active='menuActived'
           >
    <template v-for="item in items">
      <template v-if="!item.hidden&&!item.children">
        <el-menu-item :index="item.path"
                      :key="item.path">
          <i :class="item.icon"></i>{{item.name}}
        </el-menu-item>
      </template>
      <template v-if="!item.hidden&&item.children&&item.children.length<=1">
        <el-menu-item :index="item.path + item.children[0].path"
                      :key="item.children[0].path">
          <i :class="item.icon"></i>{{item.children[0].name}}
        </el-menu-item>
      </template>
      <template v-if="!item.hidden&&item.children&&item.children.length>1">
        <el-submenu :index="item.path"
                    :key="item.path">
          <template slot="title">
            <i :class="item.icon"></i>{{item.name}}
          </template>
          <el-menu-item v-for="(subItem,i) in item.children"
                        :key="i"
                        :index="item.path + subItem.path">
            {{subItem.name}}
          </el-menu-item>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>
<script>
import {menuRoutes} from "../../router.js";
export default {
  data() {
    return {
      items: [] //菜单信息
    };
  },
  computed: {
    //选中的菜单路由信息
    menuActived() {
      return this.$route.path;
    }
  },
  created() {
    this.items = menuRoutes;
  }
};
</script>
<style lang="scss" scoped>
.sidebar {
  overflow-y: auto;
  border-right: none;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
