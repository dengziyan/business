<template>
  <!--收费批次管理表格及操作组件  -->
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form :model="searchData" size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    </div>
    <!-- 各个操作按钮 -->
    <div class="anyButton">
      <el-radio-group class="anyButton-left" v-model="searchData.billStatus" @change="getList">
        <el-radio-button v-for="dict in statusOptions" :key="dict.value" :value="dict.value" :label="dict.label" />
      </el-radio-group>
      <el-button class="anyButton-right" type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    </div>
    <!--引入表格组件        -->
    <div class="table">
      <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
        <!--  文字按钮    -->
        <template #handle2="{scope: { row }}">
          <el-button type="text" @click="handleCheck(row)">{{ row.billName }}</el-button>
        </template>
        <!-- 操作按钮 。#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
        <template #handle="{scope: {row, $index}}">
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleCheck(row, $index)">审核</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(row, $index)">编辑</el-button>
        </template>
      </TableVue>
      <!--  分页  -->
      <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
    </div>
    <!--点击新增后出现的弹框    -->
    <el-dialog title="新增账单批次" :visible.sync="newVisible" width="650px">
      <new-dialog :visible.sync="newVisible"  @getList="getList" />
    </el-dialog>
    <!--点击编辑后出现的弹框    -->
    <el-dialog v-if="editVisible" title="编辑账单批次" :visible.sync="editVisible" width="650px">
      <edit-dialog v-if="editVisible" :visible.sync="editVisible" :edit-data="editData" />
    </el-dialog>

  </div>
</template>

<script>
import newDialog from './newDialog'
import editDialog from './editDialog'
import SearchForm from '@/components/SearchForm'
import TableVue from '@/components/TableVue'
import { listPayBills, delBatch, listCommunityOptions, listCommunity } from '@/api/financialMag/payBills'
import { listChargeProject } from '@/api/financialMag/chargeProject'
import { getDictVal } from '@/api/system/logininfor'
import { getUserName } from '@/api/authoraty/user'
export default {
  name: 'PayBillsTable',
  components: { newDialog, editDialog, TableVue, SearchForm },
  data() {
    return {
      editData: {},
      // 操作按钮
      single: true, multiple: true, checkAll: false, newVisible: false, editVisible: false, // single:非多个禁用 multiple:非单个禁用
      statusOptions: [], // 状态数据字典
      // 查询表单
      searchData: { pageNum: 1, pageSize: 5, startTime: undefined, endTime: undefined, chargeBeginTime: undefined, communityId: undefined,
        billName: undefined, billStatus: undefined, userId: undefined }, // 查询参数
      searchForm: [
        { type: 'datetimerange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px', change: this.getList },
        { type: 'Select', label: '小区', prop: 'communityId', isDisabled: false, multiple: false, value: '请选择', options: [], change: this.getList },
        { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // table表格数据
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'billStatus', label: '账单状态', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'communityId', label: '小区', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { slot: 'handle2', attrs: { type: 'button', prop: 'billName', label: '账单名称', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'chargeProjectId', label: '收费项目', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'chargeBeginTime', label: '收费开始日期', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amountPayable', label: '应缴金额', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'reviewer', label: '审核人', width: '100', align: 'center', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'reviewTime', label: '审核时间', align: 'center', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '180', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
    this.getOperationStatusDict()
    this.getCommunity()
  },
  methods: {
    // 选项：小区
    getCommunity() {
      listCommunityOptions(this.$store.getters.id).then(response => {
        this.communityOptions = response.data.map(function(val) {
          return { label: val.communityName, value: val.id }
        })
        this.searchForm[1].options = this.communityOptions
      })
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_charge_batch', 'bill_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 审核按钮、详情按钮
    handleCheck(row, index) {
      this.$router.push({
        name: 'payDetail',
        params: {
          id: row.id,
          billName: row.billName,
          projectName: row.chargeProjectId,
        }
      })
    },
    // 按新增按钮，弹出对话框
    handleAdd() {
      this.newVisible = true
    },
    // 编辑
    handleEdit(row, index) {
      this.editVisible = true
      this.editData = Object.assign({}, row)
      console.log(this.editData)
      // updatePayBills(row)
    },
    // 删除
    handleDelete(row) {
      const batchIds = row.id || this.ids
      this.$confirm('是否确认删除账单批次名称为 "' + row.billName + '" 的数据项?', '警告',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      ).then(function() {
        return delBatch(batchIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    // 查询批次列表
    async getList() {
      this.loading = true
      // 根据审核状态查询
      if (this.searchData.billStatus === '未审核') {
        this.searchData.billStatus = 0
      } else if (this.searchData.billStatus === '已审核') {
        this.searchData.billStatus = 1
      } else if (this.searchData.billStatus === '缴费中') {
        this.searchData.billStatus = 2
      }
      // 调用查询方法
      const searchData = Object.assign({}, this.searchData)
      searchData.chargeBeginTime = undefined
      listPayBills(this.addDateRange(searchData, this.searchData.chargeBeginTime)).then(
        async(response) => {
          const listData = response.data.rows || []
          this.total = response.data.total
          for (let i = 0; i < listData.length; i++) {
            const query = {
              chargeProjectId: listData[i].chargeProjectId
            }
            // 根据收费项目ID 获取收费项目名称
            await listChargeProject(query).then(response => {
              listData[i].chargeProjectId = response.data.rows[0].chargeProjectName
            })
            // 根据小区id查询小区名称
            await listCommunity(listData[i].communityId).then(response => {
              listData[i].communityId = response.data.communityName
            })
            // 根据 审核者ID查询 审核者账号
            console.log(listData[i].reviewer)
            getUserName(this.$store.getters.id, listData[i].reviewer).then(
              response => {
                console.log(response.data)
                listData[i].reviewer = response.data[0].userAccount
              }
            )
            // 显示账单状态
            this.statusOptions.filter(
              item => item.value - 0 === listData[i].billStatus
            ).map(function(val) {
              listData[i].billStatus = val.label
            })
          }
          this.list = listData
          this.loading = false
        }
      )
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
  .anyButton{
    /*display: flex;*/
    /*justify-content:space-around;*/
    /*margin-left: -30px;*/
  }
  .anyButton-left{
    float: left;
  }
  .anyButton-right{
    float: right;
  }
  /*.el-row{*/
  /*  margin-left: 10px !important;*/
  /*}*/
  .el-table{
    width: 100% !important;
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
