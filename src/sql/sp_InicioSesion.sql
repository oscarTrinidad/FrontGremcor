USE DB_GREMCOR
GO

CREATE PROC SEGURIDAD.sp_InicioSesion(   
@vUsuario VARCHAR(20),      
@vContrasenia VARCHAR(150)
)
AS      
BEGIN

DECLARE @status INT = 1,  @mensaje VARCHAR(700) = '', @cantidadValidacion INT=0

-- VALIDAR ESTADO GENERAL

SELECT @cantidadValidacion = COUNT(iIdUsuario) FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
WHERE iEstado=1       
AND vUsuario = @vUsuario
AND vContrasenia = @vContrasenia

IF(@cantidadValidacion=0 AND @status = 1)
BEGIN
	SET @status = -1
	SET @mensaje = 'No existe un usuario con estas credenciales!'
END

-- VALIDAR ESTADO USUARIO

SELECT @cantidadValidacion = COUNT(iIdUsuario) FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
WHERE iEstadoUsuario=1       
AND vUsuario = @vUsuario
AND vContrasenia = @vContrasenia

IF(@cantidadValidacion=0 AND @status = 1)
BEGIN
	SET @status = -1
	SET @mensaje = 'El usuario con estas credenciales está inactivo!'
END

IF(@status = -1)
BEGIN
	SELECT @status, @mensaje
END
ELSE
BEGIN
	SELECT 1, iIdUsuario,ISNULL(vNombreUsuario,'') vNombreUsuario,vCorreo, vDni,    
	vUsuario, vContrasenia, iRol,
	CASE iRol WHEN 1 THEN 'ADMINISTRADOR' 
	ELSE 'GESTOR' END AS vRol
	FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
	WHERE iEstado=1       
	AND vUsuario = @vUsuario
	AND vContrasenia = @vContrasenia
END  

END 