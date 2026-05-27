#!/bin/bash
# Pochacco管理系统 - 阿里云部署脚本

set -e

echo "===== Pochacco 部署开始 ====="

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "安装Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
    echo "Docker安装完成"
fi

# 检查Docker Compose
if ! command -v docker compose &> /dev/null; then
    echo "安装Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin 2>/dev/null || \
    yum install -y docker-compose-plugin 2>/dev/null
    echo "Docker Compose安装完成"
fi

# 拉取代码（如果当前目录没有docker-compose.yml）
if [ ! -f docker-compose.yml ]; then
    echo "拉取代码..."
    git clone https://gitlab.digitalit.com.cn/Edw/beta001.git .
    echo "代码拉取完成"
else
    echo "更新代码..."
    git pull origin main || true
fi

# 构建并启动
echo "构建并启动服务..."
docker compose down 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

# 等待服务启动
echo "等待服务启动..."
sleep 15

# 检查状态
echo ""
echo "===== 服务状态 ====="
docker compose ps

echo ""
echo "===== 部署完成 ====="
echo "前端访问: http://$(hostname -I | awk '{print $1}')"
echo "后端API:  http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "常用命令:"
echo "  查看日志: docker compose logs -f"
echo "  停止服务: docker compose down"
echo "  重启服务: docker compose restart"
