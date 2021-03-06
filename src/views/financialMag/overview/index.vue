<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <div class="txt">
      <div class="txt-left">
        <span>收入金额总计: {{ incomeAmounts }}元<br></span>
        <span>现金金额总计: {{ incomeAmounts }}元<br></span>
      </div>
      <div class="txt-right">
        <span>收入笔数: {{ incomeCounts }}笔<br></span>
        <span>现金笔数: {{ incomeCounts }}笔<br></span>
      </div>
      <div class="txt-right"><span> 缴费总户数: {{ numberOfHouseholds }} 户<br></span></div>
    </div>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleBack(row, $index)">退款</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listIncomeDetail, toRefund } from '@/api/financialMag/incomeDetail'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listCommunityOptions } from '@/api/financialMag/payBills'
import { listCountResult } from '@/api/financialMag/countResult'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      incomeCounts: 0,
      incomeAmounts: 0.0,
      numberOfHouseholds: 0,
      billNames: [],
      // 查询表单
      searchData: { pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, amountActuallyPaid: undefined,
        name: undefined, year: undefined, billName: undefined, userId: undefined, communityName: undefined }, // 查询参数
      searchForm: [
        { type: 'Select', label: '小区', prop: 'communityName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'year', label: '账单创建年份', prop: 'year', isDisabled: false, multiple: false, change: this.getList },
        { type: 'Select', label: '账单名称', prop: 'billName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'datetimerange', label: '缴费日期', prop: 'chargeBeginTime', width: '1000px', change: this.getList }
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
        { attrs: { prop: 'incomeSum', label: '收入金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeCount', label: '收入笔数', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundSum', label: '退款金额', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundCount', label: '退款笔数', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'numberOfHousehold', label: '缴费户数', 'show-overflow-tooltip': true }}
      ])
    }
  },
  created() {
    this.getList()
    this.getBillList()
    this.getCommunity()
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
    // 选项：账单名称
    getBillList() {
      this.searchData.userId = this.$store.getters.id
      listIncomeDetail(this.searchData).then((response) => {
        const listBillName = response.data.rows
        for (let i = 0; i < listBillName.length; i++) {
          // 获取收费账单名称列表
          const billName = listBillName[i]
          this.billNames.push({ lable: billName.billName, value: billName.billName, isDisabled: false })
        }
        this.searchForm[2].options = this.unique(this.billNames)
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
        this.incomeAmounts = response.data.incomeAmounts
        this.incomeCounts = response.data.incomeCounts
        this.numberOfHouseholds = response.data.numberOfHouseholds
        this.loading = false
      })
    },
    // 退款按钮的方法
    handleBack(row, index) {
      toRefund(this.$store.getters.id, row.id).then(response => {
        console.log(response)
        this.$message({
          message: response.message,
          type: response.code === 2000 ? 'success' : 'error'
        })
      })
    },
    // 对象数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    // 导出按钮操作
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.export = 'all'
      }
      this.$confirm('是否确认导出收入统计?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfo(searchData).then(res => {
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          fileDownload(res, sysDate + '收入统计.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style scoped>
  .main{
    margin: 20px;
  }
  .search{
    height: 150px;
  }
  .txt{
    display: flex;
    justify-content: flex-start
  }
  .txt-left{
    margin-right: 200px;
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
