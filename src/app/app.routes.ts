import { Routes } from '@angular/router';
import { HomeComponent } from '@/app/pages/home/home.component';
import { CollectionComponent } from './collection/collection.component';
import {CardsComponent} from '@/app/pages/cards/cards.component';
import {AuthHandlerPageComponent} from '@/app/pages/auth/auth-handler-page/auth-handler-page.component';
import {LoginComponent} from '@/app/pages/auth/login/login.component';
import {LogoutComponent} from '@/app/pages/auth/logout/logout.component';
import { UserCollectionComponent } from './user-collection/user-collection.component';
import {CardComponent} from '@/app/pages/card/card.component';
import {SellCardComponent} from '@/app/pages/sell-card/sell-card.component';
import {AdminComponent} from '@/app/pages/admin/admin.component';
import {SalesListComponent} from '@/app/pages/sales-list/sales-list.component';
import {MySalesListComponent} from '@/app/pages/my-sales-list/my-sales-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cards/:setId', component: CardsComponent },
  { path: 'cards/:setId/:cardId', component: CardComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'auth', component: AuthHandlerPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'user-collection', component: UserCollectionComponent },
  { path: 'sell/:cardId', component: SellCardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'sales', component: SalesListComponent },
  { path: 'my/sales', component: MySalesListComponent }
];
