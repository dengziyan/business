<template>
  <!--收费详情管理表格及操作组件  -->
  <div class="main">
    <search-form size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入操作子组件        -->
    <el-button-group>
      <el-row :gutter="10" class="mb8">
        <el-button type="primary" icon="el-icon-plus" size="mini" :disabled="!multiple" @click="handleAdd">新建</el-button>
        <!--        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleAnyCheck">批量审核-->
        <!--        </el-button>-->
        <!--        <el-button type="info" icon="el-icon-upload2" size="mini" :disabled="!multiple" @click="handleImport">导入-->
        <!--        </el-button>-->
        <el-button type="warning" icon="el-icon-download" size="mini" :disabled="!multiple" @click="handleExport">导出
        </el-button>
        <!--        <el-checkbox v-model="checkAll">导出所有数据</el-checkbox>-->
      </el-row>
    </el-button-group>
    <!--点击新增后出现的弹框    -->
    <el-dialog :title="newdialoEdit?'编辑收费详情':'添加收费详情'" :visible.sync="newdialogVisible" :edit.sync="newdialoEdit" width="700px">
      <!--弹框子组件      -->
      <new-dialog v-if="newdialogVisible" :visible.sync="newdialogVisible" :edit.sync="newdialoEdit" :edit-info="editInfo" :new-dialog-batch-id="newDialogBatchId" />
    </el-dialog>
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!--  文字按钮    -->
      <template #handle2="{scope: { row }}" type="expand">
        <el-button type="text" @click="handleDetail(row)">详情</el-button>
      </template>
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-check" @click="handleReject(row, 1)">同意</el-button>
        <el-button v-if="!row.isShow" size="mini" type="text" icon="el-icon-circle-close" @click="handleReject(row, 2)">拒绝</el-button>
        <el-button size="mini" type="text" icon="el-icon-delete" :disabled="row.isShow" @click="handleDelete(row)">删除</el-button>
        <el-button size="mini" type="text" icon="el-icon-edit" :disabled="row.isShow" @click="handleEdit(row, $index)">编辑</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[5,25,50]" @pagination="getList" />
    <!--点击详情后出现的弹框    -->
    <el-dialog title="周期详情" :visible.sync="dialogVisible" width="800px">
      <!--弹框子组件      -->
      <detail-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :detail-id="detailId" />
    </el-dialog>
  </div>
</template>

