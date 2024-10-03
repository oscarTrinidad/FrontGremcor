import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Observable, timer, Subscription } from 'rxjs';
import { Usuario, RolUsuario } from '../../models/usuario.model';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { ResponseModel } from 'src/app/models/response.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // VALORES
  sNombreUsuario: string = '';
  sCorreo: string = '';
  sDni: string = '';
  iRol: number = 0;

  aListRoles: RolUsuario[] = [];

  sUsuario: string = '';
  iTiempo: string = '';
  aListUsuarios: Usuario[] = [];
  oUsuario: Usuario | undefined;
  administrador = false;
  editar = false;
  idUsuario = 0;
  usuariosSubscription?: Subscription;
  bDetalle = true;

  errorUsuario={
    sNombreUsuario: '',
    sCorreo: '',
    sDni: '',
    iRol: ''
  };

  dataLoading: any = null;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: StorageService,
    private alertCtrl: AlertController,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.aListRoles = [
      {
        iIdRol: 0,
        sDescripcion: 'Seleccione'
      },
      {
        iIdRol: 1,
        sDescripcion: 'ADMINISTRADOR'
      },
      {
        iIdRol: 2,
        sDescripcion: 'GESTOR'
      }
    ]
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.aListUsuarios = [];
    this.cancelarEdicion();
    this.leerUsuario();
    this.obtenerUsuarios();
  }

  async obtenerUsuarios(){
    const aUsuarios = await this.storage.obtenerStorage('aUsuarios')??[];
    if(aUsuarios.length > 0){
      this.aListUsuarios = aUsuarios;
    } else {
      this.cargarUsuarios();
    }
  };

  async cargarUsuarios(){
    if(this.dataLoading === null){
      this.dataLoading = await this.loading('Cargando...');
      await this.dataLoading.present();
    }
    const exec = await this.usuarioService.listaUsuario();    
    this.usuariosSubscription = exec.subscribe({
      next: async (response: ResponseModel) => {
        //console.log(response);
        if(response.status){
          this.aListUsuarios = response.data.aUsuarios;
  
          await this.storage.agregarStorage('aUsuarios', response.data.aUsuarios);
        }
        if(this.dataLoading !== null){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }
  
      }, 
      error: (err) => {
  
        //console.log(err);
        this.mostrarMensaje('Error al cargar datos','danger',1500);
        if(this.dataLoading !== null){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }
  
      },
      complete: () =>{
        if(this.dataLoading !== null){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }
      }
    });
  }

  async leerUsuario(){
    this.oUsuario = await this.storage.obtenerStorage('oUsuario');
    if(this.oUsuario){
      this.administrador = this.oUsuario.iRol === 1? true : false;

      if(!this.administrador){
        this.aListRoles = [
          {
            iIdRol: 0,
            sDescripcion: 'Seleccione'
          },
          {
            iIdRol: 2,
            sDescripcion: 'GESTOR'
          }
        ]
      } else {
        this.aListRoles = [
          {
            iIdRol: 0,
            sDescripcion: 'Seleccione'
          },
          {
            iIdRol: 1,
            sDescripcion: 'ADMINISTRADOR'
          },
          {
            iIdRol: 2,
            sDescripcion: 'GESTOR'
          }
        ]
      }
    }
  };

  async agregarUsuario() {
    this.limpiarErrores();
    let error = 0;
    const numerico = /^[0-9]*$/;

    if(this.sNombreUsuario.length === 0){
      this.errorUsuario.sNombreUsuario = 'Definir el nombre';
      error ++;
    }

    if(this.sCorreo.length === 0){
      this.errorUsuario.sCorreo = 'Definir el correo';
      error ++;
    } else {
      const existeCorreo = this.aListUsuarios.find(x=>(x.sCorreo? x.sCorreo.toLowerCase() : '') === this.sCorreo.trim().toLowerCase() && x.iIdUsuario !== this.idUsuario);

      if(existeCorreo){
        this.errorUsuario.sCorreo = 'Correo existente';
        error ++;
      }
    }

    if(this.sDni.length === 0){
      this.errorUsuario.sDni = 'Definir el DNI';
      error ++;
    } else if(!numerico.test(this.sUsuario)){
      this.errorUsuario.sDni = 'El DNI debe ser numérico';
      error ++;
    } else {
      const existeDNI = this.aListUsuarios.find(x=>(x.sDni? x.sDni.toLowerCase() : '') === this.sDni.trim().toLowerCase() && x.iIdUsuario !== this.idUsuario);

      if(existeDNI){
        this.errorUsuario.sDni = 'DNI existente';
        error ++;
      }
    }

    if(this.iRol === 0){
      this.errorUsuario.iRol = 'Seleccione un rol';
      error ++;
    }

    if(error>0){
      return;
    }

    const dataUsuario: Usuario = {
      iIdUsuario: this.idUsuario,
      sNombreUsuario: this.sNombreUsuario.trim(),
      sCorreo: this.sCorreo.trim(),
      sDni: this.sDni.trim(),
      iRol: this.iRol,
      iEstadoUsuario: 1,
      iEstado: 1
    }

    if(this.dataLoading === null){
      this.dataLoading = await this.loading('Cargando...');
      await this.dataLoading.present();
    }

    const exec = await this.usuarioService.mantenimientoUsuario(dataUsuario);
    this.usuariosSubscription = exec.subscribe({
      next: async (response: any) => {
        //console.log(response);
        let sMensajeR = '';

        if (response.status) {
          this.cargarUsuarios();
          setTimeout(() => {
            if(this.editar){
              sMensajeR = 'Se editó el usuario con éxito!';
            } else {
              sMensajeR = 'Se creó el usuario con éxito!';
            }
            this.mostrarMensaje(sMensajeR,'success',2000);
            this.cancelarEdicion();
          }, 200);
        } else {
          sMensajeR = 'Error al momento de mandar datos.';
          if(response.message){
            sMensajeR = response.message;
          }
          
          this.mostrarMensaje(sMensajeR,'danger',2000);
          if(this.dataLoading){
            this.dataLoading.dismiss();
            this.dataLoading = null;
          }
        }
      },
      error: (err) => {

        console.log(err);
        this.mostrarMensaje('Error al momento de mandar datos.','danger',1500);
        if(this.dataLoading){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }

      },
      complete: () => {

      }
    });
  }

  /*CRUD USUARIOS INICIO ------------------------------------------------------------------------------------------------ */

  traerUsuario(item: Usuario){
    this.limpiarErrores();
    this.sNombreUsuario = item.sNombreUsuario || '';
    this.sCorreo = item.sCorreo || '';
    this.sDni = item.sDni || '';
    this.idUsuario = item.iIdUsuario || 0;
    this.iRol = item.iRol || 0;
    this.editar = true;
    this.bDetalle = true;
  }

  cancelarEdicion(){
    this.limpiarErrores();
    this.sNombreUsuario = '';
    this.sCorreo = '';
    this.sDni = '';
    this.iRol = 0;
    this.editar = false;
    this.idUsuario = 0;
  }

  async eliminacionUsuario(usuario: Usuario) {
    const validacion =  await this.validarConfirmacion(`¿Desea continuar con la eliminación del usuario ${usuario.sUsuario}?`);
    if(validacion){
      this.eliminarUsuario(usuario);
    }
  }

  async eliminarUsuario(usuario: Usuario){
    const dataUsuario: Usuario = {
      iIdUsuario: usuario.iIdUsuario,
      iEstado: 0
    }

    if(this.dataLoading === null){
      this.dataLoading = await this.loading('Eliminando...');
      await this.dataLoading.present();
    }

    const exec = await this.usuarioService.mantenimientoUsuario(dataUsuario);
    this.usuariosSubscription = exec.subscribe({
      next: async (response: any) => {
        //console.log(response);
        let sMensajeR = 'Se eliminó el usuario con éxito!';

        if (response.status) {
          this.cargarUsuarios();
          setTimeout(() => {
            this.mostrarMensaje(sMensajeR,'success',2000);
            this.cancelarEdicion();
          }, 200);
        } else {
          sMensajeR = 'Error al momento de mandar datos.';
          if(response.message){
            sMensajeR = response.message;
          }
          
          this.mostrarMensaje(sMensajeR,'danger',2000);
          if(this.dataLoading){
            this.dataLoading.dismiss();
            this.dataLoading = null;
          }
        }
      },
      error: (err) => {

        console.log(err);
        this.mostrarMensaje('Error al momento de mandar datos.','danger',1500);
        if(this.dataLoading){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }

      },
      complete: () => {

      }
    });
  }

  async validarEstado(usuario: Usuario, estado: number){
    const validacion =  await this.validarConfirmacion(`¿Desea ${estado === 1? 'activar' : 'desactivar'} al usuario ${usuario.sUsuario}?`);
    if(validacion){
      this.estadoUsuario(usuario, estado);
    }
  }

  async estadoUsuario(usuario: Usuario, estado: number){
    const dataUsuario: Usuario = {
      iIdUsuario: usuario.iIdUsuario,
      sNombreUsuario: usuario.sNombreUsuario,
      sCorreo: usuario.sCorreo,
      sDni: usuario.sDni,
      iRol: usuario.iRol,
      iEstadoUsuario: estado,
      iEstado: 1
    }

    if(this.dataLoading === null){
      this.dataLoading = await this.loading(`${estado === 1? 'Activando...' : 'Desactivando...'}`);
      await this.dataLoading.present();
    }

    const exec = await this.usuarioService.mantenimientoUsuario(dataUsuario);
    this.usuariosSubscription = exec.subscribe({
      next: async (response: any) => {
        //console.log(response);
        let sMensajeR = '';

        if (response.status) {
          this.cargarUsuarios();
          setTimeout(() => {
            if(estado === 1){
              sMensajeR = 'Se activó al usuario con éxito!';
            } else {
              sMensajeR = 'Se desactivó al usuario con éxito!';
            }
            this.mostrarMensaje(sMensajeR,'success',2000);
            this.cancelarEdicion();
          }, 200);
        } else {
          sMensajeR = 'Error al momento de mandar datos.';
          if(response.message){
            sMensajeR = response.message;
          }
          
          this.mostrarMensaje(sMensajeR,'danger',2000);
          if(this.dataLoading){
            this.dataLoading.dismiss();
            this.dataLoading = null;
          }
        }
      },
      error: (err) => {

        console.log(err);
        this.mostrarMensaje('Error al momento de mandar datos.','danger',1500);
        if(this.dataLoading){
          this.dataLoading.dismiss();
          this.dataLoading = null;
        }

      },
      complete: () => {

      }
    });
  }


  iniciarUsuario(usuario: Usuario): void {

    // setTimeout(() => {
    //   if (tarea.estado === 2) {
    //     this.cancelarUsuario(tarea);
    //   }
    // }, 20000); // 20 segundos
  }

  cancelarUsuario(tarea: Usuario): void {
  }
  /*CRUD USUARIOS FIN ------------------------------------------------------------------------------------------------ */

  changeUsuario(event: any, tipo: string) {
    if(tipo === 'sNombreUsuario'){
      this.errorUsuario.sNombreUsuario = '';
    } else if(tipo === 'sCorreo'){
      this.errorUsuario.sCorreo = '';
    } else if(tipo === 'sDni'){
      this.errorUsuario.sDni = '';
    } else if(tipo === 'iRol'){
      this.errorUsuario.iRol = '';
    }
  }

  validarInput(event: any, tipo: string) {
    // console.log(event);
    if(tipo === 'dni'){
      const pattern = /^[0-9]*$/;
      const inputValue = event.data;
  
      if (!pattern.test(inputValue)) {
        // console.log('ejecuto');
        this.sUsuario = this.sUsuario.replace(/[^0-9]/g, '');
      }
    }

  }

  async validarConfirmacion(mensaje: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'GRUPO GREMCOR',
        message: mensaje,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false) // Resuelve la promesa con false cuando se presiona "No"
          }, {
            text: 'Si',
            handler: () => resolve(true) // Resuelve la promesa con true cuando se presiona "Si"
          }
        ]
      });
      await alert.present();
    });
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

  async cerrarSesion(){
    const validacion =  await this.validarConfirmacion(`¿Desea cerrar sesión?`);
    if(validacion){
      this.storage.borrarStorage();
      this.router.navigate(['/login']);
    }
  }

  limpiarErrores(){
    this.errorUsuario={
      sNombreUsuario: '',
      sCorreo: '',
      sDni: '',
      iRol: ''
    };
  }

}
