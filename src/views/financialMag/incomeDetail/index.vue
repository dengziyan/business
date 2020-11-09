<template>
  <!--收费批次管理表格及操作组件  -->
  <div>
    <!--引入搜索条件子组件        -->
    <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">

      <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleBack(row, $index)">退款</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listIncomeDetail, toRefund } from '@/api/financialMag/incomeDetail'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      billNames: [],
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: null, endTime: null, amountActuallyPaid: null, name: null, year: null, billName: null, userId: null }, // 查询参数
      searchForm: [
        { type: 'Select', isDisabled: false, multiple: false, label: '小区', prop: 'communityName', value: '请选择', options: [] },
        { type: 'year', isDisabled: false, multiple: false, label: '账单创建年份', prop: 'year' },
        { type: 'Select', isDisabled: false, multiple: false, label: '账单名称', prop: 'billName', value: '请选择', options: [], change: this.getList },
        { type: 'datetimerange', label: '缴费日期', prop: 'chargeBeginTime', width: '1000px' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm },
        { label: '导出', type: 'primary', handle: this.handleExport }
      ],
      // table表格数据
      // loading: true,
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'communityName', label: '小区', width: '100', align: 'center' }},
        { attrs: { prop: 'buildingName', label: '房屋（栋-单元-室/车位号/车牌号）', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'chargeCategory', label: '收费类型', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'orderUmber', label: '订单号', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'mobilePhone', label: '手机号', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentName', label: '住户', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '缴费时间', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amountPaid', label: '缴费金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'paymentMethod', label: '缴费方式', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
    this.getBillList()
  },
  methods: {
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    handleQuery() {
      this.getList()
    },
    // 查询列表
    getList() {
      this.loading = true
      console.log(this.searchData)
      listIncomeDetail(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 查询账单名称
    getBillList() {
      console.log(this.searchData)
      console.log(this)
      this.searchData.userId = this.$store.getters.id
      listIncomeDetail(this.searchData).then(
        (response) => {
          const listBillName = response.data.rows
          for (let i = 0; i < listBillName.length; i++) {
            // 获取收费账单名称列表
            const billName = listBillName[i]
            this.billNames.push({ lable: billName.billName, value: billName.billName, isDisabled: false })
          }
          this.searchForm[2].options = this.unique(this.billNames)
        }
      )
    },
    handleBack(row, index) {
      console.log('handleBack(row, index)')
      toRefund(this.$store.getters.id, row.id).then(
        response => {
          console.log(response)
        }
      )
    },
    // 对象数组去重
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
    /** 导出按钮操作 */
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
          console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(res, sysDate + '收入统计.xlsx')
        })
      }).catch(function() {
      })
    }
  }
}
</script>

<style scoped>
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
