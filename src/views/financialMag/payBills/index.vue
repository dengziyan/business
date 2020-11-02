<template>
  <!--收费批次管理表格及操作组件  -->
  <div>
    <!--引入搜索条件子组件        -->
    <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle"/>
    <!--引入操作子组件        -->
    <!-- 各个操作按钮 -->
    <el-radio-group v-model="searchData.billStatus" @change="getList">
      <el-radio-button v-for="dict in statusOptions" :key="dict.dictValue" :value="dict.dictValue" :label="dict.dictLabel"/>
    </el-radio-group>
    <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    <!--点击新增后出现的弹框    -->
    <el-dialog :title="isEdit?'编辑账单批次':'新建账单批次'" :visible.sync="dialogVisible" width="30%">
      <!--弹框子组件      -->
      <new-dialog :visible.sync="dialogVisible" />
    </el-dialog>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      <!-- 普通数据-->
      <template #h1="{scope: { row }}">{{ row.billStatus }}</template>
      <template #h2="{scope: { row }}">{{ row.communityId }}</template>
      <template #h3="{scope: { row }}">{{ row.chargeProjectId }}</template>
      <template #h4="{scope: { row }}">{{ row.chargeBeginTime }}</template>
      <template #h5="{scope: { row }}">{{ row.amountPayable }}</template>
      <template #h6="{scope: { row }}">{{ row.amountActuallyPaid }}</template>
      <template #h7="{scope: { row }}">{{ row.reviewer }}</template>
      <template #h8="{scope: { row }}">{{ row.reviewTime }}</template>
      <!--  文字按钮    -->
      <template #handle2="{scope: { row }}">
        <el-button type="text" @click="handleCheck(row)">{{row.billName}}</el-button>
      </template>
      <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleCheck(row, $index)">审核</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        <el-button type="primary" size="mini" :visible.sync="dialogVisible" :title="isEdit?'编辑账单批次':'新建账单批次'" @click="handleEdit(row, $index)">编辑</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList"/>
  </div>
</template>

<script>
import newDialog from './newDialog'
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listPayBills, delBatch, updatePayBills } from '@/api/financialMag/payBills'

const defaultPayBills = {}
export default {
  name: 'PayBillsTable',
  components: {
    newDialog,
    TableVue,
    SearchForm
  },
  data() {
    return {
      // 操作按钮
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false, // single:非多个禁用 multiple:非单个禁用
      statusOptions: [{ dictLabel: '全部', dictValue: null }, { dictLabel: '待审核', dictValue: 0 }, { dictLabel: '已审核', dictValue: 1 }], // 状态数据字典
      // 查询表单
      searchData: { pageNum: 1, pageSize: 10, startTime: null, endTime: null, chargeBeginTime: null, communityId: null, billName: null, billStatus: null}, // 查询参数
      searchForm: [
        { type: 'datetimerange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px' },
        { type: 'Input', label: '小区', prop: 'communityId', width: '100px', placeholder: '请输入小区...' },
        { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // table表格数据
      // loading: true,
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { slot: 'h1', attrs: { prop: 'billStatus', label: '账单状态', width: '100', align: 'center' }, id: 0 },
        { slot: 'h2', attrs: { prop: 'communityId', label: '小区', width: '100', 'show-overflow-tooltip': true }, id: 1 },
        { slot: 'handle2', attrs: { type: 'button', prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { slot: 'h3', attrs: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true }, id: 3 },
        { slot: 'h4', attrs: { prop: 'chargeBeginTime', label: '收费开始日期', width: '154', 'show-overflow-tooltip': true }, id: 4 },
        { slot: 'h5', attrs: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }, id: 5 },
        { slot: 'h6', attrs: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }, id: 6 },
        { slot: 'h7', attrs: { prop: 'reviewer', label: '审核人', width: '100', 'show-overflow-tooltip': true }, id: 7 },
        { slot: 'h8', attrs: { prop: 'reviewTime', label: '审核时间', width: '154', 'show-overflow-tooltip': true }, id: 8 },
        { slot: 'handle', attrs: { label: '操作', width: '', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 9 }
      ])
    }
  },
  created() {
    this.getList()
    // this.intervalId = setInterval(() => {
    //   console.log(this.formData.formItem[0].value)
    //   console.log(this.formData.formItem[1].value)
    // }, 5000)
    // this.loading = false
  },
  methods: {
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 按新增按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      // eslint-disable-next-line no-undef
      this.payBills = Object.assign({}, defaultPayBills) // 默认值为空
    },
    handleQuery() {
      this.getList()
    },
    // 查询批次列表
    getList() {
      this.loading = true
      console.log(this.searchData)
      // 根据审核状态查询
      if (this.searchData.billStatus === '待审核') {
        this.searchData.billStatus = 0
      } else if (this.searchData.billStatus === '已审核') {
        this.searchData.billStatus = 1
      } else this.searchData.billStatus = null
      listPayBills(addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 表格方法
    handleCheck(row, index) {
      console.log(row.id)
      this.$router.push({
        name: 'payDetail',
        params: {
          id: row.id
        }
      })
    },
    // 编辑
    handleEdit(row, index) {
      this.dialogVisible = true
      this.isEdit = true
      console.log(row, index)
      updatePayBills(row)
    },
    // 删除
    handleDelete(row) {
      console.log(row.id)
      const batchIds = row.id || this.ids
      this.$confirm(
        '是否确认删除账单批次名称为 "' + row.billName + '" 的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delBatch(batchIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {
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
