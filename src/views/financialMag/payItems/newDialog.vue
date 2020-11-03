<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue :form-data="formData" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'


export default {
  name: 'NewDialog',
  components: {
    FormVue
  },
  data() {
    return {
      formData: {
        rules: {
          // userName: [
          //   { required: true, message: '请输入用户名', trigger: 'blur'}
          // ]
        },
        labelWidth: '100px',
        inline: false,
        labelPosition: 'right',
        size: 'small',
        formItem: [
          {
            type: 'select',
            isDisabled: false,
            // 是否开启多选
            multiple: false,
            label: '收费类型',
            prop: 'chargeCategoryName',
            value: '车位停车费',
            options: [
              { name: '物业费', value: '物业费', isDisabled: false },
              { name: '水费', value: '水费', isDisabled: false },
              { name: '电费', value: '电费', isDisabled: false },
              { name: '车位停车费', value: '车位停车费', isDisabled: false }
            ]
          },
          {
            type: 'select',
            isDisabled: false,
            // 是否开启多选
            multiple: false,
            label: '收费项目名称',
            prop: 'chargeProjectName',
            value: '物业费1',
            options: [
              { name: '物业费1', value: '物业费1', isDisabled: false },
              { name: '水费1', value: '水费1', isDisabled: false },
              { name: '电费1', value: '电费1', isDisabled: false },
              { name: '车位停车费1', value: '车位停车费1', isDisabled: false }
            ]
          },
          { type: 'text', label: '账单名称', size: 'small', isDisabled: false, placeholder: '请输入账单名称', prop: 'billName', required: true },
          { type: 'date', label: '收费开始时间', prop: 'starTime', value: '' },
          { type: 'radio', label: '账单模式', isDisabled: false, prop: 'modle', value: '', options: [{ name: '按月', value: '1' }, { name: '按年', value: '0' }] },
          { type: 'upload', label: '账单上传', isDisabled: false, value: '' }
        ]
      }
    }
  },
  methods: {
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        updatePayBills(this.user).then(response => {
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
        addPayBills(this.user).then(response => {
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
    }
  }
}
</script>

<style scoped>
  .formMain{
    height: 400px;
  }
</style>
