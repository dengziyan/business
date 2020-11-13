<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <div class="txt">
      <span>收入金额总计: {{ sum }}<br></span>
      <span>收入笔数: {{ total }}<br></span>
      <span>收入金额总计: 0.0<br></span>
    </div>
    <!--引入操作子组件        -->
    <!--引入表格组件  -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据" />
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
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
import { listChargeCategoryOptions, listCommunityOptions } from '@/api/financialMag/payBills'

export default {
  name: 'Index',
  components: { TableVue, SearchForm },
  data() {
    return {
      sum: 0, chargeCategoryOptions: [],
      // 查询表单
      searchData: { pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, paymentCycle: undefined, chargeCategoryName: undefined, createTime: undefined },
      searchForm: [
        { type: 'Select', label: '小区', prop: 'communityName', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Select', label: '收费类型', prop: 'chargeCategoryName', isDisabled: false, multiple: false, value: '请选择收费类型', options: [], change: this.getList },
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
        { attrs: { prop: 'communityName', label: '小区', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'paymentMethod', label: '渠道', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeSum', label: '收入金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'incomeCount', label: '收入笔数', width: '154', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'income', label: '手续费金额统计', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'income', label: '优惠金额总计', 'show-overflow-tooltip': true }}
      ])
    }
  },
  created() {
    this.getList()
    this.getChargeCategory()
    this.getCommunity()
  },
  methods: {
    // 选项：小区
    getCommunity() {
      listCommunityOptions(this.$store.getters.id).then(response => {
        this.communityOptions = response.data.map(function(val) {
          return { label: val.communityName, value: val.id }
        })
        this.searchForm[0].options = this.communityOptions
      })
    },
    // 选项：收费类型
    getChargeCategory() {
      this.searchData.userId = this.$store.getters.id
      listChargeCategoryOptions(this.searchData).then(response => {
        const chargeCategoryList = response.data.rows
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ label: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.searchForm[1].options = this.chargeCategoryOptions
      })
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 查询列表
    getList() {
      this.loading = true
      listIncomeStatic(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then((response) => {
        this.list = response.data.rows
        this.sum = response.data.sum
        console.log(this.list)
        this.total = response.data.total
        this.loading = false
      })
      listIncomeStatic(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.maps
          // 将数据中 手续费和 优惠金额 设置为 0
          this.list.map((item, index, list) => {
            item.income = 0
            return item
          })
          this.sum = response.data.sum
          console.log(this.list)
          this.total = response.data.total
          this.loading = false
        }
      )
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
    margin:20px;
  }
  .search{
    height: 100px;
  }
  .txt{
    display: flex;
    height: 20px;
  }
  .txt span{
    margin-right: 40px;
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
