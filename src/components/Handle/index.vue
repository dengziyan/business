<template>
  <!-- 各个操作按钮 -->
  <el-row :gutter="10" class="mb8">
    <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
    <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleTopUpdate">修改
    </el-button>
    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
    </el-button>
    <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入
    </el-button>
    <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
    </el-button>
    <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
  </el-row>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      checkAll: false,
      dialogVisible: false,
      isEdit: false
    }
  },
  methods: {
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.user = Object.assign({}, defaultUser) // 默认值为空
    },
    // 按修改键弹出对话框（传入当前行的数据）
    handleTopUpdate() {
      console.log(this.updataData)
      this.handleUpdate(this.updataData[0])
    },
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          return delUser(userIds)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      if (this.checkAll) {
        queryParams.pageNum = undefined
        queryParams.pageSize = undefined
        queryParams.type = 'all'
      }
      this.$confirm('是否确认导出用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          exportUser(queryParams).then(res => {
            console.log(res)
            const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
            console.log(sysDate)
            fileDownload(res, sysDate + '用户信息表.xlsx')
          })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(function() {
        })
    }
  }
}
</script>

<style scoped>

</style>
