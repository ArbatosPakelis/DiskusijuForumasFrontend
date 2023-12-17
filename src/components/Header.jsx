import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import usePrivateApi from "../hooks/usePrivateApi.js";

export default function Header() {
  const { auth, setAuth } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const PrivateApi = usePrivateApi();

  const HandlePress = async () => {
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
    <div className="header">
      <button className="headButton">
        {/* using 'link' instead of 'a' to save your auth state going through the pages */}
        <Link to="/">Home page</Link>
      </button>
      {auth?.username ? (
        <>
          <button className="headButton">
            {/* using 'link' instead of 'a' to save your auth state going through the pages */}
            <Link to="/Users">User page</Link>
          </button>
          <button className="head" onClick={HandlePress}>
            Log out
          </button>
        </>
      ) : (
        <button className="head">
          {/* using 'link' instead of 'a' to save your auth state going through the pages */}
          <Link to="/Login">Log in</Link>
        </button>
      )}
    </div>
  );
}
