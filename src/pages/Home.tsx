import { useState, FormEvent } from 'react'
import { database } from '../services/firebase'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'
import GoogleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/button'

import '../styles/auth.scss'

export function Home () {
    const history = useHistory()
    const { user, signInWithGoolge } = useAuth()
    const [roomCode, setRoomCode] = useState('')

    async function handleJoinRoom(event:FormEvent) {
        event.preventDefault()

        if(roomCode.trim() === '') {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if(!roomRef.exists()) {
            alert('Room does not exists.')
            return
        }

        if(roomRef.val().endedAt) {
            alert('Room already closed')
            return
        }

        history.push(`rooms/${roomCode}`)
    }

    async function handleCreateRoom () {
        if(!user) {
            await signInWithGoolge()
        }
        history.push('/rooms/new')
    }
    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="letmeask" />
                    <button className="create-room" onClick={() => handleCreateRoom()} >
                        <img src={GoogleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        Ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input type="text" placeholder="Digite o código da sala" value={roomCode} onChange={(e) => setRoomCode(e.target.value)}/>
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}