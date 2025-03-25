import {Component, inject} from '@angular/core';
import {Auth, sendSignInLinkToEmail} from '@angular/fire/auth';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-log-in-button',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './log-in-button.component.html',
  styleUrl: './log-in-button.component.css'
})
export class LogInButtonComponent {
  auth = inject(Auth);
  // provider = new GoogleAuthProvider();

  email = new FormControl("", [Validators.required, Validators.email]);

  onClickAuth() {
    if (!this.email.value) return;
    const email = this.email.value;
    sendSignInLinkToEmail(this.auth, email, {
      url: 'http://localhost:4200/auth/',
      handleCodeInApp: true,
    }).then(() => {
      localStorage.setItem('email', email);
    });
  }

}
