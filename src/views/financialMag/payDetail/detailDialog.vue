<template>
  <div>
    <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
      <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
      <template #handle="{scope: {row, $index}}">
        <el-button type="danger" size="mini" @click="handleDelete()">删除</el-button>
        <el-button type="primary" size="mini" @click="handleEdit(row, $index)">编辑</el-button>
      </template>
    </TableVue>
  </div>
</template>
<script>
import TableVue from '@/components/TableVue'
import { getPaymentCycle } from '@/api/financialMag/payDetail'
export default {
  name: 'DetailDialog',
  props: ['detailId'],
  components: { TableVue },
  data() {
    return {
      // table表格数据
      // loading: true,
      quary: {
        billId: this.detailId
      },
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'billStatus', label: '缴费周期', width: '100', align: 'center' }},
        { attrs: { prop: 'communityId', label: '金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'reviewTime', label: '缴费状态', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '250', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      console.log(this.detailId)
      getPaymentCycle(this.quary).then((response) => {
        this.list = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
