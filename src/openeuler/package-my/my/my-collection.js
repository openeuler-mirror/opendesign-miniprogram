// pages/my/my-collection.js

Page({
  data: {},
  onReachBottom() {
    const customComponent = this.selectComponent('#meeting');
    customComponent.getMoreData();
  },
});
