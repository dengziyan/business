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
import { mapState, mapMutations } from 'vuex'
import SearchForm from '@/components/SearchForm'
import { listPayBills } from '@/api/financialMag/payBills'
export default {
  name: 'PayBillsSearch',
  components: {
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: {
        chargeBeginTime: null,
        communityId: null,
        billName: null
      },
      searchForm: [
        { type: 'datetimerange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px' },
        { type: 'Input', label: '小区', prop: 'communityId', width: '100px', placeholder: '请输入小区...' },
        { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary',
          handle: () => {
            this.handleQuery()
          }
        },
        { label: '重置', type: 'primary',
          handle: () => {
            this.resetForm('queryForm')
            this.handleQuery()
          }
        }
      ]
    }
  },
  created() {
  },
  methods: {
    handleQuery() {
      // console.log(this.searchData)
      this.$store.commit('watchQueryParams', {
        chargeBeginTime: this.searchData.chargeBeginTime,
        communityId: this.searchData.communityId,
        billName: this.searchData.billName
      })
      this.$parent.$refs.payBillsTable.getList()
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
