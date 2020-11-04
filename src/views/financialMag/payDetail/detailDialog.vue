<template>
  <div>
    <TableVue v-if="dialogVisible" v-loading="loading" :columns="columns" :data="list" empty-text="暂无数据">
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
  props: ['detailId', 'visible'],
  components: { TableVue },
  data() {
    return {
      dialogVisibled: this.visible,
      // table表格数据
      // loading: true,
      billId: this.detailId,
      list: [],
      total: 0, // 总条数
      columns: Object.freeze([
        { attrs: { prop: 'paymentCycle', label: '缴费周期', width: '100', align: 'center' }},
        { attrs: { prop: 'amountPayable', label: '金额', width: '100', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'amountActuallyPaid', label: '已缴金额', 'show-overflow-tooltip': true }},
        { attrs: { prop: 'paymentStatus', label: '缴费状态', 'show-overflow-tooltip': true }},
        { slot: 'handle', attrs: { label: '操作', width: '250', 'class-name': 'small-padding fixed-width', align: 'center' }}
      ])
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      console.log(this.detailId)
      getPaymentCycle(this.billId).then((response) => {
        this.list = response.data
        this.total = response.data.total
        this.loading = false
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].paymentStatus === 0) {
            this.list[i].paymentStatus = '未缴'
          } else if (this.list[i].paymentStatus === 1) {
            this.list[i].paymentStatus = '已缴'
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
