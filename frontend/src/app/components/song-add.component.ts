import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Song } from 'app/models/song';
import { SongService } from 'app/services/song.service';
import { GLOBAL } from '../services/GLOBAL';

import { UserService } from '../services/user.service';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [UserService, SongService],
})

export class SongAddComponent implements OnInit {
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public songMessage: string;
    public song: Song;

    ngOnInit() {
        console.log('Song-add component loaded');
    }

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _songService: SongService) {
        this.titulo = 'Añadir cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song(1, '', '', '', '');
    }

    public onSubmit() {
        this._route.params.forEach(param => {
            let album_id = param['album'];
            this.song.album = album_id;
            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    if (!response.json().song) {
                        this.songMessage = "No se ha creado la cancion";
                    } else {
                        this.song = response.json().song;
                        this._router.navigate(['/editar-cancion/' + response.json().song._id]);
                    }
                },
                error => {
                    var songMessage = <any>error;
                    if (songMessage != null) {
                        var body = JSON.parse(error._body)
                        this.songMessage = body.message;
                    }
                }
            );
        });
    }
}