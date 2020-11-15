<template>
  <!--新增按钮的弹框  -->
  <div>
    室信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { addRoom } from '@/api/CommunityMag/community'
export default {
  name: 'NewDialog4',
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
      room: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '单元', prop: 'unit', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '室号', prop: 'roomNo', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '房屋面积', prop: 'houseArea', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          roomNo: [{ required: true, message: '请输入室号', trigger: 'blur' }],
          houseArea: [{ required: true, message: '请输入房屋面积', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      const room = this.room.room
      this.form.unitId = room.property.unit
      this.form.unit = room.unit
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() { // 插入一条资源数据（即添加）
      this.$refs.form.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.userId = this.$store.getters.id
          addRoom(this.form).then(response => {
            if (response.code === 2000) {
              this.$message({
                message: response.message,
                type: 'success'
              })
              this.cancel()
              this.propertyRefresh()
            }
          })
        }
      })
    },
    // 按取消键后
    cancel() {
      this.$emit('update:visible', false)
      Object.assign(this.$data.form, this.$options.data().form)
    }
  }
}
</script>

<style scoped>
  .formMain{
    height: 130px;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    /*height: 30px;*/
  }
</style>
