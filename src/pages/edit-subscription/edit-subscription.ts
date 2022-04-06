import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {VipModal2Page} from "../vip-modal2/vip-modal2";
import {AlertButton, AlertInputOptions} from "ionic-angular/umd/components/alert/alert-options";
import {ContactUsPage} from "../contact-us/contact-us";
import {SubscriptionPage} from "../subscription/subscription";

/**
 * Generated class for the EditSubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-subscription',
  templateUrl: 'edit-subscription.html',
})
export class EditSubscriptionPage {

  data: any;
  no_data: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public api: ApiProvider,
              public alertCtrl: AlertController) {

    if (!this.api.userIsPaying) {
      this.navCtrl.push(SubscriptionPage);
    } else {
      this.api.http.get(this.api.url + '/user/edit/subscription', this.api.header).subscribe((data: any) => {
        if (data.success) {
          this.data = data;
        } else {
          this.no_data = data.no_data;
        }
      })
    }
  }

  onUpgrade() {
    console.log(this.data);
    const vipModal = this.api.modalCtrl.create(VipModal2Page, {
      subsc: this.data.payment,
    })

    vipModal.present();
    vipModal.onDidDismiss(res => {
      if (res.isVip) {

         const alert = this.alertCtrl.create({
            title: this.data.texts.popupAfterSubmit.title,
            message: this.data.texts.popupAfterSubmit.message,
            buttons: [
              {
                text: this.data.texts.popupAfterSubmit.buttons.ok,
                handler: () => {
                  if (this.data.payment.canUpdate) {
                    this.api.http.get(this.api.url + '/user/subscription/add-vip', this.api.header)
                      .subscribe((res: any) => {
                        const alert = this.alertCtrl.create({
                          title: res.title,
                          message: res.success ? res.successText : res.errorText,
                          buttons: [{
                            text: res.ok
                          }],
                        })
                        alert.present();
                        this.api.isVip = res.success;
                      });
                  } else {
                    this.navCtrl.push(ContactUsPage, {
                      texts:
                        {
                          subject: this.data.texts.popupAfterSubmit.contactUsText.title,
                          message: this.data.texts.popupAfterSubmit.contactUsText.message,
                        }
                    });
                  }
                },

              },
              {
                text: this.data.texts.popupAfterSubmit.buttons.cancel
              }
            ]
          })

          alert.present();
        }

    })
  }


  onDowngrade() {
    const alert = this.alertCtrl.create({
      title: this.data.texts.downgradePopup.title,
      message: this.data.texts.downgradePopup.message,
      buttons: [
        {
          text: this.data.texts.downgradePopup.buttons.stayVip
        },
        {
          text: this.data.texts.downgradePopup.buttons.disableVip,
          handler: () => {
            this.api.http.post(this.api.url + '/user/subscription/remove-vip', {}, this.api.header)
              .subscribe((res: any) => {
              const successAlert = this.alertCtrl.create({
                title: res.texts.title,
                message: res.texts.message,
                buttons: [
                  {
                    text: res.texts.buttons.ok
                  }
                ]
              })
              successAlert.present();
              this.data.disableVipUpdate = true;
            })
          }
        }
      ]

    })

    alert.present();
  }


  onUpdateDowngraded() {
    this.api.http.post(this.api.url + '/user/subscription/update-downgraded', {}, this.api.header).subscribe((data: any) => {
      if (data.success) {
        alert(this.data.texts.updateDowngradedPopup.message)
        this.data.disableVipUpdate = false;
        this.api.isVip = true;
      } else {
        alert('משהו השתבש, צור קשר לחידוש')
      }
    })
  }

  ionViewWillEnter() {
    this.api.pageName = 'EditSubscriptionPage';
  }

}
