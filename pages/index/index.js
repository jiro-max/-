//获取数据库
const db = wx.cloud.database()
//获取集合
const goods_col = db.collection('goods')
const carts_col = db.collection('carts')
//引入异步
import {ml_showLoading,ml_showToast,ml_hideLoading,ml_showSuccess} from '../../utils/asyncWX.js'
Page({
  data :{
    goods:[],//商品列表数据
    _page:0,
    hasmore : true,
    swipers:[]
  },
  onLoad(){
    this.setTabBar()
    this.loadSwipersData()
    this.loadListData()
  },
  //加载轮播图
  //请求访问量前三的商品
  async loadSwipersData(){
    let res =await goods_col.orderBy('count','desc').limit(3).get()
    console.log('轮播图',res)
    this.setData({
      swipers:res.data
    })
  },
  //加载列表数据
  async loadListData(){
    const LIMIT = 5
    let{_page,goods}=this.data//0

    /*wx.showLoading({//加载
      title: 'Loading...',
    })*/
    await ml_showLoading

    let res = await goods_col.limit(LIMIT).skip(_page * LIMIT).get()

    //wx.hideLoading()//隐藏加载
    await ml_hideLoading
    //手动停止下拉刷新
    wx.stopPullDownRefresh()
   
    console.log('列表数据',res.data)
    this.setData({
      goods :[...goods,...res.data],//追加，与之前数据拼接
      _page: ++_page,
      hasmore : res.data.length === LIMIT
    })
  },
  //上拉刷新
  onReachBottom(){
    //没有跟多数据可以刷新
    if(!this.data.hasmore)
    {
      /*wx.showToast({
        title: '没有更多数据了',
        icon : "none"
      })*/
      ml_showToast('没有更多数据了')
      return console.log('没有数据了')
    }
    console.log('上拉刷新')
    this.loadListData()
  },
  //下拉刷新
  onPullDownRefresh(){
    this.setData({
      goods : [],
      _page :0,
      hasmore :true
    })
    this.loadListData()
    console.log('下拉刷新')
  },
  //加入购物车
  async addCart(e){
    //拿到商品
    let { item }=e.currentTarget.dataset
    console.log('item' ,item)
    //判断商品在不在购物车里面
    try{
      let res =await carts_col.doc(item._id).get()
      console.log('有数值',res)
      //有值
      await carts_col.doc(item._id).update({
        data:{
          num :db.command.inc(1)
        }
      })
    }
    catch(err){
      console.log('没有值')
      //把该商品加到购物车里面
      await carts_col.add({
        data :{
          _id :item._id,
          imageSrc : item.imageSrc,
          price : item.price,
          title : item.title,
          num :1
        }
      })
    }
   this.setTabBar()
    await ml_showSuccess('下单成功')
  },
  //修改tebbar右上角数值
  async setTabBar(){
    let total=0
    let res=await carts_col.get()

    res.data.forEach(v => {
      total += v.num
    })
    if(total === 0) return
    //console.log('123333333333')
    wx.setTabBarBadge({
      index: 1,
      text: total + '',//转换成字符串
    })
  }
})