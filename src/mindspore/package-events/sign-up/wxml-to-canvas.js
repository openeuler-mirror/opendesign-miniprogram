const wxml = (data) => {
  return `
    <view class="container">
        <image class="bgImg" src="https://openeuler-website.obs.ap-southeast-1.myhuaweicloud.com/sign-up/bg${data.poster}.png" />
        <view class="absolute">
            <image class="avatar" src="https://openeuler-website.obs.ap-southeast-1.myhuaweicloud.com/default-avatar.png" />
            <text class="openEuler">openEuler</text>
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
      width: 64,
      height: 64,
    },
    openEuler: {
      marginTop: 10,
      color: '#333333',
      fontSize: 17,
      lineHeight: 24,
      height: 24,
      width: 100,
      textAlign: 'center',
    },
    successText: {
      color: '#333333',
      fontSize: 20,
      marginTop: 30,
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
      marginTop: 64,
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
