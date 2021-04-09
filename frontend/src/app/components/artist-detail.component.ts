import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/GLOBAL';
import { AlbumService } from 'app/services/album.service';
import { Album } from 'app/models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService],
})

export class ArtistDetailComponent implements OnInit {
    public artist: Artist;
    public albums: Album[];
    public identity: any;
    public token: string;
    public url: string;
    public artistMessage: string;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {
        console.log('Artist-detail component loaded');
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
                        //obtener albums
                        this._albumService.getAlbums(this.token, res.artist._id).subscribe(
                            response => {
                                let res = response.json();
                                if (!res.albums) {
                                    this.artistMessage = 'No hay albums';
                                } else {
                                    this.albums = res.albums;
                                }
                            },
                            error => {
                                var artistMessage = <any>error;
                                if (artistMessage != null) {
                                    var body = JSON.parse(error._body)
                                }
                            }
                        );
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


    public confirmado;
    public onDeleteConfirm(id) {
        this.confirmado = id;
    }

    public onDeleteCancel() {
        this.confirmado = null;
    }

    public onDeleteAlbum(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                let res = response.json();
                if (!res.album) {
                    alert('Error en el servidor');
                } else {
                    this.getArtist();
                }
            },
            error => {
                var artistMessage = <any>error;
                if (artistMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        );
    }



}