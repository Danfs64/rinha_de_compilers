import type { File, Function } from "./schema.js";
type NameTable = Map<string, ReturnType>;
/** Coisas que podem ser retornadas por uma expressão válida de uma `.rinha`.
 */
type ReturnType = string | number | boolean | [ReturnType, ReturnType] | Callable;
type Callable = {
    fn: Function;
    local_nametable: NameTable;
};
/** Interpreta o conteúdo da AST de um `.rinha`
 *
 * Isso é feito chamando a função de evaluation na `expression` do arquivo
 */
export declare function interpretate(file: Readonly<File>): ReturnType;
export {};
