<template>
  <!--小区表格及操作组件  -->
  <div>
    <!-- 各个操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新增</el-button>
      <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入</el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出</el-button>
      <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>
    </el-row>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
        <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">编辑</el-button>
      </template>
    </TableVue>
    <!--分页    -->
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :page-sizes="[10,25,50]" @pagination="getList"/>
  </div>
</template>

<script>
import TableVue from '@/components/TableVue'
import { listResident } from '@/api/CommunityMag/community'
export default {
  name: 'CommTable',
  components: {
    TableVue
  },
  data() {
    return {
      // 操作按钮
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      checkAll: false,
      dialogVisible: false,
      isEdit: false,
      // 表格
      total: 0, // 总条数
      // table表格数据
      loading: true,
      list: [],
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        userId: this.$store.getters.id || 1,
        buildingId: undefined, //
        communityId: undefined,
        data: {
          mobilePhone: '1',
          residentName: undefined
        },
        merchantId: undefined,
        roomNo: undefined,
        unitId: undefined
      },
      columns: Object.freeze([
        { attrs: { prop: 'communityName', label: '小区', width: '50', align: 'center' }, id: 0 },
        { attrs: { prop: 'buildingName', label: '栋', width: '50', 'show-overflow-tooltip': true }, id: 1 },
        { attrs: { prop: 'unitName', label: '单元', width: '50', 'show-overflow-tooltip': true }, id: 2 },
        { attrs: { prop: 'roomNo', label: '室', width: '50', 'show-overflow-tooltip': true }, id: 3 },
        { attrs: { prop: 'houseArea', label: '建筑面积', width: '80', 'show-overflow-tooltip': true }, id: 4 },
        { attrs: { prop: 'residentName', label: '姓名', width: '70', 'show-overflow-tooltip': true }, id: 5 },
        { attrs: { prop: 'mobilePhone', label: '手机号', 'show-overflow-tooltip': true }, id: 6 },
        { attrs: { prop: 'certificateNo', label: '证件号', 'show-overflow-tooltip': true }, id: 7 },
        { attrs: { prop: 'residentIdentity', label: '住户身份', width: '100', 'show-overflow-tooltip': true }, id: 8 },
        { attrs: { prop: 'createTime', label: '创建时间', width: '100', 'show-overflow-tooltip': true }, id: 9 },
        { slot: 'handle', attrs: { label: '操作', width: '180', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 10 }
      ])
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询住户列表 */
    getList() {
      // console.log('用户id是'+this.$store.getters.id)
      this.loading = true
      listResident(this.queryParams).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 表格方法
    handleUpdate(row, index) {
      console.log(row, index)
    },
    handleDelete() {
      this.list = []
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.user = Object.assign({}, defaultUser) // 默认值为空
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
.el-row{
  margin-left: 10px !important;
}
.el-table{
  width: 98% !important;
  border-right: none !important;
}
</style>
