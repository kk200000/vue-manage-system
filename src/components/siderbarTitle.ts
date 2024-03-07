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
    permiss: '14',
  },
  {
    icon: 'Phone',
    index: '/myhelp',
    title: '求助管理',
    permiss: '15',
  },
  {
    icon: 'Stamp',
    index: '/export',
    title: '导入水电费',
    permiss: '16',
  },

  {
    icon: 'DocumentCopy',
    index: '/tabs',
    title: '小区公告',
    permiss: '6',
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
    permiss: '2',
    subs: [
      {
        index: '/parking',
        title: '停车场',
        permiss: '3',
      },

      {
        index: '/AITalk',
        title: 'AI管家',
        permiss: '5',
      },
      {
        index: '/export',
        title: '生活费用',
        permiss: '4',
      },
    ],
  },

  {
    icon: 'DocumentCopy',
    index: '/tabs',
    title: '小区公告消息',
    permiss: '6',
  },
  {
    icon: 'Edit',
    index: '3',
    title: '维修申请',
    permiss: '7',
    subs: [
      {
        index: '/form',
        title: '填写维修单',
        permiss: '8',
      },
      {
        index: '/myhelp',
        title: '我的维修',
        permiss: '8',
      },

      // {
      //   index: '4',
      //   title: '与我有关',
      //   permiss: '7',
      //   subs: [
      //     {
      //       index: '/editor',
      //       title: '我参与的',
      //       permiss: '8',
      //     },
      //     {
      //       index: '/markdown',
      //       title: '历史活动',
      //       permiss: '9',
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: 'Setting',
    index: '/user',
    title: '信息填写',
    permiss: '2',
  },
]
