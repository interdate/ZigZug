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
//import {KeyboardOriginal} from "@ionic-native/keyboard";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ActivationPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      menuType: 'overlay',

    }, {
      links: [
        {component: HomePage, name: 'בית', segment: 'home'},
        {component: HomePage, name: 'וידאו', segment: 'home/:id'},
        {component: ProfilePage, name: 'פרופיל', segment: 'profile/:id', defaultHistory: [HomePage]},
        {
          component: ActivationPage,
          name: 'Activation',
          segment: 'activation/:email/:code',
          defaultHistory: [HomePage]
        },
        {component: DialogPage, name: 'Chat', segment: 'dialog/:id', defaultHistory: [HomePage]},
        {component: FullScreenProfilePage, name: 'Full Screen Profile', segment: 'full-screen-profile', defaultHistory: [HomePage]},
        {component: SubscriptionPage, name: 'Subscription', segment: 'subscription'},
        {component: RegisterPage, name: 'פרופיל שלי', segment: 'edit/:step', defaultHistory: [HomePage]},
        {component: InboxPage, name: 'תיבת הודעות', segment: 'inbox', defaultHistory: [HomePage]},
        {component: ArenaPage, name: 'התיבה', segment: 'hativa', defaultHistory: [HomePage]},
        {component: ContactUsPage, name: 'צור קשר', segment: 'contact-us', defaultHistory: [HomePage]},
        {component: Page, name: 'עמוד', segment: 'page/:pageId', defaultHistory: [HomePage]},
        {component: ArticlePage, name: 'עמוד', segment: 'article/:id', defaultHistory: [HomePage]},
        {component: PasswordRecoveryPage, name: 'שחזור סיסמה', segment: 'recovery', defaultHistory: [HomePage]},
        //{ component: ResultsPage, name: 'תוצאות', segment: 'results' },
        {component: SearchPage, name: 'חיפוש', segment: 'search', defaultHistory: [HomePage]},
        {component: LoginPage, name: 'כניסה', segment: 'login', defaultHistory: [HomePage]},
        {component: NotificationsPage, name: 'התיבה שלי', segment: 'notifications', defaultHistory: [HomePage]},
        {component: SearchResultPage, name: 'תוצאות חיפוש', segment: 'page-search-result/:gender/:ageFrom/:ageTo', defaultHistory: [HomePage]}
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
    SearchResultPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ActivationPage
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
    FingerprintAIO
  ]
})
export class AppModule {}
