<template>
  <div class="main">
    <!--引入搜索条件子组件        -->
    <div class="search">
      <search-form size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle"/>
    </div>
      <!--引入操作子组件        -->
    <div class="anyBtn">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    </div>
    <!--点击新增后出现的弹框    -->
    <el-dialog :title="isEdit?'编辑收费项目':'添加收费项目'" :visible.sync="dialogVisible" :edit.sync="isEdit" width="700px">
      <new-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :edit.sync="isEdit" :edit-info="editInfo"  @getList="getList" />
    </el-dialog>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row, $index)">编辑</el-button>
      </template>
    </TableVue>
    <!--分页    -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
  </div>
</template>
<script>
import { listChargeProject, deletePayItems } from '@/api/financialMag/chargeProject'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import newDialog from './newDialog'
import { listChargeCategoryOptions } from '@/api/financialMag/payBills'
import { getDictVal } from '@/api/system/logininfor'
export default {
  name: 'Index',
  components: { SearchForm, TableVue, newDialog },
  data() {
    return {
      total: 0,
      statusOptions: [], // 状态数据字典
      editInfo: {}, // 编辑相关数据
      chargeCategoryOptions: [],
      // 查询表单3
      searchData: {
        pageNum: 1,
        pageSize: 5,
        userId: undefined,
        // userId: this.$store.getters.id,
        chargeStandard: undefined,
        chargeCategoryName: undefined
      },
      searchForm: [
        { type: 'Select', label: '收费类型', prop: 'chargeCategoryName', isDisabled: false, multiple: false, value: '请选择收费类型', options: [], change: this.getList },
        { type: 'Select', label: '收费标准名称', prop: 'chargeStandard', isDisabled: false, multiple: false, width: '1000px', placeholder: '请输入收费名称...', change: this.getList,
          options: [{ value: '0', label: '无' }, { value: '1', label: '按固定金额' }, { value: '2', label: '按建筑面积' }] }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // 操作按钮
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      // table表格数据
      loading: true,
      list: [],
      columns: Object.freeze([
        { attrs: { prop: 'chargeCategoryName', label: '收费类型', width: '100', align: 'center' }},
        { attrs: { prop: 'chargeProjectName', label: '收费项目名称', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'chargeStandard', label: '收费标准', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'standardAmount', label: '标准金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createBy', label: '创建人', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '创建时间', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'note', label: '备注', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '120', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
    this.loading = true
    this.getChargeCategory()
  },
  methods: {
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_charge_project', 'charge_standard').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
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
        this.searchForm[0].options = this.chargeCategoryOptions
      })
    },
    // 表格重置
    resetForm() {
      console.log('123213')
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 查询收费项目列表
    getList() {
      this.searchData.userId = this.$store.getters.id
      listChargeProject(this.searchData).then((response) => {
        const listData = response.data.rows || []
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) {
          // 显示账单状态
          this.statusOptions.filter(
            item => item.value - 0 === listData[i].chargeStandard
          ).map(function(val) {
            listData[i].chargeStandard = val.label
          })
        }
        this.list = listData
        this.loading = false
      })
    },
    // 编辑
    handleUpdate(row, index) {
      this.dialogVisible = true
      this.isEdit = true
      this.editInfo = Object.assign({}, row)
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleDelete(row) {
      deletePayItems(row.id).then(
        response => {
          if (response.code === 2000) {
            this.$message({
              message: '删除收费项目成功',
              type: 'success'
            })
            this.getList()
          }
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
  .anyBtn{
    margin-top:10px;
  }
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
  .el-form-item__label{
    width: 100px !important;
  }
  .el-row{
    margin-left: 10px !important;
  }
  .el-table{
    width: 98% !important;
    border-right: none !important;
  }
</style>

