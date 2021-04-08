import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/GLOBAL';

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService],
})

export class UserEditComponent implements OnInit {

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public updateMessage;
    public url;

    constructor(
        private _userService: UserService
    ) {

        this.titulo = 'Actualizar mis datos';


        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {

    }

    public onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {

                if (!response.json().user) {
                    this.updateMessage = 'El usuario no se ha actualizado';
                } else {
                    // let user = response.json().user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.updateMessage = 'El usuario se ha actualizado correctamente';
                    document.getElementById('identity_name').innerHTML = this.user.name;
                    if (this.filesToUpload) {
                        this.makeFileRequest(this.url + 'users/upload-image/' + this.user._id, [], this.filesToUpload)
                            .then((result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));

                                let image_path = this.url + 'users/get-image/' + this.user.image;
                                document.getElementById('user_image')
                                    .setAttribute('src', image_path);
                            }).catch((res) => { });
                    }
                }
            },
            error => {
                var updateMessage = <any>error;
                if (updateMessage != null) {
                    var body = JSON.parse(error._body)
                    this.updateMessage = body.message;
                }
            }
        );
    }


    public filesToUpload: Array<File>;
    public fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    public makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        let token = this.token;
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();
            for (let i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}