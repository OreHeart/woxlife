// miniprogram/pages/printer/printer.wxml.js
const options = {
  connectTimeout: 20000,
  clientId: 'test',
  username: 'admin',
  password: 'admin',
  clean: true
}
let mqtt = require('../../libs/mqtt.js')
let client = {}

var Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  // public method for encoding
  , encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      }
      else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    } // Whend 

    return output;
  } // End Function encode 


  // public method for decoding
  , decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    } // Whend 

    output = Base64._utf8_decode(output);

    return output;
  } // End Function decode 


  // private method for UTF-8 encoding
  , _utf8_encode: function (string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    } // Next n 

    return utftext;
  } // End Function _utf8_encode 

  // private method for UTF-8 decoding
  , _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    } // Whend 

    return string;
  } // End Function _utf8_decode 

}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mtopic: '/printers/pSSto04rvSJPNqTVt7p3qHLhquIxMjtbN37Rcf5m8DzyM5Mj/',
    ip: '127.0.0.1:3000',
    state: false,
    printerState: 'free',
    bedTemp: 0,
    cbedTemp: 0,
    extTemp: 0,
    cextTemp: 0,
    position: 0,
    fileList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (client.connected) {
      this.setData({
        state: true
      })
    }
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
   * 连接mqtt
   */
  onConnect: function () {
    let that = this
    client = mqtt.connect('wx://' + this.data.ip, options)
    client.on('connect', function (e) {
      that.setData({
        state: true
      })
      console.log('connect success')
      client.subscribe('/printers/pSSto04rvSJPNqTVt7p3qHLhquIxMjtbN37Rcf5m8DzyM5Mj/client/#', function (e) {
        console.log('subscribe success')
      })
    })
    client.on('message', function (topic, message) {
      try {
        console.log(topic, JSON.parse(message))
        let json = JSON.parse(message)
        if (json.status) {
          this.setData({
            status: json.status,
            bedTemp: json.bed_temperature,
            extTemp: json.temperature
          })
        }
        if (json.files) {
          this.setData({
            fileList: json.files
          })
        }
      } catch (e) {
        console.log(e, message.toString())
      }
    })
    client.on('reconnect', (error) => {
      console.log('reconnet')
    })
    client.on('error', (error) => {
      console.log(error)
      client.end()
      that.setData({
        state: false
      })
    })
  },

  /**
   * 数据处理
   */
  publish: function (topic, type, restapi, cmd) {
    topic = this.data.mtopic + topic
    if (!client.connected) {
      console.log('client disconnecting')
      wx.showToast({
        title: '请先连接打印机！！！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    // base64編碼
    cmd = Base64.encode(cmd)
    let json = {
      '_timestamp': new Date(),
      'act_type': type,
      'act_restapi': restapi,
      'act_cmd': cmd,
      'act_content-type': 'application/json'
    }
    console.log(topic, json)
    client.publish(topic, JSON.stringify(json))
  },

  /**
   * 断开mqtt
   */
  disConnect: function () {
    client.end()
    this.setData({
      state: false
    })
  },

  /**
   * 设置热床温度
   */
  bindBed: function (e) {
    this.setData({
      cbedTemp: e.detail.value
    })
  },

  setBed: function () {
    let val = this.data.cbedTemp || 50
    let cmd = '{"command": "target", "target": ' + val + '}'
    console.log(cmd)
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'printer/bed', cmd)
  },

  /**
   * 设置挤出头温度
   */
  bindExt: function (e) {
    this.setData({
      cextTemp: e.detail.value
    })
  },

  setExt: function () {
    let val = this.data.cextTemp || 50
    let cmd = '{"command": "target", "targets": {"tool0": ' + val + '}}'
    console.log(cmd)
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'printer/tool', cmd)
  },

  /**
   * 订阅
   */
  bindPrinter: function () {
    if (!client.connected) {
      wx.showToast({
        title: '请先连接打印机！！！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    client.subscribe('123', function (e) {
      console.log('bind')
    })
  },

  /**
   * 取消订阅
   */
  unbindPrinter: function () {
    if (!client.connected) {
      wx.showToast({
        title: '请先连接打印机！！！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    client.unsubscribe('123', function (e) {
      console.log('unbind')
    })
  },

  /**
   * 测试信息
   */
  sendTest: function () {
    if (!client.connected) {
      wx.showToast({
        title: '请先连接打印机！！！',
        icon: 'none',
        duration: 1500
      })
      return
    }
    client.publish('123', '测试信息')
  },

  /**
   * 获取ip
   */
  bindInput: function (e) {
    this.setData({
      ip: e.detail.value
    })
  },

  /**
   * 选择当前移动方向
   */
  choose: function (e) {
    this.setData({
      position: e.currentTarget.dataset['index']
    })
  },

  /**
   * 坐标向右移动
   */
  moveRight: function () {
    let pos = 'x'
    if (this.data.position == 1) {
      pos = 'y'
    } else if (this.data.position == 2) {
      pos = 'z'
    }
    let cmd = '{"command": "jog", "' + pos + '": 10}'
    let topic = this.data.mtopic + 'controller'
    console.log(cmd, topic)
    this.publish(topic, 'post', 'printer/printhead', cmd)
  },

  /**
   * 坐标向左移动
   */
  moveLeft: function () {
    let pos = 'x'
    if (this.data.position == 1) {
      pos = 'y'
    } else if (this.data.position == 2) {
      pos = 'z'
    }
    let cmd = '{"command": "jog", "' + pos + '": -10}'
    let topic = this.data.mtopic + 'controller'
    console.log(cmd, topic)
    this.publish(topic, 'post', 'printer/printhead', cmd)
  },

  /**
   * 归位
   */
  moveHome: function () {
    let cmd = '{"command": "home", "axes": ["x", "y", "z"]}'
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'printer/printhead', cmd)
  },

  /**
   * 获取文件列表
   */
  getFile: function () {
    this.setData({
      fileList: [
        { name: 'xxx.gcode' },
        { name: 'xxxx.gcode' },
        { name: 'xxxxx.gcode' },
        { name: 'xxxxxx.gcode' },
        { name: 'xxxxxxx.gcode' }
      ]
    })
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'get', 'files', '')
  },

  /**
   * 开始打印
   */
  startPrint: function (e) {
    let cmd = '{"command": "select", "print": true}'
    let topic = this.data.mtopic + 'controller'
    let index = e.currentTarget.dataset['index']
    console.log(this.data.fileList[index].name)
    this.publish(topic, 'post', 'files/local/' + this.data.fileList[index].name, cmd)
  },

  /**
   * 恢复打印
   */
  restartPrint: function () {
    let cmd = '{"command": "pause", "action": "resume"}'
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'job', cmd)
  },

  /**
   * 暂停打印
   */
  pausePrint: function () {
    let cmd = '{"command": "pause", "action": "pause"}'
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'job', cmd)
  },

  /**
   * 取消打印
   */
  cancelPrint: function () {
    let cmd = '{"command": "cancel"}'
    let topic = this.data.mtopic + 'controller'
    this.publish(topic, 'post', 'job', cmd)
  }
})