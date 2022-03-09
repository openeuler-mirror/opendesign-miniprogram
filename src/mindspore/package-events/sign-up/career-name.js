const {
    all
} = require("../../utils/underscore")

Page({
    data: {
        checkedList: [],
        seachList: [],
        addShow: false,
        renderList: [],
        allCareer: [{
                value: '管理',
                isActive: false
            },
            {
                value: '后端开发',
                isActive: false
            },
            {
                value: '前端开发',
                isActive: false
            },
            {
                value: '移动开发',
                isActive: false
            },
            {
                value: '测试',
                isActive: false
            },
            {
                value: 'DBA',
                isActive: false
            },
            {
                value: '运维',
                isActive: false
            },
            {
                value: '产品经理',
                isActive: false
            },
            {
                value: '产品设计师',
                isActive: false
            },
            {
                value: '视觉设计',
                isActive: false
            },
            {
                value: '交互设计',
                isActive: false
            },
            {
                value: '用户研究',
                isActive: false
            },
            {
                value: '市场/营销',
                isActive: false
            },
            {
                value: '媒介/公关',
                isActive: false
            },
            {
                value: '品牌/广告',
                isActive: false
            },
            {
                value: '渠道/推广',
                isActive: false
            },
            {
                value: '活动策划',
                isActive: false
            },
            {
                value: '用户运营',
                isActive: false
            },
            {
                value: '产品运营',
                isActive: false
            },
            {
                value: '新媒体运营',
                isActive: false
            },
            {
                value: '内容运营',
                isActive: false
            },
            {
                value: '社群运营',
                isActive: false
            },
            {
                value: '财务',
                isActive: false
            },
            {
                value: '人力资源（HR）',
                isActive: false
            },
            {
                value: '行政',
                isActive: false
            },
        ],
        seachValue: '',
        newTag: ''
    },
    onLoad(options) {
        let active = JSON.parse(options.nameList);
        let render = this.data.allCareer
        try {
            active.forEach(item =>{
                render[item.index].isActive = true
           })
        } catch (error) {
            render = this.data.allCareer
        }
        this.setData({
            renderList:render,
            checkedList:JSON.parse(options.nameList)
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
            renderList: seach
        })
    },
    onCancel() {
        this.setData({
            renderList: this.data.allCareer
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
            nameList: this.data.checkedList
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