// 左边侧边栏
export const LeftSiderBarAdmin = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },

  {
    icon: 'Van',
    index: '/parking',
    title: '车辆管理',
    permiss: '3',
  },
  {
    icon: 'Phone',
    index: '/myhelp',
    title: '求助管理',
    permiss: '8',
  },
  {
    icon: 'Stamp',
    index: '/fees',
    title: '导入水电费',
    permiss: '4',
  },

  {
    icon: 'DocumentCopy',
    index: '/notice',
    title: '小区公告',
    permiss: '6',
  },
  {
    icon: 'Umbrella',
    index: '/AITalk',
    title: 'AI管家',
    permiss: '5',
  },
  {
    icon: 'Setting',
    index: '/user',
    title: '用户中心',
    permiss: '2',
  },
  {
    icon: 'Warning',
    index: '/permission',
    title: '权限管理',
    permiss: '18',
  },
]

export const LeftSiderBarUser = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },
  {
    icon: 'Calendar',
    index: '1',
    title: '居民生活',
    permiss: '1',
    subs: [
      {
        index: '/parking',
        title: '停车场',
        permiss: '3',
      },

      {
        index: '/AITalk',
        title: 'AI管家',
        permiss: '4',
      },
      {
        index: '/fees',
        title: '生活费用',
        permiss: '5',
      },
    ],
  },

  {
    icon: 'DocumentCopy',
    index: '/notice',
    title: '小区公告消息',
    permiss: '6',
  },
  {
    icon: 'Edit',
    index: '/myhelp',
    title: '我的维修',
    permiss: '8',
  },
  {
    icon: 'Setting',
    index: '/user',
    title: '信息填写',
    permiss: '2',
  },
]
