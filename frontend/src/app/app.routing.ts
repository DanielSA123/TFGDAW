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
import { PlaylistEditComponent } from './components/playlist-edi.component';
import { PlaylistListComponent } from './components/playlist-list.component';
import { SearchListComponent } from './components/search-list.component';



const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'artistas/:page', component: ArtistListComponent },
    { path: 'crear-artista', component: ArtistAddComponent },
    { path: 'editar-artista/:id', component: ArtistEditComponent },
    { path: 'artista/:id', component: ArtistDetailComponent },
    { path: 'crear-album/:artist', component: AlbumAddComponent },
    { path: 'editar-album/:id', component: AlbumEditComponent },
    { path: 'album/:id', component: AlbumDetailComponent },
    { path: 'albums/:page', component: AlbumListComponent },
    { path: 'crear-cancion/:album', component: SongAddComponent },
    { path: 'editar-cancion/:id', component: SongEditComponent },
    { path: 'songs/:page', component: SongListComponent },
    { path: 'search/:name', component: SearchListComponent },
    { path: 'lista/:id', component: PlaylistDetailComponent },
    { path: 'crear-lista', component: PlaylistAddComponent },
    { path: 'editar-lista/:id', component: PlaylistEditComponent },
    { path: 'listas', component: PlaylistListComponent },
    { path: 'mis-datos', component: UserEditComponent },
    { path: '**', component: HomeComponent },
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);