import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Events, InfiniteScroll } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {ProfilePage} from "../profile/profile";
import {DialogPage} from "../dialog/dialog";
import * as $ from 'jquery';
import {LoginPage} from "../login/login";
import {Push} from "@ionic-native/push";
import {ActivationPage} from "../activation/activation";
import {SubscriptionPage} from "../subscription/subscription";
import {TestVirtualScrollPage} from "../test-virtual-scroll/test-virtual-scroll";
import {NewTestVirtualScrollPage} from "../new-test-virtual-scroll/new-test-virtual-scroll";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild(InfiniteScroll) scroll: InfiniteScroll;

    public options: {filter: any} = {filter: 1};
    showLoader: any = false;
    list: any;
    action: any;
    offset: any;
    page_counter: any;
    loader: any = true;
    username: any;
    password: any;
    blocked_img: any = false;
    user_counter: any = 0;
    form_filter: any;
    filter: any; //= {filter: '', visible: ''}
    users: any;//Array<{ id: string, isOnline: string, isAddBlackListed: string, nickName: string, photo: string, age: string, region_name: string, image: string, about: {}, component: any}>;
    texts: { like: string, add: string, message: string, remove: string, unblock: string, no_results: string, chatErrorsMess: Array<string> };
    params: any
        = {
        action: 'online',
        filter: 'photo',
        page: 1,
        usersCount: 20,
        list: '',
        searchparams: {region: '', agefrom: 0, ageto: 0, sexpreef: '', meritalstat: '', userNick: ''}
    };
    params_str: any;
    scrolling = false;
    selectOptions = {title: 'popover select'};
    user: any;
    //tracker: (ix: number, obj: any) => any;


    constructor(
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider,
        public events: Events
    ) {
      // alert(2)
        this.api.filter = 'online';
        this.api.audioCall = new Audio();
        this.api.audioCall.src = 'https://www.zigzug.co.il/phone_ringing.mp3';
        this.api.audioCall.loop = true;
        this.api.audioCall.load();
        this.api.audioWait = new Audio();
        this.api.audioWait.src = 'https://www.zigzug.co.il/landline_phone_ring.mp3';
        this.api.audioWait.loop = true;
        this.api.audioWait.load();
        if (navParams.get('params') && navParams.get('params') != 'login') {

            if (navParams.get('action')) {
                this.params_str = {
                    action: 'list',
                    list: navParams.get('params').list,
                    page: 1,
                    usersCount: 20,
                    filter: 'new'
                }
            }

            this.params_str = navParams.get('params');
            this.params = JSON.parse(this.params_str);
        }

        if(!navParams.get('params') || navParams.get('params') == 'login'){
            this.api.setLocation();
        }

        if(navParams.get('advParams')){
            this.params = navParams.get('advParams');
        }

        this.params_str = JSON.stringify(this.params);

        // If Current Page Is "Block" or "Favorited", than remove "Add Favorited"
        if (this.params.list == 'black' || this.params.list == 'fav') {
            this.blocked_img = true;
        }

        this.page_counter = 1;

        this.api.storage.get('user_data').then((val) => {
            if(val) {
                this.password = val.password;
                this.username = val.username;
                // if (val.user_id == 588929719) {
                //     this.api.testingMode = true;
                // } else {
                //     this.api.testingMode = false;
                // }
                if (val.status == 'not_activated') {
                  this.navCtrl.push(ActivationPage);
                } else {
                    this.getUsers();
                }
                if(!this.api.transferStart){
                  this.api.transferData();
                }
            }else{
                this.navCtrl.setRoot(LoginPage);
                this.navCtrl.popToRoot();
            }
        });


        if(this.params.action == 'online' && this.params.filter == 'distance'){
          this.api.filter = 'distance';
        }else if(this.params.action == 'search'
          && this.params.searchparams && this.params.searchparams.freeToday == 1){
          this.api.filter = 'freeToday';
        }else if(this.params.list == ''){
          this.api.filter = this.params.action;
        }else{
          this.api.filter = this.params.list;
        }
        console.log(this.api.filter);
    }

    trackByFn(index: number, item: any): any {
        //console.log('virtualTrack', index, item);
            if ((index + 1) % 20 == 0) {
                console.log(item);
            }
            item.right = (index % 2 != 0)
            return item;
    }


    itemTapped(user) {
        this.navCtrl.push(ProfilePage, {
            user: user
        });
    }

    filterStatus() {
        if (this.options.filter == 1) {
            this.options.filter = 0;
        } else {
            this.options.filter = 1;
        }
    }

    toDialog(user) {
        if(user.id != this.api.myId) {
            var mess = '';
            if(user.isAllowedToSend == '1'){
                mess = this.texts.chatErrorsMess[1];
            }else if(user.isAllowedToSend == '2'){
                mess = this.texts.chatErrorsMess[2];
            }
            if(mess == ''){
                //user.userId = user.id;
                this.navCtrl.push(DialogPage, {
                    user: user
                });
            }else{
                // let toast = this.toastCtrl.create({
                //     message: mess,
                //     duration: 5000
                // });
                // toast.present();
                let alert = this.api.alertCtrl.create({
                  //title: 'הודעה פנימי',
                  message: mess,
                  buttons: ['אישור']
                });
                alert.present();
            }
        }
    }

    addLike(user) {

        if (user.isLike == '0') {

            user.isLike = '1';

            // let toast = this.toastCtrl.create({
            //     message: ' עשית לייק ל' + user.nickName,
            //     duration: 5000
            // });
            // toast.present();
            let alert = this.api.alertCtrl.create({
              //title: 'הודעה פנימי',
              message: 'עשית לייק ל ' + user.nickName,
              buttons: ['אישור']
            });
            alert.present();

            let params = JSON.stringify({
                toUser: user.id,
            });

            //alert(JSON.stringify(user));

            this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {

            }, err => {
                console.log("Oops!");
            });
        }
    }

    block(user, bool) {

        //let toast;
        let params;

        if (this.params.list == 'black' && bool == true) {

            //user.isAddBlackListed = true;


            params = JSON.stringify({
                list: 'BlackList',
                action: 'add'
            });

        } else if (this.params.list == 'black' && bool == false) {

            //user.isAddBlackListed = false;

            params = JSON.stringify({
                list: 'BlackList',
                action: 'delete'
            });
        }

        if(typeof params != 'undefined') {
            if (this.users.length == 1) {
                this.user_counter = 0;
            }

            // Remove user from list
            this.users.splice(this.users.indexOf(user), 1);
            this.events.publish('statistics:updated');


            this.api.http.post(this.api.url + '/user/managelists/black/0/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
                let res: any = data;
                // toast = this.toastCtrl.create({
                //     message: res.success,
                //     duration: 3000
                // });
                // toast.present();
                let alert = this.api.alertCtrl.create({
                  //title: 'הודעה פנימי',
                  message: res.success,
                  buttons: ['אישור']
                });
                alert.present();
            });
        }
    }

    unFavorites(user,index) {
        if(user.isFav == '1') {
            user.isFav = '0';
            let params = JSON.stringify({
                list: 'Unfavorite'
            });

            this.api.http.post(this.api.url + '/user/managelists/favi/0/' + user.id, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
                let res: any = data;
                // let toast = this.toastCtrl.create({
                //     message: res.success,
                //     duration: 3000
                // });
                // toast.present();
                let alert = this.api.alertCtrl.create({
                  //title: 'הודעה פנימי',
                  message: res.success,
                  buttons: ['אישור']
                });
                alert.present();

                //index = this.users.indexOf(user);
                this.users.splice(index, 1);
                this.events.publish('statistics:updated');
            });
        }
    }

    addFavorites(user) {

        let params;
        let url;

        if (user.isFav == false) {
            user.isFav = true;

            params = JSON.stringify({
                list: 'Favorite'
            });

            url = this.api.url + '/user/managelists/favi/1/' + user.id;

        } else {
            user.isFav = false;

            params = JSON.stringify({
                list: 'Unfavorite'
            });

            url = this.api.url + '/user/managelists/favi/0/' + user.id;
        }

        this.api.http.post(url, params, this.api.setHeaders(true, this.username, this.password)).subscribe(data => {
            let res: any = data;
            // let toast = this.toastCtrl.create({
            //     message: res.success,
            //     duration: 3000
            // });
            // toast.present();
            let alert = this.api.alertCtrl.create({
              //title: 'הודעה פנימי',
              message: res.success,
              buttons: ['אישור']
            });
            alert.present();

            this.events.publish('statistics:updated');
        });
    }

    sortBy() {

        //console.log(JSON.stringify(this.params.searchparams));

        // let params = JSON.stringify({
        //     action: this.params.action,
        //     list: '',
        //     filter: this.filter,
        //     page: 1,
        //     searchparams: this.params.searchparams,
        //     advanced_search: this.params.advanced_search,
        //
        // });

        // if (this.params.list) {
        //     params = JSON.stringify({
        //         action: 'list',
        //         list: this.params.list,
        //         filter: this.filter,
        //         page: 1,
        //
        //         searchparams: this.params.searchparams,
        //         advanced_search: this.params.advanced_search,
        //     })
        // }

        this.params.filter = this.filter;
        this.params.page = this.page_counter = 1;
        this.params_str = JSON.stringify(this.params);

        this.navCtrl.push(HomePage, {
            params: JSON.stringify(this.params)
        })
    }


    getUsers() {

        if (this.navParams.get('params') == 'login') {
            var headers = this.api.setHeaders(true);
            if(this.navParams.get('username') && this.navParams.get('password')) {
                this.username = this.navParams.get('username');
                this.password = this.navParams.get('password');
                headers = this.api.setHeaders(true, this.username, this.password);
            }

            this.api.http.post(this.api.url + '/users/search/', this.params_str, headers).subscribe(data => {
                let res: any = data;
                this.api.hideLoad();
                this.users = res.users;
                this.texts = res.texts;

                this.user_counter = res.users.length;
                this.form_filter = res.filters;
                this.filter = res.filter;
                if (res.users.length < this.params.usersCount) {
                    this.loader = false;
                }
                if(typeof res.user != 'undefined'){
                    this.user = res.user;
                }
                //this.setDistanceFormat();
            }, err => {
                this.api.hideLoad();

                if(err.status == 403 ){

                    if(this.api.pageName != 'LoginPage' && this.api.status != 'block') {
                        this.api.status = 'block';
                        this.api.setHeaders(false, null, null);
                        // Removing data storage
                        this.api.storage.remove('user_data');
                        this.navCtrl.setRoot(LoginPage, {error: err.error});
                        this.navCtrl.popToRoot();
                    }
                }
            });
        } else {
            //alert(this.params_str);
            var that = this;
            if(typeof this.password == 'undefined'){
                setTimeout(function () {
                    that.getUsers();
                },500);
            }else {
                this.api.showLoad('אנא המתן...');
                this.api.http.post(this.api.url + '/users/search/', this.params_str, this.api.setHeaders(true)).subscribe(data => {
                    let res: any = data;
                    this.api.hideLoad();
                    this.users = res.users;
                    this.texts = res.texts;
                    this.user_counter = res.users.length;
                    this.form_filter = res.filters;
                    this.filter = res.filter;
                    if (res.users.length < this.params.usersCount) {
                        this.loader = false;
                    }
                    if(typeof res.user != 'undefined'){
                        this.user = res.user;
                    }
                    //this.setDistanceFormat();
                }, err => {
                    this.api.hideLoad();

                    if(err.status == 403 ){
                        //if(val.status != resp.status){
                        //                         this.status = val.status = resp.status;
                        //                         val.userIsPaying = resp.userIsPaying;
                        //                         this.api.storage.set('user_data', val);
                        //                     }
                        if(this.api.pageName != 'LoginPage' && this.api.status != 'block') {
                            this.api.status = 'block';
                            this.api.setHeaders(false, null, null);
                            // Removing data storage
                            this.api.storage.remove('user_data');
                            this.navCtrl.setRoot(LoginPage, {error: err.error});
                            this.navCtrl.popToRoot();
                        }
                    }
                });
            }
        }
    }

    testClick() {
      this.navCtrl.push(NewTestVirtualScrollPage);
    }


    moreUsers(infiniteScroll?: any) {

        if (this.loader) {
            this.loader = false;
            this.showLoader = true;
            this.page_counter++;
            this.params.page = this.page_counter;
            this.params_str = JSON.stringify(this.params);

            this.api.http.post(this.api.url + '/users/search/', this.params_str, this.api.setHeaders(true)).subscribe(data => {
                let res: any = data;
                this.api.hideLoad();
                if (res.users.length == this.params.usersCount) {
                    this.loader = true;
                }
                this.texts = res.texts;
                this.users = this.users.concat(res.users);
                this.showLoader = false;
                //console.log(res.users,res.users.concat(this.users));
                //console.log(this.users);
                if(infiniteScroll) {

                    infiniteScroll.complete();

                }else{
                //     let that = this;
                //     setTimeout(function () {
                //         if(that.api.pageName == 'HomePage') {
                //             that.moreUsers();
                //         }
                //     },1000);
                }
            },      error => {
                this.api.hideLoad();
            });

        }
    }

    approveSubmit(){
        var value = (this.user.freeToday == '0') ? '1' : '0';
        this.user.freeToday = value;
        // let toast = this.toastCtrl.create({
        //     message: 'נשמר',
        //     duration: 3000
        // });
        //
        // toast.present();

        this.api.http.post(this.api.url + '/user/settings/freeToday/' + value, {}, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    ionViewWillEnter() {
        this.api.pageName = 'HomePage';
        this.api.showBackBtn = false;

    }

    toVideoChat(user) {
      this.api.openVideoChat({id: user.id, chatId: 0, alert: false, username: user.nickName});
    }

}
