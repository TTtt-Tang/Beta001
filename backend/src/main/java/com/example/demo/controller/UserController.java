package com.example.demo.controller;


import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserController {

    @Autowired
    private UserService userService;

    private Map<String, Object> ok(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("data", data);
        return result;
    }

    @GetMapping
    public Map<String, Object> list() {
        return ok(userService.list());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {
        return ok(userService.getById(id));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody User user) {
        user.setCreatedAt(LocalDateTime.now());
        return ok(userService.save(user));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return ok(userService.updateById(user));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return ok(userService.removeById(id));
    }
}
