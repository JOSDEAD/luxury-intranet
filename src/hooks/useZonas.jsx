import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook para manejar la subcolección 'zonas' de una instalación
 * @param {string} instalacionId - ID del documento de instalación
 */
export function useZonas(instalacionId) {
  const [zonas, setZonas] = useState([])

  useEffect(() => {
    if (!instalacionId) {
      setZonas([])
      return
    }
    const colRef = collection(db, 'instalaciones', instalacionId, 'zonas')
    const unsub = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setZonas(datos)
    })
    return () => unsub()
  }, [instalacionId])

  const guardarZona = async (zonaData) => {
    await addDoc(collection(db, 'instalaciones', instalacionId, 'zonas'), zonaData)
  }

  const actualizarZona = async (zona) => {
    const ref = doc(db, 'instalaciones', instalacionId, 'zonas', zona.id)
    const { id, ...data } = zona
    const dataClean = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
    await updateDoc(ref, dataClean)
  }

  const eliminarZona = async (zonaId) => {
    await deleteDoc(doc(db, 'instalaciones', instalacionId, 'zonas', zonaId))
  }

  return { zonas, guardarZona, actualizarZona, eliminarZona }
}