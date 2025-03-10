// Sistema de Monitoramento
const monitor = {
    webhookUrl: 'https://discord.com/api/webhooks/1335796742574051478/AsgD18K2mVvei9rBUA45ajOOWNeGYdiwWZGOazrHPvdaDlB9qhy6xjssLj2aJiIXj4Th', // URL do webhook do Discord
    visits: {
        today: 0,
        total: 0
    },
    sales: {
        count: 0,
        total: 0,
        history: []
    },
    domains: new Map(),

    init() {
        this.loadConfig();
        this.loadStats();
        this.trackVisit();
        this.detectDomain();
    },

    loadConfig() {
        // Carrega configurações do localStorage
        const config = localStorage.getItem('adminConfig');
        if (config) {
            const { webhookUrl } = JSON.parse(config);
            this.webhookUrl = webhookUrl;
        }
    },

    loadStats() {
        // Carrega estatísticas do localStorage
        const stats = localStorage.getItem('siteStats');
        if (stats) {
            const { visits, sales } = JSON.parse(stats);
            this.visits = visits;
            this.sales = sales;
        }
    },

    saveStats() {
        // Salva estatísticas no localStorage
        localStorage.setItem('siteStats', JSON.stringify({
            visits: this.visits,
            sales: this.sales
        }));
    },

    async trackVisit() {
        // Incrementa contadores
        this.visits.today++;
        this.visits.total++;
        this.saveStats();

        // Reseta contador diário à meia-noite
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight - now;

        setTimeout(() => {
            this.visits.today = 0;
            this.saveStats();
        }, timeUntilMidnight);
    },

    async trackSale(amount, productName, clientData = {}) {
        // Registra nova venda
        this.sales.count++;
        this.sales.total += amount;
        
        // Adiciona ao histórico
        this.sales.history.unshift({
            date: new Date().toISOString(),
            amount,
            productName,
            clientData
        });

        // Mantém apenas as últimas 100 vendas no histórico
        if (this.sales.history.length > 100) {
            this.sales.history.pop();
        }

        this.saveStats();
        
        // Notifica Discord sobre a venda
        await this.notifyDiscordSale(amount, productName, clientData);
    },

    async detectDomain() {
        try {
            // Obtém informações do domínio atual
            const domain = window.location.hostname;
            const response = await fetch('https://api.ipify.org?format=json');
            const { ip } = await response.json();

            // Atualiza lista de domínios
            this.domains.set(domain, {
                ip,
                lastSeen: new Date().toISOString()
            });

            // Salva no localStorage
            localStorage.setItem('domains', JSON.stringify(Array.from(this.domains.entries())));

            // Envia notificação para o Discord
            this.notifyDiscord(domain, ip);
        } catch (error) {
            console.error('Erro ao detectar domínio:', error);
        }
    },

    async notifyDiscord(domain, ip) {
        if (!this.webhookUrl) return;

        try {
            const embed = {
                title: '🌐 Novo Domínio Detectado',
                color: 0x3D8A0C,
                fields: [
                    {
                        name: 'Domínio',
                        value: domain,
                        inline: true
                    },
                    {
                        name: 'IP',
                        value: ip,
                        inline: true
                    },
                    {
                        name: 'Data/Hora',
                        value: new Date().toLocaleString('pt-BR'),
                        inline: false
                    }
                ],
                footer: {
                    text: 'CARNAVALBUX Monitor'
                }
            };

            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    },

    async notifyDiscordSale(amount, productName, clientData = {}) {
        if (!this.webhookUrl) return;

        try {
            const embed = {
                title: '💰 Nova Venda Realizada!',
                color: 0x3D8A0C,
                fields: [
                    {
                        name: 'Produto',
                        value: productName,
                        inline: true
                    },
                    {
                        name: 'Valor',
                        value: `R$ ${amount.toFixed(2)}`,
                        inline: true
                    },
                    {
                        name: 'Data/Hora',
                        value: new Date().toLocaleString('pt-BR'),
                        inline: false
                    }
                ],
                footer: {
                    text: 'CARNAVALBUX Monitor'
                }
            };

            await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
        } catch (error) {
            console.error('Erro ao enviar notificação de venda:', error);
        }
    },

    getStats() {
        return {
            visits: this.visits,
            sales: this.sales,
            domains: Array.from(this.domains.entries())
        };
    }
};

// Inicializa o monitor quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    monitor.init();
}); 