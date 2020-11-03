<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="submitFileForm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updatePayBills, addPayBills, listChargeCategoryOptions, listChargeProjectOptions, importTemplates, batchAddChargeBatch, batchAddBatchBills } from '@/api/financialMag/payBills'
import fileDownload from 'js-file-download'
import { getToken } from '@/utils/auth'
export default {
  name: 'NewDialog',
  components: {
    FormVue
  },
  props: ['visible'],
  data() {
    return {
      dialogVisibled: this.visible,
      // dialogVisible: false,
      chargeCategoryOptions: [], // 收费类型选项
      chargeProjectOptions: [], // 收费项目名称
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
          { type: 'select', isDisabled: false, multiple: false, label: '收费类型', tip: '', value: '', options: [] },
          { type: 'select', isDisabled: false, multiple: false, label: '收费项目名称', tip: '', value: '', options: [] },
          { type: 'text', label: '账单名称', size: 'small', isDisabled: false, placeholder: '请输入账单名称', prop: 'billName', required: true },
          { type: 'date', label: '收费开始时间', prop: 'starTime', value: '' },
          { type: 'radio', label: '账单模式', isDisabled: false, prop: 'modle', value: '', options: [{ name: '按月', value: '1' }, { name: '按年', value: '0' }] },
          { type: 'upload', label: '账单上传', isDisabled: false, value: '', fileList: [],
            upload: {
              open: false, // 是否显示弹出层（用户导入）
              title: '', // 弹出层标题（用户导入）
              isUploading: false, // 是否禁用上传
              updateSupport: 0, // 是否更新已经存在的用户数据
              // headers: { Authorization: getToken() }, // 设置上传的请求头部
              url: process.env.VUE_APP_BASE_API + '/chatgeBill/import/parkingFee' // 上传的地址
            },
            importTemplate: this.importTemplate,
            handleFileUpload: ($event) => { this.handleFileUpload($event) }
          }
        ]
      }
    }
  },
  computed: {
    listCategories() {
      return []
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
    this.getChargeCategory()
    this.getChargeProject()
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
    },
    // 获取收费类型
    getChargeCategory() {
      listChargeCategoryOptions().then(response => {
        const chargeCategoryList = response.data
        for (let i = 0; i < chargeCategoryList.length; i++) {
          const cate = chargeCategoryList[i]
          this.chargeCategoryOptions.push({ lable: cate.chargeCategoryName, value: cate.chargeCategoryName, isDisabled: false })
        }
        this.formData.formItem[0].options = this.chargeCategoryOptions
      })
    },
    // 获取收费项目名称
    getChargeProject() {
      listChargeProjectOptions().then(response => {
        const cateList = response.data.rows
        for (let i = 0; i < cateList.length; i++) {
          const cate = cateList[i]
          this.chargeProjectOptions.push({ lable: cate.chargeProjectName, value: cate.chargeProjectName, isDisabled: false })
        }
        this.formData.formItem[1].options = this.chargeProjectOptions
      })
    },
    // 下载模板
    importTemplate() {
      importTemplates(2).then(res => {
        fileDownload(res, '批量导入模板.xlsx')
      })
        .catch(err => {
          console.log(err)
        })
    },
    // 上传
    handleFileUpload(val) {
      const formData = new FormData()
      const chargeBatch = {
        billName: '2019物业费',
        chargeProjectId: 1,
        chargeBeginTime: '2019-01-01 00:00:00'
      }
      console.log(JSON.parse(JSON.stringify(chargeBatch)))
      formData.append('chargeBatch', JSON.stringify(chargeBatch))
      formData.append('file', val.file)
      console.log(val)
      batchAddBatchBills(0, 0, formData).then(res => {
        val.onSuccess()
      }).catch(res => {
        val.onError()
      })
    },
    cancel(val) {
      this.dialogVisibled = val
      this.$emit('update:visible', this.dialogVisibled)
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.form.$refs.upload[0].submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange() {
    }
  }
}
</script>

<style scoped>

</style>
