<template>
  <!-- 各个操作按钮 -->
  <div>
    <el-button-group>
      <el-row :gutter="10" class="mb8">
        <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新建</el-button>
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleAnyCheck">批量审核
        </el-button>
        <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入
        </el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
        </el-button>
        <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
      </el-row>
    </el-button-group>
    <!--点击新增后出现的弹框    -->
    <el-dialog v-if="dialogVisible" :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="30%">
      <!--弹框子组件      -->
      <new-dialog />
    </el-dialog>
  </div>
</template>

<script>
import newDialog from './newDialog'
const defaultPayBills = {

}
export default {
  name: 'CommHandle',
  components: {
    newDialog
  },
  data() {
    return {
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      checkAll: false,
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.payBills = Object.assign({}, defaultPayBills) // 默认值为空
    },
    handleAnyCheck() {

    },
    handleImport() {

    },
    handleExport(){

    }
  }
}
</script>

<style scoped>

</style>
