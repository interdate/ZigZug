import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {DialogPage} from "../dialog/dialog";
import * as $ from 'jquery';

/**
 * Generated class for the BingoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bingo',
  templateUrl: 'bingo.html',
})
export class BingoPage {

    data: { user: any, texts: any };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider,
        public toastCtrl: ToastController
    ) {
        this.data = navParams.get('data');
        this.data.texts.text2 = this.data.texts.text2.replace('USERNAME',this.data.user.nickName);
    }

    toDialog() {
        var mess = '';
        if(this.data.user.isAllowedToSend == '1'){
            mess = this.data.texts.chatErrorsMess[1];
        }else if(this.data.user.isAllowedToSend == '2'){
            mess = this.data.texts.chatErrorsMess[2];
        }
        if(mess == ''){
            this.data.user.id = this.data.user.userId;
            this.navCtrl.push(DialogPage,{ user: this.data.user });
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

    goBack() {
        this.navCtrl.pop();
    }

    ionViewWillEnter() {
      this.api.pageName = 'BingoPage';
      $('.banner').hide();
    }

    ionViewWillLeave() {
      $('.banner').removeAttr('style');
    }


}
