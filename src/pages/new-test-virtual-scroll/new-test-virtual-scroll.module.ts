import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewTestVirtualScrollPage } from './new-test-virtual-scroll';

@NgModule({
  declarations: [
    NewTestVirtualScrollPage,
  ],
  imports: [
    IonicPageModule.forChild(NewTestVirtualScrollPage),
  ],
})
export class NewTestVirtualScrollPageModule {}
