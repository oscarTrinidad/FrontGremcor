import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public agregarStorage(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async obtenerStorage(key: string) {
    const value = await this._storage?.get(key);
    return value;
  }

  public async eliminarStorage(key: string) {
    await this._storage?.remove(key);
  }

  public async borrarStorage(){
    await this._storage?.clear();
  }

  async validarUsuario(): Promise<boolean> {
    const isLoggedIn = await this.storage.get('oUsuario');
    if(isLoggedIn){
      return true;
    } else {
      return false;
    }
  }
}
