import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import useAuth from "../hooks/useAuth.js";
import UserRow from "../components/UserRow.jsx";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function MainPage(req){
    const { auth} = useAuth();
    const [users, setUsers] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const PrivateApi = usePrivateApi();

    async function fetchingUsers() {
        try {
            let response = "";
            if(auth.role === "admin")
            {
                response = await PrivateApi.get("/api/v1/users",
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                  },
                });
            }
            else
            {
                response = await PrivateApi.get(`/api/v1/users/${auth.id}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                  },
                });
            }
            
            setUsers(response?.data?.users);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No users were found');
            } else {
                setErrorMessage('User load failure')
            }
        }
    }

    const handleFormSubmit = async() => {
        setUsers(undefined);
        setErrorMessage('');
        await fetchingUsers();
    };

    useEffect( () => {
        fetchingUsers();
    }, [])


    return (
        <>
            <Header/>
            { auth?.role !== "admin" ? (
                <>
                    <h3>
                        User page
                    </h3>
                    <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
                    {users !== undefined && users.length !== 0 ? (
                        <UserRow onFormSubmit={handleFormSubmit} key={users.id} {...users} />
                    ) : (
                        <p> </p>
                    )}
                </>
            ) : (
                <>
                    <h3>
                        Users 
                    </h3>
                    <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
                    {users !== undefined && users.length !== 0 ? (
                        users.map((x) => <UserRow onFormSubmit={handleFormSubmit} key={x.id} {...x} />)
                    ) : (
                        <p> </p>
                    )}
                </>
            )}
        </>
    );
}