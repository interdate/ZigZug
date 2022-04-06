import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestVirtualScrollPage } from './test-virtual-scroll';

@NgModule({
  declarations: [
    TestVirtualScrollPage,
  ],
  imports: [
    IonicPageModule.forChild(TestVirtualScrollPage),
  ],
})
export class TestVirtualScrollPageModule {}
