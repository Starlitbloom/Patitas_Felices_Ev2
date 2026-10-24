/* PÁGINA — Panel admin de mascotas (ruta /admin/mascotas): CRUD completo. */
import { useState } from 'react'
import type { EstadoMascota, Mascota, RegistroClinico, RegistroVacuna, SolicitudCambio } from '../../types/mascota'
import {
  actualizarMascota,
  agregarRegistroClinico,
  agregarVacuna,
  aprobarSolicitud,
  crearMascota,
  eliminarMascota,
  eliminarVacuna,
  listarMascotas,
  listarSolicitudesPendientes,
  obtenerVacunas,
  rechazarSolicitud,
} from '../../services/mascotasService'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { FiltrosMascotasAdmin, type FiltrosMascotasAdminValor } from '../../componentes/organismos/FiltrosMascotasAdmin'
import { TablaMascotas } from '../../componentes/organismos/TablaMascotas'
import { TablaSolicitudesMascotas } from '../../componentes/organismos/TablaSolicitudesMascotas'
import { TablaHistorialPacientes } from '../../componentes/organismos/TablaHistorialPacientes'
import { DetalleHistorialPaciente } from '../../componentes/organismos/DetalleHistorialPaciente'
import { Modal } from '../../componentes/organismos/Modal'
import { ModalConfirmacion } from '../../componentes/organismos/ModalConfirmacion'
import { FormularioMascota, type DatosFormularioMascota } from '../../componentes/organismos/FormularioMascota'
import { FormularioAtencion } from '../../componentes/organismos/FormularioAtencion'
import { FormularioVacuna } from '../../componentes/organismos/FormularioVacuna'
import { Boton } from '../../componentes/atomos/Boton'

const FILTROS_INICIALES: FiltrosMascotasAdminValor = { texto: '', especie: '' }

type EstadoModal = { tipo: 'crear' } | { tipo: 'editar'; mascota: Mascota } | null
/* Registro clínico que se está llenando: de qué tipo y para qué mascota (null = cerrado) */
type EstadoClinico = { tipo: 'atencion' | 'vacuna'; mascota: Mascota } | null

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>(() => listarMascotas())
  const [filtros, setFiltros] = useState<FiltrosMascotasAdminValor>(FILTROS_INICIALES)
  const [modal, setModal] = useState<EstadoModal>(null)
  const [aEliminar, setAEliminar] = useState<Mascota | null>(null)
  const [solicitudes, setSolicitudes] = useState<SolicitudCambio[]>(() => listarSolicitudesPendientes())
  const [aRechazar, setARechazar] = useState<SolicitudCambio | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)
  const [clinico, setClinico] = useState<EstadoClinico>(null)
    /* Paciente cuyo historial se está viendo (null = ventana cerrada) */
  const [verHistorial, setVerHistorial] = useState<Mascota | null>(null)

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
    /* Foto actual de la mascota (para la tabla de solicitudes) */
  const imagenMascota = (id: string) => mascotas.find((m) => m.id === id)?.imagen ?? ''

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
    /* Guarda la atención en el historial, las vacunas marcadas en el calendario del paciente
     y, si el veterinario cambió el estado del paciente, lo actualiza */
  const guardarAtencion =
    (mascota: Mascota) => (registro: RegistroClinico, estado: EstadoMascota, vacunasNuevas: RegistroVacuna[]) => {
      agregarRegistroClinico(mascota.id, registro)
      vacunasNuevas.forEach((vacuna) => agregarVacuna(mascota.id, vacuna))
      if (estado !== mascota.estado) actualizarMascota(mascota.id, { estado })
      recargar() // vuelve a leer la tabla para que se vea el estado nuevo
      setClinico(null)
      setAviso(`Atención de ${mascota.nombre} registrada correctamente.`)
    }

  /* Guarda la vacuna en el calendario de la mascota y cierra el formulario */
  const guardarVacuna = (mascota: Mascota) => (registro: RegistroVacuna) => {
    agregarVacuna(mascota.id, registro)
    setClinico(null)
    setAviso(`Vacuna de ${mascota.nombre} registrada correctamente.`)
  }
    /* Quita un registro de vacuna (ej: uno de prueba o mal ingresado) y refresca el aviso del formulario */
  const quitarVacuna = (mascota: Mascota) => (indice: number) => {
    eliminarVacuna(mascota.id, indice)
    recargar() // vuelve a dibujar la página para que el aviso muestre las vacunas actualizadas
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
        <TablaSolicitudesMascotas 
          solicitudes={solicitudes} 
          nombreMascota={nombreMascota} 
          imagenMascota={imagenMascota} 
          onAprobar={aprobar} 
          onRechazar={setARechazar} 
        />
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
        <TablaMascotas mascotas={visibles}
          onEditar={(m) => setModal({ tipo: 'editar', mascota: m })} 
          onEliminar={setAEliminar} 
          onAtencion={(m) => setClinico({ tipo: 'atencion', mascota: m })} 
          onVacuna={(m) => setClinico({ tipo: 'vacuna', mascota: m })}
        />
      </section>
            {/* Historial clínico por paciente: una fila por mascota con sus atenciones, vacunas y servicios */}
      <div className="admin-seccion-cabecera">
        <div>
          <h2>Historial clínico de pacientes</h2>
          <p>Revisa las atenciones, vacunas y servicios realizados a cada paciente.</p>
        </div>
      </div>

      <section className="admin-tabla-seccion">
        {/* Usa la lista filtrada: el buscador de arriba también aplica aquí */}
        <TablaHistorialPacientes
          mascotas={visibles}
          onVer={setVerHistorial}
        />
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

      {/* Formulario de atención o de vacuna, según el botón que se pulsó */}
      <Modal
        abierto={clinico !== null}
        titulo={clinico?.tipo === 'vacuna' ? `Registrar vacuna · ${clinico.mascota.nombre}` : `Registrar atención · ${clinico?.mascota.nombre ?? ''}`}
        onCerrar={() => setClinico(null)}
        ancho
      >
        {clinico?.tipo === 'atencion' && (
          <FormularioAtencion
            key={clinico.mascota.id}
            especie={clinico.mascota.especie}
            estadoActual={clinico.mascota.estado}
            aplicadas={obtenerVacunas(clinico.mascota.id)}
            onSubmit={guardarAtencion(clinico.mascota)}
            onCancelar={() => setClinico(null)}
          />
        )}
        {clinico?.tipo === 'vacuna' && (
          <FormularioVacuna
            key={clinico.mascota.id}
            especie={clinico.mascota.especie}
            aplicadas={obtenerVacunas(clinico.mascota.id)}
            onSubmit={guardarVacuna(clinico.mascota)}
            onCancelar={() => setClinico(null)}
            onEliminar={quitarVacuna(clinico.mascota)}
          />
        )}
      </Modal>
      {/* Ventana con el historial completo del paciente (foto, atenciones, servicios y vacunas) */}
      <Modal
        abierto={verHistorial !== null}
        titulo={`Historial · ${verHistorial?.nombre ?? ''}`}
        onCerrar={() => setVerHistorial(null)}
        ancho
      >
        {verHistorial && <DetalleHistorialPaciente mascota={verHistorial} />}
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