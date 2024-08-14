import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto): number {
    const { expression } = calcBody;

    if (!this.isValidExpression(expression)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }

    try {
      const result = this.evaluateExpression(expression);
      return result;
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }
  }

  private isValidExpression(expression: string): boolean {
    const validPattern = /^[0-9+\-*/\s]+$/;
    return (
      validPattern.test(expression) && this.hasBalancedOperators(expression)
    );
  }

  private hasBalancedOperators(expression: string): boolean {
    const tokens = expression.match(/\d+|\+|\-|\*|\//g);
    if (!tokens) return false;

    let lastToken = '';
    let hasNumber = false;

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        hasNumber = true;
      } else if (['+', '-', '*', '/'].includes(token)) {
        if (lastToken === '' || lastToken === token) return false;
      }
      lastToken = token;
    }

    return hasNumber && !['+', '-', '*', '/'].includes(lastToken);
  }

  private evaluateExpression(expression: string): number {
    const tokens = expression.match(/\d+|\+|\-|\*|\//g);

    if (!tokens) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Invalid expression provided',
        error: 'Bad Request',
      });
    }

    const values: number[] = [];
    const operators: string[] = [];

    for (const token of tokens) {
      if (!isNaN(parseFloat(token))) {
        values.push(parseFloat(token));
      } else if (['+', '-', '*', '/'].includes(token)) {
        while (
          operators.length &&
          this.hasPrecedence(token, operators[operators.length - 1])
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

  private hasPrecedence(op1: string, op2: string): boolean {
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
