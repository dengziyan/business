<template>
  <!--新增按钮的弹框  -->
  <div>
    楼栋信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateBuilding, addBuilding } from '@/api/CommunityMag/community'
import { getToken } from '@/utils/auth'
export default {
  name: 'BuildingDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    editBuilding: { type: Object, required: true },
    requireId: { type: Number, required: true },
    treeIsEdit: { type: Boolean, required: true }
  },
  data() {
    return {
      treeDialogVisible: this.visible,
      form: {
        communityId: this.requireId,
        buildingName: '',
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
  created() {
    // console.log('this.editBuilding')
    // console.log(this.requireId)
    // console.log(this.editBuilding.buildingName)
    this.reflesh()
    // this.form.buildingName = this.editBuilding.buildingName
    // this.form = this.editBuilding.admin
  },
  computed: {
    listCategories() {
      return []
    }
  },
  methods: {
    reflesh() {
      if (this.treeIsEdit) {
        // console.log(2345678)
        // this.form = Object.assign({}, this.editBuilding)
        console.log(this.editBuilding)
        this.form = Object.assign({}, this.editBuilding)
      }
    },
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
            this.treeIsEdit = false
            this.$parent.getProperty()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addBuilding(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.treeDialogVisible = false
            Object.assign(this.$data.form, this.$options.data().form)
            this.$parent.getProperty()
          }
        })
      }
    },
    // 按取消键后
    cancel() {
      this.treeDialogVisible = false
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
