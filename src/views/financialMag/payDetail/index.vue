<template>
  <div>
    <!--引入搜索条件子组件        -->
    <pay-detail-search />
    <!--引入表格操作子组件        -->
    <pay-detail-table />
  </div>
</template>

<script>
import payDetailSearch from './payDetailSearch'
import payDetailTable from './payDetailTable'
import {listPayDetail} from "@/api/financialMag/payDetail";
export default {
  name: 'Index',
  components: {
    payDetailSearch,
    payDetailTable
  },
  created() {
    // console.log('哈哈哈哈')
    // console.log(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>
