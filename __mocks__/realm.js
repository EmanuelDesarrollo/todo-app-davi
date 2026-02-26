// Mock manual de Realm para entornos de prueba (evita binarios nativos).
const UpdateMode = {
    Never: 'never',
    Modified: 'modified',
    All: 'all',
};

class RealmObjectMock {
    constructor(data) {
        Object.assign(this, data);
    }
}

class RealmMock {
    constructor() {
        this._store = new Map();
    }

    objectForPrimaryKey(schema, id) {
        return this._store.get(id) || null;
    }

    write(fn) {
        fn();
    }

    create(schema, data, updateMode) {
        const obj = { ...data };
        this._store.set(data.id, obj);
        return obj;
    }

    objects(schemaName) {
        return Array.from(this._store.values());
    }
}

RealmMock.UpdateMode = UpdateMode;
RealmMock.Object = RealmObjectMock;

module.exports = RealmMock;
module.exports.default = RealmMock;
module.exports.UpdateMode = UpdateMode;
