import { ReactNode } from 'react'

import '../styles/question.scss'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isWighLighted?: boolean;
}

export const Question = ({
    content,
    author,
    isAnswered = false,
    isWighLighted = false,
    children,
}: QuestionProps) => {
    return (
        <div className={`question ${isAnswered ? 'answered' : ''} ${(isWighLighted && !isAnswered) ? 'highlighted' : ''} `}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}