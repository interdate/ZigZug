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

  article: any = false;
  articles: any = [];
  clear: any = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
    this.api.showLoad();
    if(parseInt(this.navParams.get('id')) > 0) {
      this.api.http.get(this.api.siteUrl + '/open_api/v2/article/' + this.navParams.get('id'), this.api.setHeaders(false)).subscribe(
        data => {
          let res: any = data;
          //alert(JSON.stringify(data));
          console.log('page: ', res);
          this.article = res.success;
          this.api.hideLoad();
          let that = this;
          setTimeout(function () {
            $('#content').html(that.article.pageText.replace("\r\n",'<br>'));
          },20);

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
    }else{
      this.api.storage.get('articles').then((val:any) => {
        if(val){
          this.articles = val;
        }else{
          this.getArticles();
        }
      });
    }
  }

  getArticles() {
    this.articles = [];
    this.api.http.get(this.api.siteUrl + '/open_api/v2/article/0', this.api.setHeaders(false)).subscribe(
      data => {
        let res: any = data;
        //alert(JSON.stringify(data));
        console.log('page: ', res);
        this.articles = res.success;
        this.api.hideLoad();
        //$('#content').html(this.article.pageText);
        //this.content.scrollToTop(300);
      }, err => {
        console.log('articles: ', err);
        this.articles = [{
          id: 0,
          title: 'Page Error',
          text: err.error
        }];
        //$('#content').html(this.article.pageText);
        this.api.hideLoad();
      }
    );
  }

  articleRead(read){
    this.api.storage.set('articles',this.articles);
    this.clear = false;
    this.navCtrl.push(ArticlePage,{id:read.id});
  }

  ionViewWillLeave() {
    if(this.clear){
      this.api.storage.remove('articles');
    }
    this.api.showBackBtn = false;
  }

  ionViewWillEnter() {
    this.api.pageName = 'ArticlePage';
    this.api.showBackBtn = true;
  }

}
