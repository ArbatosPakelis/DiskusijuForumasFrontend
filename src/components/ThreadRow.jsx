import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import usePrivateApi from "../hooks/usePrivateApi";

export default function ThreadRow(props){
    const [ update, setUpdate] = useState(false);
    const [name, setName] = useState("");
    const { auth, setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const PrivateApi = usePrivateApi();

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
            const response = await PrivateApi.patch(
              "/api/v1/threads",
              JSON.stringify({ 
                name: name,
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
                setName("");
                setUpdate(false);
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
              setErrorMessage('Thread update Failed');
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

    const onTickle = async(e) =>{
      e.preventDefault();
      try {
          // http request
          const response1 = await PrivateApi.delete(
            `/api/v1/threads/${props.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
          if (response1?.status === 200) {
              await props.onFormSubmit();
          }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
              await Press();
          } else {
            setErrorMessage('Thread deletion failed');
          }
        }
  };

    return (
        <>
            <div className="dataRow">
                <div>
                    <Link to={`/Comments/${props.id}`}>
                        <div className="units" style={{ margin:"20px 0px 0px 10px"}}>
                            <h5>{props.name}</h5>
                        </div>
                    </Link>
                    <div className="units" style={{float:"right"}}>
                        <p className="other">upvotes: {props.upvotes}</p>
                        <p className="other">downvotes: {props.downvotes}</p>
                    </div>
                    { auth.id === props.users_fk || auth.role === "admin" ? (
                    <div className="bottomRightContainer">
                        <button className="bottomRightButton" style={{marginRight:"100px"}} onClick={onClick}>Update</button>
                        <button className="bottomRightButton" onClick={onTickle}>Delete</button>
                    </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
            {update ? (
                <section className="smallSection">
                    <form onSubmit={onSubmit}>
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
            )}
        </>
    );

}