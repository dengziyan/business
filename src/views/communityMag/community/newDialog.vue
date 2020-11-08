<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" v-loading="loadingAdd" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateResident, addResident, listUserProperty } from '@/api/CommunityMag/community'

export default {
  name: 'NewDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    edit: { type: Boolean, required: true },
    editData: { type: Object, required: true }
  },
  data() {
    return {
      communityQuery: {
        userId: this.$store.getters.id
      },
      dialogVisible: this.visible,
      isEdit: this.edit,
      loadingAdd: false,
      form: {
        communityName: undefined,
        buildingName: undefined,
        unitName: undefined,
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
          { type: 'cascader', label: '小区名称', prop: 'communityName', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          // { type: 'select', label: '栋', prop: 'buildingName', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          // { type: 'select', label: '单元', prop: 'unitName', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          // { type: 'select', label: '室', prop: 'roomNo', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '建筑面积', prop: 'houseArea', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '业主姓名', prop: 'residentName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '手机号', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '证件号', prop: 'certificateNo', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '住户身份', prop: 'residentIdentity', size: 'small', isDisabled: false, required: true }
        ]
      }
    }
  },
  created() {
    this.getCommunity()
    if (this.isEdit) {
      this.form = Object.assign({}, this.editData)
    }
  },
  methods: {
    // 小区选项
    getCommunity() {
      this.loadingAdd = true
      console.log(3456789)
      listUserProperty(this.communityQuery).then(response => {
        const mercchant = response.data || []
        console.log(response.data)
        const that = this
        mercchant.map(function(val) {
          const children = val.children || []
          children.map(function(params) {
            that.communityOptions.push(params)
          })
        })
        this.formData.formItem[0].options = this.casSelect(that.communityOptions || [])
        this.loadingAdd = false
        console.log()
      })
    },
    casSelect(options) {
      const that = this
      if (options.length === 0) { return [] }
      return options.map(function(params) {
        if (params.children === undefined || params.children.length === 0) {
          const isEnable = params.level !== 5
          console.log(isEnable)
          return { label: params.name, value: params.id, disabled: isEnable }
        }
        return { label: params.name, value: params.id, children: that.casSelect(params.children) }
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updateResident(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addResident(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.getList()
          }
        })
      }
    },
    // 按取消键后
    cancel() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style scoped>

</style>
