// package-my/events/under-release.js
const appAjax = require('./../../utils/app-ajax');
const sessionUtil = require("../../utils/app-session.js");

let that = null;
let remoteMethods = {
    getList: function (_callback) {
        let service = '';
        if (that.data.type == 4) {
            service = 'GET_DRAFT_LIST'
        } else if (that.data.type == 1) {
            service = 'DRAFTS'
        } else if (that.data.type == 5) {
            service = 'PUBLISHER_EVENTS_LIST'
        } else if (that.data.type == 2) {
            if (that.data.level == 2) {
                service = 'MY_EVENTS_LIST'
            } else {
                service = 'ALL_EVENTS_LIST'
            }

        } else if (that.data.type == 6) {
            service = 'EVENT_COLLECT_LIST'
        } else if (that.data.type == 7) {
            service = 'MY_SIGNUP_EVENTS'
        } else if (that.data.type == 3) {
            if (that.data.level == 2) {
                service = 'MY_EVENTS_LIST'
            } else {
                service = 'ALL_EVENTS_LIST'
            }

        }
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service,
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    delDraft: function (_callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'DELETE',
            service: 'DRAFT_DETAIL',
            otherParams: {
                id: that.data.curId
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    delEvent: function (_callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'PUT',
            service: 'DEL_EVENT',
            otherParams: {
                id: that.data.curId
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    collect: function (_callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'POST',
            service: 'EVENT_COLLECT',
            data: {
                activity: that.data.curId
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    unCollect: function (_callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'DELETE',
            service: 'EVENT_UNCOLLECT',
            otherParams: {
                id: that.data.collectionId
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    },
    getSignUpInfo: function (id, _callback) {
        appAjax.postJson({
            autoShowWait: true,
            type: 'GET',
            service: 'GET_SIGNUP_INFO',
            otherParams: {
                id
            },
            success: function (ret) {
                _callback && _callback(ret);
            }
        });
    }
}
Page({

    /**
     * ?????????????????????
     */
    data: {
        type: 1,
        list: [],
        level: 1,
        actionShow: false,
        actions: [],
        curId: '',
        userId: '',
        collectionId: '',
        showDialogDel: false,
        noAuthDialogShow: false,
        user: '',
        registerId: ''
    },

    /**
     * ??????????????????--??????????????????
     */
    onLoad: function (options) {
        this.setData({
            type: options.type,
            level: sessionUtil.getUserInfoByKey('eventLevel'),
            user: sessionUtil.getUserInfoByKey('userId')
        })
        that = this;
        let title = '';
        if (options.type == 1) {
            title = '?????????';
        } else if (options.type == 2) {
            title = '?????????';
        } else if (options.type == 3) {
            title = '????????????';
        } else if (options.type == 4) {
            title = '?????????';
        } else if (options.type == 5) {
            title = '?????????';
        } else if (options.type == 6) {
            title = '??????????????????';
        } else if (options.type == 7) {
            title = '??????????????????';
        }
        wx.setNavigationBarTitle({
            title
        })
    },


    /**
     * ??????????????????--??????????????????
     */
    onShow: function () {
        remoteMethods.getList(res => {
            this.setData({
                list: res
            })

        })
    },
    toSign(e) {
        wx.navigateTo({
            url: `/package-events/events/sign?id=${e.currentTarget.dataset.id}`
        })
    },
    editDraft(e) {
        wx.navigateTo({
            url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=4`
        })
    },
    onActionClose() {
        this.setData({
            actionShow: false
        })
    },
    onActionSelect(e) {
        if (this.data.type == 4) {
            remoteMethods.delDraft(() => {
                this.onShow();
            })
        } else if ((this.data.type == 2) || (this.data.type == 6) || (this.data.type == 7)) {
            if (this.data.level == 3) {
                if (e.detail.operaType == 1) {
                    if (this.data.collectionId) {
                        remoteMethods.unCollect(() => {
                            this.onShow();
                        })
                    } else {
                        remoteMethods.collect(() => {
                            this.onShow();
                        })
                    }
                } else {
                    this.setData({
                        showDialogDel: true
                    })
                }
            } else {
                if (e.detail.operaType == 1) {
                    if (this.data.collectionId) {
                        remoteMethods.unCollect(() => {
                            this.onShow();
                        })
                    } else {
                        remoteMethods.collect(() => {
                            this.onShow();
                        })
                    }
                } else if(e.detail.operaType == 3) {
                    remoteMethods.getSignUpInfo(this.data.curId, (res) => {
                        wx.navigateTo({
                            url: `/package-events/sign-up/sign-up-success?name=${encodeURIComponent(res.name)}&title=${encodeURIComponent(res.title)}&tel=${encodeURIComponent(res.telephone)}&poster=${encodeURIComponent(res.poster)}&id=${encodeURIComponent(this.data.curId)}`
                        })
                    })
                } else {
                    this.setData({
                        noAuthDialogShow: true
                    })
                }
            }

        }
    },
    onMore(e) {
        this.setData({
            actionShow: true,
            curId: e.currentTarget.dataset.item.id,
            userId: e.currentTarget.dataset.item.user,
            collectionId: e.currentTarget.dataset.item.collection_id || '',
            registerId: e.currentTarget.dataset.item.register_id || ''
        })
        const strTemp = this.data.collectionId ? '????????????' : '????????????';
        if (this.data.type == 4) {
            this.setData({
                actions: [{
                    name: '??????',
                    operaType: 1
                }]
            })
        } else if ((this.data.type == 2) || (this.data.type == 6) || (this.data.type == 7)) {
            if (this.data.level == 3) {
                this.setData({
                    actions: [{
                            name: strTemp,
                            operaType: 1
                        },
                        {
                            name: '????????????',
                            operaType: 2
                        }
                    ]
                })
            } else {
                if (this.data.user == this.data.userId) {
                    this.setData({
                        actions: [{
                                name: strTemp,
                                operaType: 1
                            },
                            {
                                name: '????????????',
                                operaType: 2
                            }
                        ]
                    })
                } else {
                    this.setData({
                        actions: [{
                            name: strTemp,
                            operaType: 1
                        }]
                    })
                }

                if (this.data.registerId) {
                    let tempArr = this.data.actions;
                    tempArr.unshift({
                        name: '????????????',
                        operaType: 3
                    })
                    this.setData({
                        actions: tempArr
                    })
                }
            }
        }

    },
    toExamine(e) {
        wx.navigateTo({
            url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=1`
        })
    },
    del() {
        this.setData({
            showDialogDel: false
        })
        remoteMethods.delEvent(() => {
            remoteMethods.getList(res => {
                this.setData({
                    list: res
                })

            });
        })
    },
    delCancel() {
        this.setData({
            showDialogDel: false
        })
    },
    toUpdateSchedule(e) {
        if (this.data.type == 4) {
            this.editDraft(e);
        } else if ((this.data.type == 2) || (this.data.type == 6) || (this.data.type == 7)) {
            wx.navigateTo({
                url: `/package-events/events/event-detail?id=${e.currentTarget.dataset.id}&type=5`
            })
        } else if (this.data.type == 3) {
            this.sendEmail(e);
        }

    },
    copyWechat() {
        wx.setClipboardData({
            data: 'openeuler123',
            success: () => {
                this.setData({
                    noAuthDialogShow: false
                })
            }
        })

    },
    sendEmail(e) {
        wx.navigateTo({
            url: `/package-my/events/send-email?id=${e.currentTarget.dataset.id}`
        })
    }
})