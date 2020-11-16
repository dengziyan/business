<template>
  <div id="index">
    <dv-loading v-if="loading">Loading...</dv-loading>
    <el-container v-else>
      <el-header class="title">
        <dv-decoration-10 class="title-border1" />
        <dv-decoration-8 class="title-border2" />
        <div style="width:20%;height:5px;text-align: center;">
          <span style="font-size: 20px">慧缴数据大屏</span>
          <dv-decoration-6 style="height:30px;" />
        </div>
        <dv-decoration-8 :reverse="true" class="title-border2" />
        <dv-decoration-10 class="title-border1" />
      </el-header>
      <el-container>
        <el-aside class="leftAside">
          <h4>下辖小区</h4>
          <div class="leftAside-choose">
            <span class="txt">小区名称</span>
            <el-input v-model="input1" placeholder="模糊查询" class="search"/>
          </div>
          <el-tree
            ref="expandMenuList"
            class="expand-tree"
            :data="treeList"
            :render-content="renderContent"
            :props="defaultProps"
            node-key="id"
            highlight-current
            accordion
            :default-expand-all="true"
            :check-strictly="true"
            auto-expand-parent
            @node-click="handleNodeClick"
          />
        </el-aside>
        <el-main class="main">
          <h2>{{}}</h2>
          <div class="merchantTitle">
            <span>商户编号：{{}}</span>
            <span>物业管理人：{{}}</span>
          </div>
          <div class="merchantData">
            <span><p>今日营业收入</p><p>￥{{}}</p></span>
            <span><p>今日营收笔数</p><p>{{}}笔</p></span>
            <span><p>下辖小区数</p><p>{{}}</p></span>
          </div>
          <div class="bototm-box">
            <dv-border-box-13 style="height: 530px; width: 630px;background-color: #2F45BB;margin: 10px">
              <bottomLeft />
            </dv-border-box-13>
            <dv-border-box-12 style="height: 530px; width: 630px;background-color: #2F45BB;margin: 10px">
              <bottomRight />
            </dv-border-box-12>
          </div>
        </el-main>
        <el-aside class="rightAside">
          <span class="time">{{dateYear}} {{dateWeek}} {{dateDay}}</span>
          <h4>历史数据</h4>
          <p><span></span><span>营收金额</span><span>营收笔数</span></p>
          <p><span>总订</span><span>{{}}</span><span>{{}}</span></p>
          <p><span>今日</span><span>{{}}</span><span>{{}}</span></p>
          <p><span>近7日</span><span>{{}}</span><span>{{}}</span></p>
          <p><span>近30日</span><span>{{}}</span><span>{{}}</span></p>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane class="tab1" label="支付笔数" name="first">
              <dv-scroll-ranking-board :config="config" style="width:500px;color: black" />
            </el-tab-pane>
            <el-tab-pane class="tab1" label="支付金额" name="second">
              <dv-scroll-ranking-board :config="config" style="width:500px;color: black" />
            </el-tab-pane>
            <el-tab-pane class="tab1" label="支付占比排名" name="third">
              <dv-scroll-ranking-board :config="config" style="width:500px;color: black" />
            </el-tab-pane>
          </el-tabs>
        </el-aside>
      </el-container>
    </el-container>


  </div>
</template>

<script>
import { formatTime } from '@/utils'
// import centerRight1 from './centerRight1'
import centerRight2 from './centerRight2'
// import center from './center'
import bottomLeft from './bottomLeft'
import bottomRight from './bottomRight'
import ScreenTree from './ScreenTree'
import {listProperty, listResident} from '@/api/CommunityMag/community'
export default {
  components: { bottomLeft, bottomRight, centerRight2 },
  data() {
    return {
      config: {
        data: [
          { name: 'xx小区一期', value: 167 },
          { name: 'xx小区二期', value: 23 },
          { name: 'xx小区三期', value: 520 }
        ]
      },
      config2: {
        data: [
          { name: 'xx小区一期', value: 167 },
          { name: 'xx小区二期', value: 23 },
          { name: 'xx小区三期', value: 520 }
        ]
      },
      config3: {
        data: [
          { name: 'xx小区一期', value: 167 },
          { name: 'xx小区二期', value: 23 },
          { name: 'xx小区三期', value: 520 }
        ]
      },
      isLoadingTree: false,
      queryParams: { userId: undefined },
      activeName: 'first',
      loading: true, dateDay: null, dateYear: null, dateWeek: null, weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      treeList: [], input1: undefined,
      defaultProps: { children: 'children', label: 'name', id: 'name' },
      searchData: { // 查询参数
        pageNum: 1, pageSize: 5, userId: undefined, buildingId: undefined, communityId: undefined,
        merchantId: undefined, roomNo: undefined, unitId: undefined,
        data: { mobilePhone: undefined, residentName: undefined }
      }
    }
  },
  mounted() {
    this.loadingMain()
    this.getList()
    this.timeFn()
    this.cancelLoading()
  },
  methods: {
    loadingMain() {
      this.loading = true
      this.isLoadingTree = true
      this.getProperty()
    },
    // 获取物业菜单
    async getProperty() {
      this.queryParams.userId = this.$store.getters.id
      await listProperty(this.queryParams).then((response) => {
        this.treeList = response.data
        this.isLoadingTree = false
        this.loading = false
      })
    },
    renderContent(h, { node, data, store }) { // 加载节点
      const that = this
      // Object.assign(this.$data.query, this.$options.data().query)
      return h(ScreenTree, {
        props: { DATA: data, NODE: node, STORE: store, maxexpandId: that.non_maxexpandId },
        on: {
          nodeAdd: (s, d, n) => that.nodeAdd(s, d, n),
          nodeEdit: (s, d, n) => that.nodeEdit(s, d, n),
          nodeDel: (s, d, n) => that.nodeDelete(s, d, n)
        }
      })
    },
    // 点击节点
    handleNodeClick(d, node, s) {
      // 置空 物业 单元 楼栋 小区
      this.levels = [-1, -1, -1, -1]
      // 遍历节点信息
      this.nodeCheck(node)
      d.treeIsEdit = false// 放弃编辑状态
      // 设置选中
      this.nodeSet()
      this.loadingTable = true
      // 获取住户信息
      this.getList()
    },
    nodeCheck(node) {
      // 终止条件
      if (node.key === undefined) {
        return
      }
      // 判断level
      this.levels[node.level - 1] = node.key
      this.nodeCheck(node.parent)
    },
    nodeSet() {
      const level = this.levels
      // 物业编号
      this.searchData.merchantId = level[0] === -1 ? undefined : level[0]
      // 小区编号
      this.searchData.communityId = level[1] === -1 ? undefined : level[1]
      // 楼栋编号
      this.searchData.buildingId = level[2] === -1 ? undefined : level[2]
      // 单元编号
      this.searchData.unitId = level[3] === -1 ? undefined : level[3]
    },
    // 获取小区列表、表格信息
    getList() {
      // console.log(12345678)
      this.loadingTable = true
      this.searchData.userId = this.$store.getters.id
      this.searchData.data.mobilePhone = this.searchData.mobilePhone
      this.searchData.data.residentName = this.searchData.residentName
      // console.log(this.searchData)
      listResident(this.searchData).then((response) => {
        const row = response.data.rows || []
        this.list = row.map(function(val) {
          val.identity = val.residentIdentity
          if (val.residentIdentity !== undefined) {
            val.residentIdentity = val.residentIdentity + 0 === 1 ? '住户' : '租户'
          }
          return val
        })
        this.total = response.data.total
        this.loadingTable = false
        this.loading = false
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    timeFn() {
      setInterval(() => {
        this.dateDay = formatTime(new Date(), 'HH: mm: ss')
        // console.log(this.dateDay)
        this.dateYear = formatTime(new Date(), 'yyyy-MM-dd')
        this.dateWeek = this.weekday[new Date().getDay()]
      }, 6000)
    },
    cancelLoading() {
      setTimeout(() => {
        this.loading = false
      }, 5000)
    }
  }
}
</script>

<style lang="scss" scoped>
/*@import '../../assets/scss/index.scss';*/
  .title{
    width: 100%;
    display: flex;
  }
  .title-border1{
    width:20%;
    height:5px;
  }
  .title-border2{
    width:20%;
    height:50px;
  }
  .leftAside{
    width: 20%;
  }
  .leftAside-choose{
    display: flex;
    text-align: center;
  }
  .leftAside-choose .txt{
    margin: 10px;
  }
  .leftAside-choose .search{
    width: 50%;
    height: 30px;
    margin-bottom: 10px;
  }
  /*中间*/
  .main{
    width: 40%;
    margin-left: 3%;
    margin-right: 3%;
  }
  .main h2{
    text-align: center;
  }
  .main .merchantTitle{
    display: flex;
  }
  .merchantTitle span{
    margin-right:30%;
  }
  .main .merchantData{
    display: flex;
    justify-content: space-between;
  }
  /*右边的历史数据*/
  .rightAside{
    width: 30%;
  }
  .rightAside span{
    display: inline-block;
    width: 25%;
    margin-right: 20px;
  }
  .rightAside .time{
    width: 75%;
  }
  .bototm-box{
    /*display: flex;*/
    /*background-color: #2F45BB;*/
  }
  .tab1{
    height: 200px;
  }
.react-left {
  cursor: pointer;
  font-size: 0.225rem;
  width: 3.75rem;
  height: 0.625rem;
  line-height: 0.625rem;
  text-align: center;
  transform: skewX(-45deg);

  .react-after {
    position: absolute;
    right: -0.3125rem;
    top: 0;
    height: 0.625rem;
    width: 0.625rem;
    background-color: #0f1325;
    transform: skewX(45deg);
  }

  .text {
    display: inline-block;
    transform: skewX(45deg);
  }
}
</style>
