import React, { useState } from 'react'
import styled from 'styled-components'
import { auth } from '../config/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #000 50%, #fff 50%);
`

const Container = styled.div`
  display: flex;
  width: 800px;
  height: 400px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.5);
  margin: 0 auto;
`

const Left = styled.div`
  flex: 1;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 2em;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.5);
`

const Right = styled.div`
  flex: 1;
  background-color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`

const Heading = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`

const Button = styled.button`
  padding: 10px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #333;
  }
`

const Link = styled.a`
  text-align: center;
  color: #000;
  text-decoration: none;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }
`

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`

const Login = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  if (user) navigate('/dashboard')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Body>
      <Container>
        <Left>
          <img src="/logo.png" alt="Logo" style={{ width: '150px' }} />
        </Left>
        <Right>
          <Heading>Login</Heading>
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Button type="submit">Login</Button>
            <Link href="#">¿Olvidaste tu contraseña?</Link>
          </form>
        </Right>
      </Container>
    </Body>
  )
}

export default Login
