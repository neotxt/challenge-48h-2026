/**
 * Gère l'accès aux données (Persistence).
 */
export class UserRepository {
    constructor() {
        this.users = []; // Simulation de base de données
    }

    /**
     * Enregistre un nouvel utilisateur dans la bdd
     * @param {User} user 
     * @returns 
     */
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

    delete(id) {
        const index = this.users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Met à jour un utilisateur.
     */
    update(id, data) {
        const user = this.findById(id);
        if (user) {
            user.name = data.name || user.name;
            user.email = data.email || user.email;
            user.role = data.role || user.role;
            return user;
        }
        return null;
    }

}