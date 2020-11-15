<template>
  <!--新增按钮的弹框  -->
  <div>
    楼栋信息
    <!--表格组件      -->
    <FormVue v-loading="loadingBuilding" ref="form" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确认</el-button>
    </span>
  </div>
</template>

<script>
import {
  listUserLink
} from '@/api/authoraty/user'
import FormVue from '@/components/FormVue'
import { updateBuilding, addBuilding } from '@/api/CommunityMag/community'
export default {
  name: 'BuildingDialog',
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
      loadingBuilding:false,
      form: {
        userId: undefined,
        communityId: this.requireId,
        buildingName: undefined,
        admin: undefined
      },
      isEdit: this.treeIsEdit,
      building: this.editInfo,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '小区名称', prop: 'community', size: 'small', isDisabled: true, required: true },
          { type: 'text', label: '楼栋名称', prop: 'buildingName', size: 'small', isDisabled: false, required: true },
          { type: 'select', label: '楼栋管理员', prop: 'admin', size: 'small', tip: '', value: '', isDisabled: false, multiple: false, options: [] }
        ],
        rules: {
          buildingName: [{ required: true, message: '请输入楼栋名称', trigger: 'blur' }],
          admin: [{ required: true, message: '请输入楼栋管理员编号', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
    listCategories() {
      return []
    }
  },
  watch: {
    buildingWatch: function(val) {
      this.building = val
    },
    isEditWatch: function(val) {
      this.isEdit = val
    },
    visibleWatch: function(val) {
      this.treeDialogVisible = val
    },
    propertyWatch: function() {
      this.refreshProperty()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      this.loadingBuilding = true
      const building = this.building.building
      await listUserLink(this.$store.getters.id, building.admin || undefined).then(res => {
        const option = res.data || []
        this.formData.formItem[2].options = option.map(function(val) {
          return { value: val.id, label: val.userAccount }
        })
      })
      if (this.treeIsEdit) {
        this.form.community = this.building.community
      } else {
        this.form.community = building.community
      }
      this.form.id = building.id || ''
      this.form.admin = building.admin || ''
      this.form.buildingName = building.buildingName
      this.loadingBuilding = false
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      if (this.treeIsEdit) { // 更新资源数据（即编辑修改）
        updateBuilding(this.$store.getters.id, this.form).then(response => {
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
        addBuilding(this.form).then(response => {
          if (response.code === 2000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.cancel()
            this.propertyRefresh()
          }
        })
      }
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
    height: 140px;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    /*height: 30px;*/
  }
</style>
