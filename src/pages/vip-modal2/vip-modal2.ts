import {Component, Input} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import * as $ from "jquery";

/**
 * Generated class for the VipModal2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vip-modal2',
  templateUrl: 'vip-modal2.html',
})
export class VipModal2Page {

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public api: ApiProvider,
    public viewCtrl: ViewController,
  ) { }

  vipTexts: any;
  subsc: any;
  vipPricePerMonth: any;
  texts: any;
  data: any;

  user: any;

  params: {list: string};


  ngOnInit() {

    this.getUser();

    if (!this.api.userIsPaying) {
      this.data = this.navParams.get('data');
      this.subsc = this.data.subsc;
    }

    this.api.http.get(this.api.url + '/user/vip', this.api.header).subscribe((data: any) => {
      this.vipTexts = data.vipTexts;
      this.texts = data.vipTexts.actionButtonsText;


      this.vipPricePerMonth = data.vipPricePerMonth;

    });

  }

  getUser() {
    this.api.http.get(this.api.url + '/user/profile/' + this.api.myId, this.api.setHeaders(true)).subscribe(data => {
      console.log('user data: ' , data);
      this.user = data;
    });
  }



  ionViewWillEnter() {
    $(document).on('backbutton', () => {
      // this.modalCtrl.dismiss();
    });

    this.data = this.navParams.get('data');
  }

  ionViewWillLeave() {
    $(document).off();
  }




  close(isVip: boolean) {
    if (isVip) {
      // alert(this.subsc.noVipAmount)
      // alert(this.subsc.period)
      // alert(this.vipPricePerMonth)
      if (!this.api.userIsPaying) {
        this.subsc.amount = this.subsc.vipPrice
        this.subsc.amount = this.subsc.vipPrice
        this.subsc.isVip = isVip;
        this.viewCtrl.dismiss({newsubsc: this.subsc});
      }
      // alert( this.subsc.amount)
    }
    this.viewCtrl.dismiss({isVip});

  }

  setDefaults() {
    this.params = {list: ''};
  }

}
