import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, UserCircle, LogOut, Settings, Building2 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../services/features/authSlice";
import { useGetNotificationCountQuery, useGetAllNotificationsQuery, useMarkNotificationAsReadMutation, useMarkAllNotificationsAsReadMutation } from "../../services/features/cemsApi";
import userAvatar from  "../../assets/usermock/userprofile.jpg"

interface NavIconInfoProps {
  userName?: string;
  userImg?: string; // imported image path
}

export const NavIconInfo: React.FC<NavIconInfoProps> = ({
  userName = "Aashish",
  userImg = userAvatar, // default to imported avatar
}) => {
  const { data: countData } = useGetNotificationCountQuery();
  const { data: notifData } = useGetAllNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllRead] = useMarkAllNotificationsAsReadMutation();

  const notificationsCount = countData?.data?.count || 0;
  const notifications = notifData?.data || [];

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMarkRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  return (
    <div className="nav-icons">
      {/* ---------------- Search ---------------- */}
      <div
        className={`nav-icons__item nav-icons__search ${isSearchOpen ? "is-open" : ""}`}
        ref={searchRef}
      >
        <Search size={18} onClick={() => setIsSearchOpen(prev => !prev)} />

        <div className="nav-icons__search-popover">
          <input type="text" placeholder="Search..." autoFocus />
        </div>
      </div>

      {/* ---------------- Notifications ---------------- */}
      <div className="nav-icons__item nav-icons__notifications" ref={notifRef} style={{ position: 'relative' }}>
        <Bell size={18} onClick={() => setIsNotifOpen(prev => !prev)} style={{ cursor: 'pointer' }} />
        {notificationsCount > 0 && (
          <span className="nav-icons__badge">{notificationsCount}</span>
        )}

        {/* Notifications Popover */}
        {isNotifOpen && (
          <div className="notif-popover">
            <div className="notif-header">
              <h4>Notifications</h4>
              <button onClick={() => markAllRead()} className="mark-all-btn">Mark all read</button>
            </div>
            <div className="notif-list">
              {notifications?.length === 0 ? (
                <div className="notif-empty">
                  <p>You're all caught up!</p>
                  <span>No new notifications to show.</span>
                </div>
              ) : (
                notifications?.map((n: any) => (
                  <div 
                    key={n.id} 
                    className={`notif-item ${!n.is_read ? 'unread' : ''}`}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    <div className="notif-dot"></div>
                    <div className="notif-content">
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-msg">{n.message}</p>
                      <span className="notif-time">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="notif-footer">
              <button className="view-all-notifs">View All Notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- User ---------------- */}
      <div className="nav-icons__item nav-icons__user" ref={userRef} style={{ position: 'relative' }}>
        <div 
          onClick={() => setIsUserMenuOpen(prev => !prev)} 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          {userImg ? (
            <img
              src={userImg}
              alt={userName}
              className="nav-icons__user-img"
            />
          ) : (
            <UserCircle size={20} />
          )}
          <span className="nav-icons__username">{userName}</span>
        </div>

        {/* User Dropdown Menu */}
        {isUserMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', right: '0', marginTop: '10px', width: '220px', 
            backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
            padding: '8px 0', zIndex: 100, border: '1px solid #eee'
          }}>
            <NavLink to="/settings/profile" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#333', textDecoration: 'none' }}>
              <UserCircle size={16} /> My Profile
            </NavLink>
            <NavLink to="/settings/company" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#333', textDecoration: 'none' }}>
              <Building2 size={16} /> Company Profile
            </NavLink>
            <NavLink to="/settings/users" onClick={() => setIsUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#333', textDecoration: 'none' }}>
              <Settings size={16} /> User Settings
            </NavLink>
            <div style={{ height: '1px', backgroundColor: '#eee', margin: '8px 0' }}></div>
            <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', color: '#d32f2f', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout System
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
