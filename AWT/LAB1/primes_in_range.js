const readline = require('readline');

function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }

    return true;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the start number: ', (start) => {
    rl.question('Enter the end number: ', (end) => {
        const startNum = parseInt(start);
        const endNum = parseInt(end);

        if (isNaN(startNum) || isNaN(endNum)) {
            console.log('Please enter valid numbers.');
        } else {
            console.log(`Prime numbers between ${startNum} and ${endNum}:`);
            for (let i = startNum; i <= endNum; i++) {
                if (isPrime(i)) {
                    console.log(i);
                }
            }
        }

        rl.close();
    });
});
