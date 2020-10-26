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
        {
          type: 'Select',
          isDisabled: false,
          // 是否开启多选
          multiple: false,
          label: '小区',
          prop: 'chargeCategoryName',
          value: '车位停车费',
          options: [
            { name: 'xx小区', value: 'xx小区', isDisabled: true },
            { name: '小区', value: '小区', isDisabled: false }
          ]
        },
        {
          type: 'Select',
          isDisabled: false,
          // 是否开启多选
          multiple: false,
          label: '账单名称',
          prop: 'billName',
          value: '车位停车费',
          options: [
            { name: '2020物业费', value: '2020物业费', isDisabled: false }
          ]
        },
        { type: 'Input', label: '房屋（栋-单元-室/车位号/车牌号）', prop: 'buildingName', width: '100px', placeholder: '请输入账单名称...' },
        { type: 'Input', label: '审核状态', prop: 'approvalStatus', width: '100px', placeholder: '请输入账单名称...' }
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
