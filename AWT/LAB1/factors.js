//find factors of given numbers

const readline = require('readline');

function factors(num) {
    let factors = [];
    for (let i = 1; i <= num; i++) {
        if (num % i === 0) {
            factors.push(i);
        }
    }

    return factors.join(', ');
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the number to find factors: ', (num) => {
    const startNum = parseInt(num);

    if (isNaN(num)) {
        console.log('Please enter valid numbers.');
    } else {
        console.log(`Factors of ${num} are:\n${factors(num)}`);
    }
    rl.close();
});
