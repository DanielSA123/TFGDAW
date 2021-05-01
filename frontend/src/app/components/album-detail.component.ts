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
import { PlaylistService } from 'app/services/playlist.service';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [UserService, ArtistService, AlbumService, SongService, PlaylistService],
})

export class AlbumDetailComponent implements OnInit {
    public album: Album;
    public songs: any[];
    public listas: any[];
    public identity: any;
    public token: string;
    public url: string;
    public albumMessage: string;
    public song: any;


    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,
        private _playlistService: PlaylistService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.url = GLOBAL.url;

    }


    ngOnInit() {
        this.getAlbum();
        this.getListas();
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

    public getListas() {
        this._playlistService.getPlaylists(this.token, this.identity._id).subscribe(
            response => {
                let res = response.json();
                if (!res.playlist) {
                    this._router.navigate(['/']);
                } else {
                    this.listas = res.playlist;
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
        this.song = song;
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'songs/get-song/' + song.file;
        let image_path = this.url + 'albums/get-image/' + song.album.image;

        localStorage.setItem('actual_song', song_player);
        let audio = document.getElementById('mp3-source');
        audio.setAttribute('src', file_path);

        (document.getElementById('reproductor') as any).load();
        (document.getElementById('reproductor') as any).play();
        (document.getElementById('reproductor') as any).onended = () => { this.nextSong(this.song) };

        document.getElementById('playing-song-title').innerHTML = song.name;
        document.getElementById('playing-song-artist').innerHTML = song.album.artist.name;
        if (song.album.image != 'null')
            document.getElementById('playing-song-image').setAttribute('src', image_path);


    }

    public nextSong(actual) {
        let nextIndex = this.songs.findIndex((song) => { return song == actual }) + 1;
        if (nextIndex > this.songs.length - 1) {
            nextIndex = 0;
        }
        this.song = this.songs[nextIndex];

        this.startPlayer(this.song);
    }



    public songToAdd;
    public onOpenModal(song) {
        this.songToAdd = song;
    }

    public addSongToPlaylist(lista) {
        this._playlistService.addSong(this.token, lista._id, this.songToAdd).subscribe(
            response => {
                let res = response.json();
                if (!res.playlist) {
                    alert('Error en el servidor');
                } else {
                    this.albumMessage = "Cancion '" + this.songToAdd.name + "' añadida a la lista '" + res.playlist.name + "'";
                }
            },
            error => {
                var albumMessage = <any>error;
                if (albumMessage != null) {
                    var body = JSON.parse(error._body)
                }
            }
        )
    }
}