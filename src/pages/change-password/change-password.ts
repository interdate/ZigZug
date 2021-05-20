import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

    form: { form: any } = {form: {oldPassword: {'label':'סיסמה ישנה'}, password: {second: {'label': 'סיסמה חדשה בשנית'}, first: {'label':'סיסמה חדשה'}}, email: {}, _token: {}, text: {}}};

    oldPassword: any;
    first_pass: any;
    second_pass: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider,
        public toastCtrl: ToastController
    ) {
    }

    formSubmit() {

        var params = JSON.stringify({
            changePassword: {
                oldPassword: this.form.form.oldPassword.value,
                password: {
                    first: this.form.form.password.first.value,
                    second: this.form.form.password.second.value
                },
                _token: this.form.form._token.value,
            }
        });

        this.api.http.post(this.api.url + '/passwords', params, this.api.setHeaders(true)).subscribe(data => {
            let res: any = data;
            this.validate(res);
        });
    }

    validate(response) {

        response = response.success;

        this.oldPassword = '';
        this.first_pass = '';
        this.second_pass = '';

        if (response.changed == true) {

            // this.api.setStorageData({label: 'password', value: this.form.form.password.first.value});
            this.api.setHeaders(true, false, this.form.form.password.first.value);
            this.api.storage.get('user_data').then((val) => {
                val.password = this.form.form.password.first.value;
                this.api.storage.set('user_data', val);
            });
            //this.api.storage.set('password', this.form.form.password.first.value);

            if(typeof this.api.faioData.username != 'undefined' && typeof this.api.faioData.password != 'undefined'){
                this.api.faioData.password = this.form.form.password.first.value;
                this.api.storage.set('fingerAIO', this.api.faioData);
            }


            this.form.form.password.first.value = "";
            this.form.form.password.second.value = "";
            this.form.form.oldPassword.value = "";

            this.api.storage.remove('fingerAuth');
            this.api.storage.remove('enableFingerAuth');
            this.api.storage.remove('disableFingerAuthInit');
            this.api.storage.remove('fingerAuthLogin');

            const toast = this.toastCtrl.create({
                message: response.texts.success,
                showCloseButton: true,
                closeButtonText: 'אישור'
            });
            toast.present();

        }
        else{
            this.oldPassword = response.error.oldPassword;
            this.first_pass = response.error.password.first;
            this.second_pass = response.error.password.second;
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'ChangePasswordPage';
    }
}
