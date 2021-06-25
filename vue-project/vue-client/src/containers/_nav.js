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
      {
        _name: 'CSidebarNavItem',
        name: 'Đổi mật khẩu',
        to: '/forgetpass',
        icon: 'cil-lock-locked'
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
        name: 'Quản lý khuyến mãi',
        icon: 'cil-puzzle',
        to: '/manage/discount'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý tỉnh thành',
        icon: 'cil-puzzle',
        to: '/manage/provinces'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý Footer',
        icon: 'cil-puzzle',
        to: '/manage/footer'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý thanh Menu',
        icon: 'cil-puzzle',
        to: '/manage/navbar'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Chat',
        icon: 'cil-puzzle',
        to: '/manage/chats'
      }
    ]
  }
]