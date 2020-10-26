<template>
  <div>
    收费项目管理
    <!--引入搜索条件子组件        -->
    <pay-items-search />
    <!--引入表格操作子组件        -->
    <pay-items-table />
  </div>
</template>
<script>
import payItemsSearch from './payItemsSearch'
import payItemsTable from "./payItemsTable";
export default {
  name: 'Index',
  components: {
    payItemsSearch,
    payItemsTable
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .el-form-item__label{
    width: 100px !important;
  }
</style>
