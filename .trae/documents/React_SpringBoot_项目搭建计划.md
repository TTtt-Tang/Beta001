# React + Spring Boot 框架搭建计划

## 一、项目概述

搭建一个 React + Spring Boot 的前后端分离学习项目，包含简单用户管理API示例。

**技术栈：**
- 前端：Vite + React 18 + TypeScript
- 后端：Spring Boot 2.7.x + Java 11 + Maven
- 数据库：MySQL 8.0

---

## 二、当前状态分析

- 当前目录为空，无任何项目文件
- 环境中未安装 Node.js、Java、Maven 等工具
- 需要创建完整的项目结构

---

## 三、实施方案

### 阶段1：环境准备与检查

**任务1.1：验证开发环境**
- 检查 Node.js、npm、Java、Maven、MySQL 是否已安装
- 如果未安装，提供安装指引

**任务1.2：创建项目根目录结构**

```
Beta001_1/
├── frontend/          # 前端项目 (Vite + React + TypeScript)
├── backend/           # 后端项目 (Spring Boot + Maven)
└── documents/         # 项目文档
```

---

### 阶段2：后端 Spring Boot 项目搭建

**任务2.1：创建 Spring Boot 项目结构**

```
backend/
├── pom.xml                           # Maven 配置文件
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── DemoApplication.java  # 启动类
│       │   ├── controller/
│       │   │   └── UserController.java
│       │   ├── service/
│       │   │   ├── UserService.java
│       │   │   └── UserServiceImpl.java
│       │   ├── mapper/
│       │   │   └── UserMapper.java
│       │   ├── entity/
│       │   │   └── User.java
│       │   └── config/
│       │       └── CorsConfig.java
│       └── resources/
│           ├── application.yml       # 主配置文件
│           └── mapper/
│               └── UserMapper.xml
└── ...
```

**任务2.2：创建 pom.xml**
- Spring Boot 2.7.18
- Spring Web
- MyBatis-Plus
- MySQL Driver
- Lombok

**任务2.3：创建配置文件 application.yml**
- 数据库连接配置 (localhost:3306/demo)
- 端口：8080

**任务2.4：实现用户管理API**
- `GET /api/users` - 获取用户列表
- `GET /api/users/{id}` - 获取单个用户
- `POST /api/users` - 创建用户
- `PUT /api/users/{id}` - 更新用户
- `DELETE /api/users/{id}` - 删除用户

**任务2.5：配置跨域 (CORS)**
- 允许前端 http://localhost:5173 访问

---

### 阶段3：前端 React 项目搭建

**任务3.1：使用 Vite 创建项目**

```bash
npm create vite@latest frontend -- --template react-ts
```

**任务3.2：安装依赖**

```bash
cd frontend
npm install
npm install axios
```

**任务3.3：项目结构**

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── api/
│   │   └── user.ts
│   ├── components/
│   │   └── UserList.tsx
│   └── types/
│       └── user.ts
└── ...
```

**任务3.4：实现用户管理界面**
- 用户列表展示
- 创建用户表单
- 编辑/删除用户功能

---

### 阶段4：验证与启动

**任务4.1：启动后端**

```bash
cd backend
mvn spring-boot:run
```

**任务4.2：启动前端**

```bash
cd frontend
npm run dev
```

**任务4.3：验证前后端联调**
- 访问前端 http://localhost:5173
- 测试用户CRUD功能

---

## 四、环境要求

### 必须安装的软件

| 软件 | 版本要求 | 用途 |
|------|----------|------|
| Node.js | 18.x+ | 前端运行时 |
| npm | 9.x+ | 前端包管理 |
| Java | 11+ | 后端运行时 |
| Maven | 3.8+ | 后端构建 |
| MySQL | 8.0+ | 数据库 |

### 环境变量配置

**Java:**
- `JAVA_HOME` = JDK 安装路径

**Maven:**
- `MAVEN_HOME` = Maven 安装路径
- Path 添加 `%MAVEN_HOME%\bin`

---

## 五、数据库初始化

创建数据库和用户表：

```sql
CREATE DATABASE IF NOT EXISTS demo;

USE demo;

CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '姓名',
  `email` VARCHAR(100) COMMENT '邮箱',
  `age` INT COMMENT '年龄',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 六、关键文件说明

| 文件 | 作用 |
|------|------|
| backend/pom.xml | Maven依赖配置 |
| backend/src/main/resources/application.yml | 后端配置（数据库、端口） |
| backend/src/main/java/.../UserController.java | 用户API控制器 |
| frontend/src/App.tsx | 前端主组件 |
| frontend/src/api/user.ts | 用户API调用封装 |

---

## 七、假设与决策

1. **MySQL使用本地默认实例**：主机localhost，端口3306
2. **数据库名**：demo
3. **前后端分离**：前端5173端口，后端8080端口
4. **使用MyBatis-Plus**：简化数据库操作
5. **使用Axios**：前端HTTP请求库
6. **初始用户数据**：插入2-3条示例数据便于测试

---

## 八、验证步骤

1. **后端验证**：启动后访问 `http://localhost:8080/api/users` 返回用户列表JSON
2. **前端验证**：浏览器打开 `http://localhost:5173` 显示用户管理界面
3. **联调验证**：在前端界面执行创建/编辑/删除用户操作，后端数据正确更新
