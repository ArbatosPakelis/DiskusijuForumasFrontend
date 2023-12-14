import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import defaultApi from "../apis/defaultApi";

export default function UserRow(props){
    const [ password, setPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(false);
    const [ForceLogin, setForceLogin] = useState("");
    const { auth, setAuth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [ update, setUpdate] = useState(false);

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
            let response = "";
            // http request
            if(auth.role === "admin"){
                response = await defaultApi.patch("/api/v1/users",
                    JSON.stringify({ username: auth.username,
                                    password: password,
                                    email: email,
                                    isDelete:false,
                                    status: status,
                                    ForceRelogin:ForceLogin,
                                    id: auth.id }),
                    {
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${auth.accessToken}` 
                        },
                        withCredentials: true
                    }
                );
            }
            else
            {
                response = await defaultApi.patch("/api/v1/users",
                    JSON.stringify({ username: auth.username,
                                    password: password,
                                    email: email,
                                    isDelete:false,
                                    status: auth.role,
                                    ForceRelogin:false,
                                    id: auth.id
                                }),
                    {
                        headers: { 
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${auth.accessToken}` 
                        },
                        withCredentials: true
                    }
                );
            }
            if (response?.status === 200) {
                props.onFormSubmit();
                setPassword("");
                setEmail("");
                setStatus(false);
                setForceLogin(false);
                setUpdate(false);
            }
          } catch (err) {
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
              console.log(err);
              await Press();
            } else {
              setErrorMessage('User update Failed');
            }
          }
    }

    const onTickle = async(e) =>{
      e.preventDefault();
      try {
          // http request
          const response1 = await defaultApi.delete(
            `/api/v1/users/${props.id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.accessToken}`,
              },
            }
          );
          if (response1?.status === 200) {
              props.onFormSubmit();
              if(auth.role !== "admin")
              {
                navigate("/Login");
              }
          }
        } catch (err) {
          if (!err?.response) {
            setErrorMessage('No Server Response');
          } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
              await Press();
          } else {
            setErrorMessage('User deletion failed');
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
        auth.role !== "admin" ? 
            (
                <>
                <div className="dataRow">
                    <div>
                        <div>
                            <p>username: {props.username}</p>
                            <p>email: {props.email}</p>
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

                            <label htmlFor="password">
                                password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />

                            <label htmlFor="email">
                                email:
                            </label>
                            <input
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />


                            <button type="submit">submit</button>
                        </form>
                    </section>
                ) : (
                <p></p>
                )}
            </>
            ) : (
                <>
                <div className="dataRow">
                    <div>
                        <div>
                            <p>username: {props.username}</p>
                            <p>email: {props.email}</p>
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

                            <label htmlFor="password">
                                password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />

                            <label htmlFor="email">
                                email:
                            </label>
                            <input
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />

                            <label htmlFor="status">
                                role:
                            </label>
                            <input
                                type="text"
                                id="status"
                                autoComplete="off"
                                onChange={(e) => setStatus(e.target.value)}
                                value={status}
                                required
                            />

                            <label htmlFor="ForceLogin">
                                Forcing Login:
                            </label>
                            <input
                                type="text"
                                id="ForceLogin"
                                autoComplete="off"
                                onChange={(e) => setForceLogin(e.target.value)}
                                value={ForceLogin}
                                required
                            />

                            <button type="submit">submit</button>
                        </form>
                    </section>
                ) : (
                <p></p>
                )}
            </>
            )
    );

}