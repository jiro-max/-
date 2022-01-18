//获取购物车数据库
const db =wx.cloud.database()
const carts_col = db.collection('carts')
import{ml_showSuccess}from '../../utils/asyncWX'
Page({
  data :{
    carts :[] ,//购物车数据
    totalCount:0,
    totalPrice:0
  },
  onLoad(){
    this.loadCartsData()
  },
  async loadCartsData(){
    let res = await carts_col.get()
    console.log('carts' , res)
    this.setData({
      carts : res.data
    })
    this.setCart(res.data)//统计总数
  },
  //统计总数
  setCart(carts){
    let totalCount=0
    let totalPrice=0

    carts.forEach(v =>{
      totalCount += v.num
      totalPrice += v.num*v.price
    })
    
    this.setData({
      totalCount,
      totalPrice,
    })
  },
  //加一
  async addCount(e){
    //获取id
    let id = e.currentTarget.dataset.id
    //修改num数量
    let res =await carts_col.doc(id).update({
      data:{
        num :db.command.inc(1)
      }
    })
    this.loadCartsData()
    await ml_showSuccess('添加成功')
  },
  //删除商品
  async deleteCount(e){
    //获取商品id
    let id = e.currentTarget.dataset.id
    //修改num数量
    let res =await carts_col.doc(id).update({
      data:{
        num :db.command.inc(-1)
      }
    })
    console.log('res ----',res)
    console.log('id-------',e.currentTarget.dataset.num)
    await ml_showSuccess('删除成功')
    let num=await carts_col.doc(id).num
    console.log('num的值',num)
    if( num === 0 )
    {
      console.log('商品数量为0')
    }
    this.loadCartsData()
  },
  //支付
  async startpay(){
    //发起订单
    let res1=await wx.cloud.callFunction({
      name : 'makeOrder',
      data :{
        carts : this.data.carts
      }
    })
    console.log('发起订单',res1)
    await ml_showSuccess('发起订单成功')
    const {  order_number } =res1.result
    console.log('订单号',order_number)

    //预支付
    wx.cloud.callFunction({
      name : 'pay',
      data :{
        order_number
      }
    })

    //
    wx.requestPayment({
      nonceStr: 'nonceStr',
      package: 'package',
      paySign: 'paySign',
      timeStamp: 'timeStamp',
    })

    //
    wx.cloud.callFunction({
      name :'updateStatus',
      data :{
        order_number
      }
    })
  },
  //点击当前页面触发tab
  onTabItemTap(){
    console.log('123456tab')
    wx.setTabBarBadge({
      index: 1,
      text: ' ',
    })
    this.loadCartsData()
  }
})