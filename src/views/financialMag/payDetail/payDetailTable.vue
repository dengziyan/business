<template>
  <!--收费详情管理表格及操作组件  -->
  <div>
    <search-form size="mini" label-width="80px" :search-data="searchData" :search-form="searchForm" :search-handle="searchHandle" />
    <!--引入操作子组件        -->
    <table-handle />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!--  文字按钮    -->
      <template #handle2="{scope: { row }}">
        <el-button type="text" @click="handleDetail(row)">详情</el-button>
      </template>
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleReject(row, 0)">同意</el-button>
        <el-button type="primary" size="mini" @click="handleReject(row, 1)">拒绝</el-button>
        <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
        <el-button type="primary" size="mini" @click="handleEdit(row, $index)">编辑</el-button>
      </template>
    </TableVue>
    <!--  分页  -->
    <pagination v-show="total>0" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" :page-sizes="[10,25,50]" @pagination="getList" />
    <!--点击详情后出现的弹框    -->
    <el-dialog title="周期详情" :visible.sync="dialogVisible" width="800px">
      <!--弹框子组件      -->
      <detail-dialog :visible.sync="dialogVisible" :detailId="detailId"/>
    </el-dialog>
  </div>
</template>

<script>
import tableHandle from './tableHandle'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import { listPayDetail } from '@/api/financialMag/payDetail'
import DetailDialog from './detailDialog'
export default {
  name: 'PayBillsTable',
  components: { DetailDialog, tableHandle, TableVue, SearchForm },
  data() {
    return {
      // 查询表单
      searchData: {
        pageNum: 1, pageSize: 10,
        communityId: null,
        billName: null,
        billStatus: null,
        beginTime: null,
        endTime: null,
        batchId: null
      },
      dialogVisible: '',
      searchForm: [// multiple:是否开启多选
        { type: 'Select', isDisabled: false, multiple: false, label: '小区', prop: 'communityId', value: '车位停车费', options: [] },
        { type: 'Select', isDisabled: false, multiple: false, label: '账单名称', prop: 'billName', value: '车位停车费', options: [] },
        { type: 'Input', label: '房屋（栋-单元-室/车位号/车牌号）', prop: 'buildingName', width: '100px', placeholder: '请输入账单名称...' },
        { type: 'Input', label: '审核状态', prop: 'approvalStatus', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: this.getList },
        { label: '重置', type: 'primary', handle: this.resetForm }
      ],
      // table表格数据
      total: 0, loading: true, list: [], dialogVisible: false, detailId: 0, // 表单参数
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
        { slot: 'handle', attrs: { label: '操作', width: '220', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
    this.loading = false
  },
  methods: {
    // 表格重置
    resetForm() {
      Object.assign(this.$data.searchData, this.$options.data().searchData)
    },
    // 查询详情列表
    getList() {
      this.loading = true
      this.searchData.batchId = this.$route.params.id
      listPayDetail(this.searchData).then(
        (response) => {
          this.list = response.data.rows
          // console.log(response.data)
          for (let i = 0; i < this.list.length; i++) {
            this.list[i].billName = this.$route.params.billName
            this.list[i].projectName = this.$route.params.projectName
            this.list[i].amountActuallyPaid = response.data.amountActuallyPaid[i]
            // 判断 审核状态
            if (this.list[i].approvalStatus === 0) {
              this.list[i].approvalStatus = '待审核'
            } else if (this.list[i].approvalStatus === 1) {
              this.list[i].approvalStatus = '已审核'
            }
          }
          // console.log(this.list)
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 表格方法
    handleDetail(row) {
      this.dialogVisible = true
      this.detailId = row.id
      // console.log(this.detailId)
    },
    handleReject(row, index) {
      // this.dialogVisible = true
      // this.isEdit = false
      // this.payBills = Object.assign({}, defaultPayBills) // 默认值为空
    },
    handleEdit(row, index) {

    },
    handleDelete() {
      this.list = []
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
