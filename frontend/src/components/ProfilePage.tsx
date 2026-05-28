import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { User, Role, UserGroup } from '../types/user';
import { userApi, roleApi, groupApi, menuApi } from '../api/user';
import UserList from './UserList';
import RoleList from './RoleList';
import GroupList from './GroupList';
import MenuList from './MenuList';

type TabKey = 'profile' | 'users' | 'roles' | 'groups' | 'menus';

function ProfilePage() {
  const { t } = useI18n();
  const { user: authUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allGroups, setAllGroups] = useState<UserGroup[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roles, groups] = await Promise.all([
          roleApi.list(),
          groupApi.list(),
        ]);
        setAllRoles(roles);
        setAllGroups(groups);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
      setFormData({ name: authUser.name, email: authUser.email || '', age: authUser.age?.toString() || '' });
    }
  }, [authUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      await userApi.update(currentUser.id!, {
        ...currentUser,
        name: formData.name,
        email: formData.email || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
      });
      setEditing(false);
    } catch (error) { console.error(error); }
  };

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'profile', label: t('profile.basicInfo'), icon: '👤' },
    { key: 'users', label: t('nav.users'), icon: '👥' },
    { key: 'roles', label: t('nav.roles'), icon: '🛡️' },
    { key: 'groups', label: t('nav.groups'), icon: '�' },
    { key: 'menus', label: t('nav.menus'), icon: '📋' },
  ];

  return (
    <div className="page-container">
      <div className="profile-header-card">
        <div className="profile-avatar-large">🐶</div>
        <div className="profile-info">
          <h2 className="profile-name">{currentUser?.name || 'Pochacco'}</h2>
          <p className="profile-email">{currentUser?.email || 'pochacco@sanrio.com'}</p>
          <div className="profile-tags">
            {allRoles.slice(0, 2).map(role => (
              <span key={role.id} className="blog-tag blog-tag-green">{role.name}</span>
            ))}
            {allGroups.slice(0, 2).map(group => (
              <span key={group.id} className="blog-tag">{group.name}</span>
            ))}
          </div>
        </div>
        <button className="btn-danger" onClick={logout} style={{ marginLeft: 'auto', padding: '8px 20px' }}>
          {t('label.lang') === '语言' ? '退出登录' : 'Logout'}
        </button>
      </div>

      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`profile-tab ${activeTab === tab.key ? 'profile-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && currentUser && (
          <div className="form-card">
            <h3 className="form-title">{t('profile.basicInfo')}</h3>
            {editing ? (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t('label.name')}</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>{t('label.email')}</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>{t('label.age')}</label>
                    <input type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-primary" onClick={handleSaveProfile}>{t('btn.save')}</button>
                  <button className="btn-secondary" onClick={() => setEditing(false)}>{t('btn.cancel')}</button>
                </div>
              </>
            ) : (
              <div className="profile-detail">
                <div className="profile-detail-row">
                  <span className="profile-detail-label">{t('label.name')}</span>
                  <span className="profile-detail-value">{currentUser.name}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">{t('label.email')}</span>
                  <span className="profile-detail-value">{currentUser.email || '-'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">{t('label.age')}</span>
                  <span className="profile-detail-value">{currentUser.age || '-'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">{t('label.createdAt')}</span>
                  <span className="profile-detail-value">{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleString() : '-'}</span>
                </div>
                <div className="form-actions">
                  <button className="btn-primary" onClick={() => setEditing(true)}>{t('profile.editProfile')}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && <UserList />}
        {activeTab === 'roles' && <RoleList />}
        {activeTab === 'groups' && <GroupList />}
        {activeTab === 'menus' && <MenuList />}
      </div>
    </div>
  );
}

export default ProfilePage;
