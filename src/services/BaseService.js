class BaseService {

    constructor(name) {
        this.name = name;
        this.running = false;
    }

    async start() {
        this.running = true;
    }

    async stop() {
        this.running = false;
    }

    isRunning() {
        return this.running;
    }

}

module.exports = BaseService;
