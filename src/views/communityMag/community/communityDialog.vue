<template>
  <!--新增按钮的弹框  -->
  <div>
    小区信息
    <!--表格组件      -->
    <FormVue ref="form" v-loading="loadingCommunity" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
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
      loadingCommunity: false,
      form: {
        userId: undefined,
        merchantId: this.requireId,
        communityName: undefined,
        category: undefined,
        admin: undefined,
        mobilePhone: undefined,
        location: undefined
      },
      isEdit: this.treeIsEdit,
      community: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '商户编号', prop: 'merchantId', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '小区名称', prop: 'communityName', size: 'small', isDisabled: false },
          { type: 'select', label: '小区类别', prop: 'category', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] },
          { type: 'text', label: '联系人', prop: 'admin', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '联系电话', prop: 'mobilePhone', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '位置信息', prop: 'location', size: 'small', isDisabled: false, required: true }
        ],
        rules: {
          communityName: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
          category: [{ required: true, message: '请选择小区类别', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入联系人编号', trigger: 'blur' }, { pattern: /\d/, message: '必须为数字值' }],
          mobilePhone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }, { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确格式' }]
        }
      }
    }
  },
  computed: {
  },
  watch: {
    buildingWatch: function(val) { this.building = val },
    isEditWatch: function(val) { this.isEdit = val },
    visibleWatch: function(val) { this.treeDialogVisible = val },
    propertyWatch: function() { this.refreshProperty() }
  },
  created() {
    this.getOptionStatusDict()
  },
  methods: {

    refresh() {
      if (this.treeIsEdit) {
        const property = this.community
        const community = this.community.community
        this.form.merchant = property.merchant
        this.form.merchantId = property.property.merchantId
        this.form.admin = community.admin
        this.form.id = community.id
        this.form.category = community.category + ''
        this.form.communityName = community.communityName
        this.form.location = community.location
        this.form.mobilePhone = property.phone
        console.log(this.form)
      }
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 获取回显字典
    getOptionStatusDict() {
      this.loadingCommunity = true
      getDictVal('tb_community_info', 'category').then(res => {
        this.formData.formItem[2].options = this.selectDictLabels(res.data)
        this.refresh()
        this.loadingCommunity = false
      })
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateCommunity(this.$store.getters.id, this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      } else { // 插入一条资源数据（即添加）
        this.form.userId = this.$store.getters.id
        // this.form.merchantId = this.requireId
        console.log(this.form)
        addCommunity(this.form).then(response => {
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
    },
    cancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
.formMain{
  height: 400px;
}
</style>
