import {Component, inject} from '@angular/core';
import {Auth, sendSignInLinkToEmail} from '@angular/fire/auth';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatButton,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './login.component.html',
  styleUrl: './log-in-button.component.css'
})
export class LoginComponent {
  auth = inject(Auth);

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
