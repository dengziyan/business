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
  name: 'PayItemsSearch',
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
        { type: 'Select',
          isDisabled: false,
          // 是否开启多选
          multiple: false,
          label: '收费类型',
          prop: 'chargeCategoryName',
          value: '车位停车费',
          options: [
            { name: '物业费', value: '物业费', isDisabled: false },
            { name: '水费', value: '水费', isDisabled: false },
            { name: '电费', value: '电费', isDisabled: false },
            { name: '车位停车费', value: '车位停车费', isDisabled: false }
          ]
        },
        { type: 'Input', label: '收费标准名称', prop: 'communityId', width: '1000px', placeholder: '请输入收费名称...' }
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
