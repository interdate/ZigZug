import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestVirtualScrollPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test-virtual-scroll',
  templateUrl: 'test-virtual-scroll.html',
})
export class TestVirtualScrollPage {

  items = {
    test1: '1',
    test2: '1',
    test3: '1',
    test4: '1',
    test5: '1',
    test6: '1',
    test7: '1',
    test8: '1',
    test9: '1',
    test10: '1',
    test11: '1',
    test12: '1',
    test13: '1',
    test14: '1',
    test15: '1',
    test16: '1',
    test17: '1',
    test18: '1',
    test19: '1',
    test20: '1',
    test22: '1',
    test23: '1',
    test24: '1',
    test25: '1',
    test26: '1',
    test27: '1',
    test28: '1',
    test29: '1',
    test30: '1',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestVirtualScrollPage');
  }

}
