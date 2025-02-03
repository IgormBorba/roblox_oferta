const auth = {
    // Chaves para o localStorage
    USERS_KEY: 'carnavalbux_users',
    CURRENT_USER_KEY: 'carnavalbux_current_user',

    // Função para gerar ID único
    generateId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000);
        return `${timestamp}-${random}`;
    },

    // Inicializa o storage se necessário
    init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    },

    // Registra um novo usuário
    register(name, email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        
        // Verifica se o email já está cadastrado
        if (users.some(user => user.email === email)) {
            return false;
        }

        // Cria novo usuário
        const newUser = {
            id: this.generateId(),
            name,
            email,
            password, // Em produção, a senha deveria ser hasheada
            createdAt: new Date().toISOString()
        };

        // Salva o usuário
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Faz login automático após registro
        this.setCurrentUser(newUser);
        return true;
    },

    // Faz login do usuário
    login(email, password) {
        this.init();
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        
        // Procura o usuário
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.setCurrentUser(user);
            return true;
        }
        
        return false;
    },

    // Faz logout do usuário
    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    },

    // Define o usuário atual
    setCurrentUser(user) {
        const { password, ...safeUser } = user; // Remove a senha dos dados salvos
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(safeUser));
    },

    // Retorna o usuário atual
    getCurrentUser() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Verifica se há um usuário autenticado
    isAuthenticated() {
        return !!this.getCurrentUser();
    },

    // Atualiza dados do usuário
    updateUser(data) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) return false;

        // Atualiza os dados
        users[userIndex] = { ...users[userIndex], ...data };
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        // Atualiza usuário atual
        this.setCurrentUser(users[userIndex]);
        return true;
    }
}; 