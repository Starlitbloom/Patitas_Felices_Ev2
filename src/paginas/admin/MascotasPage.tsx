/* PÁGINA — Panel admin de mascotas (ruta /admin/mascotas): CRUD completo. */
import { useState } from 'react'
import type { Mascota, SolicitudCambio } from '../../types/mascota'
import {
  actualizarMascota,
  aprobarSolicitud,
  crearMascota,
  eliminarMascota,
  listarMascotas,
  listarSolicitudesPendientes,
  rechazarSolicitud,
} from '../../services/mascotasService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { FiltrosMascotasAdmin, type FiltrosMascotasAdminValor } from '../../componentes/organismos/FiltrosMascotasAdmin'
import { TablaMascotas } from '../../componentes/organismos/TablaMascotas'
import { TablaSolicitudesMascotas } from '../../componentes/organismos/TablaSolicitudesMascotas'
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
  const [solicitudes, setSolicitudes] = useState<SolicitudCambio[]>(() => listarSolicitudesPendientes())
  const [aRechazar, setARechazar] = useState<SolicitudCambio | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const visibles = mascotas.filter(
    (m) =>
      (!filtros.texto.trim() || m.nombre.toLowerCase().includes(filtros.texto.trim().toLowerCase())) &&
      (!filtros.especie || m.especie === filtros.especie),
  )

  const recargar = () => {
    setMascotas(listarMascotas())
    setSolicitudes(listarSolicitudesPendientes())
  }

  const nombreMascota = (id: string) => mascotas.find((m) => m.id === id)?.nombre ?? id

  const aprobar = (solicitud: SolicitudCambio) => {
    aprobarSolicitud(solicitud.id)
    recargar()
    setAviso(`Cambios de ${nombreMascota(solicitud.mascotaId)} aprobados.`)
  }

  const confirmarRechazo = () => {
    if (!aRechazar) return
    rechazarSolicitud(aRechazar.id)
    setAviso(`Solicitud de ${nombreMascota(aRechazar.mascotaId)} rechazada.`)
    setARechazar(null)
    recargar()
  }

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
      <EncabezadoAdmin>Mantenedor de mascotas 🐾</EncabezadoAdmin>

      {aviso && (
        <div className="admin-aviso" role="status">
          {aviso}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}

      <div className="admin-seccion-cabecera">
        <div>
          <h2>Solicitudes de cambio pendientes</h2>
          <p>Cambios que un dueño propuso sobre una mascota ya registrada.</p>
        </div>
      </div>

      <section className="admin-tabla-seccion">
        <TablaSolicitudesMascotas solicitudes={solicitudes} nombreMascota={nombreMascota} onAprobar={aprobar} onRechazar={setARechazar} />
      </section>

      <div className="admin-seccion-cabecera">
        <div>
          <h2>Mascotas registradas</h2>
          <p>Administra los pacientes registrados en Patitas Felices.</p>
        </div>
        <Boton variante="exportar" onClick={() => setModal({ tipo: 'crear' })}>
          + Nueva mascota
        </Boton>
      </div>

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

      <ModalConfirmacion
        abierto={aRechazar !== null}
        titulo="Rechazar solicitud"
        mensaje="¿Rechazar esta solicitud de cambio?"
        textoConfirmar="Rechazar"
        onConfirmar={confirmarRechazo}
        onCancelar={() => setARechazar(null)}
      />
    </>
  )
}