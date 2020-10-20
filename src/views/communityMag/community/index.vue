<template>
  <div>
    <!--    <TreeControl :tree-data="treeData"/>-->
    <!--    <FormVue :form-data="formData" />-->
    <div class="tree">
      <!--引入树形控件组件      -->
      <tree />
    </div>
    <div class="table">
      住户信息
      <div class="detail">
        <!--引入搜索条件组件        -->
        <search-form
          size="mini"
          label-width="80px"
          :search-data="searchData"
          :search-form="searchForm"
          :search-handle="searchHandle"
        />
        <!--引入操作子组件        -->
        <Handle></Handle>
        <!--引入表格组件        -->
        <TableVue v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
          <!-- 下面是上面的简写，#是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
          <template #handle="{scope: {row, $index}}">
            <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
              修改
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete()">
              清空
            </el-button>
          </template>
        </TableVue>
      </div>
    </div>
  </div>
</template>

<script>
// import FormVue from '@/components/FormVue'
// import TreeControl from '@/components/TreeControl'
import Handle from '@/components/Handle'
import SearchForm from '@/components/SearchForm'
import Tree from '@/components/Tree'
import TableVue from '@/components/TableVue'
const id = 1000
export default {
  components: {
    // FormVue,
    // TreeControl,
    Handle,
    SearchForm,
    Tree,
    TableVue
  },
  data() {
    // const sexs = [{ label: '男', value: 'M' }, { label: '女', value: 'F' }]
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
      ],
      // form数据
      formData: {
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        labelWidth: '100px',
        inline: false,
        labelPosition: 'right',
        size: 'small',
        formItem: [
          { type: 'text', label: '用户名', isDisabled: false, placeholder: '请输入用户名', prop: 'userName', value: '6666', required: true },
          { type: 'password', label: '密码', isDisabled: false, placeholder: '请输入密码', prop: 'password', value: '', required: true },
          { type: 'radio', label: '性别', isDisabled: false, prop: 'sex', value: '', options: [{ name: '男', value: '1' }, { name: '女', value: '0' }] },
          { type: 'switch', label: '状态', isDisabled: false, prop: 'status', value: '0' },
          {
            type: 'radioButton',
            isDisabled: true,
            label: '选择城市',
            prop: 'city',
            value: 'huaian',
            options: [
              { name: '上海', value: 'shanghai' },
              { name: '北京', value: 'beijing' },
              { name: '淮安', value: 'huaian' }
            ]
          },
          {
            type: 'checkbox',
            isDisabled: false,
            label: '爱好',
            prop: 'hoppies',
            value: [],
            options: [
              { name: '游戏', value: 'LOL', isDisabled: true },
              { name: '健身', value: 'fitness', isDisabled: false },
              { name: '娱乐', value: 'bath', isDisabled: false },
              { name: 'Code', value: 'code', isDisabled: true }
            ]
          },
          {
            type: 'select',
            isDisabled: false,
            // 是否开启多选
            multiple: false,
            label: '选择语言',
            prop: 'languages',
            value: [],
            options: [
              { name: 'JavaScript', value: 'JavaScript', isDisabled: true },
              { name: 'Java', value: 'Java', isDisabled: false },
              { name: 'Python', value: 'Python', isDisabled: false },
              { name: 'C#', value: 'C#', isDisabled: false },
              { name: 'C', value: 'C', isDisabled: false },
              { name: 'Go', value: 'Go', isDisabled: false },
              { name: 'PHP', value: 'PHP', isDisabled: false }
            ]
          },
          {
            type: 'cascader',
            label: '地址',
            prop: 'dizhi',
            isMore: { multiple: false },
            isDisabled: false,
            value: [],
            options: [
              {
                value: 'js',
                label: '江苏省',
                children: [
                  {
                    value: 'nanjing',
                    label: '南京市'
                  },
                  {
                    value: 'suzhou',
                    label: '苏州市'
                  },
                  {
                    value: 'wuxi',
                    label: '无锡市'
                  },
                  {
                    value: 'huaian',
                    label: '淮安市',
                    children: [
                      {
                        value: 'pjpq',
                        label: '清江浦区'
                      },
                      {
                        value: 'hyq',
                        label: '淮阴区'
                      }
                    ]
                  }
                ]
              },
              {
                value: 'sh',
                label: '上海市',
                children: [
                  {
                    value: 'pudong',
                    label: '浦东新区'
                  },
                  {
                    value: 'xuhui',
                    label: '徐汇区'
                  },
                  {
                    value: 'minhang',
                    label: '闵行区'
                  },
                  {
                    value: 'songjiang',
                    label: '松江区',
                    children: [
                      {
                        value: 'dongjing',
                        label: '洞泾'
                      },
                      {
                        value: 'jiuting',
                        label: '九亭'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          { type: 'date', label: '日期', prop: 'starTime', value: '' },
          { type: 'time', label: '时间', prop: 'time', value: '' },
          { type: 'dateTime', label: '日期时间', prop: 'dateTime', value: '' },
          { type: 'datetimerange', label: '范围选择器', prop: 'datetimerange', value: '' }
        ]
      },
      // 树形控件的数据
      treeData: [
        {
          id: 1,
          label: '一级 2',
          isEdit: true,
          children: [{
            id: 3,
            label: '二级 2-1',
            isEdit: true,
            children: [{
              id: 4,
              isEdit: true,
              label: '三级 3-1-1'
            }, {
              id: 5,
              isEdit: true,
              label: '三级 3-1-2',
              disabled: true
            }]
          }, {
            id: 2,
            isEdit: true,
            label: '二级 2-2',
            disabled: true,
            children: [{
              id: 6,
              isEdit: true,
              label: '三级 3-2-1'
            }, {
              id: 7,
              isEdit: true,
              label: '三级 3-2-2',
              disabled: true
            }]
          }]
        }
      ],
      // table表格数据
      loading: true,
      list: [],
      columns: Object.freeze([
        {
          attrs: {
            prop: 'date',
            label: '日期',
            width: '150',
            align: 'center'
          },
          id: 1
        },
        {
          attrs: {
            prop: 'author',
            label: '作者',
            width: '110',
            'show-overflow-tooltip': true
          },
          id: 2
        },
        {
          attrs: {
            prop: 'des',
            label: '简要描述',
            'show-overflow-tooltip': true
          },
          id: 3
        },
        {
          slot: 'handle',
          attrs: {
            label: '操作',
            width: '230',
            'class-name': 'small-padding fixed-width',
            align: 'center'
          },
          id: 4
        }
      ])
    }
  },
  created() {
    setTimeout(() => {
      this.list = [
        {
          date: '2020-10-13',
          author: '南巢',
          name: '李易峰',
          des: '我是南方来的燕啊，为何也会迷恋北方的寒。'
        },
        {
          date: '2019-05-14',
          author: '测试超出文本显示是否正常测试超出文本显示是否正常测试超出文本显示是否正常测试超出文本显示是否正常',
          des: '我是南方来的燕啊，为何也会迷恋北方的寒。'
        },
        {
          date: '2019-02-14',
          author: '自卑感',
          des: '低头瞥见自己的影子在前疯狂的跑着躲的离你不远沉默走的路不知几个光年我还原地打转连微笑也腼腆一事无成是最好描述要怎么往前'
        },
        {
          date: '2019-02-14',
          author: '自卑感',
          des: '低头瞥见自己的影子在前疯狂的跑着躲的离你不远沉默走的路不知几个光年我还原地打转连微笑也腼腆一事无成是最好描述要怎么往前'
        },
        {
          date: '2019-02-14',
          author: '自卑感',
          des: '低头瞥见自己的影子在前疯狂的跑着躲的离你不远沉默走的路不知几个光年我还原地打转连微笑也腼腆一事无成是最好描述要怎么往前'
        }
      ]
      this.loading = false
    }, 1000)
  },
  methods: {
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

<style lang="scss" scoped>
    /*左边的树*/
  .tree{
    float: left;
    width: 20%;
  }
    /* 右边的住户信息 */
  .table{
    float: right;
    width: 78%;
    padding-top: 20px;
    margin-left: 10px;
  }
  .detail{
    border:1px solid #BFBFBF;
  }

  .myTrees {
    width: 288px;
    background: rebeccapurple;
  }

  .el-tree {
    background: aquamarine;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  /*搜索条件*/
  .ces-search{
    height: 50px;
  }
</style>
