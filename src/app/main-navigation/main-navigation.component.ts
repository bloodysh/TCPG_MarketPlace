import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Auth, user} from '@angular/fire/auth';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrl: './main-navigation.component.css',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ]
})
export class MainNavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private auth = inject(Auth);
  user$ = user(this.auth);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  routerLinks: {name: string, href: string, loggedOutOnly?: boolean; loggedInOnly?: boolean}[] = [
    {name: 'Home', href: '/home'},
    {name: 'Collections', href: '/collection'},
    {name: 'Current sales', href: '/sales'},
    {name: 'My Sales', href: '/my/sales', loggedInOnly: true},
    {name: 'User Collection', href: '/user-collection', loggedInOnly: true},
    {name: 'Login', href: '/login', loggedOutOnly: true},
    {name: 'Logout', href: '/logout', loggedInOnly: true}
  ] as const;
}
