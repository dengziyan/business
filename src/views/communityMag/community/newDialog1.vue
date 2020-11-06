<template>
  <!--新增按钮的弹框  -->
  <div>
    小区信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain"/>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel(false)">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">新建</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateCommunity, addCommunity } from '@/api/CommunityMag/community'
import { getDictVal } from '@/api/system/logininfor'
export default {
  name: 'NewDialog1',
  components: { FormVue },
  props: ['visible', 'requireId'],
  data() {
    return {
      treeDialogVisible: this.visible,
      form: {
        merchantId: this.requireId,
        communityName: '',
        category: '',
        admin: '',
        mobilePhone: '',
        location: ''
      },
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '商户Id', prop: 'merchantId', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '小区名称', prop: 'communityName', size: 'small', isDisabled: false },
          { type: 'select', label: '小区类别', prop: 'category', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] },
          { type: 'text', label: '联系人', prop: 'admin', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '联系电话', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '位置信息', prop: 'location', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          communityName: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
          category: [{ required: true, message: '请选择小区类别', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入联系人编号', trigger: 'blur' }],
          mobilePhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
        }
      }
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
    console.log(this.requireId)
    this.getOptionStatusDict()
  },
  computed: {
  },
  methods: {
    // 获取回显字典
    getOptionStatusDict() {
      getDictVal('tb_community_info', 'category').then(res => {
        this.formData.formItem[2].options = this.selectDictLabels(res.data)
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateCommunity(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.treeDialogVisible = false
            this.getOptionStatusDict()
          }
        })
      } else { // 插入一条资源数据（即添加）
        addCommunity(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '添加成功！',
              type: 'success'
            })
            this.treeDialogVisible = false
            this.getOptionStatusDict()
          }
        })
      }
    },
    cancel(val) {
      this.treeDialogVisible = val
      this.$emit('update:visible', this.treeDialogVisible)
      // this.$refs.form.clearValidate()
      // this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
.formMain{
  height: 400px;
}
</style>
