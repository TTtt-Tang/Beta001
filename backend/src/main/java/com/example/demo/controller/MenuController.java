package com.example.demo.controller;

import com.example.demo.entity.Menu;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class MenuController {

    @Autowired
    private MenuService menuService;

    private Map<String, Object> ok(Object data) {
        Map<String, Object> result = new HashMap<>();
        result.put("code", 200);
        result.put("data", data);
        return result;
    }

    @GetMapping
    public Map<String, Object> list() {
        return ok(menuService.list());
    }

    @GetMapping("/tree")
    public Map<String, Object> tree() {
        List<Menu> all = menuService.list();
        List<Menu> roots = all.stream()
                .filter(m -> m.getParentId() == 0)
                .collect(Collectors.toList());
        for (Menu root : roots) {
            root.setChildren(all.stream()
                    .filter(m -> m.getParentId().equals(root.getId()))
                    .collect(Collectors.toList()));
        }
        return ok(roots);
    }

    @GetMapping("/{id}")
    public Map<String, Object> getById(@PathVariable Long id) {
        return ok(menuService.getById(id));
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Menu menu) {
        menu.setCreatedAt(LocalDateTime.now());
        return ok(menuService.save(menu));
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Menu menu) {
        menu.setId(id);
        return ok(menuService.updateById(menu));
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return ok(menuService.removeById(id));
    }
}
