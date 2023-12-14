import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import defaultApi from "../apis/defaultApi";

export default function CommentRow(props){
    const [ update, setUpdate] = useState(false);
    const [content, setContent] = useState("");
    const { auth, setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onClick = async (e) => {

        if(update === false)
        {
            setUpdate(true);
        }
        else
        {
            setUpdate(false);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // http request
            const response = await defaultApi.patch(
              "/api/v1/comments",
              JSON.stringify({ 
                content: content,
                users_fk: props.users_fk,
                id: props.id
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
                setContent("");
                setUpdate(false);
            }
          } catch (err) {
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
              setErrorMessage('Comment already exists');
            } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
              await Press();
            } else {
              setErrorMessage('Comment update Failed');
            }
          }
    }

    const onTickle = async(e) =>{
      e.preventDefault();
      try {
          // http request
          const response1 = await defaultApi.delete(
            `/api/v1/comments/${props.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
          if (response1?.status === 200) {
              props.onFormSubmit();
          }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
              await Press();
              console.log(err);
          } else {
            setErrorMessage('Comment deletion failed');
          }
        }
  };

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
        <>
            <div className="dataRow">
                <div>
                    <div className="units" style={{float:"right"}}>
                        <p className="other">upvotes: {props.upvotes}</p>
                        <p className="other">downvotes: {props.downvotes}</p>
                    </div>
                    <div>
                        <p style={{ margin:"20px 0px 0px 10px"}}>{props.content}</p>
                    </div>
                    <div className="bottomRightContainer">
                        <button className="bottomRightButton" style={{marginRight:"100px"}} onClick={onClick}>Update</button>
                        <button className="bottomRightButton" onClick={onTickle}>Delete</button>
                    </div>
                </div>
            </div>
            {update ? (
                <section className="smallSection">
                    <form onSubmit={onSubmit}>
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
            )}
        </>
    );

}