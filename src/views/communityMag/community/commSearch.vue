<template>
    <div>
      <search-form
        class="searchMain"
        size="mini"
        label-width="80px"
        :search-data="searchData"
        :search-form="searchForm"
        :search-handle="searchHandle"
      />
    </div>
</template>

<script>
import SearchForm from '@/components/SearchForm'
import { listResident } from '@/api/CommunityMag/community'
export default {
  name: 'CommSearch',
  components: {
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: {
        roomNo: null,
        residentName: null,
        mobilePhone: null,
      },
      searchForm: [
        { type: 'Input', label: '室', prop: 'roomNo', width: '100px', placeholder: '请输入室...' },
        { type: 'Input', label: '姓名', prop: 'residentName', width: '100px', placeholder: '请输入姓名...' },
        { type: 'Input', label: '手机号', prop: 'mobilePhone', width: '100px', placeholder: '请输入手机号码...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary',
          handle: () => {
            this.getList()
          }
        },
        { label: '重置', type: 'primary', handle: () => '' }
      ]
    }
  },

  created() {
    // this.getList()
  },
  mounted() {
    // const timer = setInterval(() => {
    //   console.log(this.searchData)
    // }, 2000)
    // // 在beforeDestroy钩子触发时清除定时器
    // this.$once('hook:beforeDestroy', () => {
    //   clearInterval(timer);
    // })
  },
  methods: {
    handleQuery() {
      // console.log('查询成功')
    },

    /** 查询用户列表 */
    getList() {
      console.log('查询成功')
      this.loading = true
      listResident(this.searchData).then(
        (response) => {
          // this.list = response.data
          this.total = response.data.total
          this.loading = false
        }
      )
    },
  }
}
</script>

<style scoped>
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
  .searchMain{
    height: 200px;
  }
</style>
