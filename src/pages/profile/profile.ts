import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController, Content, LoadingController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
import {DialogPage} from "../dialog/dialog";

import * as $ from 'jquery';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Nav) nav: Nav;

    isAbuseOpen: any = false;

    user: any = {};

    texts: any = {lock: '', unlock: ''};

    formReportAbuse: { title: any, buttons: { cancel: any, submit: any }, text: { label: any, name: any, value: any } } =
        {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;

    imageClick: boolean = false;

    photos:any = [];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public api: ApiProvider
    ) {
        //this.api.showLoad('אנא המתן...');

        var user = navParams.get('user');

        if (user) {
            this.api.storage.get('user_data').then((val) => {
                //alert(val.user_id);
                //alert(this.user.id)
                if (val) {
                    this.myId = val.user_id;
                }
            });
            this.user = user;
            if(typeof this.user.photos == 'undefined'){
                let url = (this.user.photo) ? this.user.photo: this.user.mainImage.url;
                //url = url.replace('c_thumb,g_face,h_600,w_600','w_600');
                this.user.photos = [{url:url}];
                //this.user.mainImage = false;
            }
            this.photos = this.user.photos;
            console.log(this.user.photos);

            this.api.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true)).subscribe(data => {
                let res:any = data;
                this.user = res;
                if(this.user.photos.length > this.photos.length) {
                    for (let i = 0; i < this.user.photos.length; i++) {
                        if (i > 0) {
                            this.photos.push(this.user.photos[i]);
                        }
                    }
                }
                this.formReportAbuse = res.formReportAbuse;
                this.texts = res.texts;
                this.api.hideLoad();
                this.imageClick = true;
            });
        } else {

            this.api.storage.get('user_data').then((val) => {
                //alert(val);
                if (val) {
                    this.myId = val.user_id;
                    this.api.http.get(api.url + '/user/profile/' + this.myId, api.setHeaders(true)).subscribe(data => {
                        let res:any = data;
                        this.user = res;
                        this.photos = this.user.photos;
                        this.formReportAbuse = res.formReportAbuse;
                        this.texts = res.texts;
                        this.api.hideLoad();
                        this.imageClick = true;
                    });
                }
            });
        }
    }

    setHtml(id, html) {
        if ($('#' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;/*
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });*/
            $('#' + id).append(div);
        }
    }

    scrollToBottom() {
        this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 300);
    }

    // addFavorites(user) {
    //
    //     if (user.isFav == false) {
    //         user.isFav = true;
    //
    //
    //         let params = JSON.stringify({
    //             list: 'Favorite'
    //         });
    //
    //         this.api.http.post(this.api.url + '/user/managelists/favi/1/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {
    //             let res:any = data;
    //             let toast = this.toastCtrl.create({
    //                 message: res.success,
    //                 duration: 3000
    //             });
    //
    //             toast.present();
    //         });
    //     }
    // }

    favSubmit(){
        var action;

        if (this.user.isFav == '1') {
            this.user.isFav = '0';
            action = 'delete';
        } else {
            this.user.isFav = '1';
            action = 'create';
        }

        let params = JSON.stringify({
            list: 'Favorite',
            action: action
        });

        var act = this.user.isFav == '1' ? 1 : 0;


        this.api.http.post(this.api.url + '/user/managelists/favi/' + act + '/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            let toast = this.toastCtrl.create({
                message: res.success,
                duration: 3000
            });

            toast.present();
        });
    }

    blockSubmit() {
        var action;
        if (this.user.isBlack == '1') {
            this.user.isBlack = '0';
            action = 'delete';
        } else {
            this.user.isBlack = '1';
            action = 'create';
        }

        let params = JSON.stringify({
            list: 'BlackList',
            action: action
        });

        var act = this.user.isBlack == '1' ? 1 : 0;

        this.api.http.post(this.api.url + '/user/managelists/black/' + act + '/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            let toast = this.toastCtrl.create({
                message: res.success,
                duration: 3000
            });

            toast.present();

        });
    }

    approveSubmit(){
        let alert = this.api.alertCtrl.create({
           title: this.texts.approve.title,
           message: this.texts.approve.message,
            buttons: [
                {
                    text: this.texts.approve.yes_button,
                    handler: () => {
                        //console.log('Buy clicked');
                        this.api.http.post(this.api.url + '/user/setApprove/' + this.user.id, '', this.api.setHeaders(true)).subscribe((data:any) => {
                            //'אימות פרופיל בוצע, תודה.'
                            var mess = (data.message) ? data.message : 'אימות פרופיל בוצע, תודה.';
                            let toast = this.toastCtrl.create({
                                message: mess,
                                duration: 2000
                            });
                            toast.present();
                        });
                    }
                },
                {
                    text: this.texts.approve.cancel_button,
                    role: 'cancel',
                    handler: () => {
                        //console.log('Cancel clicked');
                    }
                }
            ]
        });
        alert.present();
    }

    addLike() {
        if(this.user.isLike == '0') {
            this.user.isLike = '1';
            let toast = this.toastCtrl.create({
                message: ' עשית לייק ל' + this.user.userNick,
                duration: 2000
            });

            toast.present();

            let params = JSON.stringify({
                toUser: this.user.id,
            });

            this.api.http.post(this.api.url + '/user/like/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
                console.log(data);
            }, err => {
                console.log("Oops!");
            });
        }
    }

    fullPagePhotos(index) {

        //alert(JSON.stringify(this.user));
        //alert(this.user.photos[0].url);
        //alert('https://www.zigzug.co.il/images/users/large/' + this.user.gender + '.jpg');
        if(this.user.photos[0].url != '/images/no_photo_' + this.user.gender + '.jpg') {
            this.navCtrl.push(FullScreenProfilePage, {
                user: this.user,
                i: index
            });
        }
    }

    toDialog() {
        var mess = '';
        if(this.user.isBlack == '1' || this.user.isAllowedToSend == '1'){
            mess = this.texts.chatErrorsMess[1];
        }else if(this.user.isBlack == '0' &&  this.user.isAllowedToSend == '2'){
            mess = this.texts.chatErrorsMess[2];
        }
        if(mess == ''){
            //user.userId = user.id;
            this.navCtrl.push(DialogPage, {
                user: this.user
            });
        }else{
            let toast = this.toastCtrl.create({
                message: mess,
                duration: 5000
            });
            toast.present();
        }
    }

    reportAbuseShow() {
        this.isAbuseOpen = true;
        this.scrollToBottom();
    }

    reportAbuseClose() {
        this.isAbuseOpen = false;
        this.formReportAbuse.text.value = "";
    }

    abuseSubmit() {

        let params = JSON.stringify({
            text: this.formReportAbuse.text.value,
        });

        this.api.http.post(this.api.url + '/user/abuse/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
            let res:any = data;
            let toast = this.toastCtrl.create({
                message: (res.messageText) ? res.messageText : 'הודעתך נשלחה בהצלחה להנהלת האתר',
                duration: 2000
            });

            toast.present();
        }, err => {
            console.log("Oops!");
        });
        this.reportAbuseClose();
    }

    ionViewWillLeave() {
        $('.back-btn').hide();
    }

    toVideoChat() {
      this.api.openVideoChat({id: this.user.id, chatId: 0, alert: false, username: this.user.userNick});
    }

    ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
        $('.back-btn').show();
    }

}
