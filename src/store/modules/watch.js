
const state = {
  queryParamsTest: {
    chargeBeginTime: '',
    communityId: '',
    billName: '',
    pageNum: 1,
    pageSize: 10
  },
  hah: 'hah'
}

const mutations = {
  watchQueryParams(state, all) {
    state.queryParamsTest = all
    console.log(state.queryParamsTest)
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
