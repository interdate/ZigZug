import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the SelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {

    data: any;
    options: any = [];
    viewEmpty: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public api: ApiProvider
    ) {
        this.data = this.navParams.get('data');
        console.log(this.data);
        console.log(this.api.pageName);
        this.viewEmpty = (this.api.pageName == 'RegisterPage') ? false : true;
        if(!this.viewEmpty){
            for(var i in this.data.choices){
                var choice = this.data.choices[i];
                if(choice.label !== '') {
                    this.options.push(choice);
                }
            }
        }else {
            this.options = this.data.choices;
        }
        //this.addOption();
    }

    /*addOption(){
        if(this.opt_add) {
            let start = 0;
            let finish = this.data.choices.length;
            if (this.page == 1 && finish > this.count) {
                finish = this.count;
            } else {
                start = this.count * (this.page - 1);
                finish = this.count * this.page;
                if (finish > this.data.choices.length) {
                    finish = this.data.choices.length;
                }
            }

            let i: any = 0;
            for (let opt of this.data.choices) {
                if (i >= start && i < finish) {
                    this.options.push(opt);
                }
                i++;
            }
        }
    }*/

    getItems(ev: any) {
        // Reset items back to all of the items
        this.options = this.data.choices;

        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            //this.opt_add = false;
            this.options = this.options.filter((item) => {
                return (item.label.indexOf(val.toLowerCase()) > -1);
            })
        }
    }

    close(){
        this.navCtrl.pop();
    }

    getItem(item){
        this.viewCtrl.dismiss(item);
    }

    /*moreItems(infiniteScroll: any) {
        this.page++;
        this.addOption();
        setTimeout(() => {
            infiniteScroll.complete();
        }, 500);
    }*/

}
