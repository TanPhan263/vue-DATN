export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/manage/dashboard',
        icon: 'cil-speedometer',
        badge: {
          color: 'primary',
          text: 'NEW'
        }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Cài đặt tài khoản']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Cập nhật thông tin',
        to: '/manage/update',
        icon: 'cil-puzzle'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Đổi mật khẩu',
        to: '/ForgetPass',
        icon: 'cil-pencil'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Quản lý']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý người dùng',
        icon: 'cil-puzzle',
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
        name: 'Quản lý Navbar',
        icon: 'cil-puzzle',
        to: '/manage/store'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quản lý khuyến mãi',
        icon: 'cil-puzzle',
        to: '/manage/discount'
      }
      
    ]
  }
]