<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" v-loading="loading" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { listUserProperty } from '@/api/CommunityMag/community'
import { addPayDetail, updatePayDetail } from '@/api/financialMag/payDetail'

export default {
  name: 'NewDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    edit: { type: Boolean, required: true },
    editInfo: { type: Object, required: true },
    newDialogBatchId: { type: Number, required: true }
  },
  data() {
    return {
      dialogVisible: this.visible,
      isEdit: this.edit,
      property: [],
      loading: false,
      communityOptions: [],
      form: {
        id: undefined,
        paymentCycle: undefined,
        communityId: undefined,
        buildingId: undefined,
        unitId: undefined,
        roomId: undefined,
        propertyName: undefined,
        residentName: undefined,
        mobilePhone: undefined,
        amount: undefined,
        note: undefined
      },
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'cascader', label: '小区', prop: 'propertyName', size: 'small', isDisabled: this.edit, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '姓名', prop: 'residentName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '手机号', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '应缴', prop: 'amount', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '账单周期', prop: 'paymentCycle', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '备注', prop: 'note', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          paymentCycle: [{ required: true, message: '请输入账单周期', trigger: 'blur' }, { min: 4, max: 6, message: '长度在 4 到 6 个数字', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this.getCommunity()
    if (this.isEdit) {
      const edit = this.editInfo
      this.property.push(edit.communityId)
      this.property.push(edit.buildingId)
      this.property.push(edit.unitId)
      this.property.push(edit.roomId)
      this.editInfo.propertyName = this.property
      this.form.id = this.editInfo.id
      this.form.propertyName = this.editInfo.propertyName
      this.form.residentName = this.editInfo.residentName
      this.form.mobilePhone = this.editInfo.mobilePhone
      this.form.amount = this.editInfo.amount
      this.form.paymentCycle = this.editInfo.paymentCycle
      this.form.note = this.editInfo.note
      console.log(this.form)
    }
  },
  methods: {
    // 小区选项
    async getCommunity() {
      this.loading = true
      listUserProperty(this.$store.getters.id).then((response) => {
        console.log(response)
        const merchant = response.data || []
        const that = this
        merchant.map(function(val) {
          const children = val.children || []
          children.map(function(params) {
            that.communityOptions.push(params)
          })
        })
        this.loading = false
        this.formData.formItem[0].options = this.casSelect(that.communityOptions || [])
      })
    },
    casSelect(options) {
      const that = this
      if (options.length === 0) { return [] }
      return options.map(function(params) {
        if (params.level === 5) { return { label: params.name, value: params.name, disabled: params.disable } }
        if (params.children === undefined || params.children.length === 0) { return { label: params.name, value: params.name, disabled: true } }
        return { label: params.name, value: params.name, children: that.casSelect(params.children) }
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        const resident = Object.assign({}, this.form)
        resident.propertyName = undefined
        updatePayDetail(resident).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        })
      } else { // 插入一条资源数据（即添加）
        console.log(this.newDialogBatchId)
        const property = {
          userId: this.userId,
          communityName: this.form.propertyName[0],
          buildingName: this.form.propertyName[1],
          unitName: this.form.propertyName[2],
          roomNo: this.form.propertyName[3],
          amount: this.form.amount,
          residentName: this.form.residentName,
          mobilePhone: this.form.mobilePhone,
          note: this.form.note,
          paymentCycle: this.form.paymentCycle,
          batchId: this.newDialogBatchId
        }
        addPayDetail(property).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.$emit('getList')
            this.cancel()
          }
        })
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
    height: 230px;
  }
  .dialog-footer{
    display: flex;
    justify-content: space-between;
    /*height: 30px;*/
  }
</style>
