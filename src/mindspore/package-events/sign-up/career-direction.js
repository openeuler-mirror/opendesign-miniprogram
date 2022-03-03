const {
    all
} = require("../../utils/underscore")

Page({
    data: {
        checkedList: [],
        seachList:[],
        addShow: false,
        renderList:[],
        allCareer: [{
                value: '网络方向',
                isActive: false
            },
            {
                value: '运维方向',
                isActive: false
            },
            {
                value: '数据库方向',
                isActive: false
            },
            {
                value: '开发方向',
                isActive: false
            },
            {
                value: '测试方向',
                isActive: false
            },
            {
                value: '项目产品方向',
                isActive: false
            },
            {
                value: '安全方向',
                isActive: false
            },
            {
                value: '新型产业',
                isActive: false
            },
            {
                value: '技术管理和架构',
                isActive: false
            },
        ],
        seachValue: '',
        newTag: ''
    },
    onShow() {
        wx.getStorageSync('addNew')
        this.setData({
            renderList:this.data.allCareer
        })
    },
    itemClick(e) {
        let renderList = this.data.renderList
        let index = e.currentTarget.dataset.index
        if (this.data.checkedList.length >= 3 && !renderList[index].isActive) {
            wx.showToast({
                title: "最多可选3个标签",
                icon: 'error',
            });
        } else {
            renderList[index].isActive = !renderList[index].isActive
            let pushItem = renderList[index]
            pushItem['index'] = index
            if (renderList[index].isActive) {
                this.data.checkedList.push(pushItem)
            } else {
                let delIndex = this.data.checkedList.findIndex(item => {
                    return item.index == index
                })
                this.data.checkedList.splice(delIndex, 1)
            }
        }
        this.setData({
            renderList: renderList,
            checkedList: this.data.checkedList
        })
    },
    onSearch(e) {
        let value = e.detail;
        let seach = this.data.allCareer.filter(item => {
            return item.value.includes(value)
        })
        this.setData({
            renderList:seach
        })
    },
    onCancel() {
        this.setData({
            renderList:this.data.allCareer
        })
    },
    cancelChecked() {
        this.data.renderList.forEach(item => {
            item.isActive = false
        })
        this.setData({
            checkedList: [],
            renderList: this.data.renderList
        })
    },
    confirmChecked() {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
            directionList: this.data.checkedList
        })

        wx.navigateBack({
            delta: 1
        })
    },
    addNew() {
        this.setData({
            addShow: true
        })
    },
    addCancel() {
        this.setData({
            addShow: false
        })
    },
    addConfirm() {

        if (this.data.checkedList.length >= 3) {
            wx.showToast({
                title: "最多可选3个标签",
                icon: 'error',
            });
        } else {
            let length = this.data.renderList.length
            let newTag = {
                value: this.data.newTag,
                index: length,
                isActive: true
            }
            this.data.checkedList.push(newTag)
            this.data.renderList.push(newTag)
            this.setData({
                addShow: false,
                newTag: '',
                checkedList: this.data.checkedList,
                renderList: this.data.renderList
            })
        }

    },
    tagInput(e) {
        this.setData({
            newTag: e.detail.value,
        });
    },
    back() {
        if (this.data.isScan) {
            wx.switchTab({
                url: '/pages/events/events'
            })
            return;
        }
        wx.navigateBack();
    }
})