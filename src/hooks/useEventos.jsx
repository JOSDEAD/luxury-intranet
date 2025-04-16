import { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useEventos() {
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'instalaciones'), (snapshot) => {
      const datos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setEventos(datos)
    })

    return () => unsub()
  }, [])

  const guardarEvento = async (evento) => {
    console.log('🚀 Evento a guardar:', evento) // 👈 Agregá esto
    await addDoc(collection(db, 'instalaciones'), evento)
  }

  const actualizarEvento = async (evento) => {
    const ref = doc(db, "instalaciones", evento.id)
    const { id, ...dataSinId } = evento

    // Eliminar campos undefined
    const dataLimpia = Object.fromEntries(
      Object.entries(dataSinId).filter(([_, v]) => v !== undefined)
    )

    await updateDoc(ref, dataLimpia)
  }

  return { eventos, guardarEvento, actualizarEvento }
}