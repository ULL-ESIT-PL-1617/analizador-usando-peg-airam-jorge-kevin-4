{
    var constantSymbols = new Set(["PI"]);
    var functionTable = {};
    var symbolTable = {
        PI: Math.PI
    };
}

start
  = a:sentences {
      return { constantSymbols: constantSymbols, symbolTable: symbolTable, result: a };
  }

sentences
 = a:(sentence)* {
     return {  sentences: a };
 }

sentence
 = if_statement
 / loop_statement
 / function_statement
 / a:assign SEMICOLON { return a; }

if_statement
 = IF condition LEFTBRACE codeA:sentences RIGHTBRACE codeB:(ELIF condition LEFTBRACE sentences RIGHTBRACE)* codeC:(ELSE condition LEFTBRACE sentences RIGHTBRACE)? {
     let ifCode     = {
         condition: "2<3",
         sentences: codeA.sentences
     };

     let elseCode = (codeC === null) ? {} : {
         condition: "8==9",
         sentences: codeC[3].sentences
     };

     let elseIfCode = [];
     codeB.forEach(x => elseIfCode.push({
         sentences: x[3].sentences,
         condition: "1<3"
     }));

     return {
         type:       "IF",
         ifCode:     ifCode,
         elseIfCode: elseIfCode,
         elseCode:   elseCode
     }
 }

comma
  = left:assign COMMA right:comma {
    return { type: "COMMA", left: left, right: right };
  }
  / as:assign {
    return { left: as }
  }

function_statement
  = FUNCTION id:ID LEFTPAR params:(ID (COMMA ID)*)? RIGHTPAR LEFTBRACE code:sentences RIGHTBRACE {
    if (funtionTable[id])
      throw "Function already declared" + id;
    funtionTable[id] = "function";
    return { type: "FUNCTION", id: id, params: params, code: code }
  }

loop_statement
  = LOOP LEFTPAR left:comma SEMICOLON condition:condition SEMICOLON right:comma RIGHTPAR LEFTBRACE code:sentences RIGHTBRACE {
    return { type: "LOOP", left: left, condition: condition, right: right, sentences: code }
  }

assign
  = id:ID ASSIGN a:assign {
       id = id[1];
       if (constantSymbols.has(id))
          throw "Cant override value of constant " + id;
       symbolTable[id] = 'constant';
       return { type: "ASSIGN", id: id, right: a };
  }
  / cond:condition {
    return cond;
  }

condition
  = left:expression comp:COMPARASION right:expression {
    return {
      type: "CONDITION",
      left: left,
      comparador: comp,
      right: right
    }
  }
  / ex:expression {
    return ex;
  }

expression
  = left:term op:ADDOP right:expression {
    return {
      type: "expression",
      op: op[1],
      left: left,
      right: right
    };
  }
  / term

term
  = left:factor op:MULOP right:term {
    return {
      type: "MULOP",
      op: op[1],
      left: left,
      right: right
    };
  }
  / fac:factor {
      return fac;
  }

factor
  = int:integer {
      return { type: "NUM", value: parseInt(int[1])};
  }
  / id:ID {
      id = id[1];
      if (!symbolTable[id]) { throw id + " not defined as variable (or constant)"; }
      return { type: "ID", id: id};
    }
  / id:ID args:arguments {
      id = id[1];
      if (!functionTable[id]) { throw id + " not defined as function"; }
      return {
          type: "CALL",
          args: args,
          id: id
      }
  }
  / RETURN assign:(assign)? {
      return {
          type: "RETURN",
          assign: (assign == null ? {} : assign)
      }
  }
  / EXIT {
      return {
          type: "EXIT"
      }
  }

arguments
  = LEFTPAR comma:(comma)? RIGHTPAR {
    return { type: "ARGUMENTS", arguments: (comma == null ? {} : comma)  }
  }

integer "integer"
  = NUMBER

_ = $[ \t\n\r]*

ADDOP = PLUS / MINUS
MULOP = MULT / DIV
LOOP = _"LOOP"_
RETURN = _"RETURN"_
EXIT = _"EXIT"_
COMMA = _","_
FUNCTION =_"FUNCTION"_
PLUS = _"+"_
MINUS = _"-"_
MULT = _"*"_
DIV = _"/"_
LEFTPAR = _"("_
RIGHTPAR = _")"_
SEMICOLON = _";"_
IF = _"IF"_
ELIF = _"ELSE IF"_
ELSE = _"ELSE"_
LEFTBRACE = _"{"_
RIGHTBRACE = _"}"_
NUMBER = _ $[0-9]+ _
ID = _ $([a-z_]i$([a-z0-9_]i*)) _
ASSIGN = _ '=' _
COMPARASION = _ $([<>!=]'=' / [<>]) _
