import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, } from "@angular/http";
import { GLOBAL } from "./GLOBAL";
import { Album } from "app/models/album";

@Injectable()
export class AlbumService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    public addAlbum(token, album: Album) {
        let params = JSON.stringify(album);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + 'albums', params, { headers: headers });
    }

    public getAlbums(token, artist_id = null) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        if (artist_id != null) {
            return this._http.get(this.url + 'albums/' + artist_id, options);
        } else {
            return this._http.get(this.url + 'albums/', options);
        }
    }


    public getAlbum(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'albums/album/' + id, options);

    }


    public editAlbum(token, id, album: Album) {
        let params = JSON.stringify(album);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'albums/album/' + id, params, { headers: headers });
    }


    public deleteAlbum(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'albums/album/' + id, options);
    }
}