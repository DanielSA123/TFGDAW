import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';

import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { SongListComponent } from './components/song-list.component';

import { PlaylistDetailComponent } from './components/playlist-detail.component';
import { PlaylistAddComponent } from './components/playlist-add.component';
import { PlaylistEditComponent } from './components/playlist-edit.component';
import { PlaylistListComponent } from './components/playlist-list.component';
import { SearchListComponent } from './components/search-list.component';



const appRoutes: Routes = [
    { path: '', component: HomeComponent },                         //Página de inicio
    { path: 'artistas/:page', component: ArtistListComponent },     //listar artistas
    { path: 'crear-artista', component: ArtistAddComponent },       //añadir artista
    { path: 'editar-artista/:id', component: ArtistEditComponent }, //editar artista
    { path: 'artista/:id', component: ArtistDetailComponent },      //detalles de un artista
    { path: 'crear-album/:artist', component: AlbumAddComponent },  //añadir album
    { path: 'editar-album/:id', component: AlbumEditComponent },    //editar album
    { path: 'album/:id', component: AlbumDetailComponent },         //detalles de un album
    { path: 'albums/:page', component: AlbumListComponent },        //listar albums
    { path: 'crear-cancion/:album', component: SongAddComponent },  //añadir canción
    { path: 'editar-cancion/:id', component: SongEditComponent },   //editar canción
    { path: 'songs/:page', component: SongListComponent },          //listar canciones
    { path: 'search/:name', component: SearchListComponent },       //buscar canción
    { path: 'lista/:id', component: PlaylistDetailComponent },      //detalles de una lista de reproducción
    { path: 'crear-lista', component: PlaylistAddComponent },       //añadir lista de reproducción
    { path: 'editar-lista/:id', component: PlaylistEditComponent }, //editar lista de reproducción
    { path: 'listas', component: PlaylistListComponent },           //listar listas de reproducción
    { path: 'mis-datos', component: UserEditComponent },            //editar usuario
    { path: '**', component: HomeComponent },                       //(si la ruta no existe)
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);