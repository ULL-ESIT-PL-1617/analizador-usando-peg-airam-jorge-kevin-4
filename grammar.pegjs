{
    var constantSymbols = new Set(["pi"])
    var symbolTable = {
      PI: Math.PI
    }
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
  / assign

assign
  = id:ID ASSIGN a:assign {
       id = id[1];
       if (constantSymbols.has(id.toLowerCase()))
          throw "Cant override value of constant " + id;
       symbolTable[id] = 'constant';
       return { type: "ASSIGN", id: id, right: a };
  }
  / additive

additive
  = left:multiplicative op:ADDOP right:additive {
    return {
      type: "ADDITIVE",
      op: op[1],
      left: left,
      right: right
    };
  }
  / multiplicative

multiplicative
  = left:primary op:MULOP right:multiplicative {
    return {
      type: "MULOP",
      op: op[1],
      left: left,
      right: right
    };
  }
  / primary

primary
  = int:integer {
      return { type: "NUM", value: parseInt(int[1])};
  }
  / id:ID {
      id = id[1]
      if (!symbolTable[id]) { throw id + " not defined"; }
      return { type: "ID", id: id};
    }
  / LEFTPAR a:comma RIGHTPAR { return {type: "PAR", value: a}};

integer "integer"
  = NUMBER

_ = $[ \t\n\r]*

ADDOP = PLUS / MINUS
MULOP = MULT / DIV
COMMA = _","_
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
NUMBER = _ $[0-9]+ _
ID = _ $([a-z_]i$([a-z0-9_]i*)) _
ASSIGN = _ '=' _
