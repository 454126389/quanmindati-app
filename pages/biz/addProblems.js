// pages/biz/addProblems.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewards: app.globalData.drawConf.rewards,
    problemCount: app.globalData.drawConf.problemNumber,
    problemIdx: 0,
    choiceCount: [{ x: 0, y: '' }, { x: 1, y: '' }],
    pickerAry: [1, 2],
    rightAnswerIdx: 0,
    problems: [{
      content: null,
      index: 0,
      choice: [null, null]
    }],
    curContent: '',
    nextTitle: "下一题"
  },

  curPb: function () {
    return this.data.problems[this.data.problemIdx];
  },

  checkProblem: function () {
    var curPb = this.curPb();
    if (!curPb.content) return false;
    for (var i in curPb.choice) if (!curPb.choice[i]) return false;
    return true;
  },

  prePbTap: function () {
    if (this.data.problemIdx > 0) {
      this.data.problems.pop()
      var lastPb = this.data.problems[this.data.problems.length - 1]
      var cc = [], pa = []
      for (var i = 0; i < lastPb.choice.length; ++i) {
        cc.push({ x: i, y: lastPb.choice[i] })
        pa.push(i + 1)
      }
      this.setData({
        problemIdx: this.data.problemIdx - 1,
        curContent: lastPb.content,
        choiceCount: cc,
        pickerAry: pa,
        nextTitle: "下一题"
      })
    }
  },
  nextPbTap: function () {
    if (!this.checkProblem()) {
      wx.showToast({
        title: '题目信息未完善!',
        icon: 'loading',
        duration: 700,
        mask: true
      })
      return;
    }
    if (this.data.nextTitle == '下一题') {
      this.doNextPb();
    }else {
      console.log('submit to server');
    }
  },

  doNextPb: function() {
    if (this.data.problems.length < this.data.problemCount) {
      var newPbIdx = this.data.problemIdx + 1;
      this.data.problems.push({ content: null, index: newPbIdx, choice: [null, null] })
      this.setData({
        problemIdx: newPbIdx,
        curContent: '',
        choiceCount: [{ x: 0, y: '' }, { x: 1, y: '' }],
        pickerAry: [1, 2],
        nextTitle: this.data.problems.length == this.data.problemCount ? '完成' : "下一题"
      })
    } else {
      wx.showToast({
        title: '题目太多了!',
        icon: 'loading',
        duration: 700,
        mask: true
      })
    }
  },

  setContentIpt: function (e) {
    this.curPb().content = util.trim(e.detail.value);
    this.setData({
      problems: this.data.problems
    })
  },

  setChoiceIpt: function (e) {
    var iptId = e.currentTarget.id, iptVal = util.trim(e.detail.value), pbs = this.curPb();
    iptId = parseInt(iptId);
    if (pbs.choice.length < iptId + 1) {
      for (var i = pbs.choice.length - 1; i < iptId; ++i) pbs.choice.push('')
    }
    pbs.choice[iptId] = iptVal;
    this.data.choiceCount[iptId].y = iptVal
    this.setData({
      problems: this.data.problems
    })
  },

  answerPkrChange: function (e) {
    this.setData({
      rightAnswerIdx: parseInt(e.detail.value)
    })
  },

  addChoiceTap: function () {
    var tmp = this.data.choiceCount
    if (tmp.length < 5) {
      tmp.push({ x: tmp.length, y: "" })
      this.data.pickerAry.push(tmp.length)
      this.setData({
        choiceCount: tmp,
        pickerAry: this.data.pickerAry
      })
      this.curPb().choice.push(null)
    } else {
      wx.showToast({
        title: '最多5个选项!',
        icon: 'loading',
        duration: 700,
        mask: true
      })
    }

  },


  delChoiceTap: function () {
    var c = this.data.choiceCount;
    if (c.length > 2) {
      var removedItem = c.pop();
      this.data.pickerAry.pop();
      this.setData({
        choiceCount: c,
        pickerAry: this.data.pickerAry,
        rightAnswerIdx: removedItem.x < this.data.rightAnswerIdx ? this.data.rightAnswerIdx : 0
      })
      var curChoice = this.curPb().choice;
      if (c.length < curChoice.length) curChoice.pop()
      this.setData({ problems: this.data.problems })
    } else {
      wx.showToast({
        title: '至少2个选项!',
        icon: 'loading',
        duration: 700,
        mask: true
      })
    }
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.userInfo)
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

  }
})