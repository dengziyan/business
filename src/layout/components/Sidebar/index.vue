<template>
  <div>
    <el-menu
      :collapse="isCollapse"
      :default-active="$route.path"
      router
      :unique-opened="true"
      class="el-menu-vertical-demo"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <menutree :data="menu_data" />
    </el-menu>
  </div>
</template>

<script>
import { treeList } from '@/api/authoraty/menu'
import menutree from '@/layout/components/Sidebar/menutree'
export default {
  components: {
    menutree: menutree
  },
  data() {
    return {
      treeMenu: [],
      menu_data: []
    }
  },
  computed: {
    routePathNow() {
      const activePath = this.treeMenu.filter(item => item.path === this.$route.path)
      activePath.length !== 0 ? activePath[0].effect = 'dark' : ''
      return activePath[0]
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      // 这里留给接口用：
      this.listLoading = true
      treeList(this.$store.getters.id).then(response => {
        this.dynamicRouter(response.data)
        this.$store.commit('setTabList', this.routePathNow)
        // this.listLoading = false
        this.total = response.data.total
        this.menu_data = response.data
      })
    },
    clickMenu(item) {
      this.$router.push({ name: item.webName })
      this.$store.commit('selectMenu', item)
    },
    dynamicRouter(item) {
      for (const val in item) {
        const obj = item[val]
        if (obj.children) {
          this.dynamicRouter(obj.children)
        } else {
          this.treeMenu.push({
            path: obj.webRoute,
            name: obj.webName || '',
            title: obj.menuName || '',
            icon: obj.webIcon || '',
            type: '',
            effect: 'plain'
          })
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
  #app .sidebar-container .el-submenu .el-menu-item {
    min-width: 210px !important;
    /* background-color: #1f2d3d !important; */
  }
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
  .el-menu-vertical-demo[data-v-a28ad4e6]:not(.el-menu--collapse) {
    /*width: auto;*/
  }
.menutree li{
  padding-left: 5px;
}
</style>
