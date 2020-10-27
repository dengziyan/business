<template>
  <!-- 各个操作按钮 -->
  <div>
    <el-radio-group v-model="search.billStatus" @change="getList">
      <el-radio-button
        v-for="dict in statusOptions"
         :key="dict.dictValue"
         :label="dict.dictLabel"
         :value="dict.dictValue">
      </el-radio-button>
    </el-radio-group>
<!--    <el-button-group>-->
<!--      <el-button @click="getAll">全部</el-button>-->
<!--      <el-button @click="change0" v-model="search.enabled">待审核</el-button>-->
<!--      <el-button @click="change1">已审核</el-button>-->
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
import { listPayBills } from '@/api/financialMag/payBills'
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
      isEdit: false,
      statusOptions: [{ dictLabel: '全部', dictValue: 2 }, { dictLabel: '待审核', dictValue: 0 }, { dictLabel: '已审核', dictValue: 1 }], // 状态数据字典
      search: {
        billStatus: undefined
      }
    }
  },
  methods: {
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.payBills = Object.assign({}, defaultPayBills) // 默认值为空
    },
    getList() {
      console.log('查询批次列表成功')
      listPayBills(this.search).then(
        (response) => {
          this.list = response.data
          this.total = response.data.total
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
