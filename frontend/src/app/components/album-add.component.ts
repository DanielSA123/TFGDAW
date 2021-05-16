import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/GLOBAL';

import { User } from '../models/user';
import { UserService } from '../services/user.service';

import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';

import { Album } from 'app/models/album';
import { AlbumService } from 'app/services/album.service';

@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService],
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public albumMessage: string;
    public artist: Artist;
    public album: Album

    ngOnInit() {
        this._route.params.forEach(param => {
            this.album.artist = param['artist'];
        })
    }

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService) {
        this.titulo = 'Añadir album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.album = new Album('', '', 2000, '', '','');

    }

    public onSubmit() {
        this._route.params.forEach(param => {
            let artist_id = param['artist'];
            this.album.artist = artist_id;
            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    if (!response.json().album) {
                        this.albumMessage = "No se ha creado el album";
                    } else {
                        this.album = response.json().album;
                        this._router.navigate(['/editar-album/' + response.json().album._id]);
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
}