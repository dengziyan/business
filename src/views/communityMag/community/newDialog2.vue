<template>
  <!--新增按钮的弹框  -->
  <div>
    楼栋信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateBuilding, addBuilding } from '@/api/CommunityMag/community'
import { getToken } from '@/utils/auth'
export default {
  name: 'NewDialog2',
  components: { FormVue },
  props: ['visible', 'requireId'],
  data() {
    return {
      treeDialogVisible: this.visible,
      form: {
        communityId: this.requireId,
        admin: ''
      },
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '小区编号', prop: 'communityId', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '楼栋名称', prop: 'buildingName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '楼栋管理员', prop: 'admin', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入楼栋管理员编号', trigger: 'blur' }]
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
    listCategories() {
      return []
    }
  },
  methods: {
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateBuilding(this.form).then(response => {
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
        // this.form.communityId = this.requireId
        addBuilding(this.form).then(response => {
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
    // 按取消键后
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
