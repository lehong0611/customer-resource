import { Routes } from '@angular/router';

import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { OrderComponent } from '../../order/order.component';
//import { FeeComponent } from '../../fee/fee.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'quan-ly-don-hang',   component: OrderComponent },
    //{ path: 'bieu-phi',   component: FeeComponent }
];
