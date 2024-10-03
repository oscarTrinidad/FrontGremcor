export interface Usuario {
    iIdUsuario?: number;
    sNombreUsuario?: string;
    sCorreo?: string;
    sDni?: string;
    sUsuario?: string;
    sContrasenia?: string;
    iEstadoUsuario?: number;
    sEstadoUsuario?: string;
    iEstado?: number;
    sEstado?: string;
    iRol?: number;
    sRol?: string;
}

export interface RolUsuario {
    iIdRol?: number;
    sDescripcion?: string; 
}