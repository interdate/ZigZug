import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides, ToastController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {DialogPage} from "../dialog/dialog";

/**
 * Generated class for the FullScreenProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-screen-profile',
  templateUrl: 'full-screen-profile.html',
})
export class FullScreenProfilePage {

    @ViewChild(Slides) slides: Slides;

    user:any;
    myId:any;
    defurl:any;
    i:any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public toastCtrl:ToastController,
        public api: ApiProvider
    ) {
        this.user = navParams.get('user');

        this.i = navParams.get('i');
        //this.slides.slideTo(navParams.get('i'),1);
        this.api.storage.get('user_data').then((val) => {

            if (val) {
                this.myId = val.user_id;
            }
        });
    }

    goBack() {
        console.log('test');
        this.navCtrl.pop();
    }

    toDialog() {
        var mess = '';
        if(this.user.isBlack == '1' || this.user.isAllowedToSend == '1'){
            mess = this.user.texts.chatErrorsMess[1];
        }else if(this.user.isBlack == '0' &&  this.user.isAllowedToSend == '2'){
            mess = this.user.texts.chatErrorsMess[2];
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

    addFavorites() {

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

            this.api.http.post(this.api.url + '/likes/' + this.user.id, params, this.api.setHeaders(true)).subscribe(data => {
                console.log(data);
            }, err => {
                console.log("Oops!");
            });
        }
    }

    toVideoChat() {
      this.api.openVideoChat({id: this.user.id, chatId: 0, alert: false, username: this.user.userNick});
    }

    ionViewWillEnter() {
        this.api.pageName = 'FullScreenProfilePage';
    }

}
