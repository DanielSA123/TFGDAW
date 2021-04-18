import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Playlist } from '../models/playlist';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
    selector: 'playlist-list',
    templateUrl: '../views/playlist-list.html',
    providers: [UserService, PlaylistService],
})

export class PlaylistListComponent implements OnInit {
    public listas: Playlist[];
    public titulo: string;
    public identity;
    public token;
    public url;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService) {
        this.titulo = 'Listas de reproduccion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getPlaylists();
    }

    public getPlaylists() {

        this._playlistService.getPlaylists(this.token, this.identity._id).subscribe(
            response => {
                let res = response.json();
                if (!res.playlist) {
                    this._router.navigate(['/']);
                } else {
                    this.listas = res.playlist;
                }
            },
            error => {
                var playlistMessage = <any>error;
                if (playlistMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        );
    }

    public confirmado;
    public onDeleteConfirm(id) {
        this.confirmado = id;
    }

    public onDeleteCancel() {
        this.confirmado = null;
    }

    public onDeletePlaylist(id) {
        this._playlistService.deletePlaylist(this.token, id).subscribe(
            response => {
                let res = response.json();
                if (!res.playlist) {
                    alert('Error en el servidor');
                } else {
                    this.getPlaylists();
                }
            },
            error => {
                var playlistMessage = <any>error;
                if (playlistMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        );
    }


}