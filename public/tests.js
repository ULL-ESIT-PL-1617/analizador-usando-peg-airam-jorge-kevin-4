(function() {
  var assert;

  assert = chai.assert;

  suite('parser', function() {
    setup(function() {
    });
    test('Multiplications are parsed correctly', () => {
      var result = parse('3 * 4;');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "*",
              "left": {
                "type": "NUM",
                "value": 3
              },
              "right": {
                "type": "NUM",
                "value": 4
              }
            }
          ],
          "symbolTable": {},
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('Bad expressions throw exceptions', () => {
      assert.throws(() => parse('3 + (4+2))'), /Syntax\s+Error/i);
    });
    test('Divisions are parsed correctly', () => {
      var result = parse('10 / 2;');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "/",
              "left": {
                "type": "NUM",
                "value": 10
              },
              "right": {
                "type": "NUM",
                "value": 2
              }
            }
          ],
          "symbolTable": {},
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('Functions are parsed correctly', () => {
      var result = parse('FUNCTION test (x){ x = 3; }');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "FUNCTION",
              "id": "test",
              "parameters": {
                "x": "parameter"
              },
              "code": [
                {
                  "type": "=",
                  "left": "x",
                  "right": {
                    "type": "NUM",
                    "value": 3
                  }
                }
              ]
            }
          ],
          "symbolTable": {},
          "functionTable": {
            "test": {
              "local_symbol_table": {
                "x": "parameter"
              }
            }
          },
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('Condition are parsed correctly', () => {
      var result = parse('x = 2; IF x == 5 { x = 0; } ELSE { x = 1; }');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "=",
              "left": "x",
              "right": {
                "type": "NUM",
                "value": 2
              }
            },
            {
              "type": "IF",
              "if_condition": {
                "type": "==",
                "left": {
                  "type": "ID",
                  "value": "x"
                },
                "right": {
                  "type": "NUM",
                  "value": 5
                }
              },
              "if_sentences": [
                {
                  "type": "=",
                  "left": "x",
                  "right": {
                    "type": "NUM",
                    "value": 0
                  }
                }
              ],
              "elseif_sentences": [],
              "else_sentece": [
                {
                  "type": "=",
                  "left": "x",
                  "right": {
                    "type": "NUM",
                    "value": 1
                  }
                }
              ]
            }
          ],
          "symbolTable": {
            "x": "volatile"
          },
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('Loops are parsed correctly', () => {
      var result = parse('y = 0; LOOP (x = 0; x < 4; x = x + 1) { y = y + 1; }');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "=",
              "left": "y",
              "right": {
                "type": "NUM",
                "value": 0
              }
            },
            {
              "type": "LOOP",
              "loop_start": {
                "type": "COMMA",
                "values": [
                  {
                    "type": "=",
                    "left": "x",
                    "right": {
                      "type": "NUM",
                      "value": 0
                    }
                  }
                ]
              },
              "loop_condition": {
                "type": "<",
                "left": {
                  "type": "ID",
                  "value": "x"
                },
                "right": {
                  "type": "NUM",
                  "value": 4
                }
              },
              "loop_iteration": {
                "type": "COMMA",
                "values": [
                  {
                    "type": "=",
                    "left": "x",
                    "right": {
                      "type": "+",
                      "left": {
                        "type": "ID",
                        "value": "x"
                      },
                      "right": {
                        "type": "NUM",
                        "value": 1
                      }
                    }
                  }
                ]
              },
              "code": [
                {
                  "type": "=",
                  "left": "y",
                  "right": {
                    "type": "+",
                    "left": {
                      "type": "ID",
                      "value": "y"
                    },
                    "right": {
                      "type": "NUM",
                      "value": 1
                    }
                  }
                }
              ]
            }
          ],
          "symbolTable": {
            "y": "volatile",
            "x": "volatile"
          },
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('The assignments are parsed correctly', () => {
      var result = parse('FUNCTION foo(x){} CONST y = 5; x = 3 * 2; z = foo(3 * 4); h = 1 > 2;');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "FUNCTION",
              "id": "foo",
              "parameters": {
                "x": "parameter"
              },
              "code": []
            },
            {
              "type": "=",
              "left": "y",
              "right": {
                "type": "NUM",
                "value": 5
              }
            },
            {
              "type": "=",
              "left": "x",
              "right": {
                "type": "*",
                "left": {
                  "type": "NUM",
                  "value": 3
                },
                "right": {
                  "type": "NUM",
                  "value": 2
                }
              }
            },
            {
              "type": "=",
              "left": "z",
              "right": {
                "type": "CALL",
                "id": "foo",
                "arguments": {
                  "type": "COMMA",
                  "values": [
                    {
                      "type": "*",
                      "left": {
                        "type": "NUM",
                        "value": 3
                      },
                      "right": {
                        "type": "NUM",
                        "value": 4
                      }
                    }
                  ]
                }
              }
            },
            {
              "type": "=",
              "left": "h",
              "right": {
                "type": ">",
                "left": {
                  "type": "NUM",
                  "value": 1
                },
                "right": {
                  "type": "NUM",
                  "value": 2
                }
              }
            }
          ],
          "symbolTable": {
            "y": "const",
            "x": "volatile",
            "z": "volatile",
            "h": "volatile"
          },
          "functionTable": {
            "foo": {
              "local_symbol_table": {
                "x": "parameter"
              }
            }
          },
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('The conditions are parsed correctly', () => {
      var result = parse('false; i = 2; i < 5;');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "ID",
              "value": "false"
            },
            {
              "type": "=",
              "left": "i",
              "right": {
                "type": "NUM",
                "value": 2
              }
            },
            {
              "type": "<",
              "left": {
                "type": "ID",
                "value": "i"
              },
              "right": {
                "type": "NUM",
                "value": 5
              }
            }
          ],
          "symbolTable": {
            "i": "volatile"
          },
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('The expressions are parsed correctly', () => {
      var result = parse('5 + 7; 9 - 7; 7;');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "+",
              "left": {
                "type": "NUM",
                "value": 5
              },
              "right": {
                "type": "NUM",
                "value": 7
              }
            },
            {
              "type": "-",
              "left": {
                "type": "NUM",
                "value": 9
              },
              "right": {
                "type": "NUM",
                "value": 7
              }
            },
            {
              "type": "NUM",
              "value": 7
            }
          ],
          "symbolTable": {},
          "functionTable": {},
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });
    test('Function calls are parsed correctly', () => {
      var result = parse('FUNCTION f1(){} FUNCTION f2(x){} f2(5); f1(); 4 * f2(7 * 2);');
      console.log(result);
      assert.deepEqual(result, {
          "result": [
            {
              "type": "FUNCTION",
              "id": "f1",
              "parameters": {},
              "code": []
            },
            {
              "type": "FUNCTION",
              "id": "f2",
              "parameters": {
                "x": "parameter"
              },
              "code": []
            },
            {
              "type": "CALL",
              "id": "f2",
              "arguments": {
                "type": "COMMA",
                "values": [
                  {
                    "type": "NUM",
                    "value": 5
                  }
                ]
              }
            },
            {
              "type": "CALL",
              "id": "f1",
              "arguments": {
                "values": []
              }
            },
            {
              "type": "*",
              "left": {
                "type": "NUM",
                "value": 4
              },
              "right": {
                "type": "CALL",
                "id": "f2",
                "arguments": {
                  "type": "COMMA",
                  "values": [
                    {
                      "type": "*",
                      "left": {
                        "type": "NUM",
                        "value": 7
                      },
                      "right": {
                        "type": "NUM",
                        "value": 2
                      }
                    }
                  ]
                }
              }
            }
          ],
          "symbolTable": {},
          "functionTable": {
            "f1": {
              "local_symbol_table": {}
            },
            "f2": {
              "local_symbol_table": {
                "x": "parameter"
              }
            }
          },
          "constantTable": {
            "true": 1,
            "false": 0
          }
        });
    });

  });
}).call(this);
