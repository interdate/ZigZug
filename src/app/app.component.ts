import { Component, ViewChild } from '@angular/core';
import {
  Nav,
  Platform,
  MenuController,
  ViewController,
  Content,
  AlertController,
  Events
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import {Priority, Push, PushObject, PushOptions, Visibility} from '@ionic-native/push';
import { HomePage } from '../pages/home/home';

import * as $ from 'jquery';
import {LoginPage} from "../pages/login/login";
import {ArenaPage} from "../pages/arena/arena";
import {ProfilePage} from "../pages/profile/profile";
import {BingoPage} from "../pages/bingo/bingo";
import {PasswordRecoveryPage} from "../pages/password-recovery/password-recovery";
import {ContactUsPage} from "../pages/contact-us/contact-us";
import {RegisterPage} from "../pages/register/register";
import {InboxPage} from "../pages/inbox/inbox";
import {NotificationsPage} from "../pages/notifications/notifications";
import {SearchPage} from "../pages/search/search";
import {FaqPage} from "../pages/faq/faq";
import {ChangePhotosPage} from "../pages/change-photos/change-photos";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {SettingsPage} from "../pages/settings/settings";
import {DialogPage} from "../pages/dialog/dialog";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {ActivationPage} from "../pages/activation/activation";
import {Page} from "../pages/page/page";
import {FullScreenProfilePage} from "../pages/full-screen-profile/full-screen-profile";
import {AdvancedSearchPage} from "../pages/advanced-search/advanced-search";
import {FreezePage} from "../pages/freeze/freeze";
import {EditSubscriptionPage} from "../pages/edit-subscription/edit-subscription";
import {Deeplinks} from "@ionic-native/deeplinks";
import {InAppBrowser} from "@ionic-native/in-app-browser";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(ViewController) viewCtrl: ViewController;
  @ViewChild(Content) content: Content;

  rootPage: any;
  ajaxInterval: any;

  banner: any;
  menu_items_logout: any;
  menu_items_login: any;
  menu_items: any;
  menu_items_settings: any;
  menu_items_contacts: any;
  menu_items_footer1: any;
  menu_items_footer2: any;

  activeMenu: string;
  username: any;
  back: string;
  isPaying: any = false;

  is_login: any = false;
  status: any = '';
  texts: any = {};
  new_message: any = '';
  message: any = {};
  avatar: string = '';
  stats: string = '';
  interval: any = true;
  push2: PushObject;
  lastCallId: any = null;
  menuBanner: string;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public events: Events,
    public push: Push,
    public ap: AndroidPermissions,
    public deepLinks: Deeplinks,
    public iap: InAppBrowser,

  ) {
    // alert(pushMess.currentToken);
    //this.browserPush.disableNotifications();
    //this.browserPush.enableNotifications();
    // alert(234)
    this.events.subscribe('statistics:updated', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.getStatistics();
    });

    this.events.subscribe('page:payment', () => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      // let stat = this.api.status;
      if(this.api.pageName != 'SubscriptionPage') {
        // let that = this;
        // this.api.notCheckStatus = true;
        this.nav.push(SubscriptionPage);
        // setTimeout(function () {
        //   that.api.notCheckStatus = false;
        // }, 5000);
      }
    });



    this.api.storage.get('fingerAIO').then((val:any)=>{
      //alert(JSON.stringify(val));
      this.api.setEnableFingerAuth = (val && typeof val.setEnableFingerAuth != 'undefined') ? Boolean(parseInt(val.setEnableFingerAuth)) : true;
      this.api.faioData = val;
      this.api.fingerAuth = (val && typeof val.password != 'undefined') ? true : false;
    });

    this.api.fingerAIO.isAvailable().then((result: any) => {
      this.api.enableFingerAuth = 1;
    }).catch((error: any) => {
      this.api.enableFingerAuth = 0;
    });

    this.api.http.get(api.url + '/user/menu/', this.api.setHeaders(false)).subscribe((data: any) => {
        //let resp: any = data;
        //alert(JSON.stringify(resp));
        this.initMenuItems(data.menu);

        this.api.storage.get('user_data').then((val) => {
          if (!val) {
            if(this.api.pageName == 'RegisterPage'){
              this.rootPage = RegisterPage;
            }else if(this.api.pageName == 'SubscriptionPage'){
              this.rootPage = SubscriptionPage;
            }else {
              this.rootPage = LoginPage;
            }
            this.menu_items = this.menu_items_logout;

          } else {
            this.api.password = val.password;
            this.api.myId = val.user_id;
            this.api.setHeaders(true,val.username,val.password);
            this.api.viewName = val.username;
            this.menu_items = this.menu_items_login;
            this.getBingo();
            this.status = val.status;
            //var params = {};
            //alert('er');
            if(val.status == 'toPay'){
              this.rootPage = SubscriptionPage;
            }else if(val.status == 'not_activated'){
              this.rootPage = LoginPage;
              this.menu_items = this.menu_items_logout;
              // let params = {
              //   'login':{
              //     username: this.api.username,
              //     password: this.api.password
              //   }
              // };
              // this.nav.push(this.rootPage,params);
              //this.nav.popToRoot();
              this.nav.push(ActivationPage);
            }else {
              this.rootPage = HomePage;
              this.api.sendBrowserPhoneId();
            }
          }
          this.initPushNotification(); //push for android
          if(!val || val.status != 'not_activated') {
            this.nav.setRoot(this.rootPage);
            this.nav.popToRoot();
          }
        });
        //alert(3);
      },
      (error: any) => {
        //alert('Error: ' + JSON.stringify(error));
      }
    );

    this.closeMsg();
    let that = this;

    this.ajaxInterval = setInterval(function () {
      if (that.api.password != false && that.api.password != null) {
        that.getBingo();
        // New Message Notification
        //that.getMessage();
        that.getStatistics();
      }
    }, 10000);

    this.initializeApp();
    this.menu1Active();
    this.getAppVersion();

  }

  requestPermit() {
    this.ap.requestPermissions([this.ap.PERMISSION.CAMERA, this.ap.PERMISSION.RECORD_AUDIO]).then(
      result => {this.api.videoShow = true;},
      err => {this.api.videoShow = false;}
    );
  }

  initializeApp() {
    //alert(2);
    this.platform.ready().then((readySource) => {
      if(readySource=='cordova') {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.show();
        //this.statusBar.styleDefault();
        this.statusBar.styleBlackOpaque();
        this.statusBar.backgroundColorByName('black');

        this.splashScreen.hide();

        this.ap.checkPermission(this.ap.PERMISSION.CAMERA).then(
          result => {
            console.log(result);
            if(result.hasPermission) {
              this.ap.checkPermission(this.ap.PERMISSION.RECORD_AUDIO).then(
                result => {
                  console.log(result);
                  if(result.hasPermission) {
                    this.api.videoShow = true;
                  }else{
                    this.requestPermit();
                  }
                },
                err => {
                  this.requestPermit();
                }
              );
            }else{
              this.requestPermit();
            }
          },
          err => {this.requestPermit();}
        );
        // let that = this;
        // setTimeout(function () {
        //   that.nav.push(that.rootPage);
        // },500);

      }
    });
  }

  getAppVersion() {
    this.api.http.get(this.api.url + '/app/version', this.api.header).subscribe(data => {
      let resp: any = data;
      if (this.platform.is('cordova')) {

        if (parseInt(resp.version) > this.api.appVersion) {
          let prompt = this.alertCtrl.create({
            title: resp.title,
            message: resp.message,
            cssClass: 'new-version',
            buttons: [
              {
                text: resp.cancel,
                handler: data => {
                  //console.log('Cancel clicked');
                  if(Boolean(parseInt(resp.mustUpdate))){
                    this.getAppVersion();
                  }
                }
              },
              {
                text: resp.update,
                handler: data => {
                  window.open(resp.url, '_system'); //'market://details?id=co.il.zigzug'
                  if(Boolean(parseInt(resp.mustUpdate))){
                    this.getAppVersion();
                  }
                }
              }
            ]
          });
          prompt.present();
        }
      }

    });
  }

  closeMsg() {
    this.new_message = '';
  }

  goBack() {
    this.nav.pop({animate: false}).then();
  }

  getStatistics() {
    this.api.storage.get('user_data').then((val) => {
      if (val) {
        this.api.http.get(this.api.url + '/user/statistics/', this.api.setHeaders(true)).subscribe((data:any) => {
          var resp: any = data;
          let statistics = resp.statistics;
          this.api.isVip = data.isVip;

          if(val.status != resp.status || val.userIsPaying != resp.userIsPaying){
            this.api.status = val.status = resp.status;
            this.api.userIsPaying = val.userIsPaying = resp.userIsPaying;
            this.api.textMess = val.textMess = data.texts;
            this.api.storage.set('user_data', val);
            this.checkStatus();
          }

          // if (data.menuBanner) {
            this.menuBanner = data.menuBanner;
          // }


          this.isPaying = resp.userIsPaying;

          this.menu_items_login.push();

          this.menu_items[2].count = statistics.newNotificationsNumber;
          this.menu_items[0].count = statistics.newMessagesNumber;

          // Contacts Sidebar Menu
          this.menu_items_contacts[0].count = statistics.viewed;//viewed
          this.menu_items_contacts[1].count = statistics.viewedMe;//viewedMe
          this.menu_items_contacts[2].count = statistics.connected;//connected
          this.menu_items_contacts[3].count = statistics.connectedMe;//connectedMe
          this.menu_items_contacts[4].count = statistics.favorited;//favorited
          this.menu_items_contacts[5].count = statistics.favoritedMe;//favoritedMe
          this.menu_items_contacts[6].count = statistics.blacklisted;//blacklisted
          //Footer Menu
          this.menu_items_footer1[2].count = statistics.newNotificationsNumber;
          //this.menu_items_footer2[2].count = 0;
          this.menu_items_footer1[3].count = statistics.newMessagesNumber;
          if(typeof this.push2 != 'undefined') {
            this.push2.setApplicationIconBadgeNumber(statistics.newMessagesNumber);
          }
          this.menu_items_footer2[0].count = statistics.favorited;//favorited
          //this.menu_items_footer2[1].count = statistics.favedme;//favoritedMe
          //this.bannerStatus();
          // First Sidebar Menu
          /*this.menu_items[2].count = statistics.newNotificationsNumber;
           this.menu_items[0].count = statistics.newMessagesNumber;*/
          this.api.errorMess = '';
        }, err => {
          console.log('Statistics Error: ' + JSON.stringify(err));
          this.api.hideLoad();
          if(err.status == 403 ) {
            if(this.api.status != 'block') {
              this.api.logout();
              this.homePage();
              this.api.errorMess = err.error.error;
            }
          }else{
            this.api.errorMess = '';
          }

        });
      }
    });

  }

  clearLocalStorage() {
    this.api.setHeaders(false, null, null);
    // Removing data storage
    this.api.storage.remove('user_data');

    this.nav.setRoot(LoginPage);
    this.nav.popToRoot();
  }

  initMenuItems(menu) {

    this.back = menu.back;

    this.stats = menu.stats;

    this.menu_items_logout = [
      {_id: '', icon: 'log-in', title: menu.login, component: LoginPage, count: ''},
      {_id: 'blocked', icon: '', title: menu.forgot_password, component: PasswordRecoveryPage, count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
      {_id: '', icon: 'person-add', title: menu.join_free, component: RegisterPage, count: ''},
    ];

    this.menu_items = [
      {_id: 'inbox', icon: '', title: menu.inbox, component: InboxPage, count: ''},
      {_id: 'the_area', icon: '', title: menu.the_arena, component: ArenaPage, count: ''},
      {_id: 'notifications', icon: '', title: menu.notifications, component: NotificationsPage, count: ''},
      {_id: 'stats', icon: 'stats', title: menu.contacts, component: ProfilePage, count: ''},
      {_id: 'search', icon: 'search', title: menu.search, component: SearchPage, count: ''},
      {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', component: FaqPage, count: ''},
      {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', component: FaqPage, count: ''},
    ];

    this.menu_items_login = [
      {_id: 'inbox', icon: '', title: menu.inbox, component: InboxPage, count: ''},
      {_id: 'the_area', icon: '', title: menu.the_arena, component: ArenaPage, count: ''},
      {_id: 'notifications', icon: '', title: menu.notifications, component: NotificationsPage, count: ''},
      {_id: 'stats', icon: 'stats', title: menu.contacts, component: ProfilePage, count: ''},
      {_id: 'freeToday', src_img: 'assets/img/free_today.png', icon: '', title: menu.freeToday, list: 'freeToday', component: HomePage, count: ''},
      {_id: 'search', icon: 'search', title: menu.search, component: SearchPage, count: ''},
      {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', component: FaqPage, count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
      {_id: 'subscribe', icon: 'ribbon', title: 'רכישת מנוי', component: SubscriptionPage, count: ''},
      {_id: 'update_subscription', icon: 'ribbon', title: 'שידרוג מנוי', component: EditSubscriptionPage, count: ''},

    ];
    // console.log(this.api.userIsPaying , !this.api.isVip)
    // if (this.api.isVip) {

    // }

    this.menu_items_settings = [
      {_id: 'edit_profile', icon: '', title: menu.edit_profile, component: RegisterPage, count: ''},
      {_id: 'edit_photos', icon: '', title: menu.edit_photos, component: ChangePhotosPage, count: ''},
      {_id: '', icon: 'person', title: menu.view_my_profile, component: ProfilePage, count: ''},
      {_id: 'change_password', icon: '', title: menu.change_password, component: ChangePasswordPage, count: ''},
      {_id: 'freeze_account', icon: '', title: menu.freeze_account, component: FreezePage, count: ''},
      {_id: 'settings', icon: '', title: menu.settings, component: SettingsPage, count: ''},
      {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
      {_id: 'logout', icon: 'log-out', title: menu.log_out, component: LoginPage, count: ''},
    ];


    this.menu_items_contacts = [
      {_id: 'viewed', icon: '', title: menu.viewed, component: HomePage, list: 'viewed', count: ''},
      {
        _id: 'viewed_me',
        icon: '',
        title: menu.viewed_me,
        component: HomePage,
        list: 'viewedMe',
        count: ''
      },
      {
        _id: 'contacted',
        icon: '',
        title: menu.contacted,
        component: HomePage,
        list: 'connected',
        count: ''
      },
      {
        _id: 'contacted_me',
        icon: '',
        title: menu.contacted_me,
        component: HomePage,
        list: 'connectedMe',
        count: ''
      },
      {
        _id: 'favorited',
        icon: '',
        title: menu.favorited,
        component: HomePage,
        list: 'favorited',
        count: ''
      },
      {
        _id: 'favorited_me',
        icon: '',
        title: menu.favorited_me,
        component: HomePage,
        list: 'favoritedMe',
        count: ''
      },
      {_id: 'blocked', icon: '', title: menu.blocked, component: HomePage, list: 'blacklisted', count: ''}
    ];

    this.menu_items_footer1 = [
      {
        _id: 'online',
        src_img: 'assets/img/icons/online.png',
        icon: '',
        list: 'online',
        title: menu.online,
        component: HomePage,
        count: ''
      },
      {
        _id: 'arena',
        src_img: 'assets/img/icons/new-arena.png',
        icon: '',
        list: '',
        title: menu.the_arena,
        component: ArenaPage,
        count: ''
      },
      {
        _id: 'notifications',
        src_img: 'assets/img/icons/notifications_ft.png',
        list: '',
        icon: '',
        title: menu.notifications,
        component: NotificationsPage,
        count: ''
      },
      {
        _id: 'inbox',
        src_img: 'assets/img/icons/inbox.png',
        icon: '',
        list: '',
        title: menu.inbox,
        component: InboxPage,
        count: ''
      },
    ];

    this.menu_items_footer2 = [
      {
        _id: '',
        src_img: 'assets/img/icons/favorited.png',
        icon: '',
        list: 'favorited',
        title: 'מועדפים',
        component: HomePage,
        count: ''
      },
      {
        _id: 'near-me',
        src_img: '',
        title: menu.near_me,
        list: 'distance',
        icon: 'pin',
        component: HomePage,
        count: ''
      },

      {_id: '', src_img: '', icon: 'search', title: menu.search, list: '', component: SearchPage, count: ''},/*assets/img/icons/search.png*/
      {_id: '', src_img: 'assets/img/free_today.png', icon: '', title: menu.freeToday, list: 'freeToday', component: HomePage, count: ''},
    ];
  }

  menu1Active(bool = true) {
    this.activeMenu = 'menu1';
    this.menu.enable(true, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.enable(false, 'menu3');
    if (bool) {
      this.menu.toggle();
    }
  }


  menu2Active() {
    this.activeMenu = 'menu2';
    this.menu.enable(false, 'menu1');
    this.menu.enable(true, 'menu2');
    this.menu.enable(false, 'menu3');
    this.menu.open();
  }


  menu3Active() {
    this.activeMenu = 'menu3';
    this.menu.enable(false, 'menu1');
    this.menu.enable(false, 'menu2');
    this.menu.enable(true, 'menu3');
    this.menu.toggle();
  }


  menuCloseAll() {
    if (this.activeMenu != 'menu1') {
      this.menu.toggle();
      this.activeMenu = 'menu1';
      this.menu.enable(true, 'menu1');
      this.menu.enable(false, 'menu2');
      this.menu.enable(false, 'menu3');
      this.menu.close();
      //this.menu.toggle();
    }
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      //alert("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    // this.push.createChannel({
    //   id: 'zigzug',
    //   description: 'Video call notification',
    //   importance: 5,
    //   sound: 'https://newzigzug1.wee.co.il/phone_ringing.mp3',
    //   vibration: true,
    //   visibility: 1
    // }).then(() => {console.log('create channel')})


    const options: PushOptions = {
      android: {
        clearNotifications: false,
        senderID: '561402157531'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    this.push.createChannel({
      id: 'video',
      importance: 5,
      sound: 'landline_phone_ring',
      description: 'ZigZug video call notification',
      vibration: true,
      visibility: 1,
    });

    this.push.createChannel({
      id: 'message',
      importance: 5,
      sound: 'ding_dong',
      description: 'ZigZug push notification',
      vibration: true,
      visibility: 1,
    });

    this.push2 = this.push.init(options);







    this.push2.on('notification').subscribe((data) => {

      console.log(data)
      //let self = this;
      //if user using app and push notification comes
      /*if (data.additionalData.foreground == false) {
          this.api.storage.get('user_data').then((val) => {
              if (val) {
                  this.nav.push(InboxPage);
              } else {
                  this.nav.push(LoginPage);
              }
          });
      }*/

      console.log(data);
      console.log(data.additionalData.foreground == false);

      if (typeof data.additionalData.type != 'undefined') {
        this.adminPush(data);
        // return false;
      }

      console.log('after return false if')

      if(data.additionalData.foreground == false){
        if(typeof data.additionalData.video != 'undefined' && data.additionalData.video == '1'){
          this.api.openVideoChat({
            id: data.additionalData.userId,
            chatId: 0,
            alert: false,
            username: data.additionalData.userNick,
          });
        }else {
          this.openPushMessage(data);
        }
      }else{
        if((typeof data.additionalData.video != 'undefined' && data.additionalData.video != '1') || typeof data.additionalData.video == 'undefined')  {
          if (this.api.pageName != 'DialogPage') {
            let alert = this.alertCtrl.create({
              title: data.additionalData.titleMess,
              message: data.message,
              buttons: [
                {
                  text: data.additionalData.buttons[0],
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                },
                {
                  text: data.additionalData.buttons[1],
                  handler: () => {
                    this.openPushMessage(data)
                  }
                }
              ]
            });
            alert.present();
          }
        }
      }
    });

    this.push2.on('registration').subscribe((data) => {

      console.log('deviceToken:' + data.registrationId);
      this.api.storage.set('deviceToken', data.registrationId);
      this.api.sendPhoneId(data.registrationId);
      //TODO - send device token to server
    });

    this.push2.on('error').subscribe((err) => {

      console.log('push err')
      console.log(err);
    })
  }

  openPushMessage(data){
    if(typeof data.additionalData.urlRedirect == 'undefined'){
      if(typeof data.additionalData.userId == 'undefined'){
        this.nav.push(InboxPage);
      }else if (!data.additionalData.url || data.additionalData.url == '/dialog'){
        //alert(JSON.stringify(data));
        this.nav.push(DialogPage, {
          user: {
            userId: data.additionalData.userId,
            nickName: data.additionalData.userNick
          }
        });
      } else {
        if (data.additionalData.type == 'linkOut') {
          // console.log('in if linkOut');
          this.iap.create(data.additionalData.url);
        } else {

          this.api.storage.get('user_data').then((val) => {
            // alert(val);
            if (val) {
              this.api.setHeaders(true, val.username, val.password);
              this.nav.push(data.url)
            } else {
              console.log('afterLogin in app.component');
              this.nav.push(LoginPage);
            }
          });
        }

      }
    }else{
      /*var ref = */window.open(data.additionalData.urlRedirect, '_system');
    }
  }

  swipeFooterMenu() {
    if ($('.more-btn').hasClass('menu-left')) {
      $('.more-btn').removeClass('menu-left');
      $('.more-btn .right-arrow').show();
      $('.more-btn .left-arrow').hide();

      $('.more-btn').parents('.menu-one').animate({
        'margin-right': '-92%'
      }, 1000);
    } else {
      $('.more-btn').addClass('menu-left');
      $('.more-btn .left-arrow').show();
      $('.more-btn .right-arrow').hide();
      $('.more-btn').parents('.menu-one').animate({
        'margin-right': '0'
      }, 1000);
    }
  }

  removeBackground() {
    $('#menu3, #menu2').find('ion-backdrop').remove();
  }

  getPageByStr(string){
    let page:any;
    switch (string) {
      case 'RegisterPage':
        page = RegisterPage;
        break;
      case 'ActivationPage':
        page = ActivationPage;
        break;
      case 'AdvancedSearchPage':
        page = AdvancedSearchPage;
        break;
      case 'ArenaPage':
        page = ArenaPage;
        break;
      case 'BingoPage':
        page = BingoPage;
        break;
      case 'ChangePasswordPage':
        page = ChangePasswordPage;
        break;
      case 'ChangePhotosPage':
        page = ChangePhotosPage;
        break;
      case 'ContactUsPage':
        page = ContactUsPage;
        break;
      case 'DialogPage':
        page = DialogPage;
        break;
      case 'FaqPage':
        page = FaqPage;
        break;
      case 'FullScreenProfilePage':
        page = FullScreenProfilePage;
        break;
      case 'HomePage':
        page = HomePage;
        break;
      case 'InboxPage':
        page = InboxPage;
        break;
      case 'LoginPage':
        page = LoginPage;
        break;
      case 'NotificationsPage':
        page = NotificationsPage;
        break;
      case 'PagePage':
        page = Page;
        break;
      case 'PasswordRecoveryPage':
        page = PasswordRecoveryPage;
        break;
      case 'ProfilePage':
        page = ProfilePage;
        break;
      case 'SearchPage':
        page = SearchPage;
        break;
      case 'SettingsPage':
        page = SettingsPage;
        break;
      case 'SubscriptionPage':
        page = SubscriptionPage;
        break;
      case 'FreezePage':
        page = FreezePage;
        break;
    }
    return page;
  }

  getBanner() {
    this.api.http.get(this.api.url + '/user/banner?u=test', this.api.header).subscribe((data: any) => {
      let resp:any = data;
      this.banner = resp;
      if(this.api.pageName == 'LoginPage'){
        $('.banner').css({'bottom':'3px'});
      }

      if (data.css) {
        $('.banner').css({
          'bottom': data.css.bottom,
          'top': data.css.top,
          'right': data.css.right,
          'left': data.css.left,
          'height': data.css.height,
          'width': data.css.width,
        })
      }
    });
  }

  goTo() {
    this.api.http.get(this.api.url + '/user/banner/click/' + this.banner.id, this.api.header).subscribe(data => {
      if(this.banner.link != ''){
        window.open(this.banner.link, '_system');
      }else{
        if(this.banner.page != ''){
          this.nav.push(this.getPageByStr(this.banner.page));
        }

      }
    },
      error => {
        if(this.banner.link != ''){
          window.open(this.banner.link, '_system');
        }else{
          if(this.banner.page != ''){
            this.nav.push(this.getPageByStr(this.banner.page));
          }

        }
      });
    return false;
  }

  openPage(page) {

    if (page._id == 'logout') {
      this.status = '';
      this.api.storage.remove('user_data');
      this.api.setHeaders(false, null, null);
      this.nav.setRoot(LoginPage);
      this.nav.popToRoot();
    }


    if (page._id == 'stats') {
      this.menu3Active();
    } else {
      // close the menu when clicking a link from the menu
      this.menu.close();

      let params = '';

      // navigate to the new page if it is not the current page
      if (page.list == 'online') {
        params = JSON.stringify({
          action: 'online',
          filter: "lastActivity",
          list: '',
          page: 1,
          usersCount: 20,
          searchparams: {region: '', agefrom: 0, ageto: 0, userNick: ''}
        });
      } else if (page.list == 'distance') {
        params = JSON.stringify({
          action: 'online',//'search',
          filter: page.list,
          list: '',
          page: 1,
          usersCount: 20,
          searchparams: {region: '', agefrom: 0, ageto: 0, userNick: ''}
        });
      } else if (page.list == 'freeToday') {
        params = JSON.stringify({
          action: 'search',
          filter: 'new',
          list: '',
          page: 1,
          usersCount: 20,
          searchparams: {region: '', agefrom: 0, ageto: 0, userNick: '', freeToday: 1}
        });
      } else if (page._id == 'subscribe') {
        // this.api.storage.get('user_data').then((val) => {
        //     if(val && val.user_id) {
        //         window.open('https://www.zigzug.co.il/newpayment/?userId=' + val.user_id + '&app=1', '_blank');
        //     }
        // });

      } else {

        params = JSON.stringify({
          action: '',
          list: page.list,
          filter: 'lastActivity',
          page: 1,
          usersCount: 20,
          searchparams: {region: '', agefrom: 0, ageto: 0, userNick: ''}
        });
      }
      //if(page._id != 'subscribe') {
      if (page._id == 'edit_profile') {
        let params = {user: {step: 0, register: false}};
        this.nav.push(RegisterPage, params);
      } else {
        // console.log({page: page, action: 'list', params: params});
        this.nav.push(page.component, {page: page, action: 'list', params: params});
      }
      //}
    }
  }


  homePage() {
    this.api.storage.get('user_data').then((val) => {
      if (val) {
        this.nav.setRoot(HomePage);
      } else {
        this.nav.setRoot(LoginPage);
      }
      this.nav.popToRoot();
    });
  }

  getBingo() {
    this.api.storage.get('user_data').then((val) => {
      if (val) {
        this.api.http.get(this.api.url + '/user/bingo', this.api.setHeaders(true)).subscribe(data => {

          var resp: any = data;
          this.avatar = resp.texts.avatar;
          this.texts = resp.texts;
          // DO NOT DELETE
          if (resp.user && resp.loged != 'not_activated') {
            let params = JSON.stringify({
              bingo: resp.user
            });
            this.nav.push(BingoPage, {data: resp});
            this.api.http.post(this.api.url + '/user/bingo/splashed', params, this.api.setHeaders(true)).subscribe(data1 => { });
          }
        });

        if(this.api.pageName != 'SubscriptionPage' && this.api.status != 'not_activated') {
          this.api.http.get(this.api.url + '/user/call/get', this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(this.api.videoChat == null && data.calls);
            if (this.api.videoChat == null && data.calls) {
              if(this.lastCallId == null || this.lastCallId != data.calls.msgId) {

                //res['userId'] = val;
                this.callAlert(data);
              }
            }
          });
        }
      }
    });
  }

  async callAlert(data){
    if(this.api.callAlertShow == false && this.api.videoChat == null) {
      this.api.playAudio('wait');
      this.api.callAlertShow = true;
      const param = {
        id: data.calls.msgFromId,
        chatId: data.calls.msgId,
        alert: true,
        username: data.calls.nickName,
      };
      this.api.checkVideoStatus(param);
      this.api.callAlert = await this.api.alertCtrl.create({
        title: '<img class="alert-call" width="40" src="' + data.calls.img.url + '"> ' + data.calls.title,
        // header: 'שיחה נכנסת',
        message: data.calls.title.message,
        buttons: [
          {
            text: data.calls.buttons[1],
            cssClass: 'redCall',
            role: 'cancel',
            handler: () => {
              this.lastCallId = data.calls.msgId;
              this.api.stopAudio();
              this.api.callAlertShow = false;
              this.api.http.post(this.api.url + '/user/call/' + param.id, {
                message: 'close',
                id: param.chatId
              }, this.api.setHeaders(true)).subscribe((data: any) => {
                // let res = data;
                console.log('close');

                if(this.api.callAlert !== null) {
                  this.api.callAlert.dismiss();
                  this.api.callAlert = null;
                }
                let that = this;
                setTimeout(function () {
                  that.lastCallId = null;
                },10000);
                // console.log(res);
                // this.status == 'close';
                // location.reload();
              });
            }
          },
          {
            text: data.calls.buttons[0],
            cssClass: 'greenCall',
            handler: () => {
              if(this.api.callAlert !== null) {
                this.api.callAlert.dismiss();
                this.api.callAlert = null;
              }
              // this.webRTC.partnerId = param.id;
              // this.webRTC.chatId = param.chatId;
              // this.nav.push(VideoChatPage, param);
              console.log('open');
              this.api.callAlertShow = false;

              this.api.openVideoChat(param);
            }
          }
        ]
      });


      await this.api.callAlert.present();
      this.api.callAlert.onWillDismiss(() => {
        this.api.callAlertShow = false;
        this.api.callAlert = null;
        this.api.stopAudio();
        console.log('dismiss');
      });
    }
  }

  dialogPage() {
    let user = {id: this.new_message.userId};
    this.closeMsg();
    this.nav.push(DialogPage, {user: user});
  }

  getMessage() {

  }

  checkStatus() {
    console.log(this.api.status);
    console.log(this.api.notCheckStatus);
    // let check = (this.api.status == 'login' && this.api.pageName == 'SubscriptionPage' && !this.api.userIsPaying);
    if(this.api.notCheckStatus === false) {
      if (this.api.pageName != 'ArticlePage' && this.api.pageName != 'SearchResultsPage' && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'RegisterPage' && this.api.pageName != 'PagePage' && this.api.pageName != 'TermsPage' && this.api.pageName != 'PasswordRecoveryPage' && this.api.pageName != 'FaqPage') {
        if (this.api.status == 'not_activated' && this.api.pageName != 'ActivationPage' && this.api.pageName != 'LoginPage' && this.api.pageName != 'PasswordRecoveryPage' && this.api.pageName != 'ChangePasswordPage'
          && this.api.pageName != 'ChangePhotosPage') {
          // this.nav.push(LoginPage, {'redirect': 1});
          this.nav.push(ActivationPage);
        } else if (this.api.status == 'toPay' && this.api.pageName != 'SubscriptionPage' && this.api.pageName != 'ChangePhotosPage') {
          this.nav.setRoot(SubscriptionPage);
          this.nav.popToRoot();
        } else if (this.api.status == '' && this.api.pageName != 'LoginPage' && this.api.pageName != 'RegisterPage' && this.api.pageName != 'PasswordRecoveryPage' && (!this.api.password || this.api.password == '')) {
          this.nav.setRoot(LoginPage);
          this.nav.popToRoot();
        } else if (this.api.status == 'login' && this.api.pageName == 'SubscriptionPage' && (this.api.userIsPaying == 1 || this.api.userIsPaying == true)) {
          this.nav.setRoot(HomePage);
          this.nav.popToRoot();
        } else if (this.api.status == 'login' && this.api.pageName == 'SubscriptionPage' && !this.api.userIsPaying) {
          console.log(123);
        } else if (this.api.pageName == 'LoginPage' && this.status == 'login') {
          this.nav.push(HomePage);
        }
      }

      if (this.api.pageName == 'ActivationPage' && this.api.status == 'login') {
        this.nav.push(HomePage);
        this.api.hideLoad();
      }
    }
  }

  menuBannerClick() {
    this.nav.push(SubscriptionPage);
    this.menu.close();
  }

  ngAfterViewInit() {

    this.nav.viewDidEnter.subscribe((view) => {

      this.getBanner();
      // clearInterval(this.ajaxInterval);
      // setTimeout( () => {
      //   this.getStatistics();
      //   this.getBingo();
      // },300);



      if (this.api.pageName == 'DialogPage') {
        $('.footerMenu').hide();
      } else {
        $('.footerMenu').show();
      }

      //let el = this;
      // window.addEventListener('native.keyboardshow', function () {
        //alert(1);
        // $('.keyboardClose').hide();

      // });
      // window.addEventListener('native.keyboardhide', function () {
        //alert(2);
        // $('.keyboardClose').show();

      // });

      if (this.api.pageName == 'LoginPage') {
        //clearInterval(this.interval);
        this.interval = false;
        //this.avatar = '';
      }
      if (this.api.pageName == 'HomePage' && this.interval == false) {
        this.interval = true;
        this.getBingo();
      }

      this.api.setHeaders(true);

      this.api.storage.get('user_data').then((val) => {
        this.api.status = (!val) ? false : val.status;
        this.api.userIsPaying = (!val) ? false : val.userIsPaying;
        this.api.textMess = (!val) ? false : val.textMess;

        if (val) {
          this.api.status = val.status;
          this.api.userIsPaying = val.userIsPaying;
          this.api.textMess = val.textMess;
          this.getStatistics();
          if (val.status == 'not_activated') {
            this.menu_items = this.menu_items_logout;
            this.is_login = false;
          } else {
            this.is_login = true;
            this.menu_items = this.menu_items_login;
          }
        } else {
          this.api.status = false;
          this.api.userIsPaying = false;
          this.api.textMess = false;
          this.menu_items = this.menu_items_logout;
          this.is_login = false;
        }

        this.checkStatus();
      });
      this.username = this.api.username;
    });
  }

  adminPush(data) {
    console.log(data)
    if (!data.additionalData.foreground) {
        if (data.additionalData.type == 'linkOut') {
          this.iap.create(data.additionalData.url);
        } else {
          this.adminPushEnterPage(data)
        }
    } else {
      const alert = this.api.alertCtrl.create({
        title: data.additionalData.titleMess,
        message: data.message,
        buttons: [
          {
            text: data.additionalData.buttons.view,
            handler: () => {
              if (data.additionalData.type == 'linkOut') {
                this.iap.create(data.additionalData.url);
              } else {
                // this.nav.push(data.additionalData.url);
                let params = {};
                this.adminPushEnterPage(data)
              }
            }
          },
          {
            text: data.additionalData.buttons.cancel
          }
        ]
      })
      alert.present();
    }
  }

  adminPushEnterPage(data) {
    let params = {};
    switch (data.additionalData.url) {
      case 'ArenaPage':
        this.nav.push(ArenaPage);
        break;
      case 'SubscriptionPage':
        this.nav.push(SubscriptionPage);
        break;
      case 'NotificationsPage':
        this.nav.push(NotificationsPage);
        break;

      case 'NewUsersPage':
        params = JSON.stringify({
          action: "online",
          filter: "new",
          list: "",
          page: 1,
          searchparams: {region: "", agefrom: 0, ageto: 0, sexpreef: "", meritalstat: "", userNick: ""},
          usersCount: 20
        });
        this.nav.push(HomePage, { params: params });
        break;
      case 'OnlineUsersPage':
        params = JSON.stringify({
          action: "online",
          filter: "lastActivity",
          list: "",
          page: 1,
          searchparams: {region: "", agefrom: 0, ageto: 0, userNick: ""},
          usersCount: 20,
        })
        this.nav.push(HomePage, { params: params });
        break;
      case 'NearmeUsersPage':
        params = JSON.stringify({
          action: "online",
          filter: "distance",
          list: "",
          page: 1
        })
        this.nav.push(HomePage, { params: params });
        break;
      case 'FreeTodayPage':
        params = JSON.stringify({
          action: "search",
          filter: "new",
          list: "",
          page: 1,
          searchparams: {region: "", agefrom: 0, ageto: 0, userNick: "", freeToday: 1},
          usersCount: 20,
        })
        this.nav.push(HomePage, { params: params });
        break;
    }
  }

}
