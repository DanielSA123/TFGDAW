import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';
import { ArtistService } from 'app/services/artist.service';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService],
})

export class ArtistListComponent implements OnInit {
    public artists: Artist[];
    public titulo: string;
    public identity;
    public token;
    public url;
    public next_page;
    public prev_page;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService) {
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {
        this.getArtists();
    }

    public getArtists() {
        this._route.params.forEach(param => {
            let page = +param['page'];
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;
                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }
            }
            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    let res = response.json();
                    if (!res.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = res.artists;
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

    public onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                let res = response.json();
                if (!res.artist) {
                    alert('Error en el servidor');
                } else {
                    this.getArtists();
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