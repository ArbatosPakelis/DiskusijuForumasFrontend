import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import defaultApi from "../apis/defaultApi";
import useAuth from "../hooks/useAuth";

export default function CommentForm(props){
    const [content, setContent] = useState("");
    const { auth, setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const params = useParams();
    const navigate = useNavigate();

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
              await Press();
            } else {
              setErrorMessage('Comment creation Failed');
            }
          }
    }

    const Press = async () => {
      try {
        // http request
        const response = await defaultApi.post(
          "/api/v1/users/logout",
          JSON.stringify({}),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${auth.refreshToken}`,
            },
            withCredentials: true,
          }
        );
        if (response?.status === 200) {
          setAuth({});
          navigate("/Login", { replace: true });
        }
      } catch (err) {
        if (!err?.response) {
          setErrorMessage('No Server Response');
        } else if (err.response?.status === 403) {
          setErrorMessage('Invalid user');
        } else if (err.response?.status === 401) {
          setErrorMessage('Forbidden');
        } else {
          setErrorMessage('Logout Failed');
        }
      }
    };

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

                    <button type="submit">submit</button>
                </form>
            </section>
        ) : (
        <p></p>
        )
    );

}