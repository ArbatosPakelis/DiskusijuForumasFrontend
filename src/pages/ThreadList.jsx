import { useEffect, useState } from "react";
import Header from "../components/Header.js";
import ThreadRow from "../components/ThreadRow.jsx";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import ThreadForm from "../components/ThreadForm.jsx";
import usePrivateApi from "../hooks/usePrivateApi.js";


export default function ThreadList(){
    const { auth} = useAuth();
    const { id } = useParams();
    const [subject, setSubject] = useState(undefined);
    const [follow, setFollow] = useState(undefined);
    const [threads, setThreads] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [ newThread, setNewThread] = useState(false);
    const PrivateApi = usePrivateApi();

    async function fetchingThreads() {
        try {
            const response = await PrivateApi.get(`/api/v1/threads/${id}/bonus`);
            setThreads(response?.data?.threads);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No threads were found');
            } else {
                setErrorMessage('Threads load failure')
            }
        }

        try {
            const response = await PrivateApi.get(`/api/v1/pages/${id}`);
            setSubject(response?.data?.page);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No page was found');
            } else {
                setErrorMessage('Page load failure')
            }
        }

        if(auth.username !== undefined)
        {
            try {
                const response = await PrivateApi.get(`/api/v1/follows/${id}`,
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                        },
                    });
                    setFollow(response?.data?.follow);
            } catch (err) {
                if (!err?.response) {
                    setErrorMessage('No Server Response');
                }
            }
        }
    }

    const handleFormSubmit = async() => {
        setThreads(undefined);
        setErrorMessage('');
        await fetchingThreads();
        setNewThread(false);
    };

    const onTap = async() => {
        try {
            if(follow !== undefined){
                const response = await PrivateApi.delete(`/api/v1/follows/${follow.id}`, 
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                        },
                    }
                );
                setFollow(undefined);
            }
            else
            {
                const response = await PrivateApi.post(`/api/v1/follows`, 
                    JSON.stringify({ 
                        users_fk: auth.id,
                        pages_fk: id
                    }),
                    {
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.accessToken}`,
                        },
                    }
                );
                setFollow(response?.data?.follow);
            }

        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No page was found');
            } else {
                setErrorMessage('Page load failure')
            }
        }
    };

    useEffect( () => {
        fetchingThreads();
    }, []);
    
    const onClick = async (e) => {
        if(newThread === false)
        {
            setNewThread(true);
        }
        else
        {
            setNewThread(false);
        }
    }

    return (
        <>
            <Header/>
            <h3>{subject?.name}</h3>
            { auth?.username != null ? (
                <>
                    <div style={{display:"inline"}}>
                        <button className="smallButton" onClick={onClick}>
                            New thread
                        </button>
                        <button className="smallButton" onClick={onTap}>
                            {!follow ? "follow" : "unfollow"}
                        </button>
                    </div>
                    <ThreadForm status={newThread} onFormSubmit={handleFormSubmit}/>
                </>
            ) : (
                <p> </p>
            )}
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {threads !== undefined && threads.length !== 0 ? (
                threads.map((x) => <ThreadRow onFormSubmit={handleFormSubmit} key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}
        </>
    );
}