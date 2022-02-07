import { NgModule } from '@angular/core';
import { UserProfileComponent } from './user-profile/user-profile';
import {IonicModule} from "ionic-angular";
@NgModule({
	declarations: [UserProfileComponent],
    imports: [
        IonicModule
    ],
	exports: [UserProfileComponent]
})
export class ComponentsModule {}
