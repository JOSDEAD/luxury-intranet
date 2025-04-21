import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook para manejar la subcolección 'salidas_bodega' de una instalación
 * @param {string} instalacionId - ID del documento de instalación
 */
export function useSalidasBodega(instalacionId) {
  const [salidasBodega, setSalidasBodega] = useState([])

  useEffect(() => {
    if (!instalacionId) {
      setSalidasBodega([])
      return
    }
    const colRef = collection(db, 'instalaciones', instalacionId, 'salidas_bodega')
    const unsub = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSalidasBodega(datos)
    })
    return () => unsub()
  }, [instalacionId])

  const guardarSalidaBodega = async (salidaData) => {
    await addDoc(collection(db, 'instalaciones', instalacionId, 'salidas_bodega'), salidaData)
  }

  const actualizarSalidaBodega = async (salida) => {
    const ref = doc(db, 'instalaciones', instalacionId, 'salidas_bodega', salida.id)
    const { id, ...data } = salida
    const dataClean = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
    await updateDoc(ref, dataClean)
  }

  const eliminarSalidaBodega = async (salidaId) => {
    await deleteDoc(doc(db, 'instalaciones', instalacionId, 'salidas_bodega', salidaId))
  }

  return { salidasBodega, guardarSalidaBodega, actualizarSalidaBodega, eliminarSalidaBodega }
}