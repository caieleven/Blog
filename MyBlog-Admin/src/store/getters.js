const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  isLogin: state => state.user.isLogin,
  user: state => state.user.user,
  options: state => state.option.options
}
export default getters
