CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) DEFAULT '123456',
    email VARCHAR(100),
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '角色名称',
    code VARCHAR(100) NOT NULL UNIQUE COMMENT '角色编码',
    description VARCHAR(255) COMMENT '描述',
    status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_user_group (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '用户组名称',
    code VARCHAR(100) NOT NULL UNIQUE COMMENT '用户组编码',
    description VARCHAR(255) COMMENT '描述',
    status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID',
    name VARCHAR(100) NOT NULL COMMENT '菜单名称',
    path VARCHAR(255) COMMENT '路由路径',
    icon VARCHAR(100) COMMENT '图标',
    sort_order INT DEFAULT 0 COMMENT '排序',
    type TINYINT DEFAULT 1 COMMENT '1目录 2菜单 3按钮',
    permission VARCHAR(100) UNIQUE COMMENT '权限标识',
    status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_user_role (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    UNIQUE KEY uk_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_user_group_member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    UNIQUE KEY uk_user_group (user_id, group_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sys_role_menu (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT NOT NULL,
    menu_id BIGINT NOT NULL,
    UNIQUE KEY uk_role_menu (role_id, menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 初始用户 (密码默认123456)
INSERT IGNORE sys_user (name, password, email, age) VALUES ('admin', '123456', 'admin@example.com', 25);
INSERT IGNORE sys_user (name, password, email, age) VALUES ('李四', '123456', 'lisi@example.com', 30);
INSERT IGNORE sys_user (name, password, email, age) VALUES ('王五', '123456', 'wangwu@example.com', 28);

-- 初始角色
INSERT IGNORE sys_role (name, code, description) VALUES ('超级管理员', 'admin', '拥有所有权限');
INSERT IGNORE sys_role (name, code, description) VALUES ('普通用户', 'user', '基本操作权限');
INSERT IGNORE sys_role (name, code, description) VALUES ('访客', 'guest', '只读权限');

-- 初始用户组
INSERT IGNORE sys_user_group (name, code, description) VALUES ('管理组', 'admin_group', '系统管理用户');
INSERT IGNORE sys_user_group (name, code, description) VALUES ('开发组', 'dev_group', '开发人员');
INSERT IGNORE sys_user_group (name, code, description) VALUES ('测试组', 'test_group', '测试人员');

-- 初始菜单
INSERT IGNORE sys_menu (parent_id, name, path, icon, sort_order, type, permission) VALUES (0, '系统管理', '/system', '⚙️', 1, 1, 'system');
INSERT IGNORE sys_menu (parent_id, name, path, icon, sort_order, type, permission) VALUES (1, '用户管理', '/system/users', '👤', 1, 2, 'system:user');
INSERT IGNORE sys_menu (parent_id, name, path, icon, sort_order, type, permission) VALUES (1, '角色管理', '/system/roles', '🛡️', 2, 2, 'system:role');
INSERT IGNORE sys_menu (parent_id, name, path, icon, sort_order, type, permission) VALUES (1, '用户组管理', '/system/groups', '👥', 3, 2, 'system:group');
INSERT IGNORE sys_menu (parent_id, name, path, icon, sort_order, type, permission) VALUES (1, '菜单管理', '/system/menus', '📋', 4, 2, 'system:menu');

-- 用户角色关联
INSERT IGNORE sys_user_role (user_id, role_id) VALUES (1, 1);
INSERT IGNORE sys_user_role (user_id, role_id) VALUES (2, 2);
INSERT IGNORE sys_user_role (user_id, role_id) VALUES (3, 3);

-- 用户组关联
INSERT IGNORE sys_user_group_member (user_id, group_id) VALUES (1, 1);
INSERT IGNORE sys_user_group_member (user_id, group_id) VALUES (2, 2);
INSERT IGNORE sys_user_group_member (user_id, group_id) VALUES (3, 3);

-- 角色菜单关联（admin拥有所有菜单）
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (1, 1);
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (1, 2);
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (1, 3);
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (1, 4);
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (1, 5);
-- user角色只有用户管理
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (2, 1);
INSERT IGNORE sys_role_menu (role_id, menu_id) VALUES (2, 2);

-- 博客表
CREATE TABLE IF NOT EXISTS sys_blog (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT '标题',
    summary TEXT COMMENT '摘要',
    content LONGTEXT COMMENT 'Markdown内容',
    tags VARCHAR(255) COMMENT '标签(逗号分隔)',
    status TINYINT DEFAULT 0 COMMENT '0草稿 1发布',
    author_id BIGINT COMMENT '作者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 示例博客
INSERT IGNORE sys_blog (title, summary, content, tags, status, author_id) VALUES
('帕恰狗的春日散步', '今天天气真好，帕恰狗出门散步啦！', '## 春日散步日记\n\n今天阳光明媚，帕恰狗决定出门散步！🐾\n\n### 路线\n\n1. 从**ふわふわタウン**出发\n2. 经过**うぐいす横丁**\n3. 到达**れんげ草花田**\n\n### 沿途风景\n\n> 春天的风吹在脸上暖暖的，路边的花都开了 🌸\n\n帕恰狗最喜欢的**れんげ草**开满了整片田野，美极了！\n\n### 小伙伴\n\n今天遇到了好朋友**チョッピ**，一起分享了バナナアイス 🍦\n\n```python\ndef walk_distance(steps):\n    return steps * 0.7  # 帕恰狗的小短腿\n\nprint(f"今天走了 {walk_distance(1000)} 米")\n```\n\n---\n\n*又是开心的一天！* 🐶', '散步,日记,帕恰狗', 1, 1);

INSERT IGNORE sys_blog (title, summary, content, tags, status, author_id) VALUES
('React学习笔记', '前端开发学习记录', '## React 学习笔记\n\n### 基础概念\n\nReact 是一个用于构建用户界面的 JavaScript 库。\n\n- **组件化**：将 UI 拆分为独立、可复用的组件\n- **虚拟 DOM**：高效的 DOM 更新策略\n- **单向数据流**：数据从父组件流向子组件\n\n### Hooks 常用 API\n\n| Hook | 用途 |\n| --- | --- |\n| useState | 状态管理 |\n| useEffect | 副作用处理 |\n| useCallback | 函数缓存 |\n| useMemo | 值缓存 |\n| useRef | DOM引用 |\n\n### 示例代码\n\n```tsx\nimport { useState } from ''react'';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      点击了 {count} 次\n    </button>\n  );\n}\n```\n\n> 学习前端开发，React 是一个很好的起点！\n\n- [x] 学习基础语法\n- [x] 掌握 Hooks\n- [ ] 学习 Next.js\n- [ ] 学习 React Native', '技术,React,前端', 1, 1);

INSERT IGNORE sys_blog (title, summary, content, tags, status, author_id) VALUES
('项目开发计划', '新项目的技术选型和开发规划', '## 项目开发计划\n\n### 技术栈\n\n- 前端：React + TypeScript + Vite\n- 后端：Spring Boot + MyBatis-Plus\n- 数据库：MySQL\n\n### 开发排期\n\n| 阶段 | 内容 | 状态 |\n| --- | --- | --- |\n| 第一周 | 框架搭建 | ✅ |\n| 第二周 | 权限系统 | ✅ |\n| 第三周 | 博客功能 | 🔄 |\n| 第四周 | 测试上线 | ⏳ |\n\n### 注意事项\n\n1. 代码规范要统一\n2. 接口文档及时更新\n3. 注意数据库字符编码\n\n---\n\n*持续更新中...*', '项目,计划,开发', 0, 1);
