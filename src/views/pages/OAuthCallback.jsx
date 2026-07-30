import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [error, setError] = useState(null);

  useEffect(() => {
    const status = searchParams.get("status");
    const errorMsg = searchParams.get("error");
    const token = searchParams.get("token");

    if (status === "error" || errorMsg) {
      setError(errorMsg || "Authentication failed");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    if (!token) {
      setError("Authentication token not received.");
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    // Save the token
    localStorage.setItem("authToken", token);

    // Update auth context in the background (don't await)
    checkAuth().catch(console.error);

    // Clean the URL
    window.history.replaceState({}, "", "/");

    // Navigate to the dashboard immediately
    navigate("/", { replace: true });
  }, [searchParams, navigate, checkAuth]);

  if (error) {
    return (
      <div>
        Authentication Error: {error}
        <br />
        Redirecting...
      </div>
    );
  }

  return <div>Completing sign-in... Please wait...</div>;
};

export default OAuthCallback;




// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";

// const OAuthCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { handleOAuthRedirect, user } = useAuth();

//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const status = searchParams.get("status");
//     const errorMsg = searchParams.get("error");
//     const token = searchParams.get("token");

//     if (status === "error" || errorMsg) {
//       setError(errorMsg || "Authentication failed");

//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);

//       return;
//     }

//     if (!token) {
//       setError("Authentication token not received.");

//       setTimeout(() => {
//         navigate("/login");
//       }, 3000);

//       return;
//     }

//     // Save JWT
//     localStorage.setItem("authToken", token);

//     console.log("JWT saved successfully.");

//     const authenticate = async () => {
//       try {
//         await handleOAuthRedirect();
//       } catch (err) {
//         console.error(err);
//         localStorage.removeItem("authToken");
//         navigate("/login");
//       }
//     };

//     authenticate();
//   }, [searchParams, handleOAuthRedirect, navigate]);

//   useEffect(() => {
//     if (user) {
//       console.log("User authenticated:", user);

//       // Remove token from URL
//       window.history.replaceState({}, "", "/");

//       navigate("/", { replace: true });
//     }
//   }, [user, navigate]);

//   if (error) {
//     return (
//       <div>
//         Authentication Error: {error}
//         <br />
//         Redirecting...
//       </div>
//     );
//   }

//   return <div>Completing sign-in... Please wait...</div>;
// };

// export default OAuthCallback;