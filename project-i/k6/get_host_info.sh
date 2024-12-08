# 获取系统信息
echo "Brief description of the used server: HTTP/1.1"
echo ""

# 获取计算机型号和CPU信息
echo "Brief description of my computer:"
echo "  Model Name: $(hostname)"
echo "  Model Identifier: $(uname -m)"
echo "  Chip: $(lscpu | grep 'Model name' | cut -d: -f2 | xargs)"
echo "  Total Number of Cores: $(lscpu | grep 'CPU(s):' | awk '{print $2}')"
echo "  Memory: $(free -h | grep 'Mem:' | awk '{print $2}')"
echo "  System Firmware Version: $(uname -r)"
echo "  OS Loader Version: $(uname -v)"
echo "  Serial Number (system): Not applicable in WSL"
echo "  Hardware UUID: Not applicable in WSL"
echo "  Provisioning UDID: Not applicable in WSL"
echo "  Activation Lock Status: Not applicable in WSL"
