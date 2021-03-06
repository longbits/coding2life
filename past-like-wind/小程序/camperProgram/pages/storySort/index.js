// pages/storySort/index.js
const API = require('../../common/constant.js');
const util = require('../../utils/util');
Page({
  data: {
    sortList:[
      { id: 1, headImage: '../../images/sort_1.png', name: '景点', sorttype: 'SCENERY'},
      { id: 2, headImage: '../../images/sort_2.png', name: '美食', sorttype: 'FOOD' },
      { id: 3, headImage: '../../images/sort_3.png', name: '文化', sorttype: 'CULTURE'},
      { id: 4, headImage: '../../images/sort_4.png', name: '活动', sorttype: 'ACTIVITY'}
    ],
    sortWidth:'1020',
    // 页码
    pageIndex: 1,
    pageCount: 0,
    dataList: [],
    noMoreShow: false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.keyWord ? options.keyWord : '故事'
    });
    this.data.keyWord = options.keyWord ? options.keyWord:'';
    this.getList();
  },
  getList() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let url = API.URL.CAR.FINDINFOMSGBYPAGE;
    let param = {
      pageIndex: this.data.pageIndex,
      pageSize: 8,
      // status: 'on',
    }
    if (this.data.keyWord) {
      param.msgCityLike = this.data.keyWord;
    }
    util.http({
      url: url,
      dataForm: param,
      success: ({ data }) => {
        let dataList = this.data.dataList.concat(data.bussData);
        dataList.forEach((item) => {
          if (item.msgCity.length && item.msgCity.length > 4) {
            item.msgCity = item.msgCity.charAt(0) + item.msgCity.charAt(1) + item.msgCity.charAt(2) + item.msgCity.charAt(4) + '...';
          }
        })
        this.setData({
          dataList,
          pageCount: data.pageCount
        })
        wx.hideLoading();
      },
      fail: (res) => {
        wx.hideLoading();
        wx.showToast({ title: res.msg, image: '../../images/warn.png', duration: 1000 });
      },
      revertBack: () => {
        this.getList();
      }
    })
  },
  onReachBottom() {
    if (this.data.pageCount <= this.data.pageIndex) {
      this.setData({
        noMoreShow: true
      });
      return false;
    }
    this.data.pageIndex++;
    this.getList();
  },
  linkToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../storyDetail/index?id=${id}`
    })
  },
  linkToList(e){
    let sortType = e.currentTarget.dataset.sorttype;
    wx.navigateTo({
      url: `../storySortList/index?sortType=${sortType}&keyWord=${this.data.keyWord}`
    })
  },
  onShareAppMessage: function () {
  
  }
})