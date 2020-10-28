<template>
  <!--收费项目管理表格及操作组件  -->
  <div>
    <!--引入操作子组件        -->
    <table-handle />
    <!--引入表格组件        -->
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="danger" size="mini" @click="handleDelete()">
          删除
        </el-button>
        <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
          编辑
        </el-button>
      </template>
    </TableVue>
  </div>
</template>

<script>
import tableHandle from './tableHandle'
import TableVue from '@/components/TableVue'
export default {
  name: 'PayItemsTable',
  components: {
    tableHandle,
    TableVue
  },
  data() {
    return {
      // table表格数据
      loading: true,
      list: [],
      columns: Object.freeze([
        {
          attrs: {
            prop: 'billStatus',
            label: '收费类型',
            width: '100',
            align: 'center'
          },
          id: 0
        },
        {
          attrs: {
            prop: 'communityId',
            label: '收费项目名称',
            width: '100',
            'show-overflow-tooltip': true
          },
          id: 1
        },
        {
          attrs: {
            prop: 'billName',
            label: '收费标准',
            width: '100',
            'show-overflow-tooltip': true
          },
          id: 2
        },
        {
          attrs: {
            prop: 'chargeProjectId',
            label: '标准金额',
            width: '100',
            'show-overflow-tooltip': true
          },
          id: 3
        },
        {
          attrs: {
            prop: 'chargeBeginTime',
            label: '创建人',
            'show-overflow-tooltip': true
          },
          id: 4
        },
        {
          attrs: {
            prop: 'amountPayable',
            label: '创建时间',
            width: '100',
            'show-overflow-tooltip': true
          },
          id: 5
        },
        {
          attrs: {
            prop: 'amountActuallyPaid',
            label: '备注',
            width: '100',
            'show-overflow-tooltip': true
          },
          id: 6
        },
        {
          slot: 'handle',
          attrs: {
            label: '操作',
            width: '150',
            'class-name': 'small-padding fixed-width',
            align: 'center'
          },
          id: 9
        }
      ])
    }
  },
  created() {
    this.list = [
      {
        billStatus: '已审核',
        communityId: '1',
        billName: '2020物业费',
        chargeProjectId: '物业费',
        chargeBeginTime: '20200203',
        amountPayable: '3000',
        amountActuallyPaid: '3000'
      }
    ]
    this.loading = false
  },
  methods: {
    // 表格方法
    handleUpdate(row, index) {

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
