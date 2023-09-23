import { writeFileSync } from "fs"
import { BinaryOp, File, Function, Let, Term } from "./schema.js"
import { expandToString } from "langium"

export function transpile(file: Readonly<File>) : void {
    const header = expandToString`
        function print(x) {
            switch(typeof x) {
                case "string":
                case "number":
                case "bigint":
                case "boolean":
                case "undefined":
                case "symbol":
                    console.log(x)
                    break
                case "function":
                    console.log("<#closure>")
                    break
                case "object":
                    console.log(\`(\${x[0]}, \${x[1]})\`)
            }
            return x
        }
    `
    const content = expandToString`
        ${header}
        
        ${transpile_term(file.expression)}
        
    `
    writeFileSync("a.js", content)
}

function transpile_term(term: Readonly<Term>) : string {
    switch(term.kind) {
        case "Int":
        case "Str":
        case "Bool":
            return `${term.value}`
        case "Tuple":
            return `[${transpile_term(term.first)}, ${transpile_term(term.second)}]`
        case "First":
        case "Second":
            const tuple = transpile_term(term.value)
            return `${tuple}[${term.kind == "First" ? '0' : '1'}]`
        case "Binary":
            return `${transpile_term(term.lhs)} ${transpile_op(term.op)} ${transpile_term(term.rhs)}`
        case "Let":
            return expandToString`
                let ${term.name.text} = (
                    ${transpile_term(term.value)}
                )
                ${transpile_term(term.next)}
            `
        case "Print":
            return `print(${transpile_term(term.value)})`
        case "If":
            return expandToString`
                ${transpile_term(term.condition)}
                    ? ${transpile_term(term.then)}
                    : ${transpile_term(term.otherwise)}`
        case "Call":
            return `${transpile_term(term.callee)}(${term.arguments.map(transpile_term)})`
        case "Function":
            return transpile_function(term)
        case "Var":
            return `${term.text}`
    }
}

function transpile_op(op: BinaryOp) : string {
    switch(op) {
        case "Add": return '+'
        case "Sub": return '-'
        case "Mul": return '*'
        case "Div": return '/'
        case "Rem": return '%'
        case "Eq":  return '=='
        case "Neq": return '!='
        case "Lt":  return '<'
        case "Gt":  return '>'
        case "Lte": return '<='
        case "Gte": return '>='
        case "And": return '&&'
        case "Or":  return '||'
    }
}

function transpile_function(fn: Function) : string {
    const transpile_fn_body = (term: Term) : string => {
        return isLet(term)
            ? expandToString`
                let ${term.name.text} = (
                    ${transpile_term(term.value)}
                )
                ${transpile_fn_body(term.next)}
            `
            : `return ${transpile_term(term)}`
    }
    return expandToString`
        (${fn.parameters.map(x => x.text)}) => {
            ${transpile_fn_body(fn.value)}
        }
    `
}

function isLet(term: Term) : term is Let {
    return (term as Let).next !== undefined
}
