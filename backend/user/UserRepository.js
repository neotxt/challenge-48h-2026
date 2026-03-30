/**
 * Gère l'accès aux données (Persistence).
 */
export class UserRepository {
    constructor() {
        this.users = []; // Simulation de base de données
    }

    save(user) {
        user.id = this.users.length + 1;
        this.users.push(user);
        return user;
    }

    findAll() {
        return this.users;
    }

    findById(id) {
        return this.users.find(u => u.id === parseInt(id));
    }
}