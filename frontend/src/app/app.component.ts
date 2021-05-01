import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/GLOBAL';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService],
})
export class AppComponent implements OnInit {
  public title = 'TFG DANIEL';
  public user: User;
  public userReg: User;
  public identity;
  public token;
  public errorMessage;
  public registerMessage;
  public url;


  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '', '')
    this.userReg = new User('', '', '', '', '', 'ROLE_USER', '', '')
    this.url = GLOBAL.url
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

  }

  public onSubmit() {
    this._userService.singup(this.user).subscribe(
      response => {
        let identity = response.json().user;
        this.identity = identity;
        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          //crear sesion en local storage
          localStorage.setItem('identity', JSON.stringify(identity));

          //conseguir el token del usuario
          this._userService.singup(this.user, true).subscribe(
            response => {
              let token = response.json().token;
              this.token = token;
              if (this.token.length <= 0) {
                alert("El token no se ha generado correctamente");
              } else {
                //crear sesion en local storage
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '', '');

              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body)
                this.errorMessage = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body)
          this.errorMessage = body.message;
        }
      }
    );
  }


  public logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.removeItem('actual_song');
    localStorage.clear();
    this.identity = null;
    this.token = null;
    (document.getElementById('reproductor') as any).pause();
    this._router.navigate(['/']);
  }


  public onRegister() {
    this._userService.register(this.userReg).subscribe(
      response => {
        let user = response.json().user;
        this.userReg = user;
        if (!this.userReg._id) {
          this.registerMessage = 'Error al registrarse';
        } else {
          this.registerMessage = "El usuario se ha registrado, identificate con " + this.userReg.email;
          this.userReg = new User('', '', '', '', '', 'ROLE_USER', '', '');
        }
      }
      , error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body)
          this.registerMessage = body.message;
        }
      }
    );

  }
}
