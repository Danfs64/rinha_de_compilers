import type { BinaryOp, File, Function, Term } from "./schema.js";

/** Coisas que podem ser retornadas por uma expressão válida de uma `.rinha`.
 * 
 * Notas:
 * - `void` só está aqui pq eu preciso de algo que seria o retorno do nó `Print`
 *     - Cogitando colocar para retornar a string q é printada, mas sei lá lol
 * - `Function`, o nó da AST, está aqui inalterado pois não decidi ainda como representar funções internamente
 *     - Cogitando colocar uma função anônima, seria bem ajeitadinho
 */
type ReturnType = string | number | boolean | [Term, Term] | Function | void

/** Para evitar a verbosidade de ficar passando e retornando a nametable em cada evaluation, nametable global!!
 * 
 * Nessa implementação, todos as variáveis são globais (incluindo parâmetros de função), sendo sobreescritas indiscriminadamente,
 * e isso quebra várias coisas
 * 
 * Quando eu corrigir isso, me darei ao trabalho de tirar a nametable do escopo global, e realmente ficar passando ela pra lá e pra cá
 */
const nametable = new Map<string, ReturnType>()

/** Interpreta o conteúdo da AST de um `.rinha`
 * 
 * Isso é feito chamando a função de evaluation na `expression` do arquivo
 */
export function interpretate(file: File) {
    const result = evaluate(file.expression)
    console.log(result)
}

function evaluate(term: Term): ReturnType {
    switch(term.kind) {
        case "Int":
        case "Str":
        case "Bool":
            // Valores primitivos são retornados normalmente
            return term.value
        case "Tuple":
            return [term.first, term.second]
        case "First":
        case "Second":
            // O enunciado fala que First e Second sempre serão chamados em tuplas, então a gente pode fazer essa barbaridade de type assertion
            // Se não fosse o caso, teria que fazer um `if` que levantaria um erro em qqr termo não-tupla, dispensando o uso do `as`
            const [fst, snd] = evaluate(term.value) as [Term, Term]
            return term.kind == "First"
                ? evaluate(fst)
                : evaluate(snd)
        case "Binary":
            return do_binary_op(term.lhs, term.rhs, term.op)
        case "If":
            return evaluate(term.condition)
                ? evaluate(term.then)
                : evaluate(term.otherwise)
        case "Print":
            const term_to_print = evaluate(term.value)
            return console.log(to_print(term_to_print))
        case "Let":
            nametable.set(term.name.text, evaluate(term.value))
            return evaluate(term.next)
        case "Function":
            return term
        case "Call":
            return call_function(term.callee, term.arguments)
        case "Var":
            const var_value = nametable.get(term.text)
            if(var_value !== undefined) {
                return var_value
            } else {
                throw Error(`Variável ${term.text} não foi declarada`)
            }
    }
}

// TODO Talvez tenha que fazer checagens de operações inválidas? (str GTE number)
function do_binary_op(lhs: Term, rhs: Term, op: BinaryOp): string | number | boolean {
    switch(op) {
        case "Add": return (evaluate(lhs) as any) +  (evaluate(rhs) as any)
        case "Sub": return (evaluate(lhs) as any) -  (evaluate(rhs) as any)
        case "Mul": return (evaluate(lhs) as any) *  (evaluate(rhs) as any)
        case "Div": return (evaluate(lhs) as any) /  (evaluate(rhs) as any)
        case "Rem": return (evaluate(lhs) as any) %  (evaluate(rhs) as any)
        case "Eq" : return (evaluate(lhs) as any) == (evaluate(rhs) as any)
        case "Neq": return (evaluate(lhs) as any) != (evaluate(rhs) as any)
        case "Lt" : return (evaluate(lhs) as any) <  (evaluate(rhs) as any)
        case "Gt" : return (evaluate(lhs) as any) >  (evaluate(rhs) as any)
        case "Lte": return (evaluate(lhs) as any) <= (evaluate(rhs) as any)
        case "Gte": return (evaluate(lhs) as any) >= (evaluate(rhs) as any)
        case "And": return (evaluate(lhs) as any) && (evaluate(rhs) as any)
        case "Or" : return (evaluate(lhs) as any) || (evaluate(rhs) as any)
    }
}

function to_print(value: ReturnType): string | void {
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
            return isFunction(value)
                ? "<#closure>"
                : `(${evaluate(value[0])}, ${evaluate(value[1])})`
        case "function":
        default:
            return value
    }
}

function isFunction(x: any): x is Function {
    return (x as Function)?.kind == "Function"
}

function call_function(callee: Term, args: Term[]): ReturnType {
    const fn = evaluate(callee)
    if(!isFunction(fn)) {
        throw Error(`'${fn}' is not callable!`)
    }
    if(args.length != fn.parameters.length) {
        throw Error(`Incorrect number of arguments. Expected ${fn.parameters.length}. Got ${args.length}.`)
    }
    for(const [idx, p] of fn.parameters.entries()) {
        nametable.set(p.text, evaluate(args[idx]))
    }
    return evaluate(fn.value)
}
