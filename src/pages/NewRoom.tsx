import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'

import IllustrationImg from '../assets/images/illustration.svg'
import LogoImg from '../assets/images/logo.svg'

import '../styles/auth.scss'
import { Button } from '../components/button'
import { database } from '../services/firebase'

export function NewRoom () {
    const { user } = useAuth()
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if(newRoom.trim() === '') {
            return
        }

        const roomRef = database.ref('rooms')
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })
        history.push(`/rooms/${firebaseRoom.key}`)
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={(e) => handleCreateRoom(e)}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"
                            value={newRoom}
                            onChange={(e) => setNewRoom(e.target.value)}
                        />
                        <Button type="submit">
                            Criar Sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala exsitente ? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}