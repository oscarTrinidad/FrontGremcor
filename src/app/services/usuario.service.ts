import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:44346/api/'; 

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  generaHeaders(token: string) {
    const reqHeader = new HttpHeaders({
        Authorization: 'Bearer ' + token
    });
    return reqHeader;
  }

  public loginUsuario(usuario: Usuario) {
    return this.http.post<ResponseModel>(this.apiUrl+'Usuario/login', usuario);
  }

  async listaUsuario() {
    const token = await this.storageService.obtenerStorage('sToken');
    const headers = this.generaHeaders(token);
    const usuario = await this.storageService.obtenerStorage('oUsuario');
    const pUsuario: Usuario = {
      sUsuario: usuario.sUsuario
    }
    return this.http.post<ResponseModel>(`${this.apiUrl}Usuario/lista`, pUsuario, { headers });
  }
  async mantenimientoUsuario(pUsuario: Usuario) {
    const token = await this.storageService.obtenerStorage('sToken');
    const headers = this.generaHeaders(token);
    const usuario = await this.storageService.obtenerStorage('oUsuario');
    if (usuario) {
      pUsuario.sUsuario = usuario.sUsuario;
    } else {
      pUsuario.sUsuario = 'SISTEMA';
    }
    return this.http.post<ResponseModel>(`${this.apiUrl}Usuario/mantenimiento`, pUsuario, { headers });
}
}