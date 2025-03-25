import {Component, inject, OnInit} from '@angular/core';
import {Auth, signOut} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  template: ''
})
export class LogoutComponent implements OnInit {
  auth = inject(Auth);
  router = inject(Router);

  ngOnInit() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }
}
