import { Injectable } from "@angular/core";
import { Http, Response, Headers, } from "@angular/http";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./GLOBAL";

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    singup(user_to_login, gethash = null) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'users/login', params, { headers: headers });
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != undefined) {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        let token = localStorage.getItem('token');
        if (token != undefined) {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

    register(user_to_register) {
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'users/register', params, { headers: headers });
    }
}
