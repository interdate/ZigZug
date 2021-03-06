import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpClientModule} from "@angular/common/http";
import {LoginPageModule} from "../pages/login/login.module";
import {IonicStorageModule} from "@ionic/storage";
import {ApiProvider} from "../providers/api/api";
import {Geolocation} from "@ionic-native/geolocation";
import {Push} from "@ionic-native/push";
import {Camera} from "@ionic-native/camera";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import {ImagePicker} from "@ionic-native/image-picker";
import {Media} from "@ionic-native/media";
import {Device} from "@ionic-native/device";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import {BingoPageModule} from "../pages/bingo/bingo.module";
import {ContactUsPageModule} from "../pages/contact-us/contact-us.module";
import {FaqPageModule} from "../pages/faq/faq.module";
import {PageModule} from "../pages/page/page.module";
import {SearchPageModule} from "../pages/search/search.module";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {AdvancedSearchPageModule} from "../pages/advanced-search/advanced-search.module";
import {SelectPageModule} from "../pages/select/select.module";
import {ChangePasswordPageModule} from "../pages/change-password/change-password.module";
import {PasswordRecoveryPageModule} from "../pages/password-recovery/password-recovery.module";
import {FullScreenProfilePageModule} from "../pages/full-screen-profile/full-screen-profile.module";
import {ArenaPageModule} from "../pages/arena/arena.module";
import {ProfilePageModule} from "../pages/profile/profile.module";
import {InboxPageModule} from "../pages/inbox/inbox.module";
import {NotificationsPageModule} from "../pages/notifications/notifications.module";
import {ChangePhotosPageModule} from "../pages/change-photos/change-photos.module";
import {RegisterPageModule} from "../pages/register/register.module";
import {SubscriptionPageModule} from "../pages/subscription/subscription.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {DialogPageModule} from "../pages/dialog/dialog.module";
import {ActivationPage} from "../pages/activation/activation";
import {AndroidPermissions} from "@ionic-native/android-permissions";
import {ArticlePageModule} from "../pages/article/article.module";
import {SearchResultPageModule} from "../pages/search-result/search-result.module";
import {ProfilePage} from "../pages/profile/profile";
import {DialogPage} from "../pages/dialog/dialog";
import {FullScreenProfilePage} from "../pages/full-screen-profile/full-screen-profile";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {RegisterPage} from "../pages/register/register";
import {InboxPage} from "../pages/inbox/inbox";
import {ArenaPage} from "../pages/arena/arena";
import {ContactUsPage} from "../pages/contact-us/contact-us";
import {Page} from "../pages/page/page";
import {ArticlePage} from "../pages/article/article";
import {PasswordRecoveryPage} from "../pages/password-recovery/password-recovery";
import {SearchPage} from "../pages/search/search";
import {LoginPage} from "../pages/login/login";
import {NotificationsPage} from "../pages/notifications/notifications";
import {SearchResultPage} from "../pages/search-result/search-result";
import {FreezePageModule} from "../pages/freeze/freeze.module";
import {FreezePage} from "../pages/freeze/freeze";
import {VipModal2PageModule} from "../pages/vip-modal2/vip-modal2.module";
import {EditSubscriptionPageModule} from "../pages/edit-subscription/edit-subscription.module";
import {Deeplinks} from "@ionic-native/deeplinks";
import {TestVirtualScrollPage} from "../pages/test-virtual-scroll/test-virtual-scroll";
import {NewTestVirtualScrollPageModule} from "../pages/new-test-virtual-scroll/new-test-virtual-scroll.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ActivationPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',
      scrollAssist: false,
      autoFocusAssist: false
    }, {
      links: [
        {component: HomePage, name: '??????', segment: 'home'},
        {component: HomePage, name: '??????????', segment: 'home/:id'},
        {component: ProfilePage, name: '????????????', segment: 'profile/:id', defaultHistory: [HomePage]},
        {
          component: ActivationPage,
          name: 'Activation',
          segment: 'activation/:email/:code',
          defaultHistory: [HomePage]
        },
        {component: DialogPage, name: 'Chat', segment: 'dialog/:id', defaultHistory: [HomePage]},
        {component: FullScreenProfilePage, name: 'Full Screen Profile', segment: 'full-screen-profile', defaultHistory: [HomePage]},
        {component: SubscriptionPage, name: 'Subscription', segment: 'subscription'},
        {component: RegisterPage, name: '???????????? ??????', segment: 'edit/:step', defaultHistory: [HomePage]},
        {component: InboxPage, name: '???????? ????????????', segment: 'inbox', defaultHistory: [HomePage]},
        {component: ArenaPage, name: '??????????', segment: 'hativa', defaultHistory: [HomePage]},
        {component: ContactUsPage, name: '?????? ??????', segment: 'contact-us', defaultHistory: [HomePage]},
        {component: Page, name: '????????', segment: 'page/:pageId', defaultHistory: [HomePage]},
        {component: ArticlePage, name: '????????', segment: 'article/:id', defaultHistory: [HomePage]},
        {component: PasswordRecoveryPage, name: '?????????? ??????????', segment: 'recovery', defaultHistory: [HomePage]},
        //{ component: ResultsPage, name: '????????????', segment: 'results' },
        {component: SearchPage, name: '??????????', segment: 'search', defaultHistory: [HomePage]},
        {component: LoginPage, name: '??????????', segment: 'login', defaultHistory: [HomePage]},
        {component: NotificationsPage, name: '?????????? ??????', segment: 'notifications', defaultHistory: [HomePage]},
        {component: SearchResultPage, name: '???????????? ??????????', segment: 'page-search-result/:gender/:ageFrom/:ageTo', defaultHistory: [HomePage]},
        {component: FreezePage, name: '?????????? ??????????', segment: 'freeze', defaultHistory: [HomePage]},
        {component: TestVirtualScrollPage, name: 'test', segment: 'test', defaultHistory: [TestVirtualScrollPage]},
      ]
    }),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    BingoPageModule,
    ContactUsPageModule,
    FaqPageModule,
    PageModule,
    SearchPageModule,
    SettingsPageModule,
    AdvancedSearchPageModule,
    SelectPageModule,
    VipModal2PageModule,
    ChangePasswordPageModule,
    PasswordRecoveryPageModule,
    ArenaPageModule,
    FullScreenProfilePageModule,
    ProfilePageModule,
    InboxPageModule,
    NotificationsPageModule,
    ChangePhotosPageModule,
    RegisterPageModule,
    SubscriptionPageModule,
    DialogPageModule,
    ArticlePageModule,
    SearchResultPageModule,
    FreezePageModule,
    EditSubscriptionPageModule,
    NewTestVirtualScrollPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ActivationPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    InAppBrowser,
    Geolocation,
    Push,
    Camera,
    FileTransfer,
    File,
    ImagePicker,
    AndroidPermissions,
    Media,
    Device,
    FingerprintAIO,
    Deeplinks,
  ]
})
export class AppModule {}
