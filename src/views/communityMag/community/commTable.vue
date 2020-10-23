<template>
  <!--小区表格及操作组件  -->
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
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-sizes="[10,25,50]"
      @pagination="getList"
    />
  </div>
</template>

<script>
import tableHandle from './tableHandle'
import TableVue from '@/components/TableVue'
import { listResident } from '@/api/CommunityMag/community'
export default {
  name: 'CommTable',
  components: {
    tableHandle,
    TableVue
  },
  data() {
    return {
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
    // setTimeout(() => {
    //   this.list = [
    //     {
    //       communityId: '1',
    //       buildingId: '1',
    //       unitId: '1',
    //       roomNum: '1',
    //       houseArea: '600',
    //       name: '李易峰',
    //       mobilePhone: '13423518561',
    //       certificateNum: '440923199807022427',
    //       residentIdentity: '住户',
    //       createTime: '2019'
    //     },
    //     {
    //       communityId: '1',
    //       buildingId: '1',
    //       unitId: '1',
    //       roomNum: '1',
    //       houseArea: '600',
    //       name: '李易峰',
    //       mobilePhone: '13423518561',
    //       residentIdentity: '住户',
    //       certificateNum: '440923199807022427',
    //       createTime: '2019'
    //     },
    //     {
    //       communityId: '1',
    //       buildingId: '1',
    //       unitId: '1',
    //       roomNum: '1',
    //       houseArea: '600',
    //       name: '李易峰',
    //       mobilePhone: '13423518561',
    //       residentIdentity: '住户',
    //       certificateNum: '440923199807022427',
    //       createTime: '2019'
    //     },
    //     {
    //       communityId: '1',
    //       buildingId: '1',
    //       unitId: '1',
    //       roomNum: '1',
    //       houseArea: '600',
    //       name: '李易峰',
    //       mobilePhone: '13423518561',
    //       residentIdentity: '住户',
    //       certificateNum: '440923199807022427',
    //       createTime: '2019'
    //     }
    //   ]
    //   this.loading = false
    // }, 1000)
  },
  methods: {
    /** 查询用户列表 */
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
