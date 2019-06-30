// https://segmentfault.com/a/1190000006599500

export default class Dep {

    private subs: string[] = [];

    public add(field: string) {
        this.subs.push(field);
    }
}
