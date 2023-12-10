import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import defaultApi from "../apis/defaultApi";
import CommentRow from "../components/CommentRow";


export default function CommentSection(){
    const { id } = useParams();
    const [comments, setComments] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect( () => {
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
        fetchingComments();
    }, [])

    return (
        <>
            <Header/>
            <h3>CommentSection</h3>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {comments !== undefined && comments.length !== 0 ? (
                comments.map((x) => <CommentRow key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}
        </>
    );
}