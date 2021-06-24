import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"


type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;

}
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likes: Record<string, {
        author: string;
    }>
}>

export const useRoom = (roomId: string) => {
    const { user } = useAuth()
    const [question, setQuestion] = useState<QuestionType[]>([])
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
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key,like]) => like.author === user?.id)?.[0],
                }
            })

            setTitle(databseRoom.title)
            setQuestion(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return { question, title }
}