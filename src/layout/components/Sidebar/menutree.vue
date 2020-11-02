<template>
  <div class="menutree">
    <label v-for="menu in data">
      <el-submenu v-if="menu.children" :index="'/' + menu.webName">
        <template slot="title">
          <i :class="'el-icon-'+menu.webIcon"/>
          <span>{{ menu.menuName }}</span>
        </template>
        <el-menu-item-group>
          <menutree :data="menu.children"/>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item v-else :index="'/'+menu.webName" @click="clickMenu(menu)">
        <i :class="'el-icon-'+menu.webIcon"/>
        <span slot="title">{{ menu.menuName }}</span>
      </el-menu-item>
    </label>
  </div>
</template>

<script>
import menutree from '@/layout/components/Sidebar/menutree'

export default {
  name: 'menutree',
  components: {
    menutree: menutree
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['data'],
  data() {
    return {
      menu_data: {}
    }
  },
  methods: {
    clickMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
}

.el-menu {
  border: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
}

.el-submenu .el-menu-item {
  min-width: auto;
}

</style>
