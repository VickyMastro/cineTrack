import * as v from 'valibot'

export const emailField = v.pipe(v.string(), v.email('Ingresá un correo válido'))
export const passwordField = v.pipe(
  v.string(),
  v.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
)
export const usernameField = v.pipe(
  v.string(),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
)
