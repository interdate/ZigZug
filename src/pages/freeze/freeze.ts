import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import * as $ from 'jquery';
import {LoginPage} from "../login/login";

/**
 * Generated class for the FreezePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freeze',
  templateUrl: 'freeze.html',
})
export class FreezePage {

  public freezeData: any;
  public form: any;
  public message: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
    this.api.http.get(this.api.url + '/freeze', this.api.header).subscribe((data: any) => {
      this.freezeData = data;
    });
  }

  back() {
    this.navCtrl.pop();
  }

  ionViewWillEnter() {
    this.api.pageName = 'FreezePage';
    this.api.showBackBtn = true;
  }

  submit(){
    this.api.showLoad();
    this.api.http.post(this.api.url + '/freeze', {freeze_account_reason: this.freezeData.form.freeze_account_reason.value}, this.api.setHeaders(true)).subscribe((data: any) => {
      this.api.hideLoad();
      if(data.success){
        this.freezeData.form.freeze_account_reason.value = '';
        this.message = data.message;
        this.api.storage.remove('user_data');
        this.api.setHeaders(false, null, null);
        let alert = this.api.alertCtrl.create({
          message: this.message,
          buttons: [
            {
              text: 'אישור',
              role: 'cancel',
              handler: () => {
                this.logout();
              }
            }
            ]
        });
        alert.present();

      }
    });
  }

  logout(){
    this.api.storage.remove('user_data');
    this.api.setHeaders(false, null, null);
    this.navCtrl.setRoot(LoginPage);
    this.navCtrl.popToRoot();
  }

}
