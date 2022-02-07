import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditSubscriptionPage } from './edit-subscription';

@NgModule({
  declarations: [
    EditSubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(EditSubscriptionPage),
  ],
})
export class EditSubscriptionPageModule {}
