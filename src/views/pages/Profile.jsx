import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

const Profile = () => {
  const { user, logout } = useAuth();
  const { updateProfile, deleteAccount } = useUser();

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user.userName}</p>
      <p>Email: {user.email}</p>
      <button onClick={() => updateProfile({ userName: 'New Name' })}>
        Update Name
      </button>
      <button onClick={deleteAccount}>Delete Account</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;