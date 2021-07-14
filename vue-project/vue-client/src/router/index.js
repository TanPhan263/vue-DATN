import Vue from 'vue'
import Router from 'vue-router'
import AuthService from '@/services/AuthService.js';

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/admin/Dashboard')

// Views - Pages
const Page404 = () => import('@/views/admin/pages/Page404')
const Page500 = () => import('@/views/admin/pages/Page500')
const Login = () => import('@/views/admin/pages/Login')
const Register = () => import('@/views/admin/pages/Register')
const RegisterStore = () => import('@/views/admin/pages/RegisterStore')
const chatOwner = () => import('@/views/storeOwner/chat/chatOwner')
const ChatAdmin = () => import('@/views/admin/chat/chatAdmin')
// Users
const Users = () => import('@/views/admin/users/Users')
const User = () => import('@/views/admin/users/User')
//store
const Store = () => import('@/views/admin/stores/Store')
const Stores = () => import('@/views/admin/stores/Stores')
const ConfirmStore = () => import('@/views/admin/stores/ConfirmStore')
const inforUser = () => import('@/views/admin/inforUser/update')

//navbar
const Navbar = () => import('@/views/admin/navbar/navBar')
const Provinces = () => import('@/views/admin/provinces/manageProvince')
const Footer = () => import('@/views/admin/footer/manageFooter')
const HereMapApiKey = () => import('@/views/admin/hereMap/HereMapApiKey')
//Homepage
const Homepage = () => import('@/views/user/homepage/HomePage') 
const Area = () => import('@/views/user/homepage/Area') 
const ViewMoreArea = () => import('@/views/user/homepage/ViewMoreArea') 
const Search = () => import('@/views/user/homepage/SearchPage')
const CategoryPage= () => import('@/views/user/homepage/CategoryPage') 
const storeDetail= () => import('@/views/user/storeDetail/StoreDetail') 
const ForgetPass= () => import('@/views/user/ForgetPass') 
const UserInfor= () => import('@/views/user/userInfor/UserInfor') 
const Homebody= () => import('@/views/user/homepage/Homebody') 
const DishTypeSearch= () => import('@/views/user/homepage/DishTypeSearch') 
//StoreOwner
const DashboardStoreOwner = () => import('@/views/storeOwner/DashboardStoreOwner') 
const Dish = () => import('@/views/storeOwner/manageMenu/Dish') 
const ManageMenu = () => import('@/views/storeOwner/manageMenu/MangeMenu') 
const ManageStoreInfor = () => import('@/views/storeOwner/manageStores/MangeStoreInfor') 
const OwnerStores = () => import('@/views/storeOwner/manageStores/stores') 
//Chat
const chatUser = () => import('@/views/user/chat/chatUser')
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
          path: 'overview',
          name: 'storeowner',
          component: DashboardStoreOwner,
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
              component: Users,
            },
            {
              path: ':id',
              meta: {
                label: 'User Details'
              },
              name: 'User',
              component: User,
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
              component: Stores,
            },
            {
              path: ':id',
              meta: {
                label: 'Store Details'
              },
              name: 'Store',
              component: Store,
            }
          ]
        },
        {
          path: 'confirmstore',
          name: 'confirmStore',
          component: ConfirmStore,
        },
        {
          path: 'navbar',
          name: 'navbar',
          component: Navbar,
        },
        {
          path: 'provinces',
          name: 'provinces',
          component: Provinces,
        },
        {
          path: 'footer',
          name: 'footer',
          component: Footer,
        },
        {
          path: 'heremap',
          name: 'heremap',
          component: HereMapApiKey,
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
          path: 'managestores',
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
              component: ManageStoreInfor,
            },
            {
              path: '',
              name: 'stores',
              component: OwnerStores,
            },
            {
              path: 'managemenu',
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
                  component: Dish,
                },
                {
                  path: '',
                  name: 'managemenu',
                  component: ManageMenu,
                }
              ]
            },
          ]
        },
        {
          path:'discount',
          name: 'Discount',
          component: Discount,
        },
        {
          path: 'message/',
          name: 'Message',
          component: chatOwner,
        },
        {
          path: 'chats/',
          name: 'chatadmin',
          component: ChatAdmin,
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
        // {
        //   path: 'login',
        //   name: 'login',
        //   component: Login
        // },
        // {
        //   path: 'register',
        //   name: 'Register',
        //   component: Register
        // }
      ]
    },
    {
      path: '/chatpage',
      name: 'chatuser',
      component: chatUser
    },
    {
      path: '/login',      
      name: 'login',
      component: Login     
    },
    {
      path: '/register',      
      name: 'register',
      component: Register     
    },
    {
      path: '/forgetpass',      
      name: 'forgetpassword',
      component: ForgetPass
    },
    {
      path: '/registerstore',      
      name: '/RegisterStore',
      component: RegisterStore
    },
    {
      path: '/userinformation',      
      name: 'UserInfor',
      component: UserInfor
    },
    {
      path: '/', 
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
          path: '/',      
          name: 'homebody',
          component: Homebody,
        },
        {
          path: 'dishtype',      
          name: 'DishType',
          component: DishTypeSearch
        },
        {
          path:'area',
          name:'area',
          component: Area
        },
        {
          path:'viewmore',
          name:'viewmore',
          component: CategoryPage
        },
        {
          path:'district/:id',
          name:'district',
          component: ViewMoreArea
        }
      ]
    },
    {
      path: '/:id',      
      name: 'storeDetail',
      component: storeDetail
    },
  ]
}



