import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import defaultApi from "../apis/defaultApi";
import useAuth from "../hooks/useAuth";

export default function PageForm(props){
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { auth } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // http request
            const response = await defaultApi.post(
              "/api/v1/pages",
              JSON.stringify({ 
                category: category,
                name: name,
                description: description
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
            }
          } catch (err) {
            if (!err?.response) {
              setErrorMessage('No Server Response');
            } else if (err.response?.status === 403) {
              setErrorMessage('Page already exists');
            } else if (err.response?.status === 401) {
              setErrorMessage('Forbidden');
            } else {
              setErrorMessage('Page creation Failed');
            }
          }
    }

    return (
        
        props.status ? (
            <section>
                <form onSubmit={handleSubmit}>
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
        )
    );

}