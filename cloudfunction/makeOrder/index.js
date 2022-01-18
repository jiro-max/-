// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env :'jiro-2gj8a4en24928bf8'
})
const orders_col =db.collection('orders')
// 云函数入口函数
exports.main = async (event, context) => {
  //生成订单号
  let obj={
    order_number : Date.now(),
    carts : event.carts,
    status :0 //0代表未支付
  }
  //添加到orders集合
  let res =await orders_col.add({
    data :obj
  })

  return {
    res,
    order_number :obj.order_number
  }
}