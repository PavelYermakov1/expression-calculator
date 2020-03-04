function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
      let newString = expr.replace(/[' ']/g,'');
      let braketLeft = 0; 
      let braketRigth = 0;
      for(let i = 0; i < newString.length; i++){
        if (newString[i] == '(') {
            braketLeft++;
          }else if (newString[i] == ')') {
            braketRigth++;
          }
      }
      if (braketLeft != braketRigth) {
          throw new Error('ExpressionError: Brackets must be paired');
      }
      
      for (let i = 0; i < braketLeft; i++) {
          let braketInto = newString.slice(newString.lastIndexOf('(') + 1, newString.indexOf(')', newString.lastIndexOf('(')));
          let resultInto = calc(braketInto);
          newString = newString.replace(`(${braketInto})`, resultInto);
      }
      
      return calc(newString);
  }
  
  function calc(str) {
    str = str.replace(/[-]/g,'m');
      if (str[0] == 'm') {
          str = `-${str.substr(1, str.length)}`;
      }
    let singCount = 0;
    let arr = str.split('');
    str = arr.reduce((acc,cur,i) => {
        if(cur === '+' || cur === '*' || cur === '/') {
            singCount++;
            return acc += cur;
        } else if(cur === 'm') {
            if (arr[i-1] == '+' || arr[i-1] == '*' || arr[i-1] == '/' || arr[i-1] == 'm') {
                return acc += '-';
            } else {
                singCount++;
                return acc += cur;
            }
        } else {
            return acc += cur;
        }
    }, '');
      for (let i = 0; i < singCount; i++) {
          let indFirst = 0; 
          let indCurr = str.match(/[+,m,*,/]/).index; 
          let indlast = 0;
          if (i + 1 == singCount) {
              indlast = str.length - 1;
          } else {
              indlast = str.slice(indCurr + 1).match(/[+,m,*,/]/).index + indCurr;
              if ((str[indCurr] == '+' || str[indCurr] == 'm') && (str[indlast + 1] == '*' || str[indlast + 1] == '/')) {
                  indFirst = indCurr + 1;
                  indCurr = indlast + 1;
                  if (i + 2 == singCount) {
                      indlast = str.length - 1;
                  } else {
                      indlast = str.slice(indCurr + 1 ).match(/[+,m,*,/]/).index + indCurr;
                  }
              }
          }
          let result = 0;
          switch(str[indCurr]) {
            case '+':
                result = parseFloat(str.slice(indFirst, indCurr)) + parseFloat(str.slice(indCurr + 1, indlast + 1));
                break;
            case 'm':
                result = parseFloat(str.slice(indFirst, indCurr)) - parseFloat(str.slice(indCurr + 1, indlast + 1));
                break;
            case '/':
                if (parseFloat(str.slice(indCurr + 1, indlast + 1)) == 0) {
                    throw new Error('TypeError: Division by zero.');
                }else{
                    result = parseFloat(str.slice(indFirst, indCurr)) / parseFloat(str.slice(indCurr + 1, indlast + 1));
                }
                break;
            case '*':
                result = parseFloat(str.slice(indFirst, indCurr)) * parseFloat(str.slice(indCurr + 1, indlast + 1));
                break;
          }
          str = str.replace(str.slice(indFirst, indlast + 1), result);
      }
      return parseFloat(str);
}

module.exports = {
    expressionCalculator
}