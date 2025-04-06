import { CommonModule } from '@angular/common';
import {Component, inject, OnInit, signal} from '@angular/core';
import {Auth, isSignInWithEmailLink, signInWithEmailLink} from '@angular/fire/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-handler-page',
  imports: [CommonModule],
  template: '@if(error()){{{error()}}}'
})
export class AuthHandlerPageComponent implements OnInit {
  auth = inject(Auth);
  router = inject(Router);

  error = signal<string|null>(null);

  ngOnInit() {
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      const email = localStorage.getItem('email');
      if (!email) {
        this.error.set('For security reasons, you must do the auth flow from a single device.');
        return;
      }
      signInWithEmailLink(this.auth, email, window.location.href).then(console.log);
      this.router.navigate(['/']);
      sessionStorage.setItem('showLoginSuccess', 'true');
    }
  }
}
