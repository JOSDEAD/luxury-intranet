import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * Hook para manejar la subcolección 'compras_externas' de una instalación
 * @param {string} instalacionId - ID del documento de instalación
 */
export function useComprasExternas(instalacionId) {
  const [comprasExternas, setComprasExternas] = useState([])

  useEffect(() => {
    if (!instalacionId) {
      setComprasExternas([])
      return
    }
    const colRef = collection(db, 'instalaciones', instalacionId, 'compras_externas')
    const unsub = onSnapshot(colRef, (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setComprasExternas(datos)
    })
    return () => unsub()
  }, [instalacionId])

  const guardarCompraExterna = async (compraData) => {
    await addDoc(collection(db, 'instalaciones', instalacionId, 'compras_externas'), compraData)
  }

  const actualizarCompraExterna = async (compra) => {
    const ref = doc(db, 'instalaciones', instalacionId, 'compras_externas', compra.id)
    const { id, ...data } = compra
    const dataClean = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
    await updateDoc(ref, dataClean)
  }

  const eliminarCompraExterna = async (compraId) => {
    await deleteDoc(doc(db, 'instalaciones', instalacionId, 'compras_externas', compraId))
  }

  return { comprasExternas, guardarCompraExterna, actualizarCompraExterna, eliminarCompraExterna }
}