import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from '../../contexts/LocationContext';
import { Icon } from '../../utils/iconResolver';
import Card from '../../components/common/Card';
import './Profile.css';

export default function Profile() {
  const { user, currentUser } = useAuth();
  const { selectedLocation } = useLocation();

  if (!user) {
    return (
      <div className="profile">
        <Card>
          <p>Please <a href="/login">login</a> to view your profile.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile">
      <h1 className="profile__title">My Profile</h1>
      <Card className="profile__card">
        <div className="profile__avatar">
          <Icon name="FaUserCircle" />
        </div>
        <div className="profile__info">
          <div className="profile__field">
            <span className="profile__label">Name</span>
            <span>{currentUser.name}</span>
          </div>
          <div className="profile__field">
            <span className="profile__label">Email</span>
            <span>{currentUser.email}</span>
          </div>
          {currentUser.phone && (
            <div className="profile__field">
              <span className="profile__label">Phone</span>
              <span>{currentUser.phone}</span>
            </div>
          )}
          {selectedLocation && (
            <div className="profile__field">
              <span className="profile__label">Location</span>
              <span>{selectedLocation.name}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
