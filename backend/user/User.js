/**
 * Constantes pour les rôles utilisateur.
 */
export class UserRoles {
    static ADMIN = "admin";
    static MASTER = "master";
    static ETUDIANT = "etudiant";
    static INTERVENANT = "intervenant";
}

/**
 * Entité représentant un Utilisateur.
 */
export class User {
    /**
     * @param {number} _id 
     * @param {string} _name 
     * @param {string} _email 
     * @param {string} _password 
     * @param {string} _role 
     */
    constructor(id, name, email, password, role = UserRoles.ETUDIANT) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._role = role;
    }

    getID() {
        return this._id;
    }

    getName() {
        return this._name;
    }

    getEmail() {
        return this._email;
    }

    getPassword() {
        return this._password;
    }

    getRole() {
        return this._role;
    }
}