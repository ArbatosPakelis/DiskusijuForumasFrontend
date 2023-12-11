import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import defaultApi from "../apis/defaultApi";
import useAuth from "../hooks/useAuth";

export default function CommentForm(props){
    const [content, setContent] = useState("");
    // const [upvotes, setUpvotes] = useState("");
    // const [downvotes, setDownvotes] = useState("");
    const { auth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const params = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // http request
            const response = await defaultApi.post(
              "/api/v1/comments",
              JSON.stringify({ 
                content: content,
                upvotes: 0,
                downvotes: 0,
                threads_fk: params.id
               }),
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.accessToken}`,
                },
              }
            );
            console.log(response?.status);
            if (response?.status === 200) {
                console.log("form works");
                props.onFormSubmit();
                setContent("");
            }
          } catch (err) {
            console.log(err.response);
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
              setErrorMessage('Comment already exists');
            } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
            } else {
              setErrorMessage('Comment creation Failed');
            }
          }
    }

    return (
        
        props.status ? (
            <section className="smallSection">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="content">
                    content:
                    </label>
                    <input
                        type="text"
                        id="content"
                        autoComplete="off"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        required
                    />

                    {/* <label htmlFor="upvotes">
                        upvotes:
                    </label>
                    <input
                        type="number"
                        id="upvotes"
                        autoComplete="off"
                        onChange={(e) => setUpvotes(e.target.value)}
                        value={upvotes}
                        required
                    />

                    <label htmlFor="downvotes">
                        downvotes:
                    </label>
                    <input
                        type="number"
                        id="downvotes"
                        autoComplete="off"
                        onChange={(e) => setDownvotes(e.target.value)}
                        value={downvotes}
                        required
                    /> */}


                    <button type="submit">submit</button>
                </form>
            </section>
        ) : (
        <p></p>
        )
    );

}