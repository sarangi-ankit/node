import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    if (!this.isValidExpression(expression)) {
      throw new Error('Invalid expression provided');
    }

    try {
      const result = this.evaluateExpression(expression);
      return result;
    } catch (error) {
      throw new Error('Invalid expression provided');
    }
  }

  private isValidExpression(expression: string): boolean {
    const validPattern = /^[0-9+\-*/\s]+$/;
    return validPattern.test(expression);
  }

  private evaluateExpression(expression: string): number {
    const tokens = expression.match(/\d+|\+|\-|\*|\//g);

    if (!tokens) {
      throw new Error('Invalid expression provided');
    }

    const values: number[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        values.push(parseFloat(token));
      } else if (['+', '-', '*', '/'].includes(token)) {
        while (
          operators.length &&
          this.hasOperate(token, operators[operators.length - 1])
        ) {
          const operator = operators.pop();
          const right = values.pop();
          const left = values.pop();
          values.push(this.applyOperator(operator, left, right));
        }
        operators.push(token);
      }
    }

    while (operators.length) {
      const operator = operators.pop();
      const right = values.pop();
      const left = values.pop();
      values.push(this.applyOperator(operator, left, right));
    }

    return values[0];
  }

  private hasOperate(op1: string, op2: string): boolean {
    if ((op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-')) {
      return false;
    }
    return true;
  }
  private applyOperator(op: string, left: number, right: number): number {
    switch (op) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      case '/':
        return left / right;
      default:
        throw new Error('Invalid operator');
    }
  }
}
