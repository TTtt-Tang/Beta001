import { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'zh' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  zh: {
    'nav.system': '系统管理',
    'nav.users': '用户管理',
    'nav.roles': '角色管理',
    'nav.groups': '用户组管理',
    'nav.menus': '菜单管理',
    'nav.blog': '博客管理',
    'nav.profile': '个人主页',
    'nav.permissions': '权限管理',
    'top.pochacco': '🐶 Pochacco!',
    'btn.add': '✨ 添加',
    'btn.edit': '编辑',
    'btn.delete': '删除',
    'btn.save': '保存',
    'btn.cancel': '取消',
    'btn.search': '搜索',
    'btn.back': '← 返回列表',
    'btn.create': '创建',
    'btn.perm': '权限',
    'btn.members': '成员',
    'btn.publish': '发布',
    'btn.draft': '撤回',
    'btn.preview': '预览',
    'btn.writeBlog': '✨ 写博客',
    'btn.saveDraft': '存为草稿',
    'btn.saveEdit': '保存修改',
    'label.name': '姓名',
    'label.email': '邮箱',
    'label.age': '年龄',
    'label.createdAt': '创建时间',
    'label.roleName': '角色名称',
    'label.roleCode': '角色编码',
    'label.description': '描述',
    'label.status': '状态',
    'label.active': '启用',
    'label.inactive': '禁用',
    'label.published': '已发布',
    'label.draftStatus': '草稿',
    'label.all': '全部状态',
    'label.title': '标题',
    'label.summary': '摘要',
    'label.tags': '标签',
    'label.content': '内容',
    'label.type': '类型',
    'label.path': '路径',
    'label.permission': '权限标识',
    'label.sort': '排序',
    'label.parentMenu': '上级菜单',
    'label.directory': '目录',
    'label.menu': '菜单',
    'label.button': '按钮',
    'label.icon': '图标',
    'label.assignPerm': '分配权限',
    'label.memberMgmt': '成员管理',
    'label.profile': '个人信息',
    'label.lang': '语言',
    'label.theme': '主题',
    'label.dark': '暗夜',
    'label.light': '浅色',
    'placeholder.searchTitle': '搜索标题或标签...',
    'placeholder.enterTitle': '输入博客标题...',
    'placeholder.enterSummary': '输入摘要（可选）...',
    'placeholder.enterTags': '标签（用逗号分隔）',
    'toolbar.insert': '快捷插入：',
    'toolbar.heading': '标题',
    'toolbar.bold': '粗体',
    'toolbar.italic': '斜体',
    'toolbar.strikethrough': '删除线',
    'toolbar.link': '链接',
    'toolbar.image': '图片',
    'toolbar.unorderedList': '无序列表',
    'toolbar.orderedList': '有序列表',
    'toolbar.quote': '引用',
    'toolbar.codeBlock': '代码块',
    'toolbar.table': '表格',
    'toolbar.divider': '分割线',
    'toolbar.todoList': '任务列表',
    'msg.loading': '🐾 加载中...',
    'msg.noBlog': '还没有博客，点击"写博客"开始创作吧！',
    'msg.confirmDelete': '确定要删除吗？',
    'msg.enterTitle': '请输入标题',
    'page.prev': '上一页',
    'page.next': '下一页',
    'page.info': '第 {current} / {total} 页 (共 {count} 篇)',
    'profile.title': '个人主页',
    'profile.basicInfo': '基本信息',
    'profile.roleInfo': '角色信息',
    'profile.groupInfo': '用户组信息',
    'profile.editProfile': '编辑资料',
  },
  en: {
    'nav.system': 'System',
    'nav.users': 'Users',
    'nav.roles': 'Roles',
    'nav.groups': 'Groups',
    'nav.menus': 'Menus',
    'nav.blog': 'Blog',
    'nav.profile': 'Profile',
    'nav.permissions': 'Permissions',
    'top.pochacco': '🐶 Pochacco!',
    'btn.add': '✨ Add',
    'btn.edit': 'Edit',
    'btn.delete': 'Delete',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.search': 'Search',
    'btn.back': '← Back',
    'btn.create': 'Create',
    'btn.perm': 'Perms',
    'btn.members': 'Members',
    'btn.publish': 'Publish',
    'btn.draft': 'Revoke',
    'btn.preview': 'Preview',
    'btn.writeBlog': '✨ New Post',
    'btn.saveDraft': 'Save Draft',
    'btn.saveEdit': 'Save Changes',
    'label.name': 'Name',
    'label.email': 'Email',
    'label.age': 'Age',
    'label.createdAt': 'Created',
    'label.roleName': 'Role Name',
    'label.roleCode': 'Role Code',
    'label.description': 'Description',
    'label.status': 'Status',
    'label.active': 'Active',
    'label.inactive': 'Inactive',
    'label.published': 'Published',
    'label.draftStatus': 'Draft',
    'label.all': 'All',
    'label.title': 'Title',
    'label.summary': 'Summary',
    'label.tags': 'Tags',
    'label.content': 'Content',
    'label.type': 'Type',
    'label.path': 'Path',
    'label.permission': 'Permission',
    'label.sort': 'Sort',
    'label.parentMenu': 'Parent Menu',
    'label.directory': 'Directory',
    'label.menu': 'Menu',
    'label.button': 'Button',
    'label.icon': 'Icon',
    'label.assignPerm': 'Assign Permissions',
    'label.memberMgmt': 'Member Management',
    'label.profile': 'Profile',
    'label.lang': 'Language',
    'label.theme': 'Theme',
    'label.dark': 'Dark',
    'label.light': 'Light',
    'placeholder.searchTitle': 'Search title or tags...',
    'placeholder.enterTitle': 'Enter title...',
    'placeholder.enterSummary': 'Enter summary (optional)...',
    'placeholder.enterTags': 'Tags (comma separated)',
    'toolbar.insert': 'Quick Insert:',
    'toolbar.heading': 'Heading',
    'toolbar.bold': 'Bold',
    'toolbar.italic': 'Italic',
    'toolbar.strikethrough': 'Strike',
    'toolbar.link': 'Link',
    'toolbar.image': 'Image',
    'toolbar.unorderedList': 'Unordered',
    'toolbar.orderedList': 'Ordered',
    'toolbar.quote': 'Quote',
    'toolbar.codeBlock': 'Code',
    'toolbar.table': 'Table',
    'toolbar.divider': 'Divider',
    'toolbar.todoList': 'Todo',
    'msg.loading': '🐾 Loading...',
    'msg.noBlog': 'No posts yet. Click "New Post" to start!',
    'msg.confirmDelete': 'Are you sure to delete?',
    'msg.enterTitle': 'Please enter a title',
    'page.prev': 'Prev',
    'page.next': 'Next',
    'page.info': 'Page {current} / {total} ({count} posts)',
    'profile.title': 'Profile',
    'profile.basicInfo': 'Basic Info',
    'profile.roleInfo': 'Role Info',
    'profile.groupInfo': 'Group Info',
    'profile.editProfile': 'Edit Profile',
  },
};

interface I18nContextType {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'zh',
  t: (key: string) => key,
  toggleLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'en' ? 'en' : 'zh') as Lang;
  });

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  const toggleLang = () => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
