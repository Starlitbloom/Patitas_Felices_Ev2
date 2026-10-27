/* =========================================================
   Prueba P04 — Formulario controlado con validación
   Archivo probado: src/componentes/organismos/FormularioLogin.tsx
   Usa un espía (vi.fn) en lugar de la función real de inicio de sesión.
========================================================= */
import { expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { FormularioLogin } from '../componentes/organismos/FormularioLogin'

test('P04 - VALIDACIÓN: FormularioLogin muestra errores con un correo inválido y no envía los datos', () => {
  // Datos de prueba
  const correo = 'maria@hotmail.com'
  const password = '12'
  const alEnviar = vi.fn() // espía: registra si el formulario intentó enviar

  render(<FormularioLogin onSubmit={alEnviar} />)
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/ }))

  expect(screen.getByText('Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.')).toBeInTheDocument()
  expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeInTheDocument()
  expect(alEnviar).not.toHaveBeenCalled()
})
