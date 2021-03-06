const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  userName: state => state.user.userName,
  email: state => state.user.email,
  mobilePhone: state => state.user.mobilePhone,
  createDate: state => state.user.createDate,
  gender: state => state.user.gender,
  baseUrl: state => state.user.baseUrl
}
export default getters
