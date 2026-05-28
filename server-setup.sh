#!/bin/bash
# Pochacco管理系统 - 阿里云服务器初始化脚本
# 在服务器上执行: bash server-setup.sh

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
    git clone https://github.com/TTtt-Tang/Beta001.git /opt/pochacco
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
echo "=========================================="
echo "  服务部署完成！"
echo "=========================================="
echo ""
echo "前端访问: http://120.24.223.14"
echo "后端API:  http://120.24.223.14/api/"
echo ""
echo "===== 下一步：安装GitHub Actions Runner ====="
echo "1. 打开浏览器访问: https://github.com/TTtt-Tang/Beta001/settings/actions/runners"
echo "2. 点击 'New self-hosted runner'"
echo "3. 选择 Linux / x64"
echo "4. 按页面上的命令在服务器上执行（类似以下命令）："
echo ""
echo "   mkdir actions-runner && cd actions-runner"
echo "   curl -o actions-runner-linux-x64-2.321.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz"
echo "   tar xzf ./actions-runner-linux-x64-2.321.0.tar.gz"
echo "   ./config.sh --url https://github.com/TTtt-Tang/Beta001 --token <页面显示的token>"
echo "   ./run.sh"
echo ""
echo "5. 安装为系统服务（开机自启）："
echo "   cd ~/actions-runner"
echo "   sudo ./svc.sh install"
echo "   sudo ./svc.sh start"
echo ""
echo "完成后，每次 git push 到 main 分支就会自动部署！"
