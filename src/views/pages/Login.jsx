import { useAuth } from "../hooks/useAuth";
import logo from "../../assets/logo.jpg";
import { useState, useEffect, useRef } from "react";

const Login = () => {
  const { login, loading } = useAuth();

  // State for live statistics (simulated)
  const [stats, setStats] = useState({
    artists: 1247,
    songs: 5230,
    listeners: 18920,
  });

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        artists: prev.artists + Math.floor(Math.random() * 2),
        songs: prev.songs + Math.floor(Math.random() * 5),
        listeners: prev.listeners + Math.floor(Math.random() * 10),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  //Trending artists (dummy data)
  const trendingArtists = [
    { name: "Pop", genre: "Main Stream" },
    { name: "Classical", genre: "Traditional" },
    { name: "Country", genre: "Roots" },
    { name: "EDM", genre: "Electronic" },
    { name: "Reaggae", genre: "Global" },
  ];

  // Refs for floating notes animation
  const noteContainerRef = useRef(null);

  // Generate random notes on mount
  useEffect(() => {
    if (!noteContainerRef.current) return;
    const container = noteContainerRef.current;
    const noteSymbols = ["♩", "♪", "♫", "♬", "🎵", "🎶"];
    const notes = [];
    for (let i = 0; i < 15; i++) {
      const note = document.createElement("span");
      note.textContent = noteSymbols[i % noteSymbols.length];
      note.style.position = "absolute";
      note.style.fontSize = `${16 + Math.random() * 24}px`;
      note.style.left = `${Math.random() * 100}%`;
      note.style.top = `${Math.random() * 100}%`;
      note.style.opacity = 0.2 + Math.random() * 0.3;
      note.style.animation = `floatNote ${15 + Math.random() * 20}s linear infinite`;
      note.style.animationDelay = `${Math.random() * 10}s`;
      note.style.color = "#D4AF37";
      notes.push(note);
    }
    notes.forEach((n) => container.appendChild(n));
  }, []);

  return (
    <>
      {/*Inline styles for animations*/}
      <style>{`
        @keyframes floatNote {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-10vh) rotate(720deg); opacity: 0; }
        }

        @keyframes equalize {
          0%, 100% { height: 6px; }
          50% { height: 30px; }
        }
        .equalizer-bar {
          display: inline-block;
          width: 4px;
          margin: 0 2px;
          background: linear-gradient(to top, #D4AF37, #F8D88A);
          border-radius: 2px;
          animation: equalize 0.8s ease-in-out infinite alternate;
        }
        .equalizer-bar:nth-child(2) { animation-duration: 1.0s; }
        .equalizer-bar:nth-child(3) { animation-duration: 0.6s; }
        .equalizer-bar:nth-child(4) { animation-duration: 1.2s; }
        .equalizer-bar:nth-child(5) { animation-duration: 0.9s; }
        .equalizer-bar:nth-child(6) { animation-duration: 0.7s; }
        .equalizer-bar:nth-child(7) { animation-duration: 1.1s; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-disc {
          animation: spin 8s linear infinite;
        }

        @keyframes waveMove {
          0% { transform: translateX(-50%) scaleY(0.4); }
          50% { transform: translateX(-25%) scaleY(0.8); }
          100% { transform: translateX(0%) scaleY(0.4); }
        }
        .sound-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100px;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(212, 175, 55, 0.08) 40px,
            rgba(212, 175, 55, 0.08) 80px
          );
          animation: waveMove 3s ease-in-out infinite alternate;
        }

        .floating-note {
          pointer-events: none;
          z-index: 0;
        }

        /* Trending carousel styles */
        .trending-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: thin;
          scrollbar-color: #D4AF37 transparent;
        }
        .trending-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .trending-scroll::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 10px;
        }
        .trending-item {
          flex: 0 0 auto;
          background: rgba(255,255,255,0.05);
          border-radius: 30px;
          padding: 0.5rem 1.2rem;
          border: 1px solid rgba(212,175,55,0.2);
          white-space: nowrap;
          transition: 0.3s;
        }
        .trending-item:hover {
          background: rgba(212,175,55,0.15);
          border-color: #D4AF37;
        }

        /* Now Playing mini player */
        .now-playing {
          background: rgba(6,36,23,0.8);
          backdrop-filter: blur(8px);
          border-radius: 50px;
          padding: 0.4rem 1rem;
          border: 1px solid rgba(212,175,55,0.3);
        }
        .progress-bar-bg {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin-top: 2px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          width: 65%;
          background: linear-gradient(90deg, #D4AF37, #F8D88A);
          border-radius: 2px;
          animation: progressPulse 2s ease-in-out infinite;
        }
        @keyframes progressPulse {
          0% { width: 40%; }
          50% { width: 70%; }
          100% { width: 40%; }
        }
      `}</style>

      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #03140F 0%, #0A2B1E 50%, #041C14 100%)",
          position: "relative",
        }}
      >
        {/*Animated Sound Wave Background*/}
        <div className="sound-wave" style={{ opacity: 0.4 }}></div>
        <div
          className="sound-wave"
          style={{
            animationDelay: "1.5s",
            opacity: 0.2,
            height: "140px",
            bottom: "-20px",
          }}
        ></div>

        {/*Floating Music Notes*/}
        <div
          ref={noteContainerRef}
          className="floating-note"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        ></div>

        <div className="row w-100 justify-content-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-10 col-xl-9">

            {/* Main Card */}
            <div
              className="card border-0 shadow-lg overflow-hidden"
              style={{
                background: "rgba(8,30,22,0.85)",
                backdropFilter: "blur(16px)",
                borderRadius: "30px",
                border: "1px solid rgba(212,175,55,0.15)",
              }}
            >
              <div className="row g-0">

                {/*Left Hero Section*/}
                <div className="col-lg-7 text-white p-5 d-flex flex-column justify-content-center position-relative">

                  {/* Rotating Vinyl Disc (logo) */}
                  <div className="vinyl-disc" style={{ width: "110px", height: "110px", marginBottom: "1.5rem" }}>
                    <img
                      src={logo}
                      alt="Crestune Music"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "50%",
                        border: "3px solid #D4AF37",
                      }}
                    />
                  </div>

                  <span
                    className="badge align-self-start mb-3 px-3 py-2"
                    style={{
                      background: "#D4AF37",
                      color: "#062417",
                      fontWeight: 600,
                    }}
                  >
                    PREMIUM MUSIC PLATFORM
                  </span>

                  <h1
                    className="display-6 fw-bold mb-3"
                    style={{ color: "#F8D88A" }}
                  >
                    Discover, Produce, Stream.
                  </h1>

                  <p
                    className="lead"
                    style={{
                      color: "#C9D7CF",
                      lineHeight: 1.6,
                    }}
                  >
                    Connect with artists, producers and music lovers around the
                    world. Upload your music, build your audience and experience
                    premium streaming.
                  </p>

                  {/*Animated Equalizer*/}
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <span style={{ color: "#C9D7CF", fontSize: "0.9rem" }}>LIVE</span>
                    <div className="d-flex align-items-end" style={{ height: "30px" }}>
                      {[...Array(7)].map((_, i) => (
                        <span key={i} className="equalizer-bar" style={{ animationDelay: `${i * 0.1}s` }}></span>
                      ))}
                    </div>
                  </div>

                  {/*Live Statistics*/}
                  <div className="row g-3 mt-2">
                    <div className="col-4">
                      <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1.4rem" }}>
                        {stats.artists.toLocaleString()}
                      </div>
                      <small style={{ color: "#9CB5A8" }}>Artists</small>
                    </div>
                    <div className="col-4">
                      <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1.4rem" }}>
                        {stats.songs.toLocaleString()}
                      </div>
                      <small style={{ color: "#9CB5A8" }}>Songs</small>
                    </div>
                    <div className="col-4">
                      <div style={{ color: "#D4AF37", fontWeight: 700, fontSize: "1.4rem" }}>
                        {stats.listeners.toLocaleString()}
                      </div>
                      <small style={{ color: "#9CB5A8" }}>Listeners</small>
                    </div>
                  </div>

                  {/*Trending Artists Carousel*/}
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ color: "#C9D7CF", fontSize: "0.9rem", fontWeight: 500 }}>
                        🔥 Trending Artists
                      </span>
                      <span style={{ color: "#D4AF37", fontSize: "0.8rem", cursor: "pointer" }}>
                        View All
                      </span>
                    </div>
                    <div className="trending-scroll">
                      {trendingArtists.map((artist, idx) => (
                        <div key={idx} className="trending-item">
                          <span style={{ color: "#F8D88A", fontWeight: 600 }}>{artist.name}</span>
                          <span style={{ color: "#9CB5A8", fontSize: "0.75rem", marginLeft: "0.5rem" }}>
                            {artist.genre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/*"Now Playing" Mini Player*/}
                  <div className="now-playing mt-3 d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        background: "#23513D",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#F8D88A",
                        fontSize: "1.2rem",
                      }}
                    >
                      ♫
                    </div>
                    <div className="flex-grow-1">
                      <div style={{ color: "#F8D88A", fontWeight: 600, fontSize: "0.9rem" }}>
                        Golden Hours
                      </div>
                      <div style={{ color: "#9CB5A8", fontSize: "0.75rem" }}>Lintrix • 3:24</div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill"></div>
                      </div>
                    </div>
                    <div style={{ color: "#D4AF37", fontSize: "1.2rem", cursor: "pointer" }}>▶</div>
                  </div>

                </div>

                {/* Right Login Panel (Glassmorphism)*/}
                <div
                  className="col-lg-5 d-flex align-items-center justify-content-center p-5"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(8px)",
                    borderLeft: "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  <div className="w-100 text-center">

                    <h2
                      className="fw-bold mb-3"
                      style={{ color: "#F8D88A" }}
                    >
                      Welcome Back
                    </h2>

                    <p
                      className="mb-4"
                      style={{ color: "#C9D7CF" }}
                    >
                      Sign in to continue your musical journey.
                    </p>

                    <button
                      onClick={login}
                      disabled={loading}
                      className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "linear-gradient(135deg,#F6D88A,#C88732)",
                        color: "#062417",
                        border: "none",
                        borderRadius: "50px",
                        padding: "15px",
                        fontWeight: 700,
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      <i className="bi bi-google"></i>
                      {loading ? "Signing In..." : "Continue with Google"}
                    </button>

                    <hr
                      className="my-4"
                      style={{
                        borderColor: "#23513D",
                      }}
                    />

                    <small
                      style={{
                        color: "#9CB5A8",
                      }}
                    >
                      By continuing, you agree to our Terms of Service and Privacy
                      Policy.
                    </small>

                    {/* Equalizer decoration */}
                    {/* <div className="mt-4 d-flex justify-content-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="equalizer-bar"
                          style={{
                            height: `${10 + i * 4}px`,
                            animationDelay: `${i * 0.15}s`,
                            background: "linear-gradient(to top, #D4AF37, #F8D88A)",
                          }}
                        ></span>
                      ))}
                    </div> */}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

// import { useAuth } from "../hooks/useAuth";
// import logo from "../../assets/logo.jpg";

// const Login = () => {
//   const { login, loading } = useAuth();

//   return (
//     <div
//       className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
//       style={{
//         background:
//           "linear-gradient(135deg, #03140F 0%, #0A2B1E 50%, #041C14 100%)",
//       }}
//     >
//       <div className="row w-100 justify-content-center">
//         <div className="col-lg-10 col-xl-9">

//           <div
//             className="card border-0 shadow-lg overflow-hidden"
//             style={{
//               background: "rgba(8,30,22,0.92)",
//               borderRadius: "30px",
//               backdropFilter: "blur(12px)",
//             }}
//           >
//             <div className="row g-0">

//               {/* Left Hero Section */}
//               <div className="col-lg-7 text-white p-5 d-flex flex-column justify-content-center">

//                 <img
//                   src={logo}
//                   alt="Crestune Music"
//                   className="mb-4"
//                   style={{
//                     width: "110px",
//                     height: "110px",
//                     objectFit: "contain",
//                   }}
//                 />

//                 <span
//                   className="badge align-self-start mb-3 px-3 py-2"
//                   style={{
//                     background: "#D4AF37",
//                     color: "#062417",
//                   }}
//                 >
//                   PREMIUM MUSIC PLATFORM
//                 </span>

//                 <h1
//                   className="display-4 fw-bold mb-4"
//                   style={{ color: "#F8D88A" }}
//                 >
//                   Discover.
//                   <br />
//                   Produce.
//                   <br />
//                   Stream.
//                 </h1>

//                 <p
//                   className="lead"
//                   style={{
//                     color: "#C9D7CF",
//                     lineHeight: 1.8,
//                   }}
//                 >
//                   Connect with artists, producers and music lovers around the
//                   world. Upload your music, build your audience and experience
//                   premium streaming powered by Crestune Music.
//                 </p>

//                 <div className="d-flex flex-wrap gap-3 mt-4">

//                   <span
//                     className="badge rounded-pill px-3 py-2"
//                     style={{
//                       background: "#0C5F44",
//                     }}
//                   >
//                     🎵 Upload Music
//                   </span>

//                   <span
//                     className="badge rounded-pill px-3 py-2"
//                     style={{
//                       background: "#0C5F44",
//                     }}
//                   >
//                     🎧 Stream Anywhere
//                   </span>

//                   <span
//                     className="badge rounded-pill px-3 py-2"
//                     style={{
//                       background: "#0C5F44",
//                     }}
//                   >
//                     💰 Monetize
//                   </span>

//                 </div>

//               </div>

//               {/* Right Login Section */}

//               <div
//                 className="col-lg-5 d-flex align-items-center justify-content-center p-5"
//                 style={{
//                   background: "rgba(255,255,255,.03)",
//                 }}
//               >
//                 <div className="w-100 text-center">

//                   <h2
//                     className="fw-bold mb-3"
//                     style={{
//                       color: "#F8D88A",
//                     }}
//                   >
//                     Welcome Back
//                   </h2>

//                   <p
//                     className="mb-4"
//                     style={{
//                       color: "#C9D7CF",
//                     }}
//                   >
//                     Sign in to continue your musical journey.
//                   </p>

//                   <button
//                     onClick={login}
//                     disabled={loading}
//                     className="btn btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
//                     style={{
//                       background:
//                         "linear-gradient(135deg,#F6D88A,#C88732)",
//                       color: "#062417",
//                       border: "none",
//                       borderRadius: "50px",
//                       padding: "15px",
//                       fontWeight: 700,
//                     }}
//                   >
//                     <i className="bi bi-google"></i>

//                     {loading
//                       ? "Signing In..."
//                       : "Continue with Google"}
//                   </button>

//                   <hr
//                     className="my-4"
//                     style={{
//                       borderColor: "#23513D",
//                     }}
//                   />

//                   <small
//                     style={{
//                       color: "#9CB5A8",
//                     }}
//                   >
//                     By continuing, you agree to our Terms of Service and Privacy
//                     Policy.
//                   </small>

//                 </div>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import { useAuth } from '../hooks/useAuth';

// const Login = () => {
//   const { login, loading } = useAuth();

//   return (
//     <div style={{ textAlign: 'center', textJustify: 'center', marginTop: '300px' }}>
//       <h1>Welcome to Crestune</h1>
//       <p> Sign in to continue</p>
//       <button onClick={login} disabled={loading} className='btn btn-primary'>
//         {loading ? 'Loading ...' : 'Sign in with Google'}
        
//       </button>
//     </div>
//   );
// };

// export default Login;