<template>
  <div>
    <!--引入搜索条件子组件        -->
    <pay-detail-search />
    <!--引入表格操作子组件        -->
    <pay-detail-table />
  </div>
</template>

<script>
import payDetailSearch from './payDetailSearch'
import payDetailTable from './payDetailTable'
export default {
  name: 'Index',
  components: {
    payDetailSearch,
    payDetailTable
  }
}
</script>

<style scoped>

</style>
