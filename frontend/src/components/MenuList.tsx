import { useState, useEffect } from 'react';
import { Menu } from '../types/user';
import { menuApi } from '../api/user';

function MenuList() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [formData, setFormData] = useState({ parentId: 0, name: '', path: '', icon: '', sortOrder: 0, type: 2, permission: '' });

  const fetchMenus = async () => {
    setLoading(true);
    try { setMenus(await menuApi.list()); } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchMenus(); }, []);

  const parentMenus = menus.filter(m => m.parentId === 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const menu = { ...formData };
      if (editingMenu) { await menuApi.update(editingMenu.id!, { ...editingMenu, ...menu }); }
      else { await menuApi.create(menu); }
      setShowForm(false); setEditingMenu(null); setFormData({ parentId: 0, name: '', path: '', icon: '', sortOrder: 0, type: 2, permission: '' }); fetchMenus();
    } catch (error) { console.error(error); }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({ parentId: menu.parentId || 0, name: menu.name, path: menu.path || '', icon: menu.icon || '', sortOrder: menu.sortOrder || 0, type: menu.type || 2, permission: menu.permission || '' });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个菜单吗？')) return;
    try { await menuApi.delete(id); fetchMenus(); } catch (error) { console.error(error); }
  };

  const handleCancel = () => { setShowForm(false); setEditingMenu(null); setFormData({ parentId: 0, name: '', path: '', icon: '', sortOrder: 0, type: 2, permission: '' }); };

  const getTypeLabel = (type?: number) => {
    if (type === 1) return '📁 目录';
    if (type === 2) return '📄 菜单';
    if (type === 3) return '🔘 按钮';
    return '-';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <button className="btn-primary" onClick={() => setShowForm(true)}>✨ 添加菜单</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editingMenu ? '✏️ 编辑菜单' : '✨ 添加菜单'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>上级菜单</label>
                <select value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: parseInt(e.target.value) })}>
                  <option value={0}>无（顶级目录）</option>
                  {parentMenus.map(m => <option key={m.id} value={m.id}>{m.icon} {m.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>菜单名称</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
              <div className="form-group"><label>路由路径</label><input type="text" value={formData.path} onChange={(e) => setFormData({ ...formData, path: e.target.value })} /></div>
              <div className="form-group"><label>图标</label><input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} /></div>
              <div className="form-group"><label>排序</label><input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} /></div>
              <div className="form-group">
                <label>类型</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) })}>
                  <option value={1}>目录</option>
                  <option value={2}>菜单</option>
                  <option value={3}>按钮</option>
                </select>
              </div>
              <div className="form-group"><label>权限标识</label><input type="text" value={formData.permission} onChange={(e) => setFormData({ ...formData, permission: e.target.value })} /></div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">保存</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>取消</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="loading">🐾 加载中...</div> : (
        <div className="table-card">
          <table className="data-table">
            <thead><tr><th>ID</th><th>名称</th><th>类型</th><th>路径</th><th>权限标识</th><th>排序</th><th>操作</th></tr></thead>
            <tbody>
              {menus.map(menu => (
                <tr key={menu.id} className={menu.parentId === 0 ? 'row-parent' : 'row-child'}>
                  <td>{menu.id}</td>
                  <td>{menu.parentId === 0 ? menu.name : `└─ ${menu.name}`}</td>
                  <td>{getTypeLabel(menu.type)}</td>
                  <td>{menu.path || '-'}</td>
                  <td><code className="code-tag">{menu.permission || '-'}</code></td>
                  <td>{menu.sortOrder}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(menu)}>编辑</button>
                    <button className="btn-danger" onClick={() => handleDelete(menu.id!)}>删除</button>
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

export default MenuList;
