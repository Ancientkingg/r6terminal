const input = require('input');
 
async function askStuff() {
  const name = await input.text('What is your name?', { default: 'Fred' });
 
  const colors = await input.checkboxes(`OK ${name}, choose some colors`, [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'rebeccapurple'
  ]);
 
  console.log('You chose:\n  ' + colors.join('\n  '));
}
 
askStuff();