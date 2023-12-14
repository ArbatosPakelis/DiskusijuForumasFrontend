import { useEffect, useState } from "react";
import Header from "../components/Header";
import PageRow from "../components/PageRow";
import defaultApi from "../apis/defaultApi";
import useAuth from "../hooks/useAuth";
import PageForm from "../components/PageForm";
import UserRow from "../components/UserRow";

export default function MainPage(req){
    const { auth} = useAuth();
    const [users, setUsers] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');

    async function fetchingUsers() {
        try {
            let response = "";
            if(auth.role === "admin")
            {
                response = await defaultApi.get("/api/v1/users",
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.accessToken}`,
                  },
                });
            }
            else
            {
                response = await defaultApi.get(`/api/v1/users/${auth.id}`,
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