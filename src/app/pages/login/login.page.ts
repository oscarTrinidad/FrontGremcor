import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Observable, Subscriber, Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.model';

import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario = '';
  contrasenia = '';

  aListUsuarios: Usuario[] = [];

  subscription?: Subscription;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: StorageService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    // this.limpiarUsuario();
    this.usuario = '';
    this.contrasenia = '';
  }

  async iniciar() {
    if(this.usuario.length === 0 || this.contrasenia.length === 0){
      this.mostrarMensaje('Defina el usuario o contraseña!','danger',1500);
      return;
    }

    const pUsuario = this.usuario.trim();

    const dataUsuario: Usuario = {
      sUsuario: pUsuario,
      sContrasenia: this.contrasenia
    }

    const loading = await this.loading();
    await loading.present();

    const exec = await this.usuarioService.loginUsuario(dataUsuario);

    this.subscription = exec.subscribe({
      next: (response: any) => {
        if (response.status) {
          this.mostrarMensaje('Credenciales correctas!','success',1500);
          this.agregarUsuario(response.data);
          setTimeout(() => {
            loading.dismiss();
            // this.router.navigate(['/home']);
            this.navCtrl.navigateRoot('/home');
          }, 1000);
        } else {
          this.mostrarMensaje(response.message,'danger',1500);
          loading.dismiss();
        }
      },
      error: (err) => {
        this.mostrarMensaje('Error durante el login','danger',1500);
        loading.dismiss();
      },
      complete: () => {
      }
    });
  }

  agregarUsuario(data: any) {
    this.storage.agregarStorage('oUsuario',data.usuario);
    this.storage.agregarStorage('sToken',data.token);
  }

  limpiarUsuario() {
    this.storage.eliminarStorage('oUsuario');
  }

  async mostrarMensaje(mensaje: string,color='dark',tiempo=35000) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: tiempo,
      position: 'bottom',
      color: color,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
  
    await toast.present();
  }

  async loading(mensaje = 'Cargando...') {
    const loading = await this.loadingController.create({
      message: mensaje,
      //duration: 2000,
      spinner: 'circles'
    });

    return loading;
  }

}
