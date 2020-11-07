<template>
  <!--新增按钮的弹框  -->
  <div>
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="submitFileForm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { listChargeCategoryOptions, listChargeProjectOptions, importTemplates, batchAddChargeBatch, batchAddBatchBills } from '@/api/financialMag/payBills'
import fileDownload from 'js-file-download'
import { getToken } from '@/utils/auth'
export default {
  name: 'NewDialog',
  components: { FormVue },
  props: ['visible'],
  data() {
    return {
      dialogVisibled: this.visible,
      chargeCategoryOptions: [], // 收费类型选项
      chargeProjectOptions: [], // 收费项目名称
      form: {
        chargeCategoryName: '',
        chargeProjectName: '',
        billName: '',
        chargeBeginTime: '',
        modle: '',
        billUpload: ''
      },
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
          { type: 'select', label: '收费类型', prop: 'chargeCategoryName', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          { type: 'select', label: '收费项目名称', prop: 'chargeProjectName', isDisabled: false, multiple: false, tip: '', value: '', options: [] },
          { type: 'text', label: '账单名称', prop: 'billName', size: 'small', isDisabled: false, placeholder: '请输入账单名称', value: '', required: true },
          { type: 'date', label: '收费开始时间', prop: 'chargeBeginTime', value: '' },
          { type: 'radio', label: '账单模式', prop: 'modle', isDisabled: false, value: '', options: [{ name: '按月', value: '1' }, { name: '按年', value: '0' }] },
          { type: 'upload', label: '账单上传', prop: 'billUpload', isDisabled: false, value: '', fileList: [],
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
    // 获取收费类型
    getChargeCategory() {
      const userId = {
        userId: this.$store.getters.id
      }
      listChargeCategoryOptions(userId).then(response => {
        const chargeCategoryList = response.data.rows
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
      importTemplates(this.form.chargeCategoryName).then(res => {
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
        billName: this.form.billName,
        chargeProjectId: this.form.chargeProjectName,
        chargeBeginTime: this.form.chargeBeginTime
      }
      listChargeProjectOptions(chargeBatch).then(response => {
        chargeBatch.chargeProjectId = response.data.rows[0].id
        console.log(JSON.parse(JSON.stringify(chargeBatch)))
        formData.append('chargeBatch', JSON.stringify(chargeBatch))
        formData.append('file', val.file)
        console.log(this.form)
        batchAddBatchBills(this.$store.getters.id, this.form.modle, formData).then(res => {
          val.onSuccess()
        }).catch(res => {
          val.onError()
        })
      })
    },
    cancel(val) {
      this.dialogVisibled = val
      this.$emit('update:visible', this.dialogVisibled)
    },
    // 对话框按确定键之后提交上传文件
    submitFileForm() {
      this.$refs.form.$refs.upload[0].submit()
      console.log(this.form)
    }
  }
}
</script>

<style scoped>

</style>
