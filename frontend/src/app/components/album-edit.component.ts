import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/GLOBAL';

import { UserService } from '../services/user.service';

import { Album } from 'app/models/album';
import { AlbumService } from 'app/services/album.service';
import { UploadService } from 'app/services/upload.service';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService],
})

export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public albumMessage: string;
    public album: Album;
    public is_edit;


    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _uploadService: UploadService) {
        this.titulo = 'Editar album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album('', '', 2000, '', '');
        this.url = GLOBAL.url;
        this.is_edit = true;
    }


    ngOnInit() {

        this.getAlbum();
    }

    public getAlbum() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = res.album;
                    }
                },
                error => {
                    var albumMessage = <any>error;
                    if (albumMessage != null) {
                        var body = JSON.parse(error._body)
                    }
                }
            );
        });
    }


    public onSubmit() {
        this._route.params.forEach((param) => {
            let id = param['id'];
            this._albumService.editAlbum(this.token, param['id'], this.album).subscribe(
                response => {
                    let res = response.json();
                    if (!response.json().album) {
                        this.albumMessage = "No se ha editado el album";
                    } else {

                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.url + 'albums/upload-image/' + id, [], this.filesToUpload, this.token, 'image')
                                .then((result: any) => {
                                    this._router.navigate(['artista/' + res.album.artist]);
                                }).catch((res) => { });
                        }
                        this.albumMessage = "Se ha editado el album correctamente";
                        this._router.navigate(['artista/' + res.album.artist]);
                    }
                },
                error => {
                    var albumMessage = <any>error;
                    if (albumMessage != null) {
                        var body = JSON.parse(error._body)
                        this.albumMessage = body.message;
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