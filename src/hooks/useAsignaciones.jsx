import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook para manejar la subcolección 'asignaciones' de una instalación
 * @param {string} instalacionId - ID del documento de instalación
 */
export function useAsignaciones(instalacionId) {
  const [asignaciones, setAsignaciones] = useState([])

  useEffect(() => {
    if (!instalacionId) {
      setAsignaciones([])
      return
    }
    const colRef = collection(db, 'instalaciones', instalacionId, 'asignaciones')
    const unsub = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAsignaciones(datos)
    })
    return () => unsub()
  }, [instalacionId])

  const guardarAsignacion = async (asignacionData) => {
    await addDoc(collection(db, 'instalaciones', instalacionId, 'asignaciones'), asignacionData)
  }

  const actualizarAsignacion = async (asignacion) => {
    const ref = doc(db, 'instalaciones', instalacionId, 'asignaciones', asignacion.id)
    const { id, ...data } = asignacion
    const dataClean = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
    await updateDoc(ref, dataClean)
  }

  const eliminarAsignacion = async (asignacionId) => {
    await deleteDoc(doc(db, 'instalaciones', instalacionId, 'asignaciones', asignacionId))
  }

  return { asignaciones, guardarAsignacion, actualizarAsignacion, eliminarAsignacion }
}