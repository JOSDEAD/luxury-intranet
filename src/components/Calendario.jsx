import React, { useState } from 'react'
import styled from 'styled-components'
import ModalEvento from './ModalEvento'
import { useEventos } from '../hooks/useEventos'

const CalendarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 20px;
  padding-top: 80px;
  background: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  background: white;
  padding: 10px 20px;
  z-index: 100;
  border-bottom: 1px solid #eee;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
`

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-top: 20px;
  gap: 10px;
  flex-grow: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`

const Day = styled.div`
  text-align: left;
  padding: 14px;
  border-radius: 6px;
  background-color: ${props => props.$today ? '#1ebeb6' : '#f0f0f0'};
  color: ${props => props.$today ? 'white' : '#333'};
  font-weight: ${props => props.$today ? 'bold' : 'normal'};
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #1ebeb6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #149d96;
  }
`

const GlobalStyles = styled.div`
  .weekday-labels {
    @media (max-width: 768px) {
      display: none;
    }
  }
`

const Calendario = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null)
  const { eventos, guardarEvento } = useEventos()
  const [currentDate, setCurrentDate] = useState(new Date())
  const handleOpenModal = () => {
    setEventoSeleccionado(null)
    setModalVisible(true)
  }
  const handleCloseModal = () => {
    setModalVisible(false)
  }
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDay = new Date(year, month, 1).getDay() // 0: domingo

  const days = []

  // Agregar espacios vacíos para los días antes del 1
  for (let i = 0; i < startDay; i++) {
    days.push(<Day key={`empty-${i}`} />)
  }

  const renderEventos = (diaActual, esHoy) => {
    const fechaStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(diaActual).padStart(2, '0')}`

    const eventosDelDia = eventos.filter(ev => {
      const inicio = new Date(ev.inicio)
      const fin = new Date(ev.final)
      const fecha = new Date(`${year}-${String(month + 1).padStart(2, '0')}-${String(diaActual).padStart(2, '0')}`)
      return fecha >= inicio && fecha <= fin
    })

    return eventosDelDia.map(ev => {
      return (
        <div key={`${ev.id}-${diaActual}`} style={{
          marginTop: '5px',
          backgroundColor: esHoy ? '#ffffff' : '#1ebeb6',
          color: esHoy ? '#1ebeb6' : 'white',
          borderRadius: '5px',
          padding: '2px 5px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => {
          setEventoSeleccionado({ ...ev })
          setModalVisible(true)
        }}>
          {ev.nombre}
        </div>
      )
    })
  }

  // Agregar días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = new Date(year, month, i)
    const isToday =
      currentDay.getDate() === today.getDate() &&
      currentDay.getMonth() === today.getMonth() &&
      currentDay.getFullYear() === today.getFullYear()
    days.push(
      <Day key={i} $today={isToday}>
        {i}
        {renderEventos(i, isToday)}
      </Day>
    )
  }

  return (
    <GlobalStyles>
      <Header>
        <h2>{currentDate.toLocaleString('default', { month: 'long' }).toUpperCase()} {year}</h2>
        <div>
          <CreateButton onClick={() => setCurrentDate(new Date(year, month - 1))}>←</CreateButton>
          <CreateButton onClick={() => setCurrentDate(new Date(year, month + 1))}>→</CreateButton>
        </div>
        <CreateButton onClick={handleOpenModal}>Crear evento</CreateButton>
      </Header>
      <CalendarContainer>
        <div className="weekday-labels">
          <DaysGrid>
            <Day><strong>Dom</strong></Day>
            <Day><strong>Lun</strong></Day>
            <Day><strong>Mar</strong></Day>
            <Day><strong>Mié</strong></Day>
            <Day><strong>Jue</strong></Day>
            <Day><strong>Vie</strong></Day>
            <Day><strong>Sáb</strong></Day>
          </DaysGrid>
        </div>
        <DaysGrid>
          {days}
        </DaysGrid>
        <ModalEvento
          visible={modalVisible}
          onClose={handleCloseModal}
          onGuardarEvento={(evento) => {
            guardarEvento(evento)
            setModalVisible(false)
          }}
          evento={eventoSeleccionado}
          eventos={eventos}
        />
      </CalendarContainer>
    </GlobalStyles>
  )
}

export default Calendario