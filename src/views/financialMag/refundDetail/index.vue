<template>
  <!--退款明细表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <div class="txt">
      <span>退款金额总计：{{ count }}元</span>
    </div>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!--  文字按钮    -->
      <template #handle2="{scope: { row }}">
        <el-button class="showDetail" type="text" @click="handleDetail(row)">详情</el-button>
      </template>
      <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row}}">
        <el-button size="mini" type="text" icon="el-icon-circle-check" :disabled="row.ifShow" @click="handleAgree(row, 1)">同意</el-button>
        <el-button size="mini" type="text" icon="el-icon-circle-close" :disabled="row.ifShow" @click="handleAgree(row, 2)">拒绝</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
    <!--点击详情后出现的弹框    -->
    <el-dialog title="周期详情" :visible.sync="dialogVisible" width="800px">
      <!--弹框子组件      -->
      <detail-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :detail-data="detailData"/>
    </el-dialog>
    <!-- 审核   -->

  </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import DetailDialog from './detailDialog'
import { listRefundDetail, refundDetailToReview } from '@/api/financialMag/refundDetail'
import { exportLogininfo, getDictVal } from '@/api/system/logininfor'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { listCommunityOptions } from '@/api/financialMag/payBills'

export default {
  name: 'Index',
  components: { TableVue, SearchForm, DetailDialog },
  data() {
    return {
      statusOptions: [], // 状态数据字典
      dialogVisible: false, detailData: {}, ifShow: true,
      // 查询表单
      searchData: { pageNum: 1, pageSize: 5, mobliePhone: undefined, beginTime: undefined, endTime: undefined,
        refundTime: undefined, communityName: undefined, refundMethod: undefined }, // 查询参数
      searchForm: [
        { type: 'Select', label: '小区', prop: 'communityName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Input', label: '手机号', prop: 'mobliePhone', width: '100px', placeholder: '请输入手机号' },
        { type: 'Select', label: '退款状态', prop: 'refundMethod', isDisabled: false, multiple: false, value: '请选择', change: this.getList,
          options: [{ value: '0', label: '待审核' }, { value: '1', label: '同意' }, { value: '2', label: '拒绝' }] },
        { type: 'datetimerange', label: '退款日期', prop: 'refundTime', width: '1000px', change: this.getList }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm },
        { label: '导出', type: 'primary', handle: this.handleExport }
      ],
      // table表格数据
      list: [],
      count: 0.0,
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'communityName', label: '小区', width: '100', align: 'center' }},
        { attrs: { prop: 'mobilePhone', label: '手机号', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundMethod', label: '退款方式', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundTime', label: '退款日期', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundAmount', label: '退款金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'refundStatus', label: '退款状态', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentName', label: '住户', 'show-overflow-tooltip': true }},
        { slot: 'handle2', attrs: { prop: 'amount', label: '退款详情', align: 'center', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '审核', width: '120', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
    this.getCommunity()
    this.getOperationStatusDict()
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
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_refund_details', 'refund_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 查询列表
    getList() {
      this.loading = true
      listRefundDetail(this.addDateRange(this.searchData, this.searchData.refundTime)).then((response) => {
        const listData = response.data.rows || []
        listData.map((item, index, list) => {
          if (item.refundStatus === 0) {
            item.ifShow = false
          } else item.ifShow = true
          return item
        })
        for (let i = 0; i < listData.length; i++) {
          this.count += listData[i].refundAmount
          // 显示退款审核的状态
          this.statusOptions.filter(
            item => item.value - 0 === listData[i].refundStatus
          ).map(function(val) {
            listData[i].refundStatus = val.label
          })
          console.log(listData[i])
        }
        this.total = response.data.total
        this.list = listData
        this.loading = false
      })
    },
    // 详情按钮
    handleDetail(row) {
      console.log(row)
      this.dialogVisible = true
      this.detailData = row
      console.log(this.detailData)
    },
    // 同意按钮
    handleAgree(row, status) {
      refundDetailToReview(this.$store.getters.id, status, row.id).then((response) => {
        if (response.code === 2000) {
          this.$message({
            message: response.message,
            type: 'success'
          })
        }
      })
      this.getList()
    },
    // 导出按钮操作
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
  .showDetail{
    margin-left: 0px;
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
  .check{
    position: relative;
  }
  .showBtn{
    position: absolute;
    top: 0px;
  }
</style>

<style>
  .el-form-item__label{
    width: auto !important;
  }
</style>
