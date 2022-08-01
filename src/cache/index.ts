export class AxiosCache {
    data: Record<string, any> = {};

    retrieve(key: string) {
        return this.data[key];
    }

    save<D>(key: string, data: D) {
        this.data[key] = data;
    }

    exists(key: string) {
        return !!this.data[key];
    }

    clear() {
        this.data = {};
    }

    isEmpty() {
        return Object.keys(this.data).length === 0;
    }
}
