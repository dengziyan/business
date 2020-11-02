<template>
  <!--结算结果表格及操作组件  -->
  <div>
    <!--引入搜索条件子组件        -->
    <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="No data~">
      <!-- 普通数据-->
      <!--        <template #h1="{scope: { row }}">{{ row.billStatus }}</template>-->
      <!--        <template #h2="{scope: { row }}">{{ row.communityId }}</template>-->
      <!--        <template #h3="{scope: { row }}">{{ row.chargeProjectId }}</template>-->
      <!--        <template #h4="{scope: { row }}">{{ row.chargeBeginTime }}</template>-->
      <!--        <template #h5="{scope: { row }}">{{ row.amountPayable }}</template>-->
      <!--        <template #h6="{scope: { row }}">{{ row.amountActuallyPaid }}</template>-->
      <!--        <template #h7="{scope: { row }}">{{ row.reviewer }}</template>-->
      <!--        <template #h8="{scope: { row }}">{{ row.reviewTime }}</template>-->
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listCountResult } from '@/api/financialMag/countResult'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'

export default {
  name: 'Index',
  components: {
    TableVue,
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: null, endTime: null, amountActuallyPaid: null, name: null, createTime: null, billName: null }, // 查询参数
      searchForm: [
        { type: 'Select', isDisabled: false, multiple: false, label: '小区', prop: 'name', value: '请选择', options: [] },
        { type: 'datetimerange', label: '结算日期', prop: 'amountActuallyPaid', width: '1000px' }
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
        { slot: 'h1', attrs: { prop: 'name', label: '小区', width: '100', align: 'center' }, id: 0 },
        { slot: 'h2', attrs: { prop: 'mobliePhone', label: '渠道', width: '100', 'show-overflow-tooltip': true }, id: 1 },
        { slot: 'h3', attrs: { prop: 'billName', label: '结算金额', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { slot: 'h4', attrs: { prop: 'chargeCategoryName', label: '收入金额', width: '154', 'show-overflow-tooltip': true }, id: 3 },
        { slot: 'h5', attrs: { prop: 'id', label: '收入笔数', 'show-overflow-tooltip': true }, id: 4 },
        { slot: 'h6', attrs: { prop: 'mobliePhone', label: '优惠金额', 'show-overflow-tooltip': true }, id: 5 },
        { slot: 'h7', attrs: { prop: 'residentIdentity', label: '手续费', 'show-overflow-tooltip': true }, id: 6 },
        { slot: 'h8', attrs: { prop: 'residentIdentity', label: '退款金额', 'show-overflow-tooltip': true }, id: 7 },
        { slot: 'h9', attrs: { prop: 'residentIdentity', label: '退款笔数', 'show-overflow-tooltip': true }, id: 8 }
      ])
    }
  },
  created() {
    this.getList()
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
      listCountResult(addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    /** 导出按钮操作 */
    handleExport() {
      const searchData = this.searchData
      if (this.checkAll) {
        searchData.pageNum = undefined
        searchData.pageSize = undefined
        searchData.export = 'all'
      }
      this.$confirm('是否确认导出退款明细表?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        exportLogininfo(searchData).then(res => {
          console.log(res)
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
          console.log(sysDate)
          fileDownload(res, sysDate + '退款明细.xlsx')
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
