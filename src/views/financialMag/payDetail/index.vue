<template>
  <div>
    <!--引入搜索条件子组件        -->
<!--    <pay-detail-search />-->
    <!--引入表格操作子组件        -->
    <pay-detail-table />
  </div>
</template>

<script>
import payDetailTable from './payDetailTable'
export default {
  name: 'Index',
  components: {
    payDetailTable
  },
  created() {

  }
}
</script>

<style scoped>

</style>
