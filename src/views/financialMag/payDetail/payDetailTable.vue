<template>
  <!--收费详情管理表格及操作组件  -->
  <div>
    <search-form
      size="mini"
      label-width="80px"
      :search-data="searchData"
      :search-form="searchForm"
      :search-handle="searchHandle"
    />
    <!--引入操作子组件        -->
    <table-handle />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleReject(row, $index)">
          拒绝
        </el-button>
        <el-button type="danger" size="mini" @click="handleDelete()">
          删除
        </el-button>
        <el-button type="primary" size="mini" @click="handleEdit(row, $index)">
          编辑
        </el-button>
      </template>
    </TableVue>
    <!--点击审核后出现的弹框    -->
    <el-dialog title="收费详情管理" :visible.sync="dialogVisible" width="30%">
      <!--弹框子组件      -->
      <pay-detail />
    </el-dialog>
  </div>
</template>

<script>
import tableHandle from './tableHandle'
import TableVue from '@/components/TableVue'
import SearchForm from '@/components/SearchForm'
import PayDetail from '../payDetail'
import { listPayDetail } from '@/api/financialMag/payDetail'
export default {
  name: 'PayBillsTable',
  components: {
    tableHandle,
    TableVue,
    PayDetail,
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: {
        communityId: null,
        billName: null,
        billStatus: null,
        beginTime: null,
        endTime: null,
        batchId: null
      },
      searchForm: [
        {
          type: 'Select',
          isDisabled: false,
          // 是否开启多选
          multiple: false,
          label: '小区',
          prop: 'communityId',
          value: '车位停车费',
          options: []
        },
        {
          type: 'Select',
          isDisabled: false,
          // 是否开启多选
          multiple: false,
          label: '账单名称',
          prop: 'billName',
          value: '车位停车费',
          options: [
            { name: '2020物业费', value: '2020物业费', isDisabled: false }
          ]
        },
        { type: 'Input', label: '房屋（栋-单元-室/车位号/车牌号）', prop: 'buildingName', width: '100px', placeholder: '请输入账单名称...' },
        { type: 'Input', label: '审核状态', prop: 'approvalStatus', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: () => '' },
        { label: '重置', type: 'primary', handle: () => '' }
      ],
      // table表格数据
      loading: true,
      list: [],
      dialogVisible: false,
      columns: Object.freeze([
        { attrs: { prop: 'approvalStatus', label: '审核状态', width: '80', align: 'center' }, id: 0 },
        { attrs: { prop: 'communityName', label: '小区', width: '60', 'show-overflow-tooltip': true }, id: 1 },
        { attrs: { prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { attrs: { prop: 'buildingName', label: '房屋（栋-单元-室/车位号/车牌号）', width: '100', 'show-overflow-tooltip': true }, id: 3 },
        { attrs: { prop: 'chargeProjectName', label: '收费项目', width: '100', 'show-overflow-tooltip': true }, id: 4 },
        { attrs: { prop: 'residentName', label: '姓名', width: '70', 'show-overflow-tooltip': true }, id: 5 },
        { attrs: { prop: 'mobliePhone', label: '手机号', width: '100', 'show-overflow-tooltip': true }, id: 6 },
        { attrs: { prop: 'amountPayable', label: '应缴金额', width: '80', 'show-overflow-tooltip': true }, id: 7 },
        { attrs: { prop: 'amountActuallyPaid', label: '实缴金额', width: '80', 'show-overflow-tooltip': true }, id: 8 },
        { attrs: { prop: 'paymentStatus', label: '缴费状态', width: '80', 'show-overflow-tooltip': true }, id: 9 },
        { attrs: { label: '周期详情', width: '80', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 10 },
        { attrs: { prop: 'note', label: '备注', width: '80', 'show-overflow-tooltip': true }, id: 11 },
        { attrs: { prop: 'createTime', label: '创建时间', width: '100', 'show-overflow-tooltip': true }, id: 12 },
        { slot: 'handle', attrs: { label: '操作', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 13 }
      ])
    }
  },
  created() {
    this.getList()
    this.loading = false
  },
  methods: {
    // 查询详情列表
    getList() {
      this.loading = true
      this.searchData.batchId = this.$route.params.id
      console.log(this.searchData)
      listPayDetail(this.searchData).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 表格方法
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
