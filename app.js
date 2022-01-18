// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env:'jiro-2gj8a4en24928bf8'
    })
  },
  globalData: {
    userInfo: null
  }
})
