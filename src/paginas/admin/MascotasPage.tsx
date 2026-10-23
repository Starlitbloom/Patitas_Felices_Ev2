/* PÁGINA — Panel admin de mascotas (ruta /admin/mascotas): CRUD completo. */
import { useState } from 'react'
import type { Mascota } from '../../types/mascota'
import { crearMascota, actualizarMascota, eliminarMascota, listarMascotas } from '../../services/mascotasService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { FiltrosMascotasAdmin, type FiltrosMascotasAdminValor } from '../../componentes/organismos/FiltrosMascotasAdmin'
import { TablaMascotas } from '../../componentes/organismos/TablaMascotas'
import { Modal } from '../../componentes/organismos/Modal'
import { ModalConfirmacion } from '../../componentes/organismos/ModalConfirmacion'
import { FormularioMascota, type DatosFormularioMascota } from '../../componentes/organismos/FormularioMascota'
import { Boton } from '../../componentes/atomos/Boton'

const FILTROS_INICIALES: FiltrosMascotasAdminValor = { texto: '', especie: '' }

type EstadoModal = { tipo: 'crear' } | { tipo: 'editar'; mascota: Mascota } | null

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>(() => listarMascotas())
  const [filtros, setFiltros] = useState<FiltrosMascotasAdminValor>(FILTROS_INICIALES)
  const [modal, setModal] = useState<EstadoModal>(null)
  const [aEliminar, setAEliminar] = useState<Mascota | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const visibles = mascotas.filter(
    (m) =>
      (!filtros.texto.trim() || m.nombre.toLowerCase().includes(filtros.texto.trim().toLowerCase())) &&
      (!filtros.especie || m.especie === filtros.especie),
  )

  const recargar = () => setMascotas(listarMascotas())

  const crear = (datos: DatosFormularioMascota) => {
    const resultado = crearMascota({ ...datos, especie: datos.especie || 'Perro', completo: true })
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    recargar()
    setModal(null)
    setAviso(`Mascota ${resultado.dato.nombre} creada correctamente.`)
  }

  const editar = (id: string) => (datos: DatosFormularioMascota) => {
    const resultado = actualizarMascota(id, { ...datos, especie: datos.especie || 'Perro' })
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    recargar()
    setModal(null)
    setAviso(`Cambios de ${resultado.dato.nombre} guardados.`)
  }

  const confirmarEliminacion = () => {
    if (!aEliminar) return
    eliminarMascota(aEliminar.id)
    setAviso(`Mascota ${aEliminar.nombre} eliminada.`)
    setAEliminar(null)
    recargar()
  }

  return (
    <>
      <EncabezadoAdmin>Mascotas 🐾</EncabezadoAdmin>

      <div className="admin-titulo">
        <p>Administra los pacientes registrados en Patitas Felices.</p>
        <Boton onClick={() => setModal({ tipo: 'crear' })}>+ Nueva mascota</Boton>
      </div>

      {aviso && (
        <div className="admin-aviso" role="status">
          {aviso}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}

      <FiltrosMascotasAdmin
        filtros={filtros}
        onCambio={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_INICIALES)}
        totalResultados={visibles.length}
      />

      <section className="admin-tabla-seccion">
        <TablaMascotas mascotas={visibles} onEditar={(m) => setModal({ tipo: 'editar', mascota: m })} onEliminar={setAEliminar} />
      </section>

      <Modal abierto={modal !== null} titulo={modal?.tipo === 'editar' ? 'Editar mascota' : 'Nueva mascota'} onCerrar={() => setModal(null)} ancho>
        {modal?.tipo === 'crear' && <FormularioMascota modo="crear" onSubmit={crear} onCancelar={() => setModal(null)} />}
        {modal?.tipo === 'editar' && (
          <FormularioMascota
            key={modal.mascota.id}
            modo="editar"
            valoresIniciales={modal.mascota}
            onSubmit={editar(modal.mascota.id)}
            onCancelar={() => setModal(null)}
          />
        )}
      </Modal>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar mascota"
        mensaje={`¿Eliminar a ${aEliminar?.nombre ?? ''}? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}