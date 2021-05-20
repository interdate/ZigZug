import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";
import {AdvancedSearchPage} from "../advanced-search/advanced-search";
import {HomePage} from "../home/home";
import {SelectPage} from "../select/select";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

    age: any;
    areas: Array<{ title: any }>;

    type_search: any = "";
    form: { form: any } = {
        form: {
            username: {value: '',label:''},
            region: { choices: [[]], value: '', label:''},
            ageFrom: {choices: [[]], label: '',value:''},
            ageTo: {choices: [[]], label: '',value:''},
            gender: {choices: [[]], label: '' ,value:''},
            userLookingForGender: {choices: [[]], label: '' ,value:''}
        }
    };

    ageLower: any = 20;
    ageUpper: any = 50;

    default_range: any = { lower: this.ageLower, upper: this.ageUpper }

    constructor(public navCtrl: NavController, public navParams: NavParams, public api:ApiProvider, public actionSheetCtrl: ActionSheetController) {
        this.age = {
            'lower': this.form.form.ageFrom.value,
            'upper': this.form.form.ageTo.value
        };

        this.api.http.get( api.url + '/user/form/search/', api.setHeaders(true) ).subscribe(data => {

            this.form.form = data;

        },err => {
            console.log("Oops!");
        });
    }

    openSelect(field, index) {
        if(typeof field == 'undefined'){
            field = false;
        }
        //console.log(index);
        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {
            if (data) {
                console.log(JSON.stringify(data));
                console.log(JSON.stringify(field));
                //let choosedVal = data.value;
                field["value"] = data.value;
                //if(field.name.indexOf('userBirthday') == -1) {
                field["valLabel"] = data.label;
                // }else{
                //     for(let i=0; i<3; i++){
                //         if(field.name == this.form.fields[index]['sel'][i].name){
                //             this.form.form[index]['sel'][i]['valLabel'] = data.label;
                //         }
                //     }
                //
                // }
                //console.log(JSON.stringify(field));
                this.form.form[index] = field;
                console.log(JSON.stringify(this.form.form[index]));
            }
        });
    }


    toSearchResultsPage(){

        if( this.form.form.username.value == '' ) {
            console.log(this.ageLower);
            console.log(this.ageUpper);

            //console.log('agefrom:'+this.form.form.ageFrom.value);

            let params = JSON.stringify({
                action: 'search',
                searchparams: {
                    region: this.form.form.region.value,
                    agefrom: this.form.form.ageFrom.value,
                    ageto: this.form.form.ageTo.value,
                    gender: this.form.form.gender.value,
                    userLookingForGender: this.form.form.userLookingForGender.value,
                    userNick: ''},
                page: 1,
                usersCount: 20,
                list: '',
                filter: 'lastActivity'

            });

            this.navCtrl.push(HomePage, { params: params });
        }else{
            let params = JSON.stringify({
                action: 'search',
                searchparams: {
                    region: '',
                    agefrom: '',
                    ageto: '',
                    sexpreef: '',
                    meritalstat: '',
                    userNick: this.form.form.username.value
                },
                page: 1,
                list: '',
                filter: 'lastActivity'
            });

            this.navCtrl.push(HomePage, { params: params });
        }
    }

    getAgeValues(event) {
        if( event.value.upper != 0) {
            this.ageUpper = event.value.upper;
        }
        if( event.value.lower != 0) {
            this.ageLower = event.value.lower;
        }
    }

    toAdvancedPage() {
        this.navCtrl.push(AdvancedSearchPage);
    }

    ionViewWillEnter() {
        this.api.pageName = 'SearchPage';
    }

    ionViewDidLoad() {
        this.type_search = 'search-1';
    }

}
