/** Interpreta o conteúdo da AST de um `.rinha`
 *
 * Isso é feito chamando a função de evaluation na `expression` do arquivo
 */
export function interpretate(file) {
    return evaluate(file.expression, new Map()).ret;
}
function evaluate(term, nametable) {
    switch (term.kind) {
        case "Int":
        case "Str":
        case "Bool":
            // Valores primitivos são retornados normalmente
            return { ret: term.value, nametable };
        case "Tuple":
            return { ret: [evaluate(term.first, nametable).ret, evaluate(term.second, nametable).ret], nametable };
        case "First":
        case "Second":
            // O enunciado fala que First e Second sempre serão chamados em tuplas, então a gente pode fazer essa barbaridade de type assertion
            // Se não fosse o caso, teria que fazer um `if` que levantaria um erro em qqr termo não-tupla, dispensando o uso do `as`
            const { ret: [fst, snd] } = evaluate(term.value, nametable);
            return term.kind == "First"
                ? { ret: fst, nametable }
                : { ret: snd, nametable };
        case "Binary":
            return { ret: do_binary_op(term.lhs, term.rhs, term.op, nametable), nametable };
        case "If":
            return evaluate(term.condition, nametable).ret
                ? evaluate(term.then, nametable)
                : evaluate(term.otherwise, nametable);
        case "Print":
            const term_to_print = evaluate(term.value, nametable);
            console.log(to_print(term_to_print.ret));
            return term_to_print;
        case "Let":
            const new_nametable = new Map(nametable);
            const value = evaluate(term.value, nametable).ret;
            nametable.set(term.name.text, value);
            new_nametable.set(term.name.text, value);
            return evaluate(term.next, new_nametable);
        case "Function":
            return { ret: { fn: term, local_nametable: nametable }, nametable };
        case "Call":
            return { ret: call_function(term.callee, term.arguments, nametable), nametable };
        case "Var":
            const ret = nametable.get(term.text);
            if (ret === undefined) {
                throw Error(`Variável ${term.text} não foi declarada`);
            }
            else {
                return { ret, nametable };
            }
    }
}
function do_binary_op(lhs, rhs, op, nametable) {
    switch (op) {
        case "Add": return evaluate(lhs, nametable).ret + evaluate(rhs, nametable).ret;
        case "Sub": return evaluate(lhs, nametable).ret - evaluate(rhs, nametable).ret;
        case "Mul": return evaluate(lhs, nametable).ret * evaluate(rhs, nametable).ret;
        case "Div": return evaluate(lhs, nametable).ret / evaluate(rhs, nametable).ret;
        case "Rem": return evaluate(lhs, nametable).ret % evaluate(rhs, nametable).ret;
        case "Eq": return evaluate(lhs, nametable).ret == evaluate(rhs, nametable).ret;
        case "Neq": return evaluate(lhs, nametable).ret != evaluate(rhs, nametable).ret;
        case "Lt": return evaluate(lhs, nametable).ret < evaluate(rhs, nametable).ret;
        case "Gt": return evaluate(lhs, nametable).ret > evaluate(rhs, nametable).ret;
        case "Lte": return evaluate(lhs, nametable).ret <= evaluate(rhs, nametable).ret;
        case "Gte": return evaluate(lhs, nametable).ret >= evaluate(rhs, nametable).ret;
        case "And": return evaluate(lhs, nametable).ret && evaluate(rhs, nametable).ret;
        case "Or": return evaluate(lhs, nametable).ret || evaluate(rhs, nametable).ret;
    }
}
function to_print(value) {
    switch (typeof value) {
        case "string":
            return value;
        case "number":
            return value.toString();
        case "boolean":
            return value
                ? "true"
                : "false";
        case "object":
            return isCallable(value)
                ? "<#closure>"
                : `(${to_print(value[0])}, ${to_print(value[1])})`;
    }
}
function isCallable(x) {
    return x?.fn !== undefined;
}
function call_function(callee, args, nametable) {
    const { ret: callable } = evaluate(callee, nametable);
    if (!isCallable(callable)) {
        throw Error(`'${callable}' is not callable!`);
    }
    const { fn, local_nametable } = callable;
    const new_nametable = new Map(local_nametable);
    if (args.length != fn.parameters.length) {
        throw Error(`Incorrect number of arguments. Expected ${fn.parameters.length}. Got ${args.length}.`);
    }
    for (const [idx, p] of fn.parameters.entries()) {
        new_nametable.set(p.text, evaluate(args[idx], nametable).ret);
    }
    return evaluate(fn.value, new_nametable).ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJwcmV0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW50ZXJwcmV0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBYUE7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxJQUFvQjtJQUM3QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUE7QUFDbkQsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLElBQW9CLEVBQUUsU0FBa0M7SUFDdEUsUUFBTyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2QsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLEtBQUssQ0FBQztRQUNYLEtBQUssTUFBTTtZQUNQLGdEQUFnRDtZQUNoRCxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFDLENBQUE7UUFDdkMsS0FBSyxPQUFPO1lBQ1IsT0FBTyxFQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQUMsQ0FBQTtRQUN4RyxLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssUUFBUTtZQUNULG1JQUFtSTtZQUNuSSx3SEFBd0g7WUFDeEgsTUFBTSxFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBMEQsQ0FBQTtZQUNsSCxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTztnQkFDdkIsQ0FBQyxDQUFDLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUM7Z0JBQ3ZCLENBQUMsQ0FBQyxFQUFDLEdBQUcsRUFB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Q0FBQyxDQUFDLE9BQVEsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLEdBQUssUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLENBQUE7UUFDakcsS0FBSyxLQUFLLENBQUMsQ0FBQyxPQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBVyxHQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBVyxDQUFBO1FBQ2pHLEtBQUssSUFBSyxDQUFDLENBQUMsT0FBUSxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQVcsSUFBSyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQVcsQ0FBQTtRQUNqRyxLQUFLLEtBQUssQ0FBQyxDQUFDLE9BQVEsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLElBQUssUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLENBQUE7UUFDakcsS0FBSyxJQUFLLENBQUMsQ0FBQyxPQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBVyxHQUFLLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBVyxDQUFBO1FBQ2pHLEtBQUssSUFBSyxDQUFDLENBQUMsT0FBUSxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQVcsR0FBSyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQVcsQ0FBQTtRQUNqRyxLQUFLLEtBQUssQ0FBQyxDQUFDLE9BQVEsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLElBQUssUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFXLENBQUE7UUFDakcsS0FBSyxLQUFLLENBQUMsQ0FBQyxPQUFRLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FB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