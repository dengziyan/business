<template>
  <!--退款明细表格及操作组件  -->
  <div>
    <!--引入搜索条件子组件        -->
    <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleCheck(row, $index)">审核</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
  </div>
</template>

<script>
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listRefundDetail } from '@/api/financialMag/refundDetail'
import { exportLogininfo } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: null, endTime: null, amountActuallyPaid: null, name: null, createTime: null, billName: null }, // 查询参数
      searchForm: [
        { type: 'Select', isDisabled: false, multiple: false, label: '小区', prop: 'name', value: '请选择', options: [] },
        { type: 'Input', label: '手机号', prop: 'mobliePhone', width: '100px', placeholder: '请输入手机号' },
        { type: 'Select', isDisabled: false, multiple: false, label: '退款状态', prop: 'billName', value: '请选择', options: [] },
        { type: 'datetimerange', label: '退款日期', prop: 'amountActuallyPaid', width: '1000px' }
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
        { attrs: { prop: 'mobilePhone', label: '手机号', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundMethod', label: '退款方式', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundTime', label: '退款日期', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'id', label: '退款金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundMethod', label: '退款状态', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentName', label: '住户', 'show-overflow-tooltip': true }},
        { slot: 'handle2', attrs: { prop: 'amount', label: '退款详情', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '', 'class-name': 'small-padding fixed-width', align: 'center' }}
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
      listRefundDetail(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
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
          const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
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
