-- Creación de la base de datos
CREATE DATABASE DB_GREMCOR;
GO

-- Usar la base de datos
USE DB_GREMCOR;
GO

-- Creación del esquema SEGURIDAD
CREATE SCHEMA SEGURIDAD;
GO

CREATE TABLE SEGURIDAD.TB_USUARIO (
    iIdUsuario INT IDENTITY(1,1) PRIMARY KEY,
    vNombreUsuario VARCHAR(500) NOT NULL,
    vCorreo VARCHAR(500) NOT NULL UNIQUE,
	vDni VARCHAR(20) NOT NULL UNIQUE,
	vUsuario VARCHAR(20) NOT NULL,
	vContrasenia VARCHAR(150) NOT NULL,
	iEstadoUsuario INT NOT NULL,
	iEstado INT NOT NULL,
	vUsuarioRegistro VARCHAR(20),
	dtFechaRegistro DATETIME,
	vUsuarioModificacion VARCHAR(20),
	dtFechaModificacion DATETIME,
	iRol INT
);
GO
-- DROP TABLE SEGURIDAD.TB_USUARIO

INSERT INTO SEGURIDAD.TB_USUARIO (vNombreUsuario,vCorreo,vDni,vUsuario,vContrasenia,iEstadoUsuario,iEstado,vUsuarioRegistro,dtFechaRegistro,iRol)
VALUES ('Oscar Trinidad', 'racso5741175@gmail.com','71333584','71333584','71333584',1,1,'71333584',GETDATE(),1);

SELECT * FROM SEGURIDAD.TB_USUARIO;