import Vue from 'vue'
import Router from 'vue-router'
import AuthService from '@/services/AuthService.js';
import UserService from '@/services/UserService.js';

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/admin/Dashboard')
const Charts = () => import('@/views/admin/charts/Charts')
const Widgets = () => import('@/views/admin/widgets/Widgets')

// Views - Pages
const Page404 = () => import('@/views/admin/pages/Page404')
const Page500 = () => import('@/views/admin/pages/Page500')
const Login = () => import('@/views/admin/pages/Login')
const Register = () => import('@/views/admin/pages/Register')
const RegisterStore = () => import('@/views/admin/pages/RegisterStore')
const Chat = () => import('@/views/admin/pages/Chat')
// Users
const Users = () => import('@/views/admin/users/Users')
const User = () => import('@/views/admin/users/User')
//store
const Store = () => import('@/views/admin/stores/Store')
const Stores = () => import('@/views/admin/stores/Stores')
const ConfirmRegisterStore = () => import('@/views/admin/stores/ConfirmRegisterStore')
const inforUser = () => import('@/views/admin/inforUser/update')
//change pass
const Changepass = () => import('@/views/admin/change-pass/changepass')

//Homepage
const Homepage = () => import('@/views/user/HomePage') 
const Area = () => import('@/views/user/containers/Area') 
const Search = () => import('@/views/user/SearchPage')
const CategoryPage= () => import('@/views/user/containers/CategoryPage') 
const storeDetail= () => import('@/views/user/storeDetail') 
const ForgetPass= () => import('@/views/user/ForgetPass') 
const UserInfor= () => import('@/views/user/UserInfor') 
const Homebody= () => import('@/views/user/Homebody') 
const DishTypeSearch= () => import('@/views/user/DishTypeSearch') 
//StoreOwner
const Dish = () => import('@/views/storeOwner/manageMenu/Dish') 
const ManageMenu = () => import('@/views/storeOwner/manageMenu/MangeMenu') 
const ManageStoreInfor = () => import('@/views/storeOwner/manageStores/MangeStoreInfor') 
const OwnerStores = () => import('@/views/storeOwner/manageStores/stores') 
//Chat
const chatPage = () => import('@/views/chat/chatPage')
//Discount
const Discount =() => import('@/views/admin/discount/Discount')
Vue.use(Router)

const isAuthen = (to, from, next) => {
  var isAuthen = localStorage.getItem('isAuthen');
  if(isAuthen != null){
    AuthService.checkUser(localStorage.getItem('isAuthen'))
    var expireTime = AuthService.parseJwt(isAuthen);
    var timeStamp = Math.floor(Date.now() / 1000);
    var timeCheck =  expireTime.exp - timeStamp;
    console.log(timeCheck)
    if(timeCheck > 0){
      var user = localStorage.getItem('userInfor');
      user =JSON.parse(user);
      const role = user.userTypeID;
      if (role != '-MO5VYNnWIjXtvJO4AXi'){
        next();
        return;
      }
    }
    else{
      AuthService.logout();
      return;
    }
  }
  next("/login");
};

export default new Router({
  mode: 'history', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/manage',     
      redirect: '/manage/dashboard',
      name: 'Home',
      component: TheContainer,
      beforeEnter: isAuthen,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
        },       
        {
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'users',
          meta: {
            label: 'Users'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Users',
              component: Users
            },
            {
              path: ':id',
              meta: {
                label: 'User Details'
              },
              name: 'User',
              component: User
            }
          ]
        },
        {
          path: 'store',
          meta: {
            label: 'Stores'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Stores',
              component: Stores
            },
            {
              path: ':id',
              meta: {
                label: 'Store Details'
              },
              name: 'Store',
              component: Store
            }
          ]
        },
        {
          path: 'confirm-registered-store',
          name: 'confirmRegisterStore',
          component: ConfirmRegisterStore
        },
        {
          path: 'update',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [ {
            path: '',
            name: 'update',
            component: inforUser
            }
          ]
        },
        {
          path: 'changepass',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'changepass',
              component: Changepass
            }
          ]
        },
        {
          path: 'manageStores',
          meta: {
            label: 'Stores'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: ':id',
              name: 'store',
              component: ManageStoreInfor
            },
            {
              path: '',
              name: 'stores',
              component: OwnerStores
            },
            {
              path: 'manageMenu',
              meta: {
                label: 'Menus'
              },
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: ':id',
                  name: 'dish',
                  component: Dish
                },
                {
                  path: '',
                  name: 'manageMenu',
                  component: ManageMenu
                }
              ]
            },
          ]
        },
        {
          path:'discount',
          name: 'Discount',
          component: Discount
        },
        {
          path: 'message/:id',
          name: 'Message',
          component: Chat,
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    },
    {
      path: '/chatPage',
      name: 'chat',
      component: chatPage
    },
    {
      path: '/login',      
      name: 'Login',
      component: Login     
    },
    {
      path: '/register',      
      name: 'Register',
      component: Register     
    },
    {
      path: '/',      
      name: 'Trangchu',
      redirect: '/Homepage',
      component: Homepage,
      children:[
        {
          path: 'search',      
          name: 'search',
          component: Search,
          meta: {
            reload: true,
          },
        },
        {
          path: 'Homepage',      
          name: 'Homepage',
          component: Homebody,
        },
        {
          path: 'DishType',      
          name: 'DishType',
          component: DishTypeSearch
        },
        {
          path:'area',
          name:'area',
          component: Area
        },
        {
          path:'ViewMore',
          name:'viewmore',
          component: CategoryPage
        }
      ]
    },
    {
      path: '/storeDetail/:id',      
      name: 'storeDetail',
      component: storeDetail
    },
    {
      path: '/ForgetPass',      
      name: 'ForgetPass',
      component: ForgetPass
    },
    {
      path: '/RegisterStore',      
      name: '/RegisterStore',
      component: RegisterStore
    },
    {
      path: '/UserInformation',      
      name: 'UserInfor',
      component: UserInfor
    }
  ]
}



