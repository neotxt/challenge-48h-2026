import { User } from "./User.js";
import { UserRepository } from "./UserRepository.js";
import bcrypt from "bcrypt";

export class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    /**
     * Crée un nouvel utilisateur après validation.
     */
    async create(data) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        const newUser = new User(null, data.name, data.email, hashedPassword, data.role);
        return this.repository.save(newUser);
    }

    async login(email, password) {
        // 1. On cherche l'utilisateur
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new Error("Cet email n'existe pas.");
        }

        // 2. On compare le mot de passe (si tu n'as pas encore haché tes mots de passe en base,
        // cette ligne va rater. Assure-toi que les comptes testés ont bien été créés AVEC bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Mot de passe incorrect.");
        }

        return user; // C'est tout bon !
    }

    async getAll() {
        return await this.repository.findAll();
    }

    async getById(id) {
        return await this.repository.findById(id);
    }

    async updateUser(id, data) {
        // Si un nouveau mot de passe est fourni, le hasher
        if (data.password) {
            const saltRounds = 10;
            data.hashedPassword = await bcrypt.hash(data.password, saltRounds);
            delete data.password; // Retirer le mot de passe non hashé
        }
        return await this.repository.update(id, data);
    }

    async deleteUser(id) {
        return await this.repository.delete(id);
    }
}