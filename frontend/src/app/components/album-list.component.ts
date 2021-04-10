import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';
import { AlbumService } from 'app/services/album.service';
import { Album } from 'app/models/album';

@Component({
    selector: 'album-list',
    templateUrl: '../views/album-list.html',
    providers: [UserService, AlbumService],
})

export class AlbumListComponent implements OnInit {
    public titulo: string;
    public albums: Album[];
    public identity: any;
    public token: string;
    public url: string;
    public albumMessage: string;
    public prev_page;
    public next_page;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService) {
        this.titulo = "Lista de albums";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {

        this.getAlbums()
    }

    getAlbums() {
        this._route.params.forEach(param => {
            let page = +param['page'];
            if (!page) {
                page = 1;
            }
            this.next_page = page + 1;
            this.prev_page = page - 1;
            if (this.prev_page == 0) {
                this.prev_page = 1;
            }
            this._albumService.getAlbumsPag(this.token, page).subscribe(
                response => {
                    let res = response.json();
                    if (!res.albums) {
                        this._router.navigate(['/']);
                    } else {
                        this.albums = res.albums;
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
                    this.getAlbums();
                }
            },
            error => {
                var albumMessage = <any>error;
                if (albumMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        );
    }
}