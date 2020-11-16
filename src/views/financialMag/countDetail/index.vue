<template>
  <!--结算结果表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listCommunityOptions } from '@/api/financialMag/payBills'
import { exportCountResult } from '@/api/financialMag/countDetail'
import { listCountResult } from '@/api/financialMag/countResult'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, beginTime: undefined, endTime: undefined, amountActuallyPaid: undefined, communityName: undefined, createTime: undefined, billName: undefined }, // 查询参数
      searchForm: [
        { type: 'Select', label: '小区', prop: 'communityName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'datetimerange', label: '结算日期', prop: 'amountActuallyPaid', width: '1000px', change: this.getList }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm },
        { label: '导出', type: 'warning', handle: this.handleExport }
      ],
      // table表格数据
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'communityName', label: '小区', width: '100', align: 'center' }},
        { attrs: { prop: 'liquidationDate', label: '清算日期', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'transactionHour', label: '交易日期', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeSum', label: '交易金额', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'checkoutAmount', label: '结账金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'fee', label: '手续费', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'fee', label: '优惠金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'paymentMethod', label: '支付方式', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentIdentity', label: '交易类型', 'show-overflow-tooltip': true }}
      ])
    }
  },
  created() {
    this.getCommunity()
    this.getList()
  },
  methods: {
    // 选项：小区
    getCommunity() {
      listCommunityOptions(this.$store.getters.id).then(response => {
        this.communityOptions = response.data.map(function(val) {
          return { label: val.communityName, value: val.communityName }
        })
        this.searchForm[0].options = this.communityOptions
      })
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 查询列表
    getList() {
      this.loading = true
      listCountResult(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then((response) => {
        this.list = response.data.settlementDetails || []
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].fee = 0
          this.list[i].checkoutAmount = this.list[i].incomeSum - this.list[i].refundSum
        }
        this.loading = false
        console.log(this.list)
      })
    },
    // 导出按钮操作
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.export = 'all'
      }
      searchData.userId=this.$store.getters.id
      this.$confirm('是否确认导出退款明细表?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportCountResult(searchData).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '结算明细.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style scoped>
  .main{
    margin:20px;
  }
  .search{
    height: 100px;
  }
  .el-row{
    margin-left: 10px !important;
  }
  .el-table{
    width: 98% !important;
    border-right: none !important;
  }
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
  .el-form-item__label{
    width: 100px !important;
  }
  .el-form-item__label{
    width: auto !important;
  }
</style>

<style>
  .el-form-item__label{
    width: auto !important;
  }
</style>
