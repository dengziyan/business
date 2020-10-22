<template>
  <div>
    <search-form
      size="mini"
      label-width="80px"
      :search-data="searchData"
      :search-form="searchForm"
      :search-handle="searchHandle"
    />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
export default {
  name: 'PayBillsSearch',
  components: {
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: {
        name: null,
        age: null,
        sex: null,
        interst: null
      },
      searchForm: [
        { type: 'daterange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px' },
        { type: 'Input', label: '小区', prop: 'communityId', width: '100px', placeholder: '请输入小区...' },
        { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: () => '' },
        { label: '重置', type: 'primary', handle: () => '' }
      ]
    }
  }
}
</script>

<style scoped>
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
  .el-form-item__label{
    width: 100px !important;
  }
</style>
