import React, { useState, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useEventos } from '../hooks/useEventos'
import { doc, deleteDoc, collection, addDoc } from 'firebase/firestore'
import { db, storage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// Para extraer texto de PDFs en el navegador con pdf.js
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf'
// Importar la URL del worker (ESM) para pdf.js
// Use the legacy worker build for pdf.js
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'
// Configurar ruta al worker en pdf.js
GlobalWorkerOptions.workerSrc = workerSrc

/**
 * Modal for creating, editing, viewing, and deleting events.
 * Uses react-bootstrap for styling consistent with theme.
 */
const ModalEvento = ({ visible, onClose, onGuardarEvento, evento, eventos = [] }) => {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [encargado, setEncargado] = useState('')
  // Tipo de evento: Instalacion o Garantia
  const [tipo, setTipo] = useState('Instalacion')
  const [inicio, setInicio] = useState('')
  const [final, setFinal] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [pagado, setPagado] = useState('')
  const [comentarios, setComentarios] = useState('')
  // Archivo PDF de cotización
  const [file, setFile] = useState(null)
  const [modoEdicion, setModoEdicion] = useState(true)
  const { actualizarEvento } = useEventos()
  /**
   * Extrae el número de cotización del PDF leyendo su contenido
 * Busca un texto como “Cotización No. 1234” (con acento o variantes) en la primera página
   * @param {File} file
   * @returns {Promise<string>} número de cotización o cadena vacía si no encuentra
   */
  const extractCotizacionId = async (file) => {
    // Leer el buffer y extraer texto de la primera página
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const content = await page.getTextContent()
    const text = content.items.map(item => item.str).join(' ')
    console.log('PDF extracted text:', text)
    // Buscar dos fechas y capturar el número que las sigue
    const datePattern = /(?:\d{1,2}\/\d{1,2}\/\d{2,4})\s+(?:\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d+)/
    const dateMatch = text.match(datePattern)
    if (dateMatch) {
      console.log('Extracted cotizacion id:', dateMatch[1])
      return dateMatch[1]
    }
    // No se encontró: devolver cadena vacía para manejarlo externamente
    console.warn('No se encontró el ID de cotización en el PDF')
    return ''
  }

  // Load event data into state when opening modal
  useEffect(() => {
    if (evento) {
      setNombre(evento.nombre || '')
      setTelefono(evento.telefono || '')
      setUbicacion(evento.ubicacion || '')
      setEncargado(evento.encargado || '')
      setInicio(evento.inicio || '')
      setFinal(evento.final || '')
      setPresupuesto(evento.presupuesto || '')
      setPagado(evento.pagado || '')
      setComentarios(evento.comentarios || '')
      setTipo(evento.tipo || 'Instalacion')
      setModoEdicion(true)
    } else {
      // New event
      setNombre('')
      setTelefono('')
      setUbicacion('')
      setEncargado('')
      setInicio('')
      setFinal('')
      setPresupuesto('')
      setPagado('')
      setComentarios('')
      setTipo('Instalacion')
      setModoEdicion(true)
    }
  }, [evento, visible])

  // Ensure final date is not before start
  useEffect(() => {
    if (inicio && final && new Date(final) < new Date(inicio)) {
      setFinal(inicio)
    }
  }, [inicio])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { nombre, telefono, ubicacion, encargado, tipo, inicio, final, presupuesto, pagado, comentarios }
    // Subir y asociar PDF de cotización
    if (!evento?.id) {
      // Nuevo proyecto: archivo obligatorio
      if (!file) return
      // Extraer número de cotización directamente del PDF
      const cotizacionId = await extractCotizacionId(file)
      const fileName = file.name
      const storageRef = ref(storage, `cotizaciones/${fileName}`)
      await uploadBytes(storageRef, file)
      const cotizacionUrl = await getDownloadURL(storageRef)
      data.cotizacionId = cotizacionId
      data.cotizacionUrl = cotizacionUrl
      // Crear nuevo evento en Firestore
      await addDoc(collection(db, 'instalaciones'), data)
    } else {
      // Edición de evento existente
      if (file) {
        // Extraer número de cotización del PDF si cambia el archivo
        const cotizacionId = await extractCotizacionId(file)
        const fileName = file.name
        const storageRef = ref(storage, `cotizaciones/${fileName}`)
        await uploadBytes(storageRef, file)
        const cotizacionUrl = await getDownloadURL(storageRef)
        data.cotizacionId = cotizacionId
        data.cotizacionUrl = cotizacionUrl
      }
      await actualizarEvento({ id: evento.id, ...data })
    }
    onClose()
  }

  const handleEliminarEvento = async () => {
    if (evento?.id) {
      const confirmacion = window.confirm('¿Seguro que querés eliminar este evento?')
      if (!confirmacion) return
      await deleteDoc(doc(db, 'instalaciones', evento.id))
      onClose()
    }
  }

  return (
    <Modal show={visible} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {evento?.id ? 'Editar evento' : 'Crear nuevo evento'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de persona *</Form.Label>
            <Form.Control
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Teléfono *</Form.Label>
            <Form.Control
              type="tel"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ubicación *</Form.Label>
            <Form.Control
              type="url"
              required
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </Form.Group>
          {/* Tipo de evento */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo *</Form.Label>
            <Form.Select
              required
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="Instalacion">Instalacion</option>
              <option value="Garantia">Garantia</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Encargado</Form.Label>
            <Form.Control
              type="text"
              value={encargado}
              onChange={(e) => setEncargado(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha inicio *</Form.Label>
            <Form.Control
              type="date"
              required
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha final *</Form.Label>
            <Form.Control
              type="date"
              required
              value={final}
              onChange={(e) => setFinal(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Presupuesto</Form.Label>
            <Form.Control
              type="number"
              value={presupuesto}
              onChange={(e) => setPresupuesto(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Pagado</Form.Label>
            <Form.Control
              type="number"
              value={pagado}
              onChange={(e) => setPagado(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </Form.Group>
          {/* Cotización PDF obligatorio para nuevos proyectos */}
          <Form.Group className="mb-3">
            <Form.Label>Cotización (PDF){!evento?.id ? ' *' : ''}</Form.Label>
            <Form.Control
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required={!evento?.id}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
          {evento?.id && (
            <Button variant="danger" onClick={handleEliminarEvento}>
              Eliminar
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalEvento