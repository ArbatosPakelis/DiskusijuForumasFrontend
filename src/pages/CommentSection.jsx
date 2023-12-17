import { useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import { useEffect, useState } from "react";
import CommentRow from "../components/CommentRow.jsx";
import useAuth from "../hooks/useAuth.js";
import CommentForm from "../components/CommentForm.jsx";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function CommentSection(){
    const { auth} = useAuth();
    const { id } = useParams();
    const [comments, setComments] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [ newComment, setNewComment] = useState(false);
    const [subject, setSubject] = useState(undefined);
    const PrivateApi = usePrivateApi();

    async function fetchingComments() {
        try {
            const response1 = await PrivateApi.get(`/api/v1/threads/${id}`);
            setSubject(response1?.data?.thread);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No thread was found');
            } else {
                setErrorMessage('Thread load failure')
            }
        }

        try {
            const response = await PrivateApi.get(`/api/v1/comments/${id}/bonus`);
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
        setComments(undefined);
        setErrorMessage('');
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
            <h3>{subject?.name}</h3>
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