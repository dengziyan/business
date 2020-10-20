<template>
    <div>
      <search-form
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
export default {
  name: 'CommSearch',
  components: {
    SearchForm
  },
  data() {
    return {
      // 查询表单
      searchData: {
        name: null,
        age: null,
        sex: null,
        interst: null
      },
      searchForm: [
        { type: 'Input', label: '室', prop: 'room', width: '100px', placeholder: '请输入室...' },
        { type: 'Input', label: '姓名', prop: 'name', width: '100px', placeholder: '请输入姓名...' },
        { type: 'Input', label: '手机号', prop: 'phone', width: '100px', placeholder: '请输入手机号码...' }
      ],
      searchHandle: [
        { label: '查询', type: 'primary', handle: () => '' },
        { label: '重置', type: 'primary', handle: () => '' }
      ]
    }
  }
}
</script>

<style scoped>
  /*搜索条件*/
  .ces-search{
    height: 50px;
    margin-top: 10px;
  }
</style>
