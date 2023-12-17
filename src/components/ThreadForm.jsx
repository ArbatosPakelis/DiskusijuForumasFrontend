import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function ThreadForm(props){
    const [name, setName] = useState("");
    const { auth, setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const params = useParams();
    const navigate = useNavigate();
    const PrivateApi = usePrivateApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // http request
            const response = await PrivateApi.post(
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
              await Press();
            } else {
              setErrorMessage('Thread creation Failed');
            }
          }
    }

    const Press = async () => {
      try {
        // http request
        const response = await PrivateApi.post(
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

                    <button type="submit">submit</button>
                </form>
            </section>
        ) : (
        <p></p>
        )
    );

}