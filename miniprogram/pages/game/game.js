// miniprogram/pages/page/page.js
let ctx = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: 0,
    color: false,
    dprx: 1,
    dprw: 375,
    colorArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const query = wx.createSelectorQuery()
    query.select('#my-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        this.setData({
          dprw: res[0].width
        })
      })
    this.colorArr = []
    console.log(this.colorArr)
    for (let i=0;i<14;i++) {
      this.colorArr.push([])
      for (let j=0;j<14;j++) {
        this.colorArr[i][j] = 0
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawChessBoard()
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

  /**
   * 重新开始
   */
  startGame: function () {
    for (let i = 0; i < 14; i++) {
      this.colorArr[i] = []
      for (let j = 0; j < 14; j++) {
        this.colorArr[i][j] = 0
      }
    }
    this.state = 0
    this.color = false
    this.cleanChessBoard()
    this.drawAgain()
    // this.drawChessBoard()
  },

  /**
   * 绘制棋盘
   */
  drawChessBoard: function () {
    const query = wx.createSelectorQuery()
    query.select('#my-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        ctx = canvas.getContext('2d')
        canvas.width = 300
        canvas.height = 300
        const dpr = wx.getSystemInfoSync().pixelRatio
        // canvas.width = res[0].width * dpr
        // canvas.height = res[0].height * dpr
        canvas.width = 300 * dpr
        canvas.height = 300 * dpr
        ctx.scale(dpr, dpr)
        this.dprx = 300 / res[0].width
        for (let i = 0; i < 14; i++) {
          //context.strokeStyle = "#BFBFBF"
          ctx.beginPath()
          ctx.moveTo((i + 1) * 20, 20)
          ctx.lineTo((i + 1) * 20, 14 * 20)
          ctx.closePath()
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(20, (i + 1) * 20)
          ctx.lineTo(14 * 20, (i + 1) * 20)
          ctx.closePath()
          ctx.stroke()
        }
      })
  },

  drawAgain: function () {
    for (let i = 0; i < 14; i++) {
      //context.strokeStyle = "#BFBFBF"
      ctx.beginPath()
      ctx.moveTo((i + 1) * 20, 20)
      ctx.lineTo((i + 1) * 20, 14 * 20)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(20, (i + 1) * 20)
      ctx.lineTo(14 * 20, (i + 1) * 20)
      ctx.closePath()
      ctx.stroke()
    }
  },

  /** 
   * 清除棋盘
   */
  cleanChessBoard: function () {
    ctx.fillStyle = "#8f7a66";
    ctx.fillRect(0, 0, 20 * 15, 20 * 15);
  },

  /**
   * 绘制棋子
   */
  drawChess: function (x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    //context.stroke();
  },

  /**
   * 手指触摸结束
   */
  touchend: function (e) {
    let ex = e.changedTouches[0].x
    let ey = e.changedTouches[0].y

    if (ex < 20 / this.dprx || ex > 14 * 20 / this.dprx || ey < 20 / this.dprx || ey > 14 * 20 / this.dprx) {
      return
    }

    if (this.state == 1) {
      wx.showToast({
        title: 'please restart the game',
        icon: 'success',
        duration: 2000
      })
      return
    }

    var dx = Math.floor((ex * this.dprx + 10) / 20) * 20
    var dy = Math.floor((ey * this.dprx + 10) / 20) * 20

    console.log(this.colorArr[dx / 20 - 1][dy / 20 - 1] != 0)
    if (this.colorArr[dx / 20 - 1][dy / 20 - 1] != 0) {
      return
    }
    if (this.color) {
      this.color = false
      this.drawChess(dx, dy, 'white')
      this.colorArr[dx/20-1][dy/20-1] = 'white'
      this.checkWin(dx / 20 - 1, dy / 20 - 1, 'white')
    } else {
      this.color = true
      this.drawChess(dx, dy, 'black')
      this.colorArr[dx / 20 - 1][dy / 20 - 1] = 'black'
      this.checkWin(dx / 20 - 1, dy / 20 - 1, 'black')
    }
    
    console.log(this.colorArr)
  },

  /**
   * 输赢判断
   */
  checkWin: function (x, y, color) {
    let mode = [
      [1,0],
      [1,1],
      [0,1],
      [1,-1]
    ]
    for (let j=0;j<4;j++) {
      let count = 1
      for (let i = 1; i < 5; i++) {
        if (this.colorArr[x + i*mode[j][0]][y + i*mode[j][1]] == color) {
          count++
        } else {
          break
        }
      }
      for (let i = 1; i < 5; i++) {
        if (this.colorArr[x - i*mode[j][0]][y - i*mode[j][1]] == color) {
          count++
        } else {
          break
        }
      }
      if (count >= 5) {
        this.state = 1
        wx.showToast({
          title: color + ' win',
          icon: 'success',
          duration: 2000
        })
        break
      }
    }
  }
})