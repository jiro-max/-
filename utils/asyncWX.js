//显示加载框
export const ml_showLoading = () =>{
  return new Promise((resolve)=>{
    wx.showLoading({
      title: 'Loading...',
      success :resolve
    })
  })
}
//隐藏加载框
export const ml_hideLoading = () =>{
  return new Promise((resolve)=>{
    wx.hideLoading({
      success :resolve
    })
  })
}
//提示无数据
export const ml_showToast = (title) =>{
  return new Promise((resolve)=>{
    wx.showToast({
      title,
      icon : 'none' ,
      success :resolve
    })
  })
}

//提示下单成功
export const ml_showSuccess = (title) =>{
  return new Promise((resolve)=>{
    wx.showToast({
      title,
      success :resolve
    })
  })
}
