import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { Playlist } from '../models/playlist';
import { UserService } from '../services/user.service';
import { PlaylistService } from '../services/playlist.service';
import { GLOBAL } from '../services/GLOBAL';
import { SongService } from 'app/services/song.service';
import { Song } from 'app/models/song';

@Component({
    selector: 'playlist-detail',
    templateUrl: '../views/playlist-detail.html',
    providers: [UserService, PlaylistService, SongService],
})

export class PlaylistDetailComponent implements OnInit {
    public lista: Playlist;
    public songs: Song[];
    public identity: any;
    public token: string;
    public url: string;
    public playlistMessage: string;

    constructor(private _route: ActivatedRoute, private _router: Router,
        private _userService: UserService,
        private _playlistService: PlaylistService) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }


    ngOnInit() {
        this.getPlaylist()
    }

    getPlaylist() {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._playlistService.getPlaylist(this.token, id).subscribe(
                response => {
                    let res = response.json();
                    if (!res.playlist) {
                        this._router.navigate(['/']);
                    } else {
                        this.lista = res.playlist;
                        //obtener albums
                        this.songs = res.playlists.songs;
                    }
                },
                error => {
                    var playlistMessage = <any>error;
                    if (playlistMessage != null) {
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

    public onDeleteSong(song) {
        this._route.params.forEach(param => {
            let id = param['id'];
            this._playlistService.removeSong(this.token, id, song).subscribe(
                response => {
                    let res = response.json();
                    if (!res.playlist) {
                        alert('Error en el servidor');
                    } else {
                        this.getPlaylist();
                    }
                },
                error => {
                    var playlistMessage = <any>error;
                    if (playlistMessage != null) {
                        var body = JSON.parse(error._body)
                    }
                }
            );
        });
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