import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Artist } from '../models/artist';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/GLOBAL';
import { AlbumService } from 'app/services/album.service';
import { Album } from 'app/models/album';
import { Song } from 'app/models/song';
import { SongService } from 'app/services/song.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, ArtistService, AlbumService, SongService],
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public songs: Song[];
    public identity: any;
    public token: string;
    public url: string;
    public albumMessage: string;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {
        console.log('Album-detail component loaded');
        this.getAlbum()
    }

    getAlbum() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = res.album;
                        //obtener canciones
                        this._songService.getSongs(this.token, res.album._id).subscribe(
                            response => {
                                let res = response.json();
                                if (!res.songs) {
                                    this.albumMessage = 'No hay canciones';
                                } else {
                                    this.songs = res.songs;
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

    public onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                let res = response.json();
                if (!res.song) {
                    alert('Error en el servidor');
                } else {
                    this.getAlbum();
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

    public startPlayer(song) {
        let song_player = JSON.stringify(song);
        console.log(song);

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