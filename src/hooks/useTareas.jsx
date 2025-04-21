import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook para manejar la subcolección 'tareas' dentro de 'zonas' de una instalación
 * @param {string} instalacionId - ID del documento de instalación
 * @param {string} zonaId - ID del documento de zona
 */
export function useTareas(instalacionId, zonaId) {
  const [tareas, setTareas] = useState([])

  useEffect(() => {
    if (!instalacionId || !zonaId) {
      setTareas([])
      return
    }
    const colRef = collection(
      db,
      'instalaciones', instalacionId,
      'zonas', zonaId,
      'tareas'
    )
    const unsub = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTareas(datos)
    })
    return () => unsub()
  }, [instalacionId, zonaId])

  const guardarTarea = async (tareaData) => {
    await addDoc(
      collection(db,
        'instalaciones', instalacionId,
        'zonas', zonaId,
        'tareas'
      ),
      tareaData
    )
  }

  const actualizarTarea = async (tarea) => {
    const ref = doc(
      db,
      'instalaciones', instalacionId,
      'zonas', zonaId,
      'tareas', tarea.id
    )
    const { id, ...data } = tarea
    const dataClean = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
    await updateDoc(ref, dataClean)
  }

  const eliminarTarea = async (tareaId) => {
    await deleteDoc(
      doc(
        db,
        'instalaciones', instalacionId,
        'zonas', zonaId,
        'tareas', tareaId
      )
    )
  }

  return { tareas, guardarTarea, actualizarTarea, eliminarTarea }
}