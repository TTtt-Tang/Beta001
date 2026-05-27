export interface User {
  id?: number;
  name: string;
  email?: string;
  age?: number;
  createdAt?: string;
}

export interface Role {
  id?: number;
  name: string;
  code: string;
  description?: string;
  status?: number;
  createdAt?: string;
}

export interface UserGroup {
  id?: number;
  name: string;
  code: string;
  description?: string;
  status?: number;
  createdAt?: string;
}

export interface Menu {
  id?: number;
  parentId?: number;
  name: string;
  path?: string;
  icon?: string;
  sortOrder?: number;
  type?: number;
  permission?: string;
  status?: number;
  createdAt?: string;
  children?: Menu[];
}

export interface Blog {
  id?: number;
  title: string;
  summary?: string;
  content?: string;
  tags?: string;
  status?: number;
  authorId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  pages: number;
  current: number;
}
