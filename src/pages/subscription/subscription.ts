import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {VipModal2Page} from "../vip-modal2/vip-modal2";
// import {VipModalPage} from "../vip-modal/vip-modal";
import * as $ from 'jquery';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

    data: any;
    form: any;
    coupon: any = '';
    vipTexts: any;
    user: any
    browser: any;
    checkPaymentInterval: any

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider,
        public iab: InAppBrowser,
        public modalController: ModalController,
    ) {
        this.getSubscriptions()
    }


    getSubscriptions() {

      let str_add: any = (this.coupon == '') ? '' : ('?coupon=' + encodeURIComponent(this.coupon));
      console.log(str_add);
      this.api.http.get(this.api.url + '/user/subscriptions' + str_add, this.api.setHeaders(true)).subscribe( data => {
          var res:any = data;
          this.vipTexts = res.vip.vipTexts;
          this.api.hideLoad();
          // if(res.status == 'toPay'){
          //     this.data = res.data;
          // }else
          console.log(res);
          console.log(this.vipTexts);
          if(res.status == 'login' && res.userIsPaying == 1) {
            this.navCtrl.setRoot(HomePage);
            this.navCtrl.popToRoot();
          }else{
            this.data = res.data;
          }
          if(res.form) {
            this.form = res.form;
          }else{
            if(!this.form){
              // this.form = {
              //   action: 'https://redirect.telepay.co.il',
              //   formId: '29593a53-a058-eb11-b847-ecebb895de82',//'da65b885-9360-e711-9802-d89d6714734f',
              //   mobile: '1',
              //   userId: this.api.myId,
              //   product: 79.00,
              //   payPeriod: -1
              // }
            }
          }
        }
      );
    }

    sendCoupon(){
      //if(this.coupon != ''){

      this.getSubscriptions();
      //}
    }

    clearCoupon(){
      if(this.coupon != ''){
        this.coupon = '';
        this.getSubscriptions();
      }
    }

    async sendForm(subsc){

      console.log('endForm(subsc)', subsc)
        let opt: any = 0;
        if (subsc.opt) {
          opt = subsc.opt;
        }

        if (typeof this.api.myId == 'undefined' && !this.form) {
            setTimeout( () => {
              this.sendForm(opt);
            },500);
        } else {
          if (subsc.canVip) {
            const vipModal = this.api.modalCtrl.create(VipModal2Page, {
              data: {
                subsc,
                user: this.user,
                vipPricePerMonth: 29,
              }
            })
            vipModal.present();

            vipModal.onDidDismiss(data => {

              this.openPayForm(subsc)

            })
          } else {
            this.openPayForm(subsc)
          }

            // this.api.showLoad();



        }

    }

  openPayForm(subsc) {
    console.log(subsc)
      var price = subsc.price;
      var payPeriod = subsc.payPeriod;
      if (subsc.opt > 0) {
        if(!this.form){
          this.form = {
            action: 'https://redirect.telepay.co.il',
            formId: '29593a53-a058-eb11-b847-ecebb895de82',//'da65b885-9360-e711-9802-d89d6714734f',
            mobile: '1'
          }
        }
        this.form.userId = this.api.myId;
        this.form.product = price;
        this.form.payPeriod = payPeriod;
        this.form.prc = btoa(subsc.amount);
        this.form.isVip = subsc.isVip ? 1 : 0;
        setTimeout(() => {
          this.checkPaymentInterval = setInterval(() => {
            this.checkPayment();

          }, 10000);

          this.browser = this.iab.create(this.form.action
            + '?formId='  + this.form.formId
            + '&app='  + this.form.mobile
            + '&userId='  + this.form.userId
            + '&product='  + this.form.product
            + '&payPeriod='  + this.form.payPeriod
            + '&prc='  + this.form.prc
            + '&isVip='  + this.form.isVip
            + '&amount='  + 1
          , '_blank', {});

          this.api.hideLoad();


      // }

        })
      }
  }


  checkPayment() {
    this.api.http.get(this.api.url + '/user/paying', this.api.header).subscribe((res: any) => {
      if (res.paying) {
        console.log( this.browser.close());
        clearInterval(this.checkPaymentInterval);
        if (this.api.pageName === 'SubscriptionPage') {
          this.navCtrl.push(HomePage);
        }
      }
    })
  }

    ionViewWillEnter() {
        this.api.pageName = 'SubscriptionPage';
    }

    ionViewWillLeave() {
      clearInterval(this.checkPaymentInterval);
    }

}
