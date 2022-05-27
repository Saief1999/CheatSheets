// defining an interface
interface User {
    name: string;
    id: number;
}

// creating a user
const user:User = {
    name: "Hayes",
    id: 0
}

class UserAccount implements User{
    name: string;
    id: number;
    constructor(name,id) {
        this.name = name ; 
        this.id = id ; 
    }
}

// polymorphism, i guess...
const user3: User = new UserAccount("Murphy",1)

type MyBool = true | false; // we set the possible values for this type

type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;

// Unions provide a way to handle different types too. For example, you may have a function that takes an array or a string

function getLength(obj: string | string[]) {
    return obj.length;
  }


// Generics

type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;

interface Backpack<Type> {
    add: (obj: Type) => void;
    get: () => Type;
  }
   

// Structual Type System 

// If two objects have the same shape ( same way they're structured), they are considered to have the same type

interface Point {
    x: number;
    y: number;
}

function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y}`);
}

const point = { x:12, y:26, z:-9, t:-4};
logPoint(point); // only a subset of fields needs to match


