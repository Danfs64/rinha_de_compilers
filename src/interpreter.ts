import type { BinaryOp, File, Function, Term } from "./schema.js";

type NameTable = Map<string, ReturnType>

/** Coisas que podem ser retornadas por uma expressão válida de uma `.rinha`.
 */
type ReturnType = string | number | boolean | [ReturnType, ReturnType] | Callable

type Callable = {
    fn: Function
    local_nametable: NameTable
}

/** Interpreta o conteúdo da AST de um `.rinha`
 * 
 * Isso é feito chamando a função de evaluation na `expression` do arquivo
 */
export function interpretate(file: Readonly<File>): ReturnType {
    return evaluate(file.expression, new Map()).ret
}

function evaluate(term: Readonly<Term>, nametable: Map<string, ReturnType>): {ret: ReturnType, nametable: NameTable} {
    switch(term.kind) {
        case "Int":
        case "Str":
        case "Bool":
            // Valores primitivos são retornados normalmente
            return {ret: term.value, nametable}
        case "Tuple":
            return {ret: [evaluate(term.first, nametable).ret, evaluate(term.second, nametable).ret], nametable}
        case "First":
        case "Second":
            // O enunciado fala que First e Second sempre serão chamados em tuplas, então a gente pode fazer essa barbaridade de type assertion
            // Se não fosse o caso, teria que fazer um `if` que levantaria um erro em qqr termo não-tupla, dispensando o uso do `as`
            const {ret: [fst, snd]} = evaluate(term.value, nametable) as {ret: [ReturnType, ReturnType], nametable: NameTable}
            return term.kind == "First"
                ? {ret: fst, nametable}
                : {ret: snd, nametable}
        case "Binary":
            return {ret: do_binary_op(term.lhs, term.rhs, term.op, nametable), nametable}
        case "If":
            return evaluate(term.condition, nametable).ret
                ? evaluate(term.then, nametable)
                : evaluate(term.otherwise, nametable)
        case "Print":
            const term_to_print = evaluate(term.value, nametable)
            console.log(to_print(term_to_print.ret))
            return term_to_print
        case "Let":
            const new_nametable = new Map(nametable)
            const value = evaluate(term.value, nametable).ret
            nametable.set(term.name.text, value)
            new_nametable.set(term.name.text, value)
            return evaluate(term.next, new_nametable)
        case "Function":
            return {ret: {fn: term, local_nametable: nametable}, nametable}
        case "Call":
            return {ret: call_function(term.callee, term.arguments, nametable), nametable}
        case "Var":
            const ret = nametable.get(term.text)
            if(ret === undefined) {
                throw Error(`Variável ${term.text} não foi declarada`)
            } else {
                return {ret, nametable}
            }
    }
}

function do_binary_op(lhs: Readonly<Term>, rhs: Readonly<Term>, op: BinaryOp, nametable: NameTable): string | number | boolean {
    switch(op) {
        case "Add": return (evaluate(lhs, nametable).ret as any) +  (evaluate(rhs, nametable).ret as any)
        case "Sub": return (evaluate(lhs, nametable).ret as any) -  (evaluate(rhs, nametable).ret as any)
        case "Mul": return (evaluate(lhs, nametable).ret as any) *  (evaluate(rhs, nametable).ret as any)
        case "Div": return (evaluate(lhs, nametable).ret as any) /  (evaluate(rhs, nametable).ret as any)
        case "Rem": return (evaluate(lhs, nametable).ret as any) %  (evaluate(rhs, nametable).ret as any)
        case "Eq" : return (evaluate(lhs, nametable).ret as any) == (evaluate(rhs, nametable).ret as any)
        case "Neq": return (evaluate(lhs, nametable).ret as any) != (evaluate(rhs, nametable).ret as any)
        case "Lt" : return (evaluate(lhs, nametable).ret as any) <  (evaluate(rhs, nametable).ret as any)
        case "Gt" : return (evaluate(lhs, nametable).ret as any) >  (evaluate(rhs, nametable).ret as any)
        case "Lte": return (evaluate(lhs, nametable).ret as any) <= (evaluate(rhs, nametable).ret as any)
        case "Gte": return (evaluate(lhs, nametable).ret as any) >= (evaluate(rhs, nametable).ret as any)
        case "And": return (evaluate(lhs, nametable).ret as any) && (evaluate(rhs, nametable).ret as any)
        case "Or" : return (evaluate(lhs, nametable).ret as any) || (evaluate(rhs, nametable).ret as any)
    }
}

function to_print(value: ReturnType): string {
    switch(typeof value) {
        case "string":
            return value
        case "number":
            return value.toString()
        case "boolean":
            return value
                ? "true"
                : "false"
        case "object":
            return isCallable(value)
                ? "<#closure>"
                : `(${to_print(value[0])}, ${to_print(value[1])})`
    }
}

function isCallable(x: ReturnType): x is Callable {
    return (x as Callable)?.fn !== undefined
}

function call_function(callee: Readonly<Term>, args: readonly Readonly<Term>[], nametable: NameTable): ReturnType {
    const {ret: callable} = evaluate(callee, nametable)
    if(!isCallable(callable)) {
        throw Error(`'${callable}' is not callable!`)
    }
    const {fn, local_nametable} = callable
    const new_nametable = new Map(local_nametable)
    if(args.length != fn.parameters.length) {
        throw Error(`Incorrect number of arguments. Expected ${fn.parameters.length}. Got ${args.length}.`)
    }

    for(const [idx, p] of fn.parameters.entries()) {
        new_nametable.set(p.text, evaluate(args[idx], nametable).ret)
    }
    return evaluate(fn.value, new_nametable).ret
}
