import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './collection/collection.component';
import { ApexGenComponent } from './apex-gen/apex-gen.component';
import { MythicalIslandComponent } from './mythical-island/mythical-island.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path : 'home', component: HomeComponent },
    { path : 'apexGen', component: ApexGenComponent },
    { path : 'collection', component: CollectionComponent },
    { path : 'mythicalIsland', component: MythicalIslandComponent },
];
