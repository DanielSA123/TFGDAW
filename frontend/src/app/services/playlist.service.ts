import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, } from "@angular/http";
import { GLOBAL } from "./GLOBAL";
import { Playlist } from "app/models/playlist";

@Injectable()
export class PlaylistService {
    public url: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }


    public addPlaylist(token, playlist: Playlist) {
        let params = JSON.stringify(playlist);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url + 'playlists', params, { headers: headers });
    }


    public getPlaylists(token, user_id = null) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'playlists/' + user_id, options);
    }


    public getPlaylist(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'playlists/playlist/' + id, options);

    }


    public editPlaylist(token, id, playlist: Playlist) {
        let params = JSON.stringify(playlist);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'playlists/playlist/' + id, params, { headers: headers });
    }


    public deletePlaylist(token, id) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'playlists/playlist/' + id, options);
    }


    public addSong(token, id, song) {
        let params = JSON.stringify(song);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'playlists/add-song/' + id, params, { headers: headers });
    }

    public removeSong(token, id, song) {
        let params = JSON.stringify(song);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url + 'playlists/remove-song/' + id, params, { headers: headers });
    }
}