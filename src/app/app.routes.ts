import { Routes } from '@angular/router';
import { HomeComponent } from '@/app/pages/home/home.component';
import { CollectionComponent } from './collection/collection.component';
import {CardsComponent} from '@/app/pages/cards/cards.component';
import {AuthHandlerPageComponent} from '@/app/pages/auth/auth-handler-page/auth-handler-page.component';
import {LoginComponent} from '@/app/pages/auth/login/login.component';
import {LogoutComponent} from '@/app/pages/auth/logout/logout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cards/:setId', component: CardsComponent },
  { path: 'collection', component: CollectionComponent },
  { path: 'auth', component: AuthHandlerPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent }
];
