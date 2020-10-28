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
import { listChargeCategoryOptions } from '@/api/financialMag/payBills'

export default {
  name: 'PayItemsSearch',
  components: {
    SearchForm
  },
  data() {
    return {
      chargeCategoryOptions: [],
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
          value: '请选择收费类型',
          options: []
        },
        { type: 'Input', label: '收费标准名称', prop: 'communityId', width: '1000px', placeholder: '请输入收费名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: () => '' },
        { label: '重置', type: 'primary', handle: () => '' }
      ]
    }
  },
  created() {
    this.getChargeCategory()
  },
  methods: {
    // 获取收费类型
    getChargeCategory() {
      console.log('212222')
      listChargeCategoryOptions().then(response => {
        const chargeCategoryList = response.data
        console.log(chargeCategoryList)
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ lable: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        console.log(this.chargeCategoryOptions)
        this.searchForm[0].options = this.chargeCategoryOptions
        console.log(this.searchForm[0].options)
      })
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
