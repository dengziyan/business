<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" v-loading="loadingAdd" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateResident, addResident, listUserProperty } from '@/api/CommunityMag/community'
import { getDictVal } from '@/api/system/logininfor'

export default {
  name: 'NewDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    edit: { type: Boolean, required: true },
    editInfo: { type: Object, required: true }
  },
  data() {
    return {
      userId: this.$store.getters.id,
      property: [],
      dialogVisible: this.visible,
      isEdit: this.edit,
      loadingAdd: false,
      statusOptions: [],
      form: {
        community: undefined,
        buildingId: undefined,
        unitId: undefined,
        roomNo: undefined,
        houseArea: undefined,
        residentName: undefined,
        mobilePhone: undefined,
        certificateNo: undefined,
        residentIdentity: undefined
      },
      communityOptions: [],
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'cascader', label: '小区名称', prop: 'propertyName', size: 'small', isDisabled: this.edit, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '业主姓名', prop: 'residentName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '手机号', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '证件号', prop: 'certificateNo', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '住户身份', prop: 'residentIdentity', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [], required: true }
        ]
      }
    }
  },
  created() {
    this.isEditData()
  },
  methods: {
    isEditData() {
      this.getOperationStatusDict()
      this.getCommunity()
      if (this.isEdit) {
        const edit = this.editInfo
        this.property.push(edit.communityId)
        this.property.push(edit.buildingId)
        this.property.push(edit.unitId)
        this.property.push(edit.roomId)
        this.editInfo.propertyName = this.property
        this.editInfo.residentIdentity = this.editInfo.identity + ''
        this.form = Object.assign({}, this.editInfo)
      }
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_resident_info', 'resident_identity').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 小区选项
    getCommunity() {
      this.loadingAdd = true
      listUserProperty(this.userId).then(response => {
        const merchant = response.data || []
        const that = this
        merchant.map(function(val) {
          const children = val.children || []
          children.map(function(params) {
            that.communityOptions.push(params)
          })
        })
        this.formData.formItem[0].options = this.casSelect(that.communityOptions || [])
        this.formData.formItem[4].options = that.statusOptions
        this.loadingAdd = false
      })
    },
    casSelect(options) {
      const that = this
      if (options.length === 0) { return [] }
      return options.map(function(params) {
        if (params.level === 5) { return { label: params.name, value: params.id, disabled: params.disable } }
        if (params.children === undefined || params.children.length === 0) { return { label: params.name, value: params.id, disabled: true } }
        return { label: params.name, value: params.id, children: that.casSelect(params.children) }
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      console.log(this.form)
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        const resident = Object.assign({}, this.form)
        resident.propertyName = undefined
        updateResident(resident).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.cancel()
          }
        })
      } else { // 插入一条资源数据（即添加）
        const resident = Object.assign({}, this.form)
        resident.propertyName = undefined
        const property = {
          userId: this.userId,
          communityId: this.form.propertyName[0],
          buildingId: this.form.propertyName[1],
          unitId: this.form.propertyName[2],
          roomId: this.form.propertyName[3],
          data: JSON.stringify(resident)
        }
        addResident(property).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
        this.dialogVisible = false
      }
    },
    // 按取消键后
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
  .formMain{
    height: 200px;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    /*height: 30px;*/
  }
</style>
