//     5
//    5 4
//   5 4 3
//  5 4 3 2
// 5 4 3 2 1

let string = "";
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 5 - i; j++) {
    string += " ";
  }
  for (let k = 0; k < i; k++) {
    string += `${5 - k} `;
  }
  string += "\n";
}
console.log(string);