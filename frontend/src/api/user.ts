import axios from 'axios';
import { User, Role, UserGroup, Menu, Blog, PageResult } from '../types/user';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

interface R<T> {
  code: number;
  data: T;
  msg?: string;
}

export const userApi = {
  list: () => api.get<R<User[]>>('/users').then(res => res.data.data),
  getById: (id: number) => api.get<R<User>>(`/users/${id}`).then(res => res.data.data),
  create: (user: Omit<User, 'id'>) => api.post<R<User>>('/users', user).then(res => res.data.data),
  update: (id: number, user: User) => api.put<R<User>>(`/users/${id}`, user).then(res => res.data.data),
  delete: (id: number) => api.delete<R<boolean>>(`/users/${id}`).then(res => res.data.data),
};

export const roleApi = {
  list: () => api.get<R<Role[]>>('/roles').then(res => res.data.data),
  getById: (id: number) => api.get<R<Role>>(`/roles/${id}`).then(res => res.data.data),
  create: (role: Omit<Role, 'id'>) => api.post<R<Role>>('/roles', role).then(res => res.data.data),
  update: (id: number, role: Role) => api.put<R<Role>>(`/roles/${id}`, role).then(res => res.data.data),
  delete: (id: number) => api.delete<R<boolean>>(`/roles/${id}`).then(res => res.data.data),
  getMenus: (id: number) => api.get<R<number[]>>(`/roles/${id}/menus`).then(res => res.data.data),
  assignMenus: (id: number, menuIds: number[]) => api.post<R<boolean>>(`/roles/${id}/menus`, menuIds).then(res => res.data.data),
  getUsers: (id: number) => api.get<R<number[]>>(`/roles/${id}/users`).then(res => res.data.data),
};

export const groupApi = {
  list: () => api.get<R<UserGroup[]>>('/groups').then(res => res.data.data),
  getById: (id: number) => api.get<R<UserGroup>>(`/groups/${id}`).then(res => res.data.data),
  create: (group: Omit<UserGroup, 'id'>) => api.post<R<UserGroup>>('/groups', group).then(res => res.data.data),
  update: (id: number, group: UserGroup) => api.put<R<UserGroup>>(`/groups/${id}`, group).then(res => res.data.data),
  delete: (id: number) => api.delete<R<boolean>>(`/groups/${id}`).then(res => res.data.data),
  getMembers: (id: number) => api.get<R<number[]>>(`/groups/${id}/members`).then(res => res.data.data),
  assignMembers: (id: number, userIds: number[]) => api.post<R<boolean>>(`/groups/${id}/members`, userIds).then(res => res.data.data),
};

export const menuApi = {
  list: () => api.get<R<Menu[]>>('/menus').then(res => res.data.data),
  tree: () => api.get<R<Menu[]>>('/menus/tree').then(res => res.data.data),
  getById: (id: number) => api.get<R<Menu>>(`/menus/${id}`).then(res => res.data.data),
  create: (menu: Omit<Menu, 'id'>) => api.post<R<Menu>>('/menus', menu).then(res => res.data.data),
  update: (id: number, menu: Menu) => api.put<R<Menu>>(`/menus/${id}`, menu).then(res => res.data.data),
  delete: (id: number) => api.delete<R<boolean>>(`/menus/${id}`).then(res => res.data.data),
};

export const blogApi = {
  list: (page: number = 1, size: number = 10, keyword?: string, status?: number) => {
    const params: Record<string, string | number> = { page, size };
    if (keyword) params.keyword = keyword;
    if (status !== undefined) params.status = status;
    return api.get<R<PageResult<Blog>>>('/blogs', { params }).then(res => res.data.data);
  },
  getById: (id: number) => api.get<R<Blog>>(`/blogs/${id}`).then(res => res.data.data),
  create: (blog: Omit<Blog, 'id'>) => api.post<R<Blog>>('/blogs', blog).then(res => res.data.data),
  update: (id: number, blog: Blog) => api.put<R<Blog>>(`/blogs/${id}`, blog).then(res => res.data.data),
  delete: (id: number) => api.delete<R<boolean>>(`/blogs/${id}`).then(res => res.data.data),
};
