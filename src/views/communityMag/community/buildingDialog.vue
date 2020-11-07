<template>
  <!--新增按钮的弹框  -->
  <div>
    楼栋信息
    <!--表格组件      -->
    <FormVue ref="form" :form-data="formData" :form="form" class="formMain" />
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel()">取 消</el-button>
      <el-button type="primary" size="small" @click="handleDialogConfirm()">确定</el-button>
    </span>
  </div>
</template>

<script>
import FormVue from '@/components/FormVue'
import { updateBuilding, addBuilding } from '@/api/CommunityMag/community'
export default {
  name: 'BuildingDialog',
  components: { FormVue },
  props: {
    visible: { type: Boolean, required: true },
    editBuilding: { type: Object, required: true },
    requireId: { type: Number, required: true },
    treeIsEdit: { type: Boolean, required: true },
    refreshProperty: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      treeDialogVisible: this.visible,
      form: {
        communityId: this.requireId,
        buildingName: undefined,
        admin: undefined
      },
      isEdit: this.treeIsEdit,
      building: this.editBuilding,
      formData: {
        labelWidth: '100px', inline: false, labelPosition: 'right', size: 'small',
        formItem: [
          { type: 'text', label: '小区编号', prop: 'communityId', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '楼栋名称', prop: 'buildingName', size: 'small', isDisabled: false, required: true },
          { type: 'text', label: '楼栋管理员', prop: 'admin', size: 'small', isDisabled: false, required: true }
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
    refresh() {
      if (this.treeIsEdit) {
        const building = this.building.building
        const community = this.building.community
        this.form.communityId = community.id
        this.form.admin = building.admin
        this.form.id = building.id
        this.form.buildingName = building.buildingName
      }
    },
    propertyRefresh() {
      if (this.refreshProperty) {
        this.refreshProperty()
      }
    },
    // 对话框按确定键之后的方法
    handleDialogConfirm() {
      console.log(this.isEdit)
      if (this.isEdit) { // 更新资源数据（即编辑修改）
        const building = this.form
        updateBuilding(building).then(response => {
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
        addBuilding(this.form).then(response => {
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
    height: 400px;
  }
</style>
