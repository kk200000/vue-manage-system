// 左边侧边栏
export const LeftSiderBarAdmin = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
  },
  {
    icon: 'Calendar',
    index: 'admin1',
    title: '管理员首页',
    permiss: '2',
    subs: [
      {
        index: '/parking',
        title: '车辆管理',
        permiss: '2',
      },
      {
        index: '/myhelp',
        title: '请求管理',
        permiss: '17',
      },
      {
        index: '/export',
        title: '导出Excel',
        permiss: '2',
      },
    ],
  },
  {
    icon: 'DocumentCopy',
    index: '/tabs',
    title: '小区公告',
    permiss: '3',
  },
  {
    icon: 'Edit',
    index: '3',
    title: '表单相关',
    permiss: '4',
    subs: [
      {
        index: '/form',
        title: '基本表单',
        permiss: '5',
      },
      {
        index: '4',
        title: '三级菜单',
        permiss: '7',
        subs: [
          {
            index: '/editor',
            title: '富文本编辑器',
            permiss: '8',
          },
          {
            index: '/markdown',
            title: 'markdown编辑器',
            permiss: '9',
          },
        ],
      },
    ],
  },
  {
    icon: 'Setting',
    index: '/icon',
    title: '自定义图标',
    permiss: '10',
  },
  {
    icon: 'PieChart',
    index: '/charts',
    title: 'schart图表',
    permiss: '11',
  },
  {
    icon: 'Warning',
    index: '/permission',
    title: '权限管理',
    permiss: '13',
  },
]

export const LeftSiderBarUser = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
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
        permiss: '2',
      },

      {
        index: '/AITalk',
        title: 'AI管家',
        permiss: '2',
      },
      {
        index: '/export',
        title: '生活费用',
        permiss: '2',
      },
    ],
  },
  // Ai 管家
  {
    icon: 'DocumentCopy',
    index: '/tabs',
    title: '小区公告消息',
    permiss: '3',
  },
  {
    icon: 'Edit',
    index: '3',
    title: '维修申请',
    permiss: '4',
    subs: [
      {
        index: '/form',
        title: '填写维修单',
        permiss: '5',
      },
      {
        index: '/myhelp',
        title: '我的维修',
        permiss: '2',
      },

      {
        index: '4',
        title: '与我有关',
        permiss: '7',
        subs: [
          {
            index: '/editor',
            title: '我参与的',
            permiss: '8',
          },
          {
            index: '/markdown',
            title: '历史活动',
            permiss: '9',
          },
        ],
      },
    ],
  },
  {
    icon: 'Setting',
    index: '/icon',
    title: '信息填写',
  },
]
