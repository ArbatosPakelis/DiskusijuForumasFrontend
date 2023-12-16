import { useEffect, useState } from "react";
import Header from "../components/Header";
import PageRow from "../components/PageRow";
import usePrivateApi from "../hooks/usePrivateApi";
import useAuth from "../hooks/useAuth";
import PageForm from "../components/PageForm";
import christmasTree from '../tree.png';

export default function MainPage(req){
    const { auth} = useAuth();
    const [pages, setPages] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [ newPage, setNewPage] = useState(false);
    const PrivateApi = usePrivateApi();

    async function fetchingPages() {
        try {
            const response = await PrivateApi.get("/api/v1/pages");
            setPages(response?.data?.pages);
        } catch (err) {
            if (!err?.response) {
                setErrorMessage('No Server Response');
            } else if (err.response?.status === 404) {
                setErrorMessage('No pages were found');
            } else {
                setErrorMessage('Page load failure')
            }
        }
    }
    
    const handleFormSubmit = () => {
        fetchingPages();
        setNewPage(false);
    };
    
    useEffect( () => {
        fetchingPages();
    }, [])


    const onClick = async (e) => {
        if(newPage === false)
        {
            setNewPage(true);
        }
        else
        {
            setNewPage(false);
        }
    }

    return (
        <>
            <Header/>
            <h3>Welcome to the main page !</h3>
            <img src={christmasTree} alt="Christmas Tree" className="img" />
            { auth?.username != null ? (
                <>
                <button className="smallButton" onClick={onClick}>
                    new page
                </button>
                <PageForm status={newPage} onFormSubmit={handleFormSubmit}/>
                </>
            ) : (
                <p> </p>
            )}
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {pages !== undefined && pages.length !== 0 ? (
                pages.map((x) => <PageRow onFormSubmit={handleFormSubmit} key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}

        </>
    );
}