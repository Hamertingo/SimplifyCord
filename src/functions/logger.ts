import chalk from 'chalk';

export class Logger {
    static success(message: string, context?: string) {
        console.log(
            chalk.green('✓'),
            context ? chalk.cyan(`[${context}]`) : '',
            message
        );
    }

    static error(message: string, error?: any, context?: string) {
        console.log(
            chalk.red.bold('✖'),
            context ? chalk.cyan(`[${context}]`) : '',
            chalk.red(message)
        );
        if (error) {
            console.log(chalk.red('Details:'), error);
        }
    }

    static warn(message: string, context?: string) {
        console.log(
            chalk.yellow('⚠'),
            context ? chalk.cyan(`[${context}]`) : '',
            chalk.yellow(message)
        );
    }

    static info(message: string, context?: string) {
        console.log(
            chalk.blue('ℹ'),
            context ? chalk.cyan(`[${context}]`) : '',
            message
        );
    }

    static ready(message: string, context?: string) {
        console.log(
            chalk.green('➜'),
            context ? chalk.cyan(`[${context}]`) : '',
            chalk.green(message)
        );
    }

    static separator() {
        console.log(chalk.gray('─'.repeat(50)));
    }

    static highlight(text: string, color: string = '#7289DA') {
        return chalk.hex(color).bold(text);
    }
}
