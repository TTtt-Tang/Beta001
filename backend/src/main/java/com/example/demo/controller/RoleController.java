package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.entity.Role;
import com.example.demo.entity.RoleMenu;
import com.example.demo.entity.UserRole;
import com.example.demo.mapper.RoleMenuMapper;
import com.example.demo.mapper.UserRoleMapper;
import com.example.demo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Autowired
    private UserRoleMapper userRoleMapper;

    private Map<String, Object> ok(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("data", data);
        return result;
    }

    @GetMapping
    public Map<String, Object> list() {
        return ok(roleService.list());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {
        return ok(roleService.getById(id));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Role role) {
        role.setCreatedAt(LocalDateTime.now());
        return ok(roleService.save(role));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Role role) {
        role.setId(id);
        return ok(roleService.updateById(role));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return ok(roleService.removeById(id));
    }

    @GetMapping("/{id}/menus")
    public Map<String, Object> getRoleMenus(@PathVariable Long id) {
        QueryWrapper<RoleMenu> wrapper = new QueryWrapper<>();
        wrapper.eq("role_id", id);
        List<Long> menuIds = roleMenuMapper.selectList(wrapper)
                .stream().map(RoleMenu::getMenuId).collect(Collectors.toList());
        return ok(menuIds);
    }

    @PostMapping("/{id}/menus")
    public Map<String, Object> assignMenus(@PathVariable Long id, @RequestBody List<Long> menuIds) {
        QueryWrapper<RoleMenu> wrapper = new QueryWrapper<>();
        wrapper.eq("role_id", id);
        roleMenuMapper.delete(wrapper);
        for (Long menuId : menuIds) {
            RoleMenu rm = new RoleMenu();
            rm.setRoleId(id);
            rm.setMenuId(menuId);
            roleMenuMapper.insert(rm);
        }
        return ok(true);
    }

    @GetMapping("/{id}/users")
    public Map<String, Object> getRoleUsers(@PathVariable Long id) {
        QueryWrapper<UserRole> wrapper = new QueryWrapper<>();
        wrapper.eq("role_id", id);
        List<Long> userIds = userRoleMapper.selectList(wrapper)
                .stream().map(UserRole::getUserId).collect(Collectors.toList());
        return ok(userIds);
    }
}
