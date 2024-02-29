// 左边侧边栏
export const LeftSiderBarAdmin = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
  },
  {
    icon: 'Calendar',
    index: '1',
    title: '管理员首页',
    permiss: '2',
    subs: [
      {
        index: '/table',
        title: '常用表格',
        permiss: '2',
      },
      {
        index: '/import',
        title: '导入Excel',
        permiss: '2',
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
        index: '/upload',
        title: '文件上传',
        permiss: '6',
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
    title: '居民首页',
    permiss: '2',
    subs: [
      {
        index: '/table',
        title: '聊天室',
        permiss: '2',
      },
      {
        index: '/import',
        title: '小区车位情况',
        permiss: '2',
      },
      {
        index: '/export',
        title: '该用户生活费用（水费，电费，煤气费等）图表一览',
        permiss: '2',
      },
    ],
  },
  // Ai 管家
  {
    icon: 'DocumentCopy',
    index: '/tabs',
    title: '生活 AI 管家',
    permiss: '3',
  },
  {
    icon: 'Edit',
    index: '3',
    title: '活动报名与信息发布',
    permiss: '4',
    subs: [
      {
        index: '/form',
        title: '公告信息',
        permiss: '5',
      },
      {
        index: '/upload',
        title: '活动报名',
        permiss: '6',
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
