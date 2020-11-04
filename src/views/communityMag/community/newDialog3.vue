<template>
  <!--新增按钮的弹框  -->
  <div>
    单元
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateUnit, addUnit } from '@/api/CommunityMag/community'
import { getToken } from '@/utils/auth'
export default {
  name: 'NewDialog3',
  components: { FormVue },
  props: ['visible'],
  data() {
    return {
      treeDialogVisible: this.visible,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '小区名称', size: 'small', isDisabled: false, prop: 'communityName', required: true },
          { type: 'text', label: '栋名称', size: 'small', isDisabled: false, prop: 'buildingName', required: true },
          { type: 'text', label: '单元名称', size: 'small', isDisabled: false, prop: 'unitName', required: true },
          { type: 'text', label: '楼栋管理员/编号', size: 'small', isDisabled: false, prop: 'affiliationId', required: true },
          { type: 'date', label: '创建时间', prop: 'createTime', value: '' }
        ],
        rules: {
          unitName: [
            { required: true, message: '请输入单元名称', trigger: 'blur' }
          ]
        }
      }
    }
  },
  // watch: {
  //   dialogVisibled(val) {
  //     console.log(this.visible)
  //     // 设置监听，如果改变就更新
  //     this.$emit('update:visible', val)
  //   }
  // },
  created() {
  },
  computed: {
  },
  methods: {
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateUnit(this.unit).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.treeDialogVisible = false
            this.getList()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addUnit(this.uidnit).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.treeDialogVisible = false
            this.getList()
          }
        })
      }
    },
    cancel(val) {
      this.treeDialogVisible = val
      this.$emit('update:visible', this.treeDialogVisible)
    }
  }
}
</script>

<style scoped>
.formMain{
  height: 400px;
}
</style>
