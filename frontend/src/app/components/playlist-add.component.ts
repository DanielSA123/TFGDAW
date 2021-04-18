import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Playlist } from '../models/playlist';
import { UserService } from '../services/user.service';
import { PlaylistService } from '../services/playlist.service';
import { GLOBAL } from '../services/GLOBAL';

@Component({
    selector: 'playlist-add',
    templateUrl: '../views/playlist-add.html',
    providers: [UserService, PlaylistService],
})

export class PlaylistAddComponent implements OnInit {
    public lista: Playlist;
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public playlistMessage: string;

    ngOnInit() {

    }

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService) {
        this.titulo = 'Crear lista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.lista = new Playlist('', '', '', []);
    }

    public onSubmit() {
        this.lista.user = this.identity._id;
        this._playlistService.addPlaylist(this.token, this.lista).subscribe(
            response => {
                if (!response.json().artist) {
                    this.playlistMessage = "No se ha creado la lista";
                } else {
                    this.lista = response.json().playlist;
                    this._router.navigate(['/editar-lista/' + response.json().playlist._id]);
                }
            },
            error => {
                var playlistMessage = <any>error;
                if (playlistMessage != null) {
                    var body = JSON.parse(error._body)
                    this.playlistMessage = body.message;
                }
            }
        );
    }
}