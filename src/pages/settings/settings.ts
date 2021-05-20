import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    form: any;
    fingerAuth: any;
    isAvalible: any = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public api:ApiProvider) {
        // this.api.storage.get('faio').then((val:any) => {
        //     if(val){
        //         this.fingerAuth = (typeof val.setEnableFingerAuth != 'undefined') ? Boolean(parseInt(val.setEnableFingerAuth)) : true;
        //         this.isAvalible = (typeof val.isAvailable != 'undefined') ? val.isAvailable : 0;
        //     }else{
        //         this.fingerAuth = true;
        //         this.isAvalible = 0;
        //     }
        // });
        this.fingerAuth = this.api.setEnableFingerAuth;
        this.isAvalible = this.api.enableFingerAuth;
        this.api.http.get(api.url + '/user/settings', api.setHeaders(true)).subscribe(data => {
            let res:any = data;

            // this.form = data.json().settings;
            // res.settings.newMessPushNotif = (res.settings.newMessPushNotif == null) ? 1 : 0;
            this.form = {
              newMessPushNotif: parseInt(res.settings.newMessPushNotif),
              userGetMsgToEmail: parseInt(res.settings.userGetMsgToEmail),
              freeToday: parseInt(res.settings.freeToday)
            };
          this.form.newMessPushNotif = res.settings.newMessPushNotif;
          console.log(this.form);
        });
    }

    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'נשמר',
            duration: 3000
        });

        toast.present();
    }

    submit(type) {

        let name;
        let value;

        if (type == 'email') {

            name = 'userGetMsgToEmail';
            value = this.form.userGetMsgToEmail;

            this.presentToast();

            this.api.http.post(this.api.url + '/user/settings/' + name + '/' + value, {}, this.api.setHeaders(true)).subscribe(data => {
            });
        } else if(type=='free_today'){

            name = 'freeToday';
            value = this.form.freeToday;

            this.presentToast();

            this.api.http.post(this.api.url + '/user/settings/' + name + '/' + value, {}, this.api.setHeaders(true)).subscribe(data => {
            });

        } else if (type == 'push') {
            name = 'newMessPushNotif';
            value = this.form.newMessPushNotif;

            this.presentToast();

            this.api.http.post(this.api.url + '/user/settings/' + name + '/' + value, {}, this.api.setHeaders(true)).subscribe(data => {
            });
        } else if ('fingerprint') {

            this.api.storage.get('fingerAIO').then((val:any) => {
                if(val){
                    val.setEnableFingerAuth = (this.fingerAuth == true) ? 1 : 0;
                    this.api.setEnableFingerAuth = this.fingerAuth;
                    this.api.faioData = val;
                    this.api.storage.set('fingerAIO', val);
                }
            });
            this.presentToast();
        }


    }

    ionViewWillEnter() {
        this.api.pageName = 'SettingsPage';
    }

}
