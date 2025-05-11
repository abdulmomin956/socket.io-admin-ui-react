class SocketHolder {
    constructor() {
        this._socket = null;
    }

    set socket(socket) {
        this._socket = socket;
    }

    get socket() {
        return this._socket;
    }
}

export default new SocketHolder();