import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService],
})

export class ArtistListComponent implements OnInit {
    public artists: Artist[];
    public titulo: string;
    public identity;
    public token;
    public url;

    ngOnInit() {
        console.log('Artist-list component loaded');

        //getListado
    }

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService) {
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
}