import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Reservations from './views/Reservations'
import Destination from './views/Destination'
import Promotion from './views/Promotion'
import Personal from './views/Personal'
import SingleStore from './views/SingleStore'
import BookDetail from './views/BookDetail'
import ConfirmPay from '@/views/ConfirmPay'
// 优惠套餐
import DiscountPackage from './views/promotion/DiscountPackage'
import PackageDetail from './views/promotion/PackageDetail'
// 优惠套餐购买详情
import PurchaseDetail from './views/promotion/PurchaseDetail'
// 套餐确认支付
import PackagePay from './views/promotion/PackagePay'
// 活动举办
import Event from './views/promotion/Event'
import EventDetail from './views/promotion/EventDetail'
// 乐享优惠-美食
import Food from './views/promotion/Food'
import ArticleDetail from './views/promotion/ArticleDetail'
// 休闲娱乐
import Entertainment from './views/promotion/Entertainment'
// 推荐活动
import Activity from './views/promotion/Activity'
// 订单详情
import OrderDetail from './views/OrderDetail'
// 套餐订单详情
import PackageOrder from './views/PackageOrder'
// 活动预订详情
import ActivityOrder from './views/ActivityOrder'
// 商城
import Shop from './views/Shop'
// 商品详情页面
import ShopDetail from './views/shop/ShopDetail'
// 购物车页面
import Cart from './views/shop/Cart'
// 订单确认页面
import OrderConfirm from './views/shop/OrderConfirm'
// 支付确认页面
import OrderPay from './views/shop/OrderPay'
// 地址
import Address from './views/shop/Address'

// 订单详情
import ShopOrderDetail from './views/shop/OrderDetail'
// // 地址添加
// import AddressAdd from './views/shop/AddressAdd'
import OrderRefund from './views/shop/orderRefund'
import Refund from './views/shop/refund/refund'
import SelectRefund from './views/shop/refund/selectRefund'

// 个人中心路由
import PersonalInfor from '@/components/personal/PersonalInfor'
import PointManagement from '@/components/personal/PointManagement'
import MyOrder from '@/components/personal/MyOrder'
import HotelOrder from '@/components/personal/HotelOrder'
import PpackageOrder from '@/components/personal/PackageOrder'
import ShopOrder from '@/views/shop/Order'
import EventReservation from '@/components/personal/EventReservation'
import MyBill from '@/components/personal/MyBill'
import MyCard from '@/components/personal/MyCard'
import CardDetail from '@/components/personal/CardDetail'
import FeedBack from '@/components/personal/FeedBack'
import MyFeedback from '@/components/personal/MyFeedback'
import AddFeedback from '@/components/personal/AddFeedback'
import AddressManage from '@/components/personal/AddressManage'
import MyAddress from '@/views/shop/Address'
import AddAddress from '@/views/shop/AddressAdd'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  mode: 'history',
  routes: [
    // 个人中心路由表
    {
      path: '/personal',
      name: 'personal',
      component: Personal,
      redirect: '/personal/personalInfor',
      children: [{
        path: '/personal/personalInfor',
        name: 'PersonalInfor',
        component: PersonalInfor,
        meta: {
          name: 'personalInfor'
        },
      }, {
        path: '/personal/pointManagement',
        name: 'PointManagement',
        component: PointManagement,
        meta: {
          name: 'pointManagement'
        },
      }, {
        path: '/personal/myorder',
        component: MyOrder,
        redirect: '/personal/myorder/hotelOrder',
        children: [{
          path: '/personal/myorder/hotelOrder',
          name: 'HotelOrder',
          component: HotelOrder,
          meta: {
            name: 'myorder'
          },
        }, {
          path: '/personal/myorder/packageOrder',
          name: 'PpackageOrder',
          component: PpackageOrder,
          meta: {
            name: 'myorder'
          },
        }, {
          path: '/personal/myorder/shopOrder',
          name: 'ShopOrder',
          component: ShopOrder,
          meta: {
            name: 'myorder'
          },
        }]
      }, {
        path: '/personal/eventReservation',
        name: 'EventReservation',
        component: EventReservation,
        meta: {
          name: 'eventReservation'
        }
      }, {
        path: '/personal/myBill',
        name: 'MyBill',
        component: MyBill,
        meta: {
          name: 'myBill'
        }
      }, {
        path: '/personal/myCard',
        name: 'MyCard',
        component: MyCard,
        redirect: '/personal/myCard/cardDetail',
        children: [{
          path: '/personal/myCard/cardDetail',
          name: 'CardDetail',
          component: CardDetail,
          meta: {
            name: 'myCard'
          }
        }]
      }, {
        path: '/personal/feedback',
        name: 'FeedBack',
        component: FeedBack,
        redirect: '/personal/feedback/myFeedback',
        children: [{
          path: '/personal/feedback/myFeedback',
          name: 'MyFeedback',
          component: MyFeedback,
          meta: {
            name: 'feedback'
          }
        },{
          path: '/personal/feedback/addFeedback',
          name: 'AddFeedback',
          component: AddFeedback,
          meta: {
            name: 'feedback'
          }
        }]
      }, {
        path: '/personal/addressManage',
        name: 'AddressManage',
        component: AddressManage,
        redirect: '/personal/addressManage/myAddress',
        children: [{
          path: '/personal/addressManage/myAddress',
          name: 'MyAddress',
          component: MyAddress,
          meta: {
            name: 'addressManage'
          }
        },{
          path: '/personal/addressManage/addAddress',
          name: 'AddAddress',
          component: AddAddress,
          meta: {
            name: 'addressManage'
          }
        }]
      }]
    },
    {
      path: '/',
      redirect: '/ '
    },
    {
      path: '/index',
      name: 'home',
      component: Home,
	  alias: '/ ',
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    // },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/xinAbout.vue')
    },
	{
	  path: '/news',
	  name: 'news',
	  component: () => import('./views/News.vue')
	},
	{
	  path: '/newDetail',
	  name: 'newDetail',
	  component: () => import('./views/NewDetail.vue')
	},
    {
      path: '/aboutHaien',
      name: 'aboutHaien',
      component: () => import( './views/aboutHE.vue')
    },
    {
      path: '/familyFarm',
      name: 'familyFarm',
      component: () => import( './views/familyFarm.vue')
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: Reservations
    },
    {
      path: '/destination',
      name: 'destination',
      component: Destination
    },
    {
      path: '/promotion',
      name: 'promotion',
      component: Promotion
    },
    {
      path: '/singleStore',
      name: 'singleStore',
      component: SingleStore
    },
    {
      path: '/bookDetail',
      name: 'bookDetail',
      component: BookDetail
    },
    {
      path: '/confirmPay',
      name: 'confirmPay',
      component: ConfirmPay
    },
    {
      path: '/discountPackage',
      name: 'discountPackage',
      component: DiscountPackage
    },
    {
      path: '/purchaseDetail',
      name: 'purchaseDetail',
      component: PurchaseDetail
    },
    {
      path: '/packagePay',
      name: 'packagePay',
      component: PackagePay
    },
    {
      path: '/event',
      name: 'event',
      component: Event
    },
    {
      path: '/eventDetail',
      name: 'eventDetail',
      component: EventDetail
    },
    {
      path: '/food',
      name: 'food',
      component: Food
    },
    {
      path: '/articleDetail',
      name: 'articleDetail',
      component: ArticleDetail
    },
    {
      path: '/entertainment',
      name: 'entertainment',
      component: Entertainment
    },
    {
      path: '/activity',
      name: 'activity',
      component: Activity
    },
    {
      path: '/packageDetail',
      name: 'packageDetail',
      component: PackageDetail
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: OrderDetail
    },
    {
      path: '/packageOrder',
      name: 'packageOrder',
      component: PackageOrder
    },
    {
      path: '/activityOrder',
      name: 'activityOrder',
      component: ActivityOrder
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop
    },
    {
      path: '/shop',
      name: 'shop',
      component: Shop
    },
    {
      path: '/shopDetail',
      name: 'shopDetail',
      component: ShopDetail
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,

    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderPay',
      name: 'orderPay',
      component: OrderPay
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    },
    // {
    //   path: '/order',
    //   name: 'order',
    //   component: Order
    // },
    {
      path: '/shopOrderDetail',
      name: 'shopOrderDetail',
      component: ShopOrderDetail
    },
    {
      path: '/orderRefund',
      name: 'orderRefund',
      component: OrderRefund,
      // redirect: {name: 'selectRefund'},
      children: [{
          path: 'refund',
          name: 'refund',
          component: Refund
        },
        {
          path: 'selectRefund',
          name: 'selectRefund',
          component: SelectRefund
        }
      ]
    }
  ]
})