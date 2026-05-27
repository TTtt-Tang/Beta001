package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("sys_user_group_member")
public class UserGroupMember {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long groupId;
}
