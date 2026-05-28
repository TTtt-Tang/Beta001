#!/bin/bash
# Pochacco管理系统 - 服务器初始化脚本
# 在阿里云服务器上执行此脚本

set -e

echo "===== 1. 安装Docker ====="
if command -v docker &> /dev/null; then
    echo "Docker已安装，跳过"
else
    echo "安装Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo "Docker安装完成"
fi

echo ""
echo "===== 2. 安装Docker Compose ====="
if docker compose version &> /dev/null; then
    echo "Docker Compose已安装，跳过"
else
    echo "安装Docker Compose插件..."
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
        -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
    echo "Docker Compose安装完成"
fi

echo ""
echo "===== 3. 拉取项目代码 ====="
if [ -d /opt/pochacco/.git ]; then
    echo "项目已存在，更新代码..."
    cd /opt/pochacco && git pull origin main
else
    echo "克隆项目..."
    rm -rf /opt/pochacco
    git clone https://gitlab.digitalit.com.cn/Edw/beta001.git /opt/pochacco
    cd /opt/pochacco
fi

echo ""
echo "===== 4. 构建并启动服务 ====="
docker compose up -d --build

echo ""
echo "===== 5. 等待服务启动 ====="
sleep 20
docker compose ps

echo ""
echo "===== 6. 安装GitLab Runner ====="
if command -v gitlab-runner &> /dev/null; then
    echo "GitLab Runner已安装，跳过"
else
    echo "安装GitLab Runner..."
    curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh" | bash
    yum install -y gitlab-runner || (curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | bash && apt-get install -y gitlab-runner)
    systemctl enable gitlab-runner
    echo "GitLab Runner安装完成"
fi

echo ""
echo "=========================================="
echo "  服务器初始化完成！"
echo "=========================================="
echo ""
echo "前端访问: http://120.24.223.14"
echo "后端API:  http://120.24.223.14/api/"
echo ""
echo "===== 下一步：注册GitLab Runner ====="
echo "1. 打开浏览器访问: https://gitlab.digitalit.com.cn/Edw/beta001/-/settings/ci_cd"
echo "2. 展开 Runners 区域，点击 'New project runner'"
echo "3. 勾选 'Run untagged jobs'，点击 'Create runner'"
echo "4. 复制页面上的注册命令（类似下面这行）："
echo ""
echo "   gitlab-runner register --url https://gitlab.digitalit.com.cn --token <你的token>"
echo ""
echo "5. 在服务器上执行该命令，提示输入时："
echo "   - Executor: 输入 shell"
echo "   - Description: 输入 pochacco-server"
echo "   - Tags: 输入 pochacco-server"
echo ""
echo "6. 将gitlab-runner用户加入docker组："
echo "   usermod -aG docker gitlab-runner"
echo ""
echo "完成后，每次 git push 就会自动部署！"
