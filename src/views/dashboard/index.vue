<template>
  <div id="myChart" :style="{width: '90%', height: '360px'}" />
</template>
<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      config: { data: [
        {
          name: '南阳',
          value: 167
        },
        {
          name: '周口',
          value: 67
        },
        {
          name: '漯河',
          value: 123
        },
        {
          name: '郑州',
          value: 55
        },
        {
          name: '西峡',
          value: 98
        }
      ] },
      lastMonth: []
    }
  },
  mounted() {
    this.drawLine()
  },
  methods: {
    drawLine() {
      for (var i = 0; i < 7; i++) {
        this.lastMonth.unshift(new Date(new Date()
          .setDate(new Date().getDate() - i))
          .toLocaleDateString())
      }
      console.log(this.lastMonth)
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['最高', '最低']
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.lastMonth
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '最高',
            type: 'line',
            data: [11, 11, 15, 13, 12, 13, 10],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '最低',
            type: 'line',
            data: [1, -2, 2, 5, 3, 2, 0],
            markPoint: {
              data: [
                { name: '周最低', value: 2, xAxis: 1, yAxis: 1.5 }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' },
                [{
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                }, {
                  symbol: 'circle',
                  label: {
                    normal: {
                      position: 'start',
                      formatter: '最大值'
                    }
                  },
                  type: 'max',
                  name: '最高点'
                }]
              ]
            }
          }
        ]
      })
    }
  }
}
</script>
