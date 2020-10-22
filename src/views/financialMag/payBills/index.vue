<template>
    <div>
      收费批次管理
      <!--引入搜索条件子组件        -->
      <pay-bills-search />
      <!--引入表格操作子组件        -->
      <pay-bills-table />
    </div>
</template>

<script>
import payBillsSearch from './payBillsSearch'
import payBillsTable from './payBillsTable'
export default {
  name: 'Index',
  components: {
    payBillsSearch,
    payBillsTable
  }
}
</script>

<style scoped>
</style>

<style>
  .el-form-item__label{
    width: auto !important;
  }
</style>
