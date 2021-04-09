import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Song } from 'app/models/song';
import { GLOBAL } from '../services/GLOBAL';



@Component({
    selector: 'player',
    templateUrl: '../views/player.html',
})

export class PlayerComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public url: string;

    constructor(private _route: ActivatedRoute, private _router: Router) {
        this.titulo = 'Reproductor';
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('player component loaded');
        var song = JSON.parse(localStorage.getItem('actual_song'));
        if (song) {
            this.song = song;
        }
        else {
            this.song = new Song(0, '', '', '', '');
        }
    }


}