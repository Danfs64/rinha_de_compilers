export type Term = Int | Str | FnCall | Binary | Function | Let | If | Print | First | Second | Bool | Tuple | Var;
export type File = {
    name: string;
    expression: Term;
    location: Location;
};
export type Location = {
    start: number;
    end: number;
    filename: string;
};
export type Str = {
    kind: "Str";
    value: string;
    location: Location;
};
export type Int = {
    kind: "Int";
    value: number;
    location: Location;
};
export type Bool = {
    kind: "Bool";
    value: boolean;
    location: Location;
};
export type Tuple = {
    kind: "Tuple";
    first: Term;
    second: Term;
    location: Location;
};
export type BinaryOp = "Add" | "Sub" | "Mul" | "Div" | "Rem" | "Eq" | "Neq" | "Lt" | "Gt" | "Lte" | "Gte" | "And" | "Or";
export type Binary = {
    kind: "Binary";
    lhs: Term;
    op: BinaryOp;
    rhs: Term;
    location: Location;
};
export type Let = {
    kind: "Let";
    name: Parameter;
    value: Term;
    next: Term;
    location: Location;
};
export type If = {
    kind: "If";
    condition: Term;
    then: Term;
    otherwise: Term;
    location: Location;
};
export type First = {
    kind: "First";
    value: Term;
    location: Location;
};
export type Second = {
    kind: "Second";
    value: Term;
    location: Location;
};
export type Print = {
    kind: "Print";
    value: Term;
    location: Location;
};
export type Function = {
    kind: "Function";
    parameters: Parameter[];
    value: Term;
    location: Location;
};
export type Parameter = {
    text: string;
    location: Location;
};
export type FnCall = {
    kind: "Call";
    callee: Term;
    arguments: Term[];
    location: Location;
};
export type Var = {
    kind: "Var";
    text: string;
    location: Location;
};
