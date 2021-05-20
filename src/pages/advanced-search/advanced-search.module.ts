import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdvancedSearchPage } from './advanced-search';

@NgModule({
  declarations: [
    AdvancedSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(AdvancedSearchPage),
  ],
})
export class AdvancedSearchPageModule {}
