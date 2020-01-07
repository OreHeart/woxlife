// miniprogram/pages/moodInn/moodInn.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    textArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res.result.openid)
        app.globalData.openid = res.result.openid
        this.onQuery()
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindTextAreaBlur: function (e) {
    /* this.setData({
      inputText: e.detail.value
    }) */
    console.log(this.data.inputText)
  },

  /**
   * 添加数据到数据库
   */
  onAdd: function () {
    let that = this
    console.log(this.data.inputText)
    const db = wx.cloud.database()
    db.collection('text-hearts').add({
      data: {
        count: 1,
        text: this.data.inputText
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        this.onQuery()
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 获取数据库数据
   */
  onQuery: function () {
    const db = wx.cloud.database()
    db.collection('text-hearts').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        let arr = []
        let idArr = []
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].text) {
            arr.push({ text: res.data[i].text })
            idArr.push(res.data[i]._id)
          }
        }
        this.setData({
          textArr: arr
        })
        app.globalData.idArr = idArr
        console.log(this.data.textArr)
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 删除数据库数据
   */
  onRemove: function (e) {
    let index = e.currentTarget.dataset['index']
    if (app.globalData.idArr[index]) {
      const db = wx.cloud.database()
      db.collection('text-hearts').doc(app.globalData.idArr[index]).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.onQuery()
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  },

  /**
   * 修改数据
   */
  onChangeData: function () {
    const db = wx.cloud.database()
    const newCount = this.data.count + 1
    db.collection('counters').doc(app.globalData.idArr[0]).update({
      data: {
        text: this.data.inputText
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },

  bindFormSubmit: function (e) {
    this.onAdd()
  },

  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  }

})