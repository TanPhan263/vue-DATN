export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/manage/dashboard',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Cài đặt tài khoản']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Cập nhật thông tin',
        to: '/manage/update',
        icon: 'cil-pencil'
      },
      // {
      //   _name: 'CSidebarNavItem',
      //   name: 'Đổi mật khẩu',
      //   to: '/forgetpass',
      //   icon: 'cil-lock-locked'
      // },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Tin nhắn']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tin nhắn',
        icon: 'cil-envelope-closed',
        to: '/manage/chats'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Quản lý']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý người dùng',
        icon: 'cil-user',
        to: '/manage/users'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý quán',
        icon: 'cil-puzzle',
        to: '/manage/store'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Xác nhận quán',
        icon: 'cil-puzzle',
        to: '/manage/confirmstore'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Khuyến mãi',
        icon: 'cil-puzzle',
        to: '/manage/discount'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tỉnh thành',
        icon: 'cil-puzzle',
        to: '/manage/provinces'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Thông tin trang web',
        icon: 'cil-puzzle',
        to: '/manage/footer'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Thanh Menu',
        icon: 'cil-puzzle',
        to: '/manage/navbar'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'HereMap',
        icon: 'cil-puzzle',
        to: '/manage/heremap'
      },
    ]
  }
]