import { useEffect, useState } from "react";
import Header from "../components/Header";
import PageRow from "../components/PageRow";
import defaultApi from "../apis/defaultApi";

export default function MainPage(req){

    const [pages, setPages] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect( () => {
        async function fetchingPages() {
            try {
                const response = await defaultApi.get("/api/v1/pages");
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
        fetchingPages();
    }, [])

    return (
        <>
            <Header/>
            <h3>MainPage</h3>
            <p className={errorMessage ? "errorMessage" : "offscreen"} aria-live="assertive">{errorMessage}</p>
            {pages !== undefined && pages.length !== 0 ? (
                pages.map((x) => <PageRow key={x.id} {...x} />)
            ) : (
                <p> </p>
            )}

        </>
    );
}