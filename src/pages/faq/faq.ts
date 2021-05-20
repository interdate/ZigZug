import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

import * as $ from 'jquery';
/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

    page: any = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        this.getPageData();
    }

    toggleAnswer(i1,i){
        $('#q_'+ i1 + i).find('.answer').toggle();
    }

    getPageData() {
        this.api.http.get(this.api.url + '/faq', this.api.header).subscribe(data => {
            let res: any = data;
            this.page = res;
            console.log(this.page);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FaqPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'FaqPage';
    }

}
