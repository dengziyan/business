<template>
  <div class="navbar">
    <header>
      <div class="l-content">
        <!--汉堡菜单        -->
        <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
        <!--面包屑        -->
        <breadcrumb class="breadcrumb-container" />
      </div>
      <div class="r-content">
        <!-- 个人中心和退出       -->
<!--        <el-dropdown trigger="click" size="mini">-->
<!--            <span class="el-dropdown-link">-->
<!--              <img :src="baseUrl+userImg" class="user" alt="">-->
<!--            </span>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <router-link to="/personal">-->
<!--              <el-dropdown-item>个人中心</el-dropdown-item>-->
<!--            </router-link>-->
<!--            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
      </div>
    </header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/index'
import Hamburger from '@/components/Hamburger/index'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
/*.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}*/
.navbar{
  background-color: #99a9bf;
}
header {
  color: white;
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.el-button {
  padding: 6px 12px;
}

//左边
.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #f4f4f4;
  }

  &:last-child {
    .el-breadcrumb__inner {
      color: #fff;
    }
  }
}

el-button {
  display: block;
}

//右边
.r-content {
  display: flex;

}

.r-content {
  .user {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

//右边下拉（个人中心）
.el-dropdown-link {
  cursor: pointer;
  color: white;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown-menu--mini .el-dropdown-menu__item {
  font-size: 16px;
}
</style>
