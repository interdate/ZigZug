import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {RegisterPage} from "../register/register";
import {LoginPage} from "../login/login";

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {

  public showLoader: any = false;
  public loader: any = true;
  public users: any;
  public params: any;
  public page_counter: any;
  // public user_counter: any;


  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiProvider
  ) {
    this.page_counter = 1;
    this.params = {
      'page': this.page_counter,
      'gender': this.navParams.get('gender'),
      'ageFrom': this.navParams.get('ageFrom'),
      'ageTo': this.navParams.get('ageTo')
    };

    this.getUsers();
  }

  back() {
    this.navCtrl.pop();
  }

  getUsers(){
    this.api.http.post(this.api.siteUrl + '/open_api/users/search/', this.params, this.api.setHeaders(false)).subscribe(data => {
      let res: any = data;
      this.api.hideLoad();
      this.users = res.users;

      // this.user_counter = res.users.length;
      if (res.users.length < res.usersCount) {
        this.loader = false;
      }
      //console.log(this.users);
      //alert(123);

    }, err => {
      this.api.hideLoad();

      // if(err.status == 403 ){
      //   this.navCtrl.setRoot(LoginPage, {error: err.error});
      //   this.navCtrl.popToRoot();
      // }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
  }

  itemTapped(user) {
    this.navCtrl.push(RegisterPage);
  }

  moreUsers(infiniteScroll?: any) {

    if (this.loader) {
      this.loader = false;
      this.showLoader = true;
      this.page_counter++;
      this.params.page = this.page_counter;
      // this.params_str = JSON.stringify(this.params);

      this.api.http.post(this.api.siteUrl + '/open_api/users/search/', this.params, this.api.setHeaders(false)).subscribe(data => {
        let res: any = data;
        this.api.hideLoad();
        if (res.users.length == res.usersCount) {
          this.loader = true;
        }

        this.users = this.users.concat(res.users);
        this.showLoader = false;
        //console.log(res.users,res.users.concat(this.users));
        //console.log(this.users);
        if(infiniteScroll) {
          infiniteScroll.complete();

        }
      },error => {
        this.api.hideLoad();
      });

    }
  }

  ionViewWillEnter() {
    this.api.pageName = 'SearchResultsPage';
  }

}
