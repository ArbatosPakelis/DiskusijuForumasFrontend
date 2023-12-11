import { useEffect, useState } from "react";
import Header from "../components/Header";
import defaultApi from "../apis/defaultApi";
import ThreadRow from "../components/ThreadRow";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import ThreadForm from "../components/ThreadForm";


export default function ThreadList(){
    const { auth} = useAuth();
    const { id } = useParams();
    const [threads, setThreads] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [ newThread, setNewThread] = useState(false);

    async function fetchingThreads() {
        try {
            const response = await defaultApi.get(`/api/v1/threads/${id}/bonus`);
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
    }

    const handleFormSubmit = () => {
        fetchingThreads();
        setNewThread(false);
    };

    useEffect( () => {
        fetchingThreads();
    }, [])
    
    const onClick = async (e) => {
        console.log(newThread);
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
            <h3>ThreadList</h3>
            { auth?.username != null ? (
                <>
                <button className="smallButton" onClick={onClick}>
                    New thread
                </button>
                <ThreadForm status={newThread} onFormSubmit={handleFormSubmit}/>
                </>
            ) : (
                <p> </p>
            )}
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {threads !== undefined && threads.length !== 0 ? (
                threads.map((x) => <ThreadRow key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}
        </>
    );
}