/* =========================================================
   Prueba P10 — Registrar una atención en la ficha clínica (Fanny Chamorro)
   Archivo probado: src/componentes/organismos/FormularioAtencion.tsx
   Usa un espía (vi.fn) en lugar de la función real que guarda la atención.
========================================================= */

// Herramientas de Vitest: expect (comprobar), test (definir una prueba) y vi (crear espías)
import { expect, test, vi } from 'vitest'
// fireEvent: simula clics y escritura; render: dibuja el componente; screen: busca cosas en la pantalla
import { fireEvent, render, screen } from '@testing-library/react'
// El formulario que se va a probar
import { FormularioAtencion } from '../componentes/organismos/FormularioAtencion'

// Definición de la prueba: el texto es el nombre que aparecerá en el informe
test('P10 - CREATE: la atención no se guarda con datos vacíos y sí se guarda al completarlos', () => {
  // Datos de prueba
  const motivo = 'Control anual'
  const diagnostico = 'Paciente sano'
  const tratamiento = 'Ninguno'
  // Espía: una función falsa que anota si el formulario intentó guardar la atención
  const alGuardar = vi.fn()

  // Dibuja el formulario de un perro, sin vacunas registradas; onCancelar recibe otro espía que no se usa
  render(<FormularioAtencion especie="Perro" estadoActual="al-dia" aplicadas={[]} onSubmit={alGuardar} onCancelar={vi.fn()} />)

  // Vacío: muestra errores y no entrega nada
  // Simula un clic en "Guardar atención" sin haber escrito nada
  fireEvent.click(screen.getByRole('button', { name: 'Guardar atención' }))
  // Debe aparecer el error del campo obligatorio
  expect(screen.getByText('El motivo de consulta es obligatorio.')).toBeInTheDocument()
  // El espía no debe haber sido llamado: no se guardó nada
  expect(alGuardar).not.toHaveBeenCalled()

  // Completo: los errores desaparecen y entrega la atención con los datos escritos
  // Simula escribir el motivo, el diagnóstico y el tratamiento
  fireEvent.change(screen.getByLabelText('Motivo de consulta'), { target: { value: motivo } })
  fireEvent.change(screen.getByLabelText('Diagnóstico'), { target: { value: diagnostico } })
  fireEvent.change(screen.getByLabelText('Tratamiento indicado'), { target: { value: tratamiento } })
  // Elige el primer veterinario/a de la lista (la opción 0 es el texto "Selecciona...")
  const veterinario = screen.getByLabelText('Veterinario/a a cargo') as HTMLSelectElement
  fireEvent.change(veterinario, { target: { value: veterinario.options[1].value } })
  // Simula otro clic en "Guardar atención", ahora con todo completo
  fireEvent.click(screen.getByRole('button', { name: 'Guardar atención' }))

  // El espía debe haber sido llamado exactamente 1 vez
  expect(alGuardar).toHaveBeenCalledTimes(1)
  // La atención entregada lleva el motivo que se escribió
  expect(alGuardar.mock.calls[0][0].motivo).toBe(motivo)
})