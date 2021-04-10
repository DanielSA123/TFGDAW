import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';
import { SongService } from 'app/services/song.service';
import { Song } from 'app/models/song';

@Component({
    selector: 'song-list',
    templateUrl: '../views/song-list.html',
    providers: [UserService, SongService],
})

export class SongListComponent implements OnInit {
    public titulo: string;
    public songs: Song[];
    public identity: any;
    public token: string;
    public url: string;
    public songMessage: string;
    public prev_page;
    public next_page;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _songService: SongService) {
        this.titulo = "Lista de canciones";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {

        this.getSongs()
    }

    getSongs() {
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
            this._songService.getSongsPag(this.token, page).subscribe(
                response => {
                    let res = response.json();
                    if (!res.songs) {
                        this._router.navigate(['/']);
                    } else {

                        this.songs = res.songs;
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


    public confirmado;
    public onDeleteConfirm(id) {
        this.confirmado = id;
    }

    public onDeleteCancel() {
        this.confirmado = null;
    }

    public onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                let res = response.json();
                if (!res.song) {
                    alert('Error en el servidor');
                } else {
                    this.getSongs();
                }
            },
            error => {
                var songMessage = <any>error;
                if (songMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        );
    }


    public startPlayer(song) {
        let song_player = JSON.stringify(song);


        let file_path = this.url + 'songs/get-song/' + song.file;
        let image_path = this.url + 'albums/get-image/' + song.album.image;

        localStorage.setItem('actual_song', song_player);
        document.getElementById('mp3-source').setAttribute('src', file_path);
        (document.getElementById('reproductor') as any).load();
        (document.getElementById('reproductor') as any).play();
        document.getElementById('playing-song-title').innerHTML = song.name;
        document.getElementById('playing-song-artist').innerHTML = song.album.artist.name;
        if (song.album.image != 'null')
            document.getElementById('playing-song-image').setAttribute('src', image_path);

    }
}