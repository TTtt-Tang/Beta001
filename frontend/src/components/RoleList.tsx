import { useState, useEffect } from 'react';
import { Role, Menu } from '../types/user';
import { roleApi, menuApi } from '../api/user';

function RoleList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPerm, setShowPerm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [permRole, setPermRole] = useState<Role | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const fetchRoles = async () => {
    setLoading(true);
    try { setRoles(await roleApi.list()); } catch (error) { console.error(error); }
    setLoading(false);
  };

  const fetchMenus = async () => {
    try { setMenus(await menuApi.list()); } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchRoles(); fetchMenus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const role = { name: formData.name, code: formData.code, description: formData.description };
      if (editingRole) { await roleApi.update(editingRole.id!, { ...editingRole, ...role }); }
      else { await roleApi.create(role); }
      setShowForm(false); setEditingRole(null); setFormData({ name: '', code: '', description: '' }); fetchRoles();
    } catch (error) { console.error(error); }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, code: role.code, description: role.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个角色吗？')) return;
    try { await roleApi.delete(id); fetchRoles(); } catch (error) { console.error(error); }
  };

  const handlePerm = async (role: Role) => {
    setPermRole(role);
    try {
      const ids = await roleApi.getMenus(role.id!);
      setSelectedMenuIds(ids);
    } catch (error) { console.error(error); }
    setShowPerm(true);
  };

  const toggleMenu = (menuId: number) => {
    setSelectedMenuIds(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const savePerm = async () => {
    if (!permRole) return;
    try { await roleApi.assignMenus(permRole.id!, selectedMenuIds); setShowPerm(false); } catch (error) { console.error(error); }
  };

  const handleCancel = () => { setShowForm(false); setEditingRole(null); setFormData({ name: '', code: '', description: '' }); };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-primary" onClick={() => setShowForm(true)}>✨ 添加角色</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editingRole ? '✏️ 编辑角色' : '✨ 添加角色'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>角色名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group"><label>角色编码</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required /></div>
              <div className="form-group"><label>描述</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">保存</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>取消</button>
            </div>
          </form>
        </div>
      )}

      {showPerm && permRole && (
        <div className="form-card">
          <h3 className="form-title">🛡️ 分配权限 - {permRole.name}</h3>
          <div className="perm-grid">
            {menus.map(menu => (
              <label key={menu.id} className="perm-item">
                <input type="checkbox" checked={selectedMenuIds.includes(menu.id!)} onChange={() => toggleMenu(menu.id!)} />
                <span>{menu.icon} {menu.name}</span>
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={savePerm}>保存权限</button>
            <button className="btn-secondary" onClick={() => setShowPerm(false)}>取消</button>
          </div>
        </div>
      )}

      {loading ? <div className="loading">🐾 加载中...</div> : (
        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>ID</th><th>角色名称</th><th>编码</th><th>描述</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.id}</td>
                  <td>{role.name}</td>
                  <td><code className="code-tag">{role.code}</code></td>
                  <td>{role.description || '-'}</td>
                  <td><span className={`status-badge ${role.status === 1 ? 'status-active' : 'status-inactive'}`}>{role.status === 1 ? '启用' : '禁用'}</span></td>
                  <td>
                    <button className="btn-perm" onClick={() => handlePerm(role)}>权限</button>
                    <button className="btn-edit" onClick={() => handleEdit(role)}>编辑</button>
                    <button className="btn-danger" onClick={() => handleDelete(role.id!)}>删除</button>
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

export default RoleList;
