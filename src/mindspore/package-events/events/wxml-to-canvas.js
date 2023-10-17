const wxml = (data) => {
  return `
    <view class="container">
        <image class="bgImg" src="https://community-meeting-minutes.obs.cn-north-4.myhuaweicloud.com:443/imgs/poster/bg${data.poster}.png" />
        <view class="absolute">
            <text class="title">${data.title}</text>
            <image class="logo" src="https://community-meeting-minutes.obs.cn-north-4.myhuaweicloud.com:443/imgs/logo.png" />
            <text class="date">时间：${data.start_date}-${data.end_date}</text>
            <image class="qrcode" src="${data.qrcode}" />
            <text class="qrcodeText">长按识别二维码，进入活动！</text>
        </view>
    </view>
    `;
};

const style = () => {
  return {
    container: {
      width: 325,
      height: 656,
      flexDirection: 'column',
      alignItems: 'center',
    },
    absolute: {
      width: 325,
      height: 656,
      flexDirection: 'column',
      alignItems: 'center',
    },
    title: {
      marginTop: 88,
      color: '#fff',
      width: 325,
      height: 41,
      fontSize: 17,
      textAlign: 'center',
    },
    logo: {
      marginTop: 80,
      width: 176,
      height: 58,
      marginBottom: 15,
    },
    date: {
      marginTop: 15,
      color: '#40ADFF',
      width: 325,
      fontSize: 12,
      height: 19,
      textAlign: 'center',
    },
    address: {
      marginTop: 10,
      color: '#40ADFF',
      width: 325,
      fontSize: 12,
      height: 19,
      textAlign: 'center',
    },
    qrcode: {
      backgroundColor: '#ffffff',
      marginTop: 40,
      height: 185,
      width: 185,
      borderRadius: 100,
    },
    qrcodeText: {
      color: '#ffffff',
      fontSize: 12,
      marginTop: 15,
      height: 17,
      width: 325,
      textAlign: 'center',
    },
    bgImg: {
      position: 'absolute',
      width: 325,
      height: 656,
      top: 0,
      left: 0,
    },
  };
};

module.exports = {
  wxml,
  style,
};
