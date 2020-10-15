<template>
  <div>
    小区信息管理
    <div class="myTrees">
      <!--引入树形控件组件      -->
      <tree-control :tree-data="treeData"/>
    </div>
    <!-- 引入表单组件   -->
    <form-icon :form-data="formData" />
    <!-- 添加或修改菜单配置对话框 -->
    <el-dialog :title="isEdit?'编辑菜单':'添加菜单'" :visible.sync="dialogVisible" width="60%">
      <el-form ref="www" :model="community" label-width="150px"  size="small">
        <el-form-item label="小区名称：" prop="name">
          <el-input v-model="community.name" />
        </el-form-item>
        <el-form-item label="小区类别：">
          <el-radio-group v-model="community.category">
            <el-radio v-for="dict in communityOptions" :key="dict.dictValue" :label="dict.dictValue">
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总户数：" prop="totalResident">
          <el-input v-model="community.totalResident" />
        </el-form-item>
        <el-form-item label="联系人：" prop="admin">
          <el-input v-model="community.admin" style="width: 80%" />
        </el-form-item>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="handleDialogConfirm()">确 定</el-button>
        </span>
      </el-form>
    </el-dialog>
    <div class="table">
      <!-- 除了需要传columns，其它api与el-table完全一致 -->
      <BaseTable v-loading="loading" :columns="columns" :data="list" empty-text="哈哈哈，我就看看没数据会怎样~">
        <!-- #是v-slot的简写，{scope: {row, $index}}是属性对象slot双重解构，注意这里的scope要与子组件插槽绑定的属性名对应 -->
        <template #handle="{scope: {row, $index}}">
          <el-button type="primary" size="mini" @click="handleUpdate(row, $index)">
            修改
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete()">
            清空
          </el-button>
        </template>
      </BaseTable>
    </div>
  </div>
</template>

<script>
import formIcon from '@/components/ElForm'
import BaseTable from '@/components/ElTable'
import TreeControl from '@/components/TreeControl'
let id = 1000
const defaultCommunity = {
  name: '',
  category: '',
  totalResident: '',
  admin: ''
}
export default {
  name: 'List',
  components: {
    formIcon,
    BaseTable,
    TreeControl
  },
  data() {
    return {
      dialogVisible: false, // 对话框是否显示
      isEdit: false, // 是否编辑
      community: Object.assign({}, defaultCommunity), // community为对话框中:model
      communityOptions: [ // 小区类别
        { dictLabel: '公寓', dictValue: 2 },
        { dictLabel: '商铺', dictValue: 1 },
        { dictLabel: '住宅', dictValue: 0 }
      ],
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
      isShow: false,
      currentData: '',
      currentNode: '',
      menuVisible: false,
      firstLevel: false,
      lastLevel: false,
      filterText: '',
      maxexpandId: 4,
      // el-form的数据
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
      // el-table的
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
        }
      ]
      this.loading = false
    }, 1000)
  },
  methods: {
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
</style>
