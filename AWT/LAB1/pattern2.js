const n = 5;
for (let i = 0; i < n; i++) {
  let line = ' '.repeat(i);
  let charsCount = n - i; 
  let char = i % 2 === 0 ? '*' : 'a';

  line += (char + ' ').repeat(charsCount).trim();

  console.log(line);
}