<script>
import newDialog from './newDialog'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import { listPayDetail, exportChargeBill, deleteById } from '@/api/financialMag/payDetail'
import DetailDialog from './detailDialog'
import moment from 'moment'
import fileDownload from 'js-file-download'
import { getDictVal } from '@/api/system/logininfor'
import { listCommunityOptions, toReview } from '@/api/financialMag/payBills'
export default {
  components: { DetailDialog, newDialog, TableVue, SearchForm },
  data() {
    return {
      statusOptions: [], // 状态数据字典
      editInfo: {}, // 编辑相关数据
      newDialogBatchId: undefined,
      loading: false,
      chargeBill: { communityId: undefined, billName: undefined, billStatus: undefined, beginTime: undefined,
        endTime: undefined, batchId: undefined
      },
      query: { userId: undefined, data: {}},
      // 操作按钮
      single: true, multiple: true, checkAll: false, dialogVisible: false, isEdit: false,
      newdialogVisible: false, newdialoEdit: false,
      // 查询表单
      searchData: {
        pageNum: 1, pageSize: 5, communityId: undefined, billName: undefined, billStatus: undefined,
        beginTime: undefined, endTime: undefined, batchId: undefined
      },
      searchForm: [// multiple:是否开启多选
        { type: 'Select', isDisabled: false, multiple: false, label: '小区', prop: 'communityId', value: '车位停车费', options: [], change: this.getList },
        { type: 'Select', isDisabled: false, multiple: false, label: '账单名称', prop: 'billName', value: '车位停车费', options: [], change: this.getList },
        { type: 'Input', label: '房屋（栋-单元-室/车位号/车牌号）', prop: 'buildingName', width: '100px', placeholder: '' },
        { type: 'Input', label: '审核状态', prop: 'approvalStatus', width: '100px', placeholder: '' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getListData },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // table表格数据
      total: 0, list: [], detailId: 0, // 表单参数
      columns: Object.freeze([
        { attrs: { prop: 'approvalStatus', label: '审核状态', width: '80', align: 'center' }},
        { attrs: { prop: 'communityName', label: '小区', width: '60', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'buildingName', label: '房屋（栋-单元-室/车位号/车牌号）', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'projectName', label: '收费项目', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'residentName', label: '姓名', width: '70', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'mobilePhone', label: '手机号', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amount', label: '应缴金额', width: '80', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amountActuallyPaid', label: '实缴金额', width: '80', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'paymentStatus', label: '缴费状态', width: '80', 'show-overflow-tooltip': true }},
        { slot: 'handle2', attrs: { label: '周期详情', width: '80', 'class-name': 'small-padding fixed-width', align: 'center' }},
        { attrs: { prop: 'note', label: '备注', width: '80', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'createTime', label: '创建时间', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '140', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.newDialogBatchId = this.$route.query.id
    this.getOperationStatusDict()
    this.getCommunity()
    // console.log(this.newDialogBatchId)
  },
  mounted() {
    // 第一种方法
    if (window.name === 'isReload' || this.$route.query.id === undefined) {
      this.$router.replace('/payBills')
    } else if (window.name === '') {
      window.name = 'isReload' // 在首次进入页面时我们可以给window.name设置一个固定值
    }
  },
  destroyed() {
    window.name = ''
    // console.log('销毁')
  },
  methods: {
    // 选项：小区
    getCommunity() {
      this.loading = true
      listCommunityOptions(this.$store.getters.id).then(response => {
        this.communityOptions = response.data.map(function(val) {
          return { label: val.communityName, value: val.id }
        })
        this.searchForm[0].options = this.communityOptions
      })
      this.getList()
    },
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 获取回显字典
    getOperationStatusDict() {
      getDictVal('tb_charge_bill', 'payment_status').then(res => {
        this.statusOptions = this.selectDictLabels(res.data || [])
      })
    },
    // 详情按钮
    handleDetail(row) {
      this.dialogVisible = true
      this.detailId = row.id
      // console.log(this.detailId)
    },
    handleReject(row, status) {
      toReview(this.$store.getters.id, row.id, status).then(
        res => {
          if (res.code === 2000) {
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.getList()
          }
        }
      )
    },
    getListData() {
      this.loading = true
      this.getList()
    },
    // 查询详情列表
    async getList() {
      this.searchData.batchId = this.$route.query.id
      // console.log(this.searchData.batchId)
      await listPayDetail(this.searchData).then(
        (response) => {
          this.list = response.data.rows
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].billName = this.$route.query.billName
            this.list[i].projectName = this.$route.query.projectName
            this.list[i].amountActuallyPaid = response.data.amountActuallyPaid[i]
            // 判断 审核状态
            if (this.list[i].approvalStatus === 0) {
              this.list[i].isShow = false
              this.list[i].approvalStatus = '待审核'
            } else if (this.list[i].approvalStatus === 1) {
              this.list[i].isShow = true
              this.list[i].approvalStatus = '已审核'
            }
            // 判断 缴费状态
            // 显示账单状态
            this.list[i].paymentStatus = this.statusOptions.filter(
              item => item.value - 0 === this.list[i].paymentStatus
            ).map(function(val) {
              return val.label
            })[0]
          }
          this.total = response.data.total
        }
      )
      this.loading = false
    },
    // 编辑按钮
    handleEdit(row, index) {
      this.newdialogVisible = true
      this.newdialoEdit = true
      this.editInfo = Object.assign({}, row)
    },
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除这一条账单详情?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          deleteById(row.id).then(res => {
            if (res.code === 2000) {
              that.$message({
                message: '删除成功',
                type: 'success'
              })
            }
            that.getList()
          })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(function() {
        })
    },
    // 按添加按钮，弹出对话框
    handleAdd() {
      this.newdialogVisible = true
      this.newdialoEdit = false
    },
    handleAnyCheck() {

    },
    handleImport() {

    },
    handleExport() {
      this.query.userId = this.$store.getters.id
      exportChargeBill(this.query).then(res => {
        // console.log(res)
        const sysDate = moment(new Date()).format('YYYY-MM-DDHHmm')
        // console.log(sysDate)
        fileDownload(res, sysDate + '账单数据.xlsx')
      })
    }
  }
}
</script>

<style scoped>
  .main{
    margin: 20px;
  }
  .el-row{
    margin-left: 10px !important;
  }
  .el-table{
    width: 98% !important;
    border-right: none !important;
  }
</style>
