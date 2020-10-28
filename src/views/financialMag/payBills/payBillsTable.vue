<template>
  <!--收费批次管理表格及操作组件  -->
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
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~" >
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="primary" size="mini" @click="handleCheck(row, $index)">
          审核
        </el-button>
        <el-button type="danger" size="mini" @click="handleDelete()">
          删除
        </el-button>
        <el-button type="primary" size="mini" @click="handleEdit(row, $index)">
          编辑
        </el-button>
      </template>
    </TableVue >
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="searchData.pageNum"
      :limit.sync="searchData.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { addDateRange } from '@/utils/userright'
import SearchForm from '@/components/SearchForm'
import tableHandle from './tableHandle'
import TableVue from '@/components/TableVue'
import { listPayBills } from '@/api/financialMag/payBills'

export default {
  name: 'PayBillsTable',
  components: {
    tableHandle,
    TableVue,
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        chargeBeginTime: null,
        communityId: null,
        billName: null
      },
      searchForm: [
        { type: 'datetimerange', label: '账单开始日期', prop: 'chargeBeginTime', width: '1000px' },
        { type: 'Input', label: '小区', prop: 'communityId', width: '100px', placeholder: '请输入小区...' },
        { type: 'Input', label: '账单名称', prop: 'billName', width: '100px', placeholder: '请输入账单名称...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary',
          handle: () => {
            this.getList()
          }
        },
        { label: '重置', type: 'primary',
          handle: () => {
            this.resetForm('queryForm')
            this.handleQuery()
          }
        }
      ],
      // table表格数据
      // loading: true,
      list: [],
      total: 0, // 总条数
      dialogVisible: false,
      columns: Object.freeze([
        { attrs: { prop: 'billStatus', label: '账单状态', width: '100', align: 'center' }, id: 0 },
        { attrs: { prop: 'communityId', label: '小区', width: '100', 'show-overflow-tooltip': true }, id: 1 },
        { attrs: { prop: 'billName', label: '账单名称', width: '100', 'show-overflow-tooltip': true }, id: 2 },
        { attrs: { prop: 'chargeProjectId', label: '收费项目', width: '100', 'show-overflow-tooltip': true }, id: 3 },
        { attrs: { prop: 'chargeBeginTime', label: '收费开始日期', width: '154', 'show-overflow-tooltip': true }, id: 4 },
        { attrs: { prop: 'amountPayable', label: '应缴金额', width: '100', 'show-overflow-tooltip': true }, id: 5 },
        { attrs: { prop: 'amountActuallyPaid', label: '实缴金额', width: '100', 'show-overflow-tooltip': true }, id: 6 },
        { attrs: { prop: 'reviewer', label: '审核人', width: '100', 'show-overflow-tooltip': true }, id: 7 },
        { attrs: { prop: 'reviewTime', label: '审核时间', width: '154', 'show-overflow-tooltip': true }, id: 8 },
        { slot: 'handle', attrs: { label: '操作', width: '', 'class-name': 'small-padding fixed-width', align: 'center' }, id: 9 }
      ])
    }
  },
  created() {
    this.getList()
    // this.loading = false
  },
  methods: {
    handleQuery() {
      this.getList()
    },
    // 查询批次列表
    getList() {
      console.log('查询批次列表成功')
      // this.loading = true
      console.log(this.searchData.chargeBeginTime)
      listPayBills(this.addDateRange(this.searchData, this.searchData.chargeBeginTime)).then(
        (response) => {
          this.list = response.data.rows
          this.total = response.data.total
          // this.loading = false
        }
      )
    },
    // 表格方法
    handleCheck(row, index) {
      this.$router.push({ path: '/payDetail' })
    },
    handleEdit(row, index) {
      console.log(row, index)
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
