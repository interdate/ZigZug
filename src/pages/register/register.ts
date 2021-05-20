import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Content, Platform } from 'ionic-angular';

import * as $ from "jquery";
import {ApiProvider} from "../../providers/api/api";
import {ChangePhotosPage} from "../change-photos/change-photos";
import {SelectPage} from "../select/select";
import {Page} from "../page/page";
import {HomePage} from "../home/home";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

    @ViewChild(Content) content: Content;
    login: any = false;
    user: any = {};
    form: any = {fields: []};
    errors: any;
    activePhoto: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public platform: Platform,
        public actionSheetCtrl: ActionSheetController,
        public api: ApiProvider
    ) {
        this.api.storage.get('user_data').then((val) => {
            this.login = (val) ? val.status : false;
            this.user = this.navParams.get('user');
            this.sendForm();
        });
    }

    getStep(step): void {
        if(this.login == 'login' || parseInt(this.user.step) > parseInt(step)) {
            this.user.step = step;
        }
        this.sendForm();
    }

    sendForm() {
        this.api.showLoad();
      let header = this.api.setHeaders((this.login == 'login') ? true : false);
      let url = (this.login == 'login') ? this.api.url + '/user/register' : this.api.siteUrl + '/open_api/v2/user/register';

        this.api.http.post(url, this.user, header).subscribe(
            data => {
                let res:any = data;
                console.log("Register success");
                console.log(data);
                //this.form = {};
                $('#labelconfirmMails').remove();
                this.form = res.form;
                this.user = res.user;
                if(!this.user.step){
                    this.user.step = this.form.step.val;
                }

                this.errors = res.errors;

                if (this.user.step == 3) {
                    if(this.user.register) {
                      this.api.setHeaders(true, this.user.userNick, this.user.userPass);
                      this.login = this.api.status = 'not_activated';
                      this.api.myId = this.user.userId;
                      this.api.storage.set('user_data', {
                        username: this.user.userNick,
                        password: this.user.userPass,
                        user_id: this.user.userId,
                        status: this.login,
                        userIsPaying: false,
                        textMess: this.user.texts,
                        user_photo: ''
                      });
                      this.api.storage.set('username', this.user.userNick);
                      this.api.viewName = this.user.userNick;
                      this.api.notActivateAlert = true;
                    }


                    let that = this;
                    setTimeout(function () {
                        that.api.hideLoad();
                    }, 1000);
                    this.api.storage.get('deviceToken').then((val) => {
                        this.api.sendPhoneId(val);
                    });
                    if(this.user.register) {
                        this.navCtrl.push(ChangePhotosPage, {
                            new_user: true,
                            username: this.user.userNick,
                            password: this.user.userPass,
                            usr: this.user
                        });
                    }else{
                        //console.log(12);
                        this.navCtrl.push(ChangePhotosPage);
                    }

                } else {
                    this.api.hideLoad();

                    if (this.user.step == 2 && !this.user.register) {
                        this.api.storage.set('username', this.user.userNick);
                        this.api.setHeaders(true, this.user.userNick);
                        this.api.viewName = this.user.userNick;
                    } else if (this.user.step == 2 && this.user.register) {
                        //this.api.storage.set('new_user', true);
                    }

                    this.content.scrollToTop(300);
                }
            }, err => {
                console.log("Error register");
                console.log(err);
                this.errors = err.error;
                this.api.hideLoad();
            }
        );
    }

    openSelect(field, index) {
        if(typeof field == 'undefined'){
            field = false;

        }
        if(this.user.userGender != '2'){
            field.class = '';
        }

        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {
            console.log(data);
            if (data) {
                let choosedVal = data.value;
                this.user[field.name] = choosedVal;
                if(field.name.indexOf('userBirthday') == -1) {
                    this.form.fields[index]['valLabel'] = data.label;
                }else{
                    for(let i=0; i<3; i++){
                        if(field.name == this.form.fields[index]['sel'][i].name){
                            this.form.fields[index]['sel'][i]['valLabel'] = data.label;
                        }
                    }
                }
            }
        });
    }

    stepBack() {
        this.user.step = this.user.step - 2;
        this.sendForm();
    }

    setHtml(id, html) {
        if ($('#' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            $('#' + id).append(div);
        }
    }

    getPage(pageId) {
        this.navCtrl.push(Page, {pageId: pageId});
    }

    ionViewWillEnter() {
        this.api.pageName = 'RegisterPage';
        $('.banner').hide();

        //this.api.activePageName = 'ContactPage';
        $('#back').show();
        this.api.storage.get('user_data').then((val) => {
            this.login = (val) ? val.status : false;
            if (this.login != 'login') {
                $('.footerMenu').hide();
            }
        });

        setTimeout(function () {
            if ($('div').hasClass('footerMenu')) {
            } else {
                $('#register .fixed-content,#register .scroll-content').css({'margin-bottom': '0'});
            }
        }, 100);

    }

    ionViewWillLeave() {
        $('#contact').removeAttr('style');
        if (this.login == 'login') {
            $('.mo-logo').click();
        }
        $('.banner').removeAttr('style');
    }

    /*inputClick(id) {

        let that = this;
        that.content.resize();
        setTimeout(function () {
            that.content.scrollTo(600, 0, 300);
            $('#' + id).focus();
        }, 400);

    }*/

    goToHome() {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }
}
