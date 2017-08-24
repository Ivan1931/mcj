const iff = Symbol("if");
const doo = Symbol("do");

function evaluateIf(expression) {
    if (expression.length < 4) {
        throw new Error(`If ${expression} statement does not have enough arguments!`)
    }
    let predicate = evaluate(expression[1])
    if (typeof(predicate) === "boolean") {
        if (predicate) {
            return evaluate(expression[2])
        } else {
            return evaluate(expression[3])
        }
    } else {
        throw new Error(`Type Error - ${expression} does not have a boolean predicate`)
    }
}

function evaluateDo(expression) {
    var lastResult = [];
    for(let exp of expression.slice(1)) {
        lastResult = evaluate(exp)
    }
    return lastResult
}

function evaluateFunction(expression) {
    let fn = expression[0]
    if (typeof(fn) === 'function') {
        let args = expression.slice(1).map((argument) => evaluate(argument))
        return fn.apply(this, args)
    } else {
        throw new Error(`Type Error ${fn} in ${expression} is not a function`)
    }
}

function isPrimitive(expression) {
    let isString = typeof(expression) === "string"
    let isBoolean = typeof(expression) === "boolean"
    let isNumber = typeof(expression) === "number"
    return isString || isBoolean || isNumber
}

function evaluate(expression) {
    if (expression instanceof Array) {
        if (expression.length == 0) return null;
        if (expression[0] === iff) {
            return evaluateIf(expression)
        } else if (expression[0] === doo) {
            return evaluateDo(expression)
        } else {
            return evaluateFunction(expression)
        }
    } else if (isPrimitive(expression)) {
        return expression
    } else {
        throw new Error(`Unknown type of expression ${expression.toString()}`)
    }
}

function parse(expression) {
    let isQuotes = false
    let idx = 0
    let parsedExpression = ""
    while (idx < expression.length) {
        if (isQuotes) {
            isQuotes = expression[idx] !== '"'
            parsedExpression += expression[idx]
        } else {
            if (expression[idx] === '(') {
                parsedExpression += '['
            } else if (expression[idx] === ')') {
                parsedExpression += ']'
            } else {
                parsedExpression += expression[idx]
            }
        }
        idx+= 1
    }
    return parsedExpression.trim().split(/\s/g).join(",")
}

console.log(evaluate("1"))
console.log(evaluate(1))
console.log(evaluate(true))
console.log(evaluate([function(x) { return x + 1}, 1]))
console.log(evaluate([iff, true, 1, 2]))
console.log(evaluate([iff, false, 1, 2]))
evaluate([doo, [console.log, 1], 1])
console.log(parse("(iff true true false)"))
console.log(evaluate(eval(parse("(iff true 1 3)"))))