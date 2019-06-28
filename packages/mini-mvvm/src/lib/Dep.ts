
export default class Dep {

    private subs: string[] = [];

    public add(field: string) {
        this.subs.push(field);
    }
}
