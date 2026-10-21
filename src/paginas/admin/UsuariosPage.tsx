/* PÁGINA (contenedor) — Gestión de usuarios (antes admin/usuarios.html).
   Aquí se integran las 4 operaciones CRUD y los filtros de búsqueda:
     C → modal "Nuevo usuario"     (crearUsuario)
     R → tabla + vista de detalle  (listarUsuarios, /admin/usuarios/:id)
     U → modal "Editar"            (actualizarUsuario)
     D → confirmación "Eliminar"   (eliminarUsuario)
   Toda la información que cambia está en useState; después de cada
   operación se vuelve a leer la lista para reflejar los cambios. */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FiltrosUsuarios as Filtros, Usuario } from '../../types/usuario'
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  filtrarUsuarios,
  listarUsuarios,
} from '../../services/usuariosService'
import { useAuth } from '../../context/AuthContext'
import { exportarUsuarios } from '../../utils/exportarExcel'
import { EncabezadoAdmin } from '../../componentes/organismos/EncabezadoAdmin'
import { FiltrosUsuarios } from '../../componentes/organismos/FiltrosUsuarios'
import { TablaUsuarios } from '../../componentes/organismos/TablaUsuarios'
import { Modal } from '../../componentes/organismos/Modal'
import { ModalConfirmacion } from '../../componentes/organismos/ModalConfirmacion'
import { FormularioUsuario, type DatosFormularioUsuario } from '../../componentes/organismos/FormularioUsuario'
import { AccesoRapido } from '../../componentes/moleculas/AccesoRapido'

const FILTROS_INICIALES: Filtros = { texto: '', rol: '', orden: 'recientes' }

type EstadoModal = { tipo: 'crear' } | { tipo: 'editar'; usuario: Usuario } | null

export default function UsuariosPage() {
  const { usuario: sesion, refrescarSesion } = useAuth()
  const navigate = useNavigate()

  const [usuarios, setUsuarios] = useState<Usuario[]>(() => listarUsuarios())
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES)
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [modal, setModal] = useState<EstadoModal>(null)
  const [aEliminar, setAEliminar] = useState<Usuario | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const visibles = filtrarUsuarios(usuarios, filtros)
  const recargar = () => setUsuarios(listarUsuarios())

  /* ---------- Selección (checkboxes) ---------- */
  const seleccionar = (id: string, marcado: boolean) => {
    setSeleccionados((prev) => {
      const copia = new Set(prev)
      if (marcado) copia.add(id)
      else copia.delete(id)
      return copia
    })
  }
  const seleccionarTodos = (marcado: boolean) =>
    setSeleccionados(marcado ? new Set(visibles.map((u) => u.id)) : new Set())

  /* ---------- CREAR ---------- */
  const crear = (datos: DatosFormularioUsuario) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password2, ...nuevo } = datos
    const resultado = crearUsuario(nuevo)
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    recargar()
    setModal(null)
    setAviso(`Usuario ${resultado.dato.nombre} creado correctamente.`)
  }

  /* ---------- ACTUALIZAR ---------- */
  const editar = (id: string) => (datos: DatosFormularioUsuario) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password2, run, ...cambios } = datos // el RUN no se modifica
    const resultado = actualizarUsuario(id, cambios)
    if (!resultado.ok) return { campo: resultado.campo, mensaje: resultado.mensaje }
    if (resultado.dato.id === sesion?.id) refrescarSesion(resultado.dato) // si el admin se editó a sí mismo
    recargar()
    setModal(null)
    setAviso(`Cambios de ${resultado.dato.nombre} guardados.`)
  }

  /* ---------- ELIMINAR ---------- */
  const confirmarEliminacion = () => {
    if (!aEliminar) return
    eliminarUsuario(aEliminar.id)
    seleccionar(aEliminar.id, false)
    setAviso(`Usuario ${aEliminar.nombre} eliminado.`)
    setAEliminar(null)
    recargar()
  }

  return (
    <>
      <EncabezadoAdmin>Gestión de usuarios 🐾</EncabezadoAdmin>

      <section className="admin-accesos admin-accesos--usuarios">
        <AccesoRapido
          icono="/img/icono-nuevo-usuario.png"
          titulo="Nuevo usuario"
          descripcion="Crea una cuenta con datos completos."
          onClick={() => setModal({ tipo: 'crear' })}
        />
        <AccesoRapido
          icono="/img/icono-mostrar-usuarios.png"
          titulo="Reportes"
          descripcion="Revisa estadísticas de usuarios, mascotas y citas."
          to="/admin/reportes"
        />
      </section>

      {aviso && (
        <div className="admin-aviso" role="status">
          {aviso}
          <button type="button" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
            ✕
          </button>
        </div>
      )}

      <FiltrosUsuarios
        filtros={filtros}
        onCambio={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_INICIALES)}
        onExportar={() => exportarUsuarios(usuarios.filter((u) => seleccionados.has(u.id)), 'usuarios-seleccionados')}
        cantidadSeleccionados={seleccionados.size}
        totalResultados={visibles.length}
      />

      <section className="admin-tabla-seccion">
        <TablaUsuarios
          usuarios={visibles}
          idSesion={sesion?.id}
          seleccionados={seleccionados}
          onSeleccionar={seleccionar}
          onSeleccionarTodos={seleccionarTodos}
          onVer={(u) => navigate(`/admin/usuarios/${u.id}`)}
          onEditar={(u) => setModal({ tipo: 'editar', usuario: u })}
          onEliminar={setAEliminar}
        />
      </section>

      <Modal abierto={modal !== null} titulo={modal?.tipo === 'editar' ? 'Editar usuario' : 'Nuevo usuario'} onCerrar={() => setModal(null)} ancho>
        {modal?.tipo === 'crear' && <FormularioUsuario modo="crear" onSubmit={crear} onCancelar={() => setModal(null)} />}
        {modal?.tipo === 'editar' && (
          <FormularioUsuario
            key={modal.usuario.id}
            modo="editar"
            valoresIniciales={modal.usuario}
            onSubmit={editar(modal.usuario.id)}
            onCancelar={() => setModal(null)}
          />
        )}
      </Modal>

      <ModalConfirmacion
        abierto={aEliminar !== null}
        titulo="Eliminar usuario"
        mensaje={`¿Eliminar la cuenta de ${aEliminar?.nombre ?? ''} ${aEliminar?.apellidos ?? ''}? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}
