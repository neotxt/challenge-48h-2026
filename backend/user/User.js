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
     * @param {number} id 
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @param {string} role 
     */
    constructor(id, name, email, password, role = UserRoles.ETUDIANT) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}