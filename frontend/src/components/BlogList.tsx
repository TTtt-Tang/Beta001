import { useState, useEffect, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Blog } from '../types/user';
import { blogApi } from '../api/user';

type ViewMode = 'list' | 'edit' | 'preview';

function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [keyword, setKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 0,
  });

  const fetchBlogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const result = await blogApi.list(page, 10, keyword || undefined, filterStatus);
      setBlogs(result.records);
      setTotal(result.total);
      setCurrent(result.current);
    } catch (error) {
      console.error('获取博客列表失败', error);
    }
    setLoading(false);
  }, [keyword, filterStatus]);

  useEffect(() => { fetchBlogs(1); }, [fetchBlogs]);

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({ title: '', summary: '', content: '', tags: '', status: 0 });
    setViewMode('edit');
  };

  const handleEdit = async (blog: Blog) => {
    try {
      const full = await blogApi.getById(blog.id!);
      setEditingBlog(full);
      setFormData({
        title: full.title,
        summary: full.summary || '',
        content: full.content || '',
        tags: full.tags || '',
        status: full.status || 0,
      });
      setViewMode('edit');
    } catch (error) {
      console.error('获取博客详情失败', error);
    }
  };

  const handlePreview = async (blog: Blog) => {
    try {
      const full = await blogApi.getById(blog.id!);
      setPreviewBlog(full);
      setViewMode('preview');
    } catch (error) {
      console.error('获取博客详情失败', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }
    try {
      if (editingBlog) {
        await blogApi.update(editingBlog.id!, { ...editingBlog, ...formData });
      } else {
        await blogApi.create(formData);
      }
      setViewMode('list');
      fetchBlogs(current);
    } catch (error) {
      console.error('保存博客失败', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇博客吗？')) return;
    try {
      await blogApi.delete(id);
      fetchBlogs(current);
    } catch (error) {
      console.error('删除博客失败', error);
    }
  };

  const handlePublish = async (blog: Blog) => {
    try {
      await blogApi.update(blog.id!, { ...blog, status: 1 });
      fetchBlogs(current);
    } catch (error) {
      console.error('发布失败', error);
    }
  };

  const handleDraft = async (blog: Blog) => {
    try {
      await blogApi.update(blog.id!, { ...blog, status: 0 });
      fetchBlogs(current);
    } catch (error) {
      console.error('操作失败', error);
    }
  };

  const insertTemplate = (template: string) => {
    setFormData(prev => ({ ...prev, content: prev.content + '\n' + template }));
  };

  const totalPages = Math.ceil(total / 10);

  // ===== 预览模式 =====
  if (viewMode === 'preview' && previewBlog) {
    return (
      <div className="page-container">
        <div className="blog-preview-header">
          <button className="btn-secondary" onClick={() => setViewMode('list')}>← 返回列表</button>
          <button className="btn-edit" onClick={() => handleEdit(previewBlog)}>编辑</button>
        </div>
        <div className="blog-preview-card">
          <h1 className="blog-preview-title">{previewBlog.title}</h1>
          <div className="blog-preview-meta">
            <span className="blog-tag">{previewBlog.status === 1 ? '已发布' : '草稿'}</span>
            {previewBlog.tags?.split(',').filter(Boolean).map((tag, i) => (
              <span key={i} className="blog-tag blog-tag-green">{tag.trim()}</span>
            ))}
            <span className="blog-meta-text">
              创建: {previewBlog.createdAt ? new Date(previewBlog.createdAt).toLocaleString() : '-'}
            </span>
            <span className="blog-meta-text">
              更新: {previewBlog.updatedAt ? new Date(previewBlog.updatedAt).toLocaleString() : '-'}
            </span>
          </div>
          {previewBlog.summary && <p className="blog-preview-summary">{previewBlog.summary}</p>}
          <div className="blog-preview-content" data-color-mode="light">
            <MDEditor.Markdown source={previewBlog.content || ''} />
          </div>
        </div>
      </div>
    );
  }

  // ===== 编辑模式 =====
  if (viewMode === 'edit') {
    return (
      <div className="page-container blog-editor-page">
        <div className="blog-editor-header">
          <button className="btn-secondary" onClick={() => setViewMode('list')}>← 返回列表</button>
          <div className="blog-editor-actions">
            <button className="btn-secondary" onClick={() => setFormData(prev => ({ ...prev, status: 0 }))}>
              存为草稿
            </button>
            <button className="btn-primary" onClick={handleSave}>
              {editingBlog ? '保存修改' : '创建博客'}
            </button>
          </div>
        </div>

        <div className="blog-editor-meta">
          <div className="blog-editor-title-row">
            <input
              type="text"
              className="blog-title-input"
              placeholder="输入博客标题..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
            <select
              className="blog-status-select"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
            >
              <option value={0}>草稿</option>
              <option value={1}>发布</option>
            </select>
          </div>
          <input
            type="text"
            className="blog-summary-input"
            placeholder="输入摘要（可选）..."
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          />
          <input
            type="text"
            className="blog-tags-input"
            placeholder="标签（用逗号分隔，如：技术,React,前端）"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          />
        </div>

        <div className="blog-toolbar">
          <span className="toolbar-label">快捷插入：</span>
          <button className="toolbar-btn" onClick={() => insertTemplate('## 标题\n\n内容')}>标题</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('**粗体**')}>粗体</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('*斜体*')}>斜体</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('~~删除线~~')}>删除线</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('[链接文字](URL)')}>链接</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('![图片描述](图片URL)')}>图片</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('- 列表项')}>无序列表</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('1. 列表项')}>有序列表</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('> 引用内容')}>引用</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('```\n代码\n```')}>代码块</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |')}>表格</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('---\n')}>分割线</button>
          <button className="toolbar-btn" onClick={() => insertTemplate('- [ ] 待办事项')}>任务列表</button>
        </div>

        <div className="blog-editor-body" data-color-mode="light">
          <MDEditor
            value={formData.content}
            onChange={(val) => setFormData(prev => ({ ...prev, content: val || '' }))}
            height={500}
            preview="live"
            hideToolbar={false}
          />
        </div>
      </div>
    );
  }

  // ===== 列表模式 =====
  return (
    <div className="page-container">
      <div className="blog-list-header">
        <div className="blog-filters">
          <input
            type="text"
            className="blog-search-input"
            placeholder="搜索标题或标签..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBlogs(1)}
          />
          <select
            className="blog-filter-select"
            value={filterStatus ?? ''}
            onChange={(e) => setFilterStatus(e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">全部状态</option>
            <option value="0">草稿</option>
            <option value="1">已发布</option>
          </select>
          <button className="btn-primary" onClick={() => fetchBlogs(1)}>搜索</button>
        </div>
        <button className="btn-primary" onClick={handleCreate}>✨ 写博客</button>
      </div>

      {loading ? (
        <div className="loading">🐾 加载中...</div>
      ) : blogs.length === 0 ? (
        <div className="blog-empty">
          <div className="blog-empty-icon">📝</div>
          <p>还没有博客，点击"写博客"开始创作吧！</p>
        </div>
      ) : (
        <>
          <div className="blog-card-list">
            {blogs.map(blog => (
              <div key={blog.id} className="blog-card">
                <div className="blog-card-main">
                  <div className="blog-card-top">
                    <h3 className="blog-card-title" onClick={() => handlePreview(blog)}>{blog.title}</h3>
                    <span className={`status-badge ${blog.status === 1 ? 'status-active' : 'status-draft'}`}>
                      {blog.status === 1 ? '已发布' : '草稿'}
                    </span>
                  </div>
                  {blog.summary && <p className="blog-card-summary">{blog.summary}</p>}
                  <div className="blog-card-bottom">
                    <div className="blog-card-tags">
                      {blog.tags?.split(',').filter(Boolean).map((tag, i) => (
                        <span key={i} className="blog-tag blog-tag-green">{tag.trim()}</span>
                      ))}
                    </div>
                    <span className="blog-meta-text">
                      {blog.updatedAt ? new Date(blog.updatedAt).toLocaleString() : new Date(blog.createdAt || '').toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="blog-card-actions">
                  <button className="btn-perm" onClick={() => handlePreview(blog)}>预览</button>
                  <button className="btn-edit" onClick={() => handleEdit(blog)}>编辑</button>
                  {blog.status === 0 ? (
                    <button className="btn-publish" onClick={() => handlePublish(blog)}>发布</button>
                  ) : (
                    <button className="btn-draft" onClick={() => handleDraft(blog)}>撤回</button>
                  )}
                  <button className="btn-danger" onClick={() => handleDelete(blog.id!)}>删除</button>
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="blog-pagination">
              <button
                className="page-btn"
                disabled={current <= 1}
                onClick={() => fetchBlogs(current - 1)}
              >上一页</button>
              <span className="page-info">第 {current} / {totalPages} 页 (共 {total} 篇)</span>
              <button
                className="page-btn"
                disabled={current >= totalPages}
                onClick={() => fetchBlogs(current + 1)}
              >下一页</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BlogList;
