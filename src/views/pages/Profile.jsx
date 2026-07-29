import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const { updateProfile, deleteAccount, loading: userLoading } = useUser();

  // Local state for editing
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState(null);

  if (!user) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">Please log in to view your profile.</div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await updateProfile({ userName: formData.userName, email: formData.email });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditMode(false);
    } catch (err) {
      setMessage({ type: 'danger', text: err.message || 'Update failed.' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      try {
        await deleteAccount();
        // Redirect/show success handled by hook
      } catch (err) {
        setMessage({ type: 'danger', text: err.message || 'Deletion failed.' });
      }
    }
  };

  // Mock recent activity (replace with actual data)
  const recentActivity = user.recentlyPlayed || [
    { id: 1, title: 'Golden Hour', artist: 'JVKE', date: '2 min ago' },
    { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', date: '1 hour ago' },
    { id: 3, title: 'Levitating', artist: 'Dua Lipa', date: '3 hours ago' },
  ];

  // Helper to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* -------- Left Column: Profile Card -------- */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-body text-center p-4">
              {/* Avatar */}
              <div className="position-relative d-inline-block">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.userName}
                    className="rounded-circle border border-3 border-gold"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle border border-3 border-gold d-flex align-items-center justify-content-center bg-gold text-white"
                    style={{ width: '120px', height: '120px', fontSize: '2.5rem', fontWeight: 'bold' }}
                  >
                    {getInitials(user.userName)}
                  </div>
                )}
                <span
                  className="position-absolute bottom-0 end-0 badge rounded-pill bg-gold text-dark px-2 py-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  {user.provider || 'local'}
                </span>
              </div>

              <h3 className="mt-3 mb-1">{user.userName}</h3>
              <p className="text-muted small">{user.email}</p>

              {user.provider === 'google' && (
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-google me-1"></i> Google
                </span>
              )}

              <hr className="my-3" />

              {/* Quick stats (placeholders) */}
              <div className="row g-2">
                <div className="col-4">
                  <div className="fw-bold text-gold">24</div>
                  <small className="text-muted">Playlists</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-gold">1.2k</div>
                  <small className="text-muted">Followers</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-gold">56</div>
                  <small className="text-muted">Likes</small>
                </div>
              </div>

              <div className="d-grid gap-2 mt-3">
                <button
                  className="btn btn-outline-gold"
                  onClick={() => setEditMode(!editMode)}
                >
                  <i className="bi bi-pencil me-1"></i> Edit Profile
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={handleDelete}
                  disabled={userLoading}
                >
                  <i className="bi bi-trash me-1"></i> Delete Account
                </button>
                <button
                  className="btn btn-gold"
                  onClick={logout}
                  disabled={authLoading}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------- Right Column: Details & Activity -------- */}
        <div className="col-lg-8">
          {/* Message alerts */}
          {message && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          {/* Edit Profile Form */}
          {editMode && (
            <div className="card shadow-sm border-0 rounded-4 mb-4">
              <div className="card-body">
                <h5 className="card-title text-gold">Edit Profile</h5>
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-gold" disabled={userLoading}>
                      {userLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* -------- User Information (All Fields) -------- */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">
              <h5 className="card-title text-gold">
                <i className="bi bi-person-badge me-2"></i>User Information
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>User ID:</strong> {user.userId || user.id || 'N/A'}</p>
                  <p><strong>User Name:</strong> {user.userName || 'N/A'}</p>
                  <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                  <p><strong>Provider:</strong> {user.provider || 'local'}</p>
                  {user.providerId && <p><strong>Provider ID:</strong> {user.providerId}</p>}
                </div>
                <div className="col-md-6">
                  <p><strong>Joined:</strong> {formatDate(user.createdAt)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(user.updatedAt)}</p>
                  {user.lastLoginAt && <p><strong>Last Login:</strong> {formatDate(user.lastLoginAt)}</p>}
                  <p><strong>Account Active:</strong> {user.isActive ? '✅ Yes' : '❌ No'}</p>
                  {user.refreshToken && <p><strong>Refresh Token:</strong> <code>••••</code></p>}
                </div>
              </div>
              {/* Additional fields if any */}
              {user.profilePicture && (
                <div className="mt-2">
                  <strong>Profile Picture:</strong> <span className="text-muted">✓ Available</span>
                </div>
              )}
              {user.password && (
                <div className="mt-2">
                  <strong>Password:</strong> <span className="text-muted">🔒 Set</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="card-title text-gold">
                <i className="bi bi-clock-history me-2"></i>Recent Activity
              </h5>
              {recentActivity.length === 0 ? (
                <p className="text-muted">No recent activity.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {recentActivity.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
                      <div>
                        <span className="fw-bold">{item.title}</span>
                        <span className="text-muted ms-2">— {item.artist}</span>
                      </div>
                      <small className="text-muted">{item.date}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* -------- Custom Styles (move to a separate CSS file if preferred) -------- */}
      <style>{`
        .text-gold {
          color: #D4AF37;
        }
        .bg-gold {
          background-color: #D4AF37;
        }
        .btn-gold {
          background: linear-gradient(135deg, #F6D88A, #C88732);
          color: #062417;
          border: none;
          font-weight: 600;
        }
        .btn-gold:hover {
          background: linear-gradient(135deg, #F8D88A, #D4AF37);
          color: #03140F;
        }
        .btn-outline-gold {
          border-color: #D4AF37;
          color: #D4AF37;
        }
        .btn-outline-gold:hover {
          background: #D4AF37;
          color: #03140F;
        }
        .border-gold {
          border-color: #D4AF37 !important;
        }
        /* Card hover effect */
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.15) !important;
        }
        /* Avatar initials fallback */
        .initials-avatar {
          background: linear-gradient(135deg, #D4AF37, #F8D88A);
        }
      `}</style>
    </div>
  );
};

export default Profile;