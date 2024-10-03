import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { Usuario } from 'src/app/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const validar = await this.storage.validarUsuario();
    if (validar) {
      return true;
    } else {
      this.storage.borrarStorage();
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}