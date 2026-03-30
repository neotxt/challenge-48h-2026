import { User } from "./User.js";
import { UserRepository } from "./UserRepository.js";

export class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    /**
     * Crée un nouvel utilisateur après validation.
     */
    create(data) {
        const newUser = new User(null, data.name, data.email, data.password, data.role);
        return this.repository.save(newUser);
    }

    getAll() {
        return this.repository.findAll();
    }

    getById(id) {
        return this.repository.findById(id);
    }

    updateUser(id, data) {
        return this.repository.update(id, data);
    }

    deleteUser(id) {
        return this.repository.delete(id);
    }
}