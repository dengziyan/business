<template>
  <!--新增按钮的弹框  -->
  <div>
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
import { listChargeProjectOptions, updatePayBills, listCommunityOptions } from '@/api/financialMag/payBills'
import { getToken } from '@/utils/auth'
export default {
  name: 'EditDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    editData: { type: Object, required: true }
  },
  data() {
    return {
      editVisible: this.visible,
      chargeProjectOptions: [], // 收费项目名称
      communityOptions: [], // 小区名称
      form: {
        userId: this.$store.getters.id,
        communityId: undefined,
        billName: '',
        chargeProjectId: undefined,
        chargeBeginTime: ''
      },
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'select', label: '小区', prop: 'communityId', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          { type: 'select', label: '收费项目', prop: 'chargeProjectId', size: 'small', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '账单名称', prop: 'billName', size: 'small', isDisabled: false, required: true },
          { type: 'date', label: '收费开始日期', prop: 'chargeBeginTime', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          // buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
          // admin: [{ required: true, message: '请输入楼栋管理员编号', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this.getChargeProject()
    this.getCommunity()
    this.form = Object.assign({}, this.editData)
  },
  methods: {
    // 选项：小区
    getCommunity() {
      listCommunityOptions(this.$store.getters.id).then(response => {
        this.communityOptions = response.data.map(function(val) {
          return { label: val.communityName, value: val.id }
        })
        this.formData.formItem[0].options = this.communityOptions
      })
    },
    // 选项：收费项目名称
    getChargeProject() {
      listChargeProjectOptions(this.form).then(response => {
        const cateList = response.data.rows
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.chargeProjectOptions.push({ label: cate.chargeProjectName, value: cate.id, isDisabled: false })
        }
        console.log(this.chargeProjectOptions)
        this.formData.formItem[1].options = this.chargeProjectOptions
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      this.form.billStatus = undefined
      updatePayBills(this.form).then(response => {
        if (response.code === 2000) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.editVisible = false
          this.treeIsEdit = false
          this.$parent.getProperty()
        }
      })
    },
    // 按取消键后
    cancel() {
      this.editVisible = false
      this.$emit('update:visible', this.editVisible)
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
