export class Garden {
    _id: String;
    name: String;
    place: String;

    width: Number;
    height: Number;

    positions: Array<Array<Number>>;

    numberOfTrees: Number;
    numberOfFreeSpace: Number;

    tank: Number;
    temperature: Number;

    warehouse: Array<any>;
}