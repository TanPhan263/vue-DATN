export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Bảng điều khiển',
        to: '/manage/overview',
        icon: 'cil-speedometer',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Cài đặt tài khoản']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Cập nhật thông tin',
        to: '/manage/profile',
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
        to: '/manage/message/'
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['QUẢN LÝ']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Quán của bạn',
        icon: 'cil-puzzle',
        to: '/manage/managestores'
      },
    ]
  }
]