package com.example.demo.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Map<String, Object> result = new HashMap<>();
        if (username == null || password == null) {
            result.put("code", 400);
            result.put("message", "用户名和密码不能为空");
            return result;
        }

        QueryWrapper<User> wrapper = new QueryWrapper<>();
        wrapper.eq("name", username);
        User user = userService.getOne(wrapper);

        if (user == null) {
            result.put("code", 401);
            result.put("message", "用户不存在");
            return result;
        }

        // 简单密码验证：使用 password 字段
        if (user.getPassword() != null && !user.getPassword().equals(password)) {
            result.put("code", 401);
            result.put("message", "密码错误");
            return result;
        }

        result.put("code", 200);
        result.put("data", user);
        result.put("token", "pochacco-token-" + user.getId() + "-" + System.currentTimeMillis());
        return result;
    }

    @GetMapping("/info")
    public Map<String, Object> getUserInfo(@RequestParam Long userId) {
        Map<String, Object> result = new HashMap<>();
        User user = userService.getById(userId);
        if (user == null) {
            result.put("code", 404);
            result.put("message", "用户不存在");
            return result;
        }
        result.put("code", 200);
        result.put("data", user);
        return result;
    }
}
