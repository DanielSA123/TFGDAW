import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/GLOBAL';
import { UploadService } from 'app/services/upload.service';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService],
})

export class ArtistEditComponent implements OnInit {
    public artist: Artist;
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public artistMessage: string;
    public is_edit;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService) {
        this.titulo = 'Añadir artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.artist = new Artist('', '', '');
        this.is_edit = true;
        this.url = GLOBAL.url;
    }

    ngOnInit() {


        this.getArtist()
    }

    getArtist() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = res.artist;
                    }
                },
                error => {
                    var artistMessage = <any>error;
                    if (artistMessage != null) {
                        var body = JSON.parse(error._body)
                    }
                }
            );
        });


    }



    public onSubmit() {
        this._route.params.forEach((param) => {
            let id = param['id'];
            this._artistService.editArtist(this.token, param['id'], this.artist).subscribe(
                response => {
                    let res = response.json();
                    if (!response.json().artist) {
                        this.artistMessage = "No se ha editado el artista";
                    } else {

                        if (this.filesToUpload) {
                            this._uploadService.makeFileRequest(this.url + 'artists/upload-image/' + id, [], this.filesToUpload, this.token, 'image')
                                .then((result: any) => {
                                    this._router.navigate(['artistas/1']);
                                }).catch((res) => { });
                        }

                        this._router.navigate(['artistas/1']);
                    }
                },
                error => {
                    var artistMessage = <any>error;
                    if (artistMessage != null) {
                        var body = JSON.parse(error._body)
                        this.artistMessage = body.message;
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