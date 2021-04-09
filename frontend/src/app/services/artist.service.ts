import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, } from "@angular/http";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
import { GLOBAL } from "./GLOBAL";
import { Artist } from "../models/artist";

@Injectable()
export class ArtistService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    public addArtist(token, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + 'artists', params, { headers: headers });
    }

    public getArtists(token, page) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'artists/' + page, options);

    }


    public getArtist(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'artists/artist/' + id, options);

    }


    public editArtist(token, id, artist: Artist) {
        let params = JSON.stringify(artist);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'artists/artist/' + id, params, { headers: headers });
    }


    public deleteArtist(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'artists/artist/' + id, options);
    }
}