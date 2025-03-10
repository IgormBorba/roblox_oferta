#!/bin/bash

# Atualizar o sistema
echo "Atualizando o sistema..."
sudo apt-get update

# Instalar dependências
echo "Instalando dependências..."
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Adicionar repositório Docker
echo "Configurando repositório Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
echo "Instalando Docker..."
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Iniciar e habilitar Docker
echo "Iniciando Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Configurar permissões
echo "Configurando permissões..."
sudo usermod -aG docker $USER

echo "Instalação concluída! Por favor, faça logout e login novamente para aplicar as mudanças de grupo."
echo "Depois, você poderá executar: docker-compose up -d --build" 