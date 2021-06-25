import { FormEvent, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

import LogoImg from '../assets/images/logo.svg'
import DeleteQuestion from '../assets/images/delete.svg'
import CheckImg from '../assets/images/check.svg'
import AnswerImg from '../assets/images/answer.svg'

import { Button } from '../components/button'
import { Question } from '../components/Question'
import { RoomCode } from '../components/RoomCode'

import '../styles/room.scss'

type RoomParams = {
    id: string
}

export const AdminRoom = () => {
    const params = useParams<RoomParams>()
    const roomId = params.id
    const history = useHistory()
    const { user } = useAuth()
    const { question, title } = useRoom(roomId)
    const [newQuestion, setNewQuestion] = useState('')

    async function handleEndRoom () {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/')
    }
    
    async function handleDeleteQuestion (questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }
    
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

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        })
    }

    async function handleCheckQuestionHasAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={() => handleEndRoom()}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}t</h1>
                    {question.length > 0 && <span>{question.length} pergunta(s)</span> }
                </div>
                    <div className="question-list">
                        {question.map (question => {
                            return (
                                <Question key={question.id} content={question.content} author={question.author} isAnswered={question.isAnswered} isWighLighted={question.isHighLighted}>
                                    {!question.isAnswered && (
                                    <>
                                        <button type="button" onClick={() => handleCheckQuestionHasAnswered(question.id)}>
                                            <img src={CheckImg} alt="Marcar como removida" />
                                        </button>
                                        <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                                            <img src={AnswerImg} alt="Destacar pergunta" />
                                        </button>
                                    </>
                                    )}
                                    <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                        <img src={DeleteQuestion} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            )
                        })}
                    </div>
            </main>
        </div>
    )
}