import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import defaultApi from "../apis/defaultApi";
import CommentRow from "../components/CommentRow";
import useAuth from "../hooks/useAuth";
import CommentForm from "../components/CommentForm";


export default function CommentSection(){
    const { auth} = useAuth();
    const { id } = useParams();
    const [comments, setComments] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [ newComment, setNewComment] = useState(false);

    async function fetchingComments() {
        try {
            const response = await defaultApi.get(`/api/v1/comments/${id}/bonus`);
            setComments(response?.data?.comments);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No comments were found');
            } else {
                setErrorMessage('Comments load failure')
            }
        }
    }

    const handleFormSubmit = () => {
        fetchingComments();
        setNewComment(false);
    };

    useEffect( () => {
        fetchingComments();
    }, [])

    const onClick = async (e) => {
        if(newComment === false)
        {
            setNewComment(true);
        }
        else
        {
            setNewComment(false);
        }
    }

    return (
        <>
            <Header/>
            <h3>CommentSection</h3>
            { auth?.username != null ? (
                <>
                <button className="smallButton" onClick={onClick}>
                    New comment
                </button>
                <CommentForm status={newComment} onFormSubmit={handleFormSubmit}/>
                </>
            ) : (
                <p> </p>
            )}
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {comments !== undefined && comments.length !== 0 ? (
                comments.map((x) => <CommentRow onFormSubmit={handleFormSubmit} key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}
        </>
    );
}