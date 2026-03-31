class JobService {
    constructor() {
        this.url = "notre url a mettre ici";
    }

    getLink() {
        return this.url;
    }
}

module.exports = new JobService();