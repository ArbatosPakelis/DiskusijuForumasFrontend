import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import defaultApi from "../apis/defaultApi";
import useAuth from "../hooks/useAuth";

export default function ThreadForm(props){
    const [name, setName] = useState("");
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
              "/api/v1/threads",
              JSON.stringify({ 
                name: name,
                upvotes: 0,
                downvotes: 0,
                pages_fk: params.id
               }),
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${auth.accessToken}`,
                },
              }
            );
            if (response?.status === 200) {
                props.onFormSubmit();
                setName("");
            }
          } catch (err) {
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
              setErrorMessage('Thread already exists');
            } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
            } else {
              setErrorMessage('Thread creation Failed');
            }
          }
    }

    return (
        
        props.status ? (
            <section className="smallSection">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
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