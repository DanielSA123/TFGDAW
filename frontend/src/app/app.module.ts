import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { appRoutingProviders, routing } from './app.routing';



import { AppComponent } from './app.component';
import { UserEditComponent } from './components/user-edit.component';
import { HomeComponent } from './components/home.component';
import { PlayerComponent } from './components/player.component';

import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { AlbumListComponent } from './components/album-list.component';
import { SongListComponent } from './components/song-list.component';
import { PlaylistAddComponent } from './components/playlist-add.component';
import { PlaylistEditComponent } from './components/playlist-edi.component';
import { PlaylistDetailComponent } from './components/playlist-detail.component';
import { PlaylistListComponent } from './components/playlist-list.component';

import { SearchListComponent } from './components/search-list.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    HomeComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    AlbumListComponent,
    SongAddComponent,
    SongEditComponent,
    SongListComponent,
    SearchListComponent,
    PlayerComponent,
    PlaylistAddComponent,
    PlaylistEditComponent,
    PlaylistDetailComponent,
    PlaylistListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
