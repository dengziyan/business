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
// import { treeList } from '@/api/authoraty/menu'
import menutree from '@/layout/components/Sidebar/menutree'
export default {
  components: {
    menutree: menutree
  },
  data() {
    return {
      treeMenu: [],
      menu_data: [
        {
          path: '/',
          name: 'dashboard',
          title: '首页',
          icon: 's-home'
        },
        {
          title: '小区管理模块',
          name: 'communityMag',
          icon: 's-ticket',
          children: [
            {
              path: '/community',
              name: 'community',
              title: '小区信息管理',
              icon: 'table'
            }
          ]
        },
        {
          title: '财务管理模块',
          name: 'financialMag',
          icon: 's-custom',
          children: [
            {
              path: '/payItems',
              name: 'payItems',
              title: '收费项目管理',
              icon: 'table'
            },
            {
              path: '/payBills',
              name: 'payBills',
              title: '收费批次管理',
              icon: 'table'
            },
            {
              path: '/incomeStatic',
              name: 'incomeStatic',
              title: '收入统计',
              icon: 'table'
            },
            {
              path: '/incomeDetail',
              name: 'incomeDetail',
              title: '收入明细',
              icon: 'table'
            }
          ]
        },
        {
          title: '权限管理模块',
          name: 'authoraty',
          icon: 's-custom',
          children: [
            {
              path: '/userList',
              name: 'userList',
              title: '用户列表',
              icon: 'table'
            },
            {
              path: '/roleList',
              name: 'roleList',
              title: '角色列表',
              icon: 'table'
            },
            {
              path: '/menuList',
              name: 'menuList',
              title: '菜单列表',
              icon: 'table'
            },
            {
              path: '/resourceCategory',
              name: 'resourceCategory',
              title: '资源列表',
              icon: 'table'
            }
          ]
        },
        {
          title: '系统管理模块',
          name: 'system',
          icon: 's-custom',
          children: [
            {
              path: '/online',
              name: 'online',
              title: '在线用户',
              icon: 'table'
            },
            {
              title: '日志管理',
              icon: 'table',
              children: [
                {
                  path: '/opeDiary',
                  name: 'opeDiary',
                  title: '操作日志',
                  icon: 'table'
                },
                {
                  path: '/logDiary',
                  name: 'logDiary',
                  title: '登录日志',
                  icon: 'table'
                }
              ]
            }
          ]
        },
      ]
    }
  },
  computed: {
    routePathNow() {
      const activePath = this.treeMenu.filter(item => item.path === this.$route.path)
      activePath.length !== 0 ? activePath[0].effect = 'dark' : ''
      console.log(activePath[0])
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
      // this.listLoading = true
      // treeList(this.$store.getters.id).then(response => {
      //   this.dynamicRouter(response.data)
      //   this.$store.commit('setTabList', this.routePathNow)
      //   // this.listLoading = false
      //   this.total = response.data.total
      //   this.menu_data = response.data
      // })
    },
    clickMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    },
    dynamicRouter(item) {
      for (const val in item) {
        const obj = item[val]
        if (obj.children) {
          this.dynamicRouter(obj.children)
        } else {
          this.treeMenu.push({
            path: '/' + obj.name,
            name: obj.name || '',
            title: obj.title || '',
            icon: obj.icon || '',
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
