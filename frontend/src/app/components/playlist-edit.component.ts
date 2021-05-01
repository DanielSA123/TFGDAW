import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Playlist } from '../models/playlist';
import { UserService } from '../services/user.service';
import { PlaylistService } from '../services/playlist.service';
import { GLOBAL } from '../services/GLOBAL';
import { UploadService } from 'app/services/upload.service';

@Component({
    selector: 'playlist-edit',
    templateUrl: '../views/playlist-add.html',
    providers: [UserService, PlaylistService, UploadService],
})

export class PlaylistEditComponent implements OnInit {
    public lista: Playlist;
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public playlistMessage: string;
    public is_edit;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService,
        private _uploadService: UploadService) {
        this.titulo = 'Editar lista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.lista = new Playlist('', '', '', []);
        this.is_edit = true;
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getPlaylist()
    }

    getPlaylist() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._playlistService.getPlaylist(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.playlist) {
                        this._router.navigate(['/']);
                    } else {
                        this.lista = res.playlist;
                    }
                },
                error => {
                    var playlistMessage = <any>error;
                    if (playlistMessage != null) {
                        var body = JSON.parse(error._body)
                    }
                }
            );
        });
    }



    public onSubmit() {
        this._route.params.forEach((param) => {
            let id = param['id'];
            this._playlistService.editPlaylist(this.token, param['id'], this.lista).subscribe(
                response => {
                    let res = response.json();
                    if (!response.json().playlist) {
                        this.playlistMessage = "prueba";
                    } else {

                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.url + 'playlists/upload-image/' + id, [], this.filesToUpload, this.token, 'image')
                                .then((result: any) => {

                                }).catch((res) => { });
                        }
                        this._router.navigate(['/']);
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
        });
    }



    public filesToUpload: Array<File>;
    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}