const wxml = (data) => {
  return `
    <view class="container">
        <image class="bgImg" src="https://community-meeting-minutes.obs.cn-north-4.myhuaweicloud.com:443/imgs/sign-up/bg${data.poster}.png" />
        <view class="absolute">
            <image class="avatar" src="https://community-meeting-minutes.obs.cn-north-4.myhuaweicloud.com:443/imgs/logo.png" />
            <text class="successText">报名成功!</text>
            <text class="title">${data.title}</text>
            <text class="voucher">您的参会凭证</text>
            <text class="name">姓名: ${data.name}</text>
            <text class="tel">手机: ${data.tel}</text>
        </view>
    </view>
    `;
};

const style = () => {
  return {
    container: {
      width: 375,
      height: 750,
      flexDirection: 'column',
      alignItems: 'center',
    },
    absolute: {
      width: 375,
      height: 750,
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      marginTop: 110,
      width: 176,
      height: 58,
    },
    successText: {
      color: '#333333',
      fontSize: 20,
      marginTop: 80,
      fontWeight: 500,
      height: 28,
      width: 100,
      textAlign: 'center',
    },
    title: {
      color: '#40ADFF',
      fontSize: 17,
      marginTop: 15,
      height: 25,
      width: 300,
      textAlign: 'center',
    },
    voucher: {
      color: '#333333',
      fontSize: 17,
      marginTop: 15,
      height: 25,
      width: 300,
      textAlign: 'center',
    },
    name: {
      marginTop: 33,
      fontSize: 17,
      color: '#40ADFF',
      height: 25,
      width: 300,
      textAlign: 'center',
    },
    tel: {
      marginTop: 15,
      fontSize: 17,
      color: '#40ADFF',
      height: 25,
      width: 350,
      textAlign: 'center',
    },
    bgImg: {
      position: 'absolute',
      width: 375,
      height: 750,
      top: 0,
      left: 0,
    },
  };
};

module.exports = {
  wxml,
  style,
};
