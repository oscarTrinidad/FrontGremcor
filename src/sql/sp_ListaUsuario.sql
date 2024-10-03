USE DB_GREMCOR
GO
CREATE PROC SEGURIDAD.sp_ListaUsuario(
@vUsuario VARCHAR(20)
)
AS
BEGIN

DECLARE @iRol INT = 2

SELECT @iRol = iRol FROM SEGURIDAD.TB_USUARIO
WHERE vUsuario = @vUsuario AND iEstado = 1

IF(@iRol = 1)
BEGIN
	SELECT iIdUsuario,ISNULL(vNombreUsuario,'') vNombreUsuario,vCorreo, vDni,    
	vUsuario, iRol,
	CASE iRol WHEN 1 THEN 'ADMINISTRADOR' 
	ELSE 'GESTOR' END AS vRol,
	iEstadoUsuario,
	CASE iEstadoUsuario WHEN 1 THEN 'ACTIVO' 
	ELSE 'INACTIVO' END AS vEstadoUsuario,
	iEstado
	FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
	WHERE iEstado=1 
END
ELSE
BEGIN
	SELECT iIdUsuario,ISNULL(vNombreUsuario,'') vNombreUsuario,vCorreo, vDni,    
	vUsuario, iRol,
	CASE iRol WHEN 1 THEN 'ADMINISTRADOR' 
	ELSE 'GESTOR' END AS vRol,
	iEstadoUsuario,
	CASE iEstadoUsuario WHEN 1 THEN 'ACTIVO' 
	ELSE 'INACTIVO' END AS vEstadoUsuario,
	iEstado
	FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
	WHERE vUsuario = @vUsuario AND iEstado = 1
END

END 