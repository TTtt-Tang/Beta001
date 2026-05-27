import { useState, useEffect } from 'react';
import { UserGroup, User } from '../types/user';
import { groupApi, userApi } from '../api/user';

function GroupList() {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [memberGroup, setMemberGroup] = useState<UserGroup | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const fetchGroups = async () => {
    setLoading(true);
    try { setGroups(await groupApi.list()); } catch (error) { console.error(error); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try { setUsers(await userApi.list()); } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchGroups(); fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const group = { name: formData.name, code: formData.code, description: formData.description };
      if (editingGroup) { await groupApi.update(editingGroup.id!, { ...editingGroup, ...group }); }
      else { await groupApi.create(group); }
      setShowForm(false); setEditingGroup(null); setFormData({ name: '', code: '', description: '' }); fetchGroups();
    } catch (error) { console.error(error); }
  };

  const handleEdit = (group: UserGroup) => {
    setEditingGroup(group);
    setFormData({ name: group.name, code: group.code, description: group.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个用户组吗？')) return;
    try { await groupApi.delete(id); fetchGroups(); } catch (error) { console.error(error); }
  };

  const handleMembers = async (group: UserGroup) => {
    setMemberGroup(group);
    try {
      const ids = await groupApi.getMembers(group.id!);
      setSelectedUserIds(ids);
    } catch (error) { console.error(error); }
    setShowMembers(true);
  };

  const toggleUser = (userId: number) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const saveMembers = async () => {
    if (!memberGroup) return;
    try { await groupApi.assignMembers(memberGroup.id!, selectedUserIds); setShowMembers(false); } catch (error) { console.error(error); }
  };

  const handleCancel = () => { setShowForm(false); setEditingGroup(null); setFormData({ name: '', code: '', description: '' }); };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-primary" onClick={() => setShowForm(true)}>✨ 添加用户组</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editingGroup ? '✏️ 编辑用户组' : '✨ 添加用户组'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>用户组名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group"><label>用户组编码</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></div>
              <div className="form-group"><label>描述</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">保存</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>取消</button>
            </div>
          </form>
        </div>
      )}

      {showMembers && memberGroup && (
        <div className="form-card">
          <h3 className="form-title">👥 成员管理 - {memberGroup.name}</h3>
          <div className="perm-grid">
            {users.map(user => (
              <label key={user.id} className="perm-item">
                <input type="checkbox" checked={selectedUserIds.includes(user.id!)} onChange={() => toggleUser(user.id!)} />
                <span>{user.name} ({user.email})</span>
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={saveMembers}>保存成员</button>
            <button className="btn-secondary" onClick={() => setShowMembers(false)}>取消</button>
          </div>
        </div>
      )}

      {loading ? <div className="loading">🐾 加载中...</div> : (
        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>ID</th><th>用户组名称</th><th>编码</th><th>描述</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id}>
                  <td>{group.id}</td>
                  <td>{group.name}</td>
                  <td><code className="code-tag">{group.code}</code></td>
                  <td>{group.description || '-'}</td>
                  <td><span className={`status-badge ${group.status === 1 ? 'status-active' : 'status-inactive'}`}>{group.status === 1 ? '启用' : '禁用'}</span></td>
                  <td>
                    <button className="btn-perm" onClick={() => handleMembers(group)}>成员</button>
                    <button className="btn-edit" onClick={() => handleEdit(group)}>编辑</button>
                    <button className="btn-danger" onClick={() => handleDelete(group.id!)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GroupList;
