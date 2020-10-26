<template>
  <!-- 各个操作按钮 -->
  <div>
<!--    <el-button-group>-->
<!--      <el-button>全部</el-button>-->
<!--      <el-button>待审核</el-button>-->
<!--      <el-button>已审核</el-button>-->
<!--    </el-button-group>-->
    <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    <!--点击新增后出现的弹框    -->
    <el-dialog :title="isEdit?'编辑用户':'添加用户'" :visible.sync="dialogVisible" width="30%">
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
  }
}
</script>

<style scoped>

</style>
