<template>
  <!--结算结果表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <div class="txt">
      <div class="txt-left">
        <span>结算金额: {{ settlementAmount }}<br></span>
        <span>优惠金额: 0.0<br></span>
      </div>
      <div class="txt-center">
        <span>收入金额(元)/笔数（笔）: {{ incomeAmounts }} / {{ incomeCounts }}<br></span>
        <span>手续费（元）:0.0<br></span>
      </div>
      <div class="txt-right">
        <span>退款金额（元）/退款笔数（笔）:{{ refundAmounts }} / {{ refundCounts }}<br></span>
      </div>
    </div>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="No data~">
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listCountResult, exportCountResult } from '@/api/financialMag/countResult'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listCommunityOptions } from '@/api/financialMag/payBills'
export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      // 收入金额
      incomeAmounts: 0.0,
      // 收入笔数
      incomeCounts: 0,
      // 退款金额
      refundAmounts: 0.0,
      // 退款笔数
      refundCounts: 0,
      // 结算金额
      settlementAmount: 0.0,
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: null, endTime: null, settlementDate: null, name: null, createTime: null, billName: null }, // 查询参数
      searchForm: [
        { type: 'Select', label: '小区', prop: 'communityName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'datetimerange', label: '结算日期', prop: 'settlementDate', width: '1000px', change: this.getList }
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
        { attrs: { prop: 'paymentMethod', label: '渠道', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'settlementAmount', label: '结算金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeSum', label: '收入金额', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeCount', label: '收入笔数', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'income', label: '优惠金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'income', label: '手续费', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundSum', label: '退款金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundCount', label: '退款笔数', 'show-overflow-tooltip': true }}
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
      const searchData = Object.assign({}, this.searchData)
      searchData.settlementDate = undefined
      listCountResult(this.addDateRange(searchData, this.searchData.settlementDate)).then((response) => {
        this.list = response.data.settlementDetails || []
        this.incomeAmounts = response.data.incomeAmounts
        this.incomeCounts = response.data.incomeCounts
        this.refundAmounts = response.data.refundAmounts
        this.refundCounts = response.data.refundCounts
        this.settlementAmount = this.incomeAmounts - this.refundAmounts
        // 将数据中 手续费和 优惠金额 设置为 0
        this.list.map((item, index, list) => {
          item.settlementAmount = item.incomeSum - item.refundSum
          item.income = 0
          return item
        })
        this.loading = false
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
      searchData.userId = this.$store.getters.id
      this.$confirm('是否确认导出结算结果表?', '警告', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(function() {
        exportCountResult(searchData).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '结算结果.xlsx')
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
  .txt{
    display: flex;
  }
  .txt-left,.txt-center{
    margin-right: 150px;
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
