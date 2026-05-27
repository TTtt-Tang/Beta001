package com.example.demo.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.entity.UserGroup;
import com.example.demo.entity.UserGroupMember;
import com.example.demo.mapper.UserGroupMemberMapper;
import com.example.demo.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;

    @Autowired
    private UserGroupMemberMapper userGroupMemberMapper;

    private Map<String, Object> ok(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("data", data);
        return result;
    }

    @GetMapping
    public Map<String, Object> list() {
        return ok(userGroupService.list());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {
        return ok(userGroupService.getById(id));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody UserGroup group) {
        group.setCreatedAt(LocalDateTime.now());
        return ok(userGroupService.save(group));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody UserGroup group) {
        group.setId(id);
        return ok(userGroupService.updateById(group));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return ok(userGroupService.removeById(id));
    }

    @GetMapping("/{id}/members")
    public Map<String, Object> getMembers(@PathVariable Long id) {
        QueryWrapper<UserGroupMember> wrapper = new QueryWrapper<>();
        wrapper.eq("group_id", id);
        List<Long> userIds = userGroupMemberMapper.selectList(wrapper)
                .stream().map(UserGroupMember::getUserId).collect(Collectors.toList());
        return ok(userIds);
    }

    @PostMapping("/{id}/members")
    public Map<String, Object> assignMembers(@PathVariable Long id, @RequestBody List<Long> userIds) {
        QueryWrapper<UserGroupMember> wrapper = new QueryWrapper<>();
        wrapper.eq("group_id", id);
        userGroupMemberMapper.delete(wrapper);
        for (Long userId : userIds) {
            UserGroupMember member = new UserGroupMember();
            member.setGroupId(id);
            member.setUserId(userId);
            userGroupMemberMapper.insert(member);
        }
        return ok(true);
    }
}
