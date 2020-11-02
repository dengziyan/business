<template>
  <!--收费批次管理表格及操作组件  -->
  <div>
    <!--引入搜索条件子组件        -->
    <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入操作子组件        -->

    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      <!--      &lt;!&ndash; 普通数据&ndash;&gt;-->
      <!--      <template #h1="{scope: { row }}">{{ row.billStatus }}</template>-->
      <!--      <template #h2="{scope: { row }}">{{ row.communityId }}</template>-->
      <!--      <template #h3="{scope: { row }}">{{ row.chargeProjectId }}</template>-->
      <!--      <template #h4="{scope: { row }}">{{ row.chargeBeginTime }}</template>-->
      <!--      <template #h5="{scope: { row }}">{{ row.amountPayable }}</template>-->
      <!--      <template #h6="{scope: { row }}">{{ row.amountActuallyPaid }}</template>-->
      <!--      <template #h7="{scope: { row }}">{{ row.reviewer }}</template>-->
      <!--      <template #h8="{scope: { row }}">{{ row.reviewTime }}</template>-->
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listIncomeStatic } from '@/api/financialMag/incomeStatic'
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
        { type: 'Select', isDisabled: false, multiple: false, label: '账单创建年份', prop: 'createTime', value: '请选择', options: [] },
        { type: 'Select', isDisabled: false, multiple: false, label: '账单名称', prop: 'billName', value: '请选择', options: [] },
        { type: 'datetimerange', label: '缴费日期', prop: 'amountActuallyPaid', width: '1000px' }
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
        { slot: 'h2', attrs: { prop: 'communityId', label: '渠道', width: '100', 'show-overflow-tooltip': true }, id: 1 },
        { slot: 'h3', attrs: { prop: 'chargeProjectId', label: '收入金额', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { slot: 'h4', attrs: { prop: 'chargeBeginTime', label: '收入笔数', width: '154', 'show-overflow-tooltip': true }, id: 3 },
        { slot: 'h5', attrs: { prop: 'amountPayable', label: '手续费金额统计', 'show-overflow-tooltip': true }, id: 4 },
        { slot: 'h6', attrs: { prop: 'amountPayable', label: '优惠金额总计', 'show-overflow-tooltip': true }, id: 5 }
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
      listIncomeStatic(addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
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
