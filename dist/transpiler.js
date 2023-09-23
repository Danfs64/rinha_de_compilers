import { writeFileSync } from "fs";
import { expandToString } from "langium";
export function transpile(file) {
    const header = expandToString `
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
    `;
    const content = expandToString `
        ${header}
        
        ${transpile_term(file.expression)}
        
    `;
    writeFileSync("a.js", content);
}
function transpile_term(term) {
    switch (term.kind) {
        case "Int":
        case "Str":
        case "Bool":
            return `${term.value}`;
        case "Tuple":
            return `[${transpile_term(term.first)}, ${transpile_term(term.second)}]`;
        case "First":
        case "Second":
            const tuple = transpile_term(term.value);
            return `${tuple}[${term.kind == "First" ? '0' : '1'}]`;
        case "Binary":
            return `${transpile_term(term.lhs)} ${transpile_op(term.op)} ${transpile_term(term.rhs)}`;
        case "Let":
            return expandToString `
                let ${term.name.text} = (
                    ${transpile_term(term.value)}
                )
                ${transpile_term(term.next)}
            `;
        case "Print":
            return `print(${transpile_term(term.value)})`;
        case "If":
            return expandToString `
                ${transpile_term(term.condition)}
                    ? ${transpile_term(term.then)}
                    : ${transpile_term(term.otherwise)}`;
        case "Call":
            return `${transpile_term(term.callee)}(${term.arguments.map(transpile_term)})`;
        case "Function":
            return transpile_function(term);
        case "Var":
            return `${term.text}`;
    }
}
function transpile_op(op) {
    switch (op) {
        case "Add": return '+';
        case "Sub": return '-';
        case "Mul": return '*';
        case "Div": return '/';
        case "Rem": return '%';
        case "Eq": return '==';
        case "Neq": return '!=';
        case "Lt": return '<';
        case "Gt": return '>';
        case "Lte": return '<=';
        case "Gte": return '>=';
        case "And": return '&&';
        case "Or": return '||';
    }
}
function transpile_function(fn) {
    const transpile_fn_body = (term) => {
        return isLet(term)
            ? expandToString `
                let ${term.name.text} = (
                    ${transpile_term(term.value)}
                )
                ${transpile_fn_body(term.next)}
            `
            : `return ${transpile_term(term)}`;
    };
    return expandToString `
        (${fn.parameters.map(x => x.text)}) => {
            ${transpile_fn_body(fn.value)}
        }
    `;
}
function isLet(term) {
    return term.next !== undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNwaWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90cmFuc3BpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxJQUFJLENBQUE7QUFFbEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUV4QyxNQUFNLFVBQVUsU0FBUyxDQUFDLElBQW9CO0lBQzFDLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQW1CNUIsQ0FBQTtJQUNELE1BQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQTtVQUN4QixNQUFNOztVQUVOLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOztLQUVwQyxDQUFBO0lBQ0QsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUNsQyxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBb0I7SUFDeEMsUUFBTyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2QsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLEtBQUssQ0FBQztRQUNYLEtBQUssTUFBTTtZQUNQLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7UUFDMUIsS0FBSyxPQUFPO1lBQ1IsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFBO1FBQzVFLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxRQUFRO1lBQ1QsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUN4QyxPQUFPLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzFELEtBQUssUUFBUTtZQUNULE9BQU8s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