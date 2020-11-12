<template>
  <!--新增按钮的弹框  -->
  <div>
    单元信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
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
  props: {
    requireId: { type: Number, required: true },
    visible: { type: Boolean, required: true },
    editInfo: { type: Object, required: true },
    treeIsEdit: { type: Boolean, required: true },
    refreshProperty: { type: Function, default: null }
  },
  data() {
    return {
      treeDialogVisible: this.visible,
      form: {
        userId: undefined,
        buildingId: this.requireId,
        unitName: undefined,
        createTime: undefined
      },
      isEdit: this.treeIsEdit,
      unit: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '栋编号', prop: 'buildingId', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '单元名称', prop: 'unitName', size: 'small', isDisabled: false, required: true },
          // { type: 'text', label: '楼栋管理员/编号', prop: 'affiliationId', size: 'small', isDisabled: false, required: true },
          { type: 'date', label: '创建时间', prop: 'createTime', value: '' }
        ],
        rules: {
          unitName: [{ required: true, message: '请输入单元名称', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this.refresh()
  },
  computed: {
  },
  methods: {
    refresh() {
      if (this.treeIsEdit) {
        console.log(this.editInfo)
        const unit = this.unit.unit
        this.form.id = unit.id
        this.form.unitName = unit.unitName
        this.form.createTime = unit.createTime
      }
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateUnit(this.$store.getters.id, this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      } else { // 插入一条资源数据（即添加）
        this.form.userId = this.$store.getters.id
        addUnit(this.form).then(response => {
          console.log(this.form)
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      }
    },
    // 按取消键后
    cancel() {
      this.$emit('update:visible',false)
      Object.assign(this.$data.form, this.$options.data().form)
    }
  }
}
</script>

<style scoped>
.formMain{
  height: 400px;
}
</style>
