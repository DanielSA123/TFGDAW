import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/GLOBAL';

import { UserService } from '../services/user.service';

import { UploadService } from 'app/services/upload.service';
import { SongService } from 'app/services/song.service';
import { Song } from 'app/models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [UserService, UploadService, SongService],
})

export class SongEditComponent implements OnInit {
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public songMessage: string;
    public song: Song;
    public is_edit;


    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.song = new Song(1, '', '', '', '');
        this.url = GLOBAL.url;
        this.is_edit = true;
    }


    ngOnInit() {
        this.getSong();
    }

    public getSong() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._songService.getSong(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.song) {
                        this._router.navigate(['/']);
                    } else {
                        this.song = res.song;
                    }
                },
                error => {
                    var songMessage = <any>error;
                    if (songMessage != null) {
                        var body = JSON.parse(error._body)
                    }
                }
            );
        });
    }


    public onSubmit() {
        this._route.params.forEach((param) => {
            let id = param['id'];
            this._songService.editSong(this.token, param['id'], this.song).subscribe(
                response => {
                    let res = response.json();
                    if (!response.json().song) {
                        this.songMessage = "No se ha editado la cancion";
                    } else {

                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.url + 'songs/upload-file/' + id, [], this.filesToUpload, this.token, 'file')
                                .then((result: any) => {
                                    this._router.navigate(['album/' + res.song.album]);
                                }).catch((res) => { });
                        }
                        this.songMessage = "Se ha editado la cancion correctamente";
                        this._router.navigate(['album/' + res.song.album]);
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


    public filesToUpload: Array<File>;
    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}