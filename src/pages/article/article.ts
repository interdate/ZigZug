import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as $ from "jquery";
import {ApiProvider} from "../../providers/api/api";
/**
 * Generated class for the ArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  article: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
    this.api.showLoad();
    this.api.http.get(this.api.siteUrl + '/open_api/v2/article/' + this.navParams.get('id'), this.api.setHeaders(false)).subscribe(
      data => {
        let res: any = data;
        //alert(JSON.stringify(data));
        console.log('page: ', res);
        this.article = res.success;
        this.api.hideLoad();
        $('#content').html(this.article.pageText);
        //this.content.scrollToTop(300);
      }, err => {
        console.log('register: ', err);
        this.article = {
          title: 'Page Error',
          pageText: err.error
        };
        $('#content').html(this.article.pageText);
        this.api.hideLoad();
      }
    );
  }

  ionViewWillLeave() {
    $('.back-btn').hide();
  }

  ionViewWillEnter() {
    this.api.pageName = 'ArticlePage';
    $('.back-btn').show();
  }

}
