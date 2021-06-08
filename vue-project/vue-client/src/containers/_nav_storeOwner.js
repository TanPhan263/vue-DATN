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
        to: '/ForgetPass',
        icon: 'cil-lock-locked'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['QUẢN LÝ']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quán của bạn',
        icon: 'cil-puzzle',
        to: '/manage/manageStores'
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Tin nhắn',
        icon: 'cil-envelope-closed',
        to: '/manage/message/-M_HoshRYUpgWAIm7Fwa'
      }
    ]
  }
]