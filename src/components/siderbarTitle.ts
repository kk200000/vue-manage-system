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
    icon: 'MostlyCloudy',
    index: '/weatherMap',
    title: '地区天气',
    permiss: '55',
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
        icon: 'MostlyCloudy',
        index: '/weatherMap',
        title: '地区天气',
        permiss: '55',
      },
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


export const PermissionTree = [
  {
    label: '系统首页',
    permiss: '1',
  },

  {
    label: '停车场',
    permiss: '3',
    children: [
      {
        label: '修改费用',
        permiss: '17',
      },
      {
        label: '操作车辆',
        permiss: '20',
      },
    ],
  },
  {
    label: '求助管理',
    permiss: '8',
    children: [
      {
        label: '我要求助',
        permiss: '60',
      },
      {
        label: '操作求助',
        permiss: '61',
      },
    ],
  },
  {
    label: '生活费用',
    permiss: '4',
    children: [
      {
        label: '导入居民费用',
        permiss: '70',
      },
      {
        label: '导出居民费用',
        permiss: '71',
      },
      {
        label: '删除数据',
        permiss: '72',
      },
    ],
  },
  {
    label: 'AI管家',
    permiss: '5',
  },
  {
    label: '小区公告',
    permiss: '6',
    children: [
      {
        label: '创建公告',
        permiss: '31',
      },
      {
        label: '操作公告',
        permiss: '16',
      },
    ],
  },

  {
    label: '用户中心',
    permiss: '2',
  },
  {
    label: '权限管理',
    permiss: '18',
  },
]
