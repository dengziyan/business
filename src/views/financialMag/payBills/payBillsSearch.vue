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
            this.getList()
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
  computed: {
    // 使用对象展开运算符将此对象混入到对象中
    ...mapState({
      queryParamsTest: state => state.watch.queryParamsTest
    })
  },
  created() {
    // this.getList()
    this.watchQueryParams()
  },
  methods: {
    ...mapMutations({
      watchQueryParams: 'watchQueryParams'
    }),
    handleQuery() {
      console.log(this.searchData)
      this.getList()
    },
    /** 查询批次列表 */
    getList() {
      this.loading = true
      listPayBills(this.searchData).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
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
