import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { userApi } from '../api/user';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await userApi.list();
      setUsers(users);
    } catch (error) {
      console.error('获取用户列表失败', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = { name: formData.name, email: formData.email, age: formData.age ? parseInt(formData.age) : undefined };
      if (editingUser) {
        await userApi.update(editingUser.id!, { ...editingUser, ...user });
      } else {
        await userApi.create(user);
      }
      setShowForm(false); setEditingUser(null); setFormData({ name: '', email: '', age: '' }); fetchUsers();
    } catch (error) { console.error('保存用户失败', error); }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email || '', age: user.age?.toString() || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    try { await userApi.delete(id); fetchUsers(); } catch (error) { console.error('删除用户失败', error); }
  };

  const handleCancel = () => { setShowForm(false); setEditingUser(null); setFormData({ name: '', email: '', age: '' }); };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-primary" onClick={() => setShowForm(true)}>✨ 添加用户</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editingUser ? '✏️ 编辑用户' : '✨ 添加用户'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>姓名</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>邮箱</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>年龄</label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">保存</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>取消</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">🐾 加载中...</div>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>ID</th><th>姓名</th><th>邮箱</th><th>年龄</th><th>创建时间</th><th>操作</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.age || '-'}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(user)}>编辑</button>
                    <button className="btn-danger" onClick={() => handleDelete(user.id!)}>删除</button>
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

export default UserList;
