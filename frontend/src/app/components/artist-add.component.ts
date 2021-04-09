import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/GLOBAL';

@Component({
    selector: 'artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService],
})

export class ArtistAddComponent implements OnInit {
    public artist: Artist;
    public titulo: string;
    public identity: any;
    public token: string;
    public url: string;
    public artistMessage: string;

    ngOnInit() {
        console.log('Artist-add component loaded');

        //getListado
    }

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService) {
        this.titulo = 'Añadir artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.artist = new Artist('', '', '');
    }

    public onSubmit() {
        console.log(this.artist);
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {

                if (!response.json().artist) {
                    this.artistMessage = "No se ha creado el artista";
                } else {
                    this.artist = response.json().artist;
                    this._router.navigate(['/editar-artista'], response.json().artist._id);
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
    }
}