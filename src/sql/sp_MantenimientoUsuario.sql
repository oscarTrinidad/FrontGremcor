USE DB_GREMCOR
GO

CREATE PROC SEGURIDAD.sp_MantenimientoUsuario(
@iIdUsuario INT = 0,
@vNombreUsuario VARCHAR(500) = '',
@vCorreo VARCHAR(500) = '',
@vDni VARCHAR(20) = '',
@iRol INT = 2,
@iEstadoUsuario INT = 0,
@iEstado INT = 0,
@vUsuario VARCHAR(20) = 'SISTEMA' -- Usuario que realiza el cambio
)
AS
BEGIN
/* VALIDACION INICIO -------------------------------------------------------------------------------------------------------------------------------------------------*/
DECLARE @status INT = 1,  @mensaje VARCHAR(700) = '', @cantidadValidacion INT=0, @iEliminar INT=0

IF(@iEstado = 0)
BEGIN
	SET @iEliminar = 1
END

IF(@iEliminar = 0)
BEGIN
	-- VALIDAR DNI

	SELECT @cantidadValidacion = COUNT(iIdUsuario) FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
	WHERE vDni = @vDni AND iEstado = 1 AND iIdUsuario != @iIdUsuario

	IF(@cantidadValidacion>0 AND @status = 1)
	BEGIN
		SET @status = -1
		SET @mensaje = 'Ya existe un usuario con este DNI!'
	END

	-- VALIDAR CORREO

	SELECT @cantidadValidacion = COUNT(iIdUsuario) FROM DB_GREMCOR.SEGURIDAD.TB_USUARIO
	WHERE vCorreo = @vCorreo AND iEstado = 1 AND iIdUsuario != @iIdUsuario

	IF(@cantidadValidacion>0 AND @status = 1)
	BEGIN
		SET @status = -1
		SET @mensaje = 'Ya existe un usuario con este CORREO!'
	END
END
/* VALIDACION FIN ----------------------------------------------------------------------------------------------------------------------------------------------------*/

/* MANTENIMIENTO INICIO ----------------------------------------------------------------------------------------------------------------------------------------------------*/
IF(@status = -1)
BEGIN
	SELECT @status, @mensaje
END
ELSE IF(@iEliminar = 0)
BEGIN
	IF(@iIdUsuario = 0)
	BEGIN
		INSERT INTO SEGURIDAD.TB_USUARIO (vNombreUsuario,vCorreo,vDni,vUsuario,vContrasenia,iEstadoUsuario,iEstado,vUsuarioRegistro,dtFechaRegistro,iRol)
		VALUES (@vNombreUsuario, @vCorreo,@vDni,@vDni,@vDni,@iEstadoUsuario,@iEstado,@vUsuario,GETDATE(),@iRol)

		SET @iIdUsuario=CONVERT(INT,SCOPE_IDENTITY())
	END
	ELSE
	BEGIN
		UPDATE SEGURIDAD.TB_USUARIO
		SET vNombreUsuario = @vNombreUsuario,
			vCorreo = @vCorreo,
			vDni = @vDni,
			vUsuario = @vDni,
			vContrasenia = @vDni,
			iRol = @iRol,
			iEstadoUsuario = @iEstadoUsuario,
			vUsuarioModificacion = @vUsuario,
			dtFechaModificacion = GETDATE()

		WHERE iIdUsuario = @iIdUsuario AND iEstado = @iEstado
	END

	SELECT @iIdUsuario
END
ELSE
BEGIN
	UPDATE DB_GREMCOR.SEGURIDAD.TB_USUARIO
	SET iEstado = 0,
		dtFechaModificacion = GETDATE(),
		vUsuarioModificacion = @vUsuario
	WHERE iIdUsuario = @iIdUsuario AND iEstado = 1

	SELECT @iIdUsuario
END

END
