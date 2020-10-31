<template>
  <div>
    收费项目管理
    <!--引入搜索条件子组件        -->
    <search-form size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle"/>
    <!--引入操作子组件        -->
    <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    <!--点击新增后出现的弹框    -->
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="30%">
      <!--弹框子组件      -->
      <new-dialog />
    </el-dialog>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
        <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">编辑</el-button>
      </template>
    </TableVue>
  </div>
</template>
<script>
import { listChargeProject } from '@/api/financialMag/chargeProject'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import newDialog from './newDialog'
import { listChargeCategoryOptions } from '@/api/financialMag/payBills'
export default {
  name: 'Index',
  components: {
    SearchForm,
    TableVue,
    newDialog
  },
  data() {
    return {
      chargeCategoryOptions: [],
      // 查询表单
      searchData: { name: null, age: null, sex: null, interst: null },
      searchForm: [
        { type: 'Select', isDisabled: false, multiple: false, label: '收费类型', prop: 'chargeCategoryName', value: '请选择收费类型', options: [] }, // multiple:是否开启多选
        { type: 'Input', label: '收费标准名称', prop: 'communityId', width: '1000px', placeholder: '请输入收费名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: () => '' },
        { label: '重置', type: 'primary', handle: () => '' }
      ],
      // 操作按钮
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      checkAll: false,
      dialogVisible: false,
      isEdit: false,
      // table表格数据
      loading: true,
      list: [],
      columns: Object.freeze([
        { attrs: { prop: 'chargeCategoryName', label: '收费类型', width: '100', align: 'center' }, id: 0 },
        { attrs: { prop: 'chargeProjectName', label: '收费项目名称', width: '100', 'show-overflow-tooltip': true }, id: 1 },
        { attrs: { prop: 'chargeStandard', label: '收费标准', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { attrs: { prop: 'createBy', label: '标准金额', width: '100', 'show-overflow-tooltip': true }, id: 3 },
        { attrs: { prop: 'createBy', label: '创建人', 'show-overflow-tooltip': true }, id: 4 },
        { attrs: { prop: 'createTime', label: '创建时间', width: '100', 'show-overflow-tooltip': true }, id: 5 },
        { attrs: { prop: 'note', label: '备注', width: '100', 'show-overflow-tooltip': true }, id: 6 },
        { slot: 'handle', attrs: { label: '操作', width: '150', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 9 }
      ])
    }
  },
  created() {
    this.getList()
    this.loading = false
    this.getChargeCategory()
  },
  methods: {
    // 获取收费类型
    getChargeCategory() {
      console.log('212222')
      listChargeCategoryOptions().then(response => {
        const chargeCategoryList = response.data
        console.log(chargeCategoryList)
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ lable: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        console.log(this.chargeCategoryOptions)
        this.searchForm[0].options = this.chargeCategoryOptions
        console.log(this.searchForm[0].options)
      })
    },
    // 查询收费项目列表
    getList() {
      console.log('查询批次列表成功')
      // this.loading = true
      listChargeProject(this.queryParams).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          // this.loading = false
        }
      )
    },
    // 表格方法
    handleUpdate(row, index) {

    },
    handleDelete() {
      this.list = []
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.payBills = Object.assign({}, defaultPayBills) // 默认值为空
    },
  }
}
</script>

<style scoped>
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

