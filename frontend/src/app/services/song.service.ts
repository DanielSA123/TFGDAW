import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, } from "@angular/http";
import { GLOBAL } from "./GLOBAL";
import { Song } from "app/models/song";

@Injectable()
export class SongService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    public addSong(token, song: Song) {
        let params = JSON.stringify(song);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + 'songs', params, { headers: headers });
    }

    public getSongs(token, album_id = null) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        if (album_id != null) {
            return this._http.get(this.url + 'songs/' + album_id, options);
        } else {
            return this._http.get(this.url + 'songs/', options);
        }
    }


    public getSong(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'songs/song/' + id, options);

    }


    public editSong(token, id, song: Song) {
        let params = JSON.stringify(song);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'songs/song/' + id, params, { headers: headers });
    }


    public deleteSong(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'songs/song/' + id, options);
    }
}