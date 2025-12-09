const readline = require('readline');

function celcius_to_fahrenheit(celcius) {
    
    fahrenheit = (celcius * 9/5) + 32;

    return fahrenheit;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the celcius: ', (num) => {

    if (isNaN(num)) {
        console.log('Please enter valid numbers.');
    } else {
        console.log(`Fahrenheit of ${num} is ${celcius_to_fahrenheit(num)}`);
    }
    rl.close();
});
