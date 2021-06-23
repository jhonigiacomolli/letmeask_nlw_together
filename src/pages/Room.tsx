import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import LOgoImg from '../assets/images/logo.svg'
import { Button } from '../components/button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { auth, database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
    id: string
}
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
}

export const Room = () => {
    const params = useParams<RoomParams>()
    const { user } = useAuth()
    const roomId = params.id
    const [newQuestion, setNewQuestion] = useState('')
    const [question, setQuestion] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions =  databseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered
                }
            })

            setTitle(databseRoom.title)
            setQuestion(parsedQuestions)
        })
    }, [roomId])
    
    async function handleSendQuestion (event: FormEvent) {
        event.preventDefault()

        if(newQuestion.trim() === '') {
            return
        }

        if(!user) {
            throw new Error('You most be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false, 
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('')
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LOgoImg} alt="Letmeask" />
                    <RoomCode code={roomId}/>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}t</h1>
                    {question.length > 0 && <span>{question.length} pergunta(s)</span> }
                </div>
                <form onSubmit={(e) => handleSendQuestion(e)}> 
                    <textarea
                        placeholder="O que você quer perguntar?"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        ) }
                        <Button disabled={!user} type="submit" >Enviar Pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(question)}
            </main>
        </div>
    )
}