<template>
<!--  <el-breadcrumb class="app-breadcrumb" separator="/">-->
<!--    <transition-group name="breadcrumb">-->
<!--      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">-->
<!--        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>-->
<!--        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>-->
<!--      </el-breadcrumb-item>-->
<!--    </transition-group>-->
<!--  </el-breadcrumb>-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if="current" :to="'/'+current.name" :replace="true">{{
      current.title
      }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from 'vuex'
import store from '../../store'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu
    })

  },
  methods: {
    collapseMenu() {
      this.$store.commit('collapseMenu')
    }
  }
}
</script>

<style lang="scss" scoped>

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

</style>
