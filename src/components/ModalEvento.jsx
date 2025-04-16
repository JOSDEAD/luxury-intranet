import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useEventos } from '../hooks/useEventos'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0px 4px 15px rgba(0,0,0,0.2);
  position: relative;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
`

const Input = styled.input`
  width: 100%;
  margin-bottom: 14px;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #1ebeb6;
    box-shadow: 0 0 0 2px rgba(30, 190, 182, 0.2);
  }
`

const ModalEvento = ({ visible, onClose, onGuardarEvento, evento, eventos = [] }) => {
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [encargado, setEncargado] = useState("")
  const [inicio, setInicio] = useState("")
  const [final, setFinal] = useState("")
  const [modoEdicion, setModoEdicion] = useState(false)
  const [presupuesto, setPresupuesto] = useState("")
  const [pagado, setPagado] = useState("")
  const [comentarios, setComentarios] = useState("")
  const { actualizarEvento } = useEventos()
  
  useEffect(() => {
    if (evento) {
      setNombre(evento.nombre || "")
      setTelefono(evento.telefono || "")
      setUbicacion(evento.ubicacion || "")
      setEncargado(evento.encargado || "")
      setInicio(evento.inicio || "")
      setFinal(evento.final || "")
      setPresupuesto(evento.presupuesto || "")
      setPagado(evento.pagado || "")
      setComentarios(evento.comentarios || "")
      setModoEdicion(!evento.id) // activar edición si es nuevo
    } else {
      setNombre("")
      setTelefono("")
      setUbicacion("")
      setEncargado("")
      setInicio("")
      setFinal("")
      setPresupuesto("")
      setPagado("")
      setComentarios("")
      setModoEdicion(true) // nuevo evento: modo edición
    }
  }, [evento])

  useEffect(() => {
    if (modoEdicion && inicio && new Date(final) < new Date(inicio)) {
      setFinal(inicio)
    }
  }, [inicio])

  const handleSubmit = (e) => {
    e.preventDefault()

    const fechasEnRango = []
    let fecha = new Date(inicio)
    const fechaFinal = new Date(final)

    while (fecha <= fechaFinal) {
      fechasEnRango.push(fecha.toISOString().slice(0, 10))
      fecha.setDate(fecha.getDate() + 1)
    }

    const excedeLimite = fechasEnRango.some(fechaStr => {
      const eventosEnEseDia = eventos.filter(ev => {
        const evInicio = new Date(ev.inicio)
        const evFinal = new Date(ev.final)
        const fechaActual = new Date(fechaStr)
        return fechaActual >= evInicio && fechaActual <= evFinal
      })
      return eventosEnEseDia.length >= 2
    })

    if (excedeLimite) {
      alert('⚠️ Ya hay dos eventos programados en al menos uno de los días seleccionados.')
      return
    }

    const data = { nombre, telefono, ubicacion, encargado, inicio, final, presupuesto, pagado, comentarios }

    if (evento?.id) {
      actualizarEvento({ id: evento.id, ...data })
    } else {
      onGuardarEvento(data)
    }
    setNombre("")
    setTelefono("")
    setUbicacion("")
    setEncargado("")
    setInicio("")
    setFinal("")
    setPresupuesto("")
    setPagado("")
    setComentarios("")
    onClose()
  }

  const handleEliminarEvento = async () => {
    if (evento?.id) {
      const confirmacion = window.confirm("¿Estás seguro de que querés eliminar este evento?")
      if (!confirmacion) return
      await deleteDoc(doc(db, "instalaciones", evento.id))
      onClose()
    }
  }

  if (!visible) return null

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <h2>{evento ? (modoEdicion ? 'Editar evento' : 'Detalle del evento') : 'Crear nuevo evento'}</h2>
        <form onSubmit={handleSubmit}>
          {modoEdicion ? (
            <>
              <label>Inicio *</label>
              <Input
                type="date"
                required
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
              />
            </>
          ) : (
            <p><strong>Inicio:</strong> {inicio}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Finalización *</label>
              <Input
                type="date"
                required
                value={final}
                onChange={(e) => setFinal(e.target.value)}
                onFocus={(e) => e.target.showPicker?.()}
              />
            </>
          ) : (
            <p><strong>Finalización:</strong> {final}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Nombre de persona *</label>
              <Input type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan Pérez" />
            </>
          ) : (
            <p><strong>Nombre:</strong> {nombre}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Teléfono *</label>
              <Input type="tel" required value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej. 8888-8888" />
            </>
          ) : (
            <p><strong>Teléfono:</strong> {telefono}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Ubicación (link Gmaps o Waze) *</label>
              <Input type="url" required value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="https://maps.google.com/..." />
            </>
          ) : (
            <p><strong>Ubicación:</strong> <a href={ubicacion} target="_blank" rel="noopener noreferrer">{ubicacion}</a></p>
          )}

          {modoEdicion ? (
            <>
              <label>Encargado (opcional)</label>
              <Input type="text" value={encargado} onChange={(e) => setEncargado(e.target.value)} placeholder="Ej. Arturo Molina" />
            </>
          ) : (
            <p><strong>Encargado:</strong> {encargado}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Presupuesto (opcional)</label>
              <Input
                type="number"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                placeholder="₡"
              />
            </>
          ) : (
            <p><strong>Presupuesto:</strong> {presupuesto}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Monto pagado al día de hoy (opcional)</label>
              <Input
                type="number"
                value={pagado}
                onChange={(e) => setPagado(e.target.value)}
                placeholder="₡"
              />
            </>
          ) : (
            <p><strong>Pagado:</strong> {pagado}</p>
          )}

          {modoEdicion ? (
            <>
              <label>Comentarios (opcional)</label>
              <Input
                type="text"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
                placeholder="Notas adicionales..."
              />
            </>
          ) : (
            <p><strong>Comentarios:</strong> {comentarios}</p>
          )}

          {!modoEdicion && (
            <button onClick={() => setModoEdicion(true)} style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Editar
            </button>
          )}

          {modoEdicion && (
            <button type="submit" style={{
              padding: '10px 20px',
              backgroundColor: '#1ebeb6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}>
              Guardar evento
            </button>
          )}

          {evento?.id && (
            <button
              type="button"
              onClick={handleEliminarEvento}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#ff4d4d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Eliminar evento
            </button>
          )}
        </form>
      </ModalBox>
    </Overlay>
  )
}

export default ModalEvento