import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function PageRow(props){
    const [ update, setUpdate] = useState(false);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
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
              "/api/v1/pages",
              JSON.stringify({ 
                category: category,
                name: name,
                description: description,
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
                setCategory("");
                setName("");
                setDescription("");
                setUpdate(false);
            }
          } catch (err) {
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
              setErrorMessage('Page already exists');
            } else if (err.response?.status === 401) {
                setErrorMessage('Forbidden');
                await Press();
            } else {
              setErrorMessage('Page creation Failed');
            }
          }
    }

    const onTickle = async(e) =>{
        e.preventDefault();
        try {
            // http request
            const response1 = await PrivateApi.delete(
              `/api/v1/pages/${props.id}`,
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
            } else {
              setErrorMessage('Page deletion failed');
            }
          }
    };

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
        <>
                <div className="dataRow">
                    <div>
                        <Link to={`/Threads/${props.id}`}>
                            <div className="units">
                                <h5>{props.name}</h5>
                            </div>
                        </Link>
                        <div className="units" style={{float:"right"}}>
                            <p className="other">category: {props.category}</p>
                        </div>
                    </div>
                    <div>
                        <p>{props.description}</p>
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
                {update ? (
                <section>
                    <form onSubmit={onSubmit}>
                        <label htmlFor="category">
                            category:
                        </label>
                        <input
                            type="text"
                            id="category"
                            autoComplete="off"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                            required
                        />

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

                        <label htmlFor="description">
                            description:
                        </label>
                        <input
                            type="text"
                            id="description"
                            autoComplete="off"
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
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