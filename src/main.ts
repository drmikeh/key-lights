import { on, off, status } from './lightService';
import { LightNames } from './types';

export async function main(command: string | undefined): Promise<void> {
  if (!command) {
    console.error('No command provided. Use "on", "off", "status", or "help".');
  } else if (command === 'help') {
    console.log('Available commands:');
    console.log('  on - Turn on the lights');
    console.log('  off - Turn off the lights');
    console.log('  status - Get the status of the lights');
  } else if (command == 'on') {
    await on(LightNames.Main, { brightness: 50, temperature: 241 });
    await on(LightNames.Fill, { brightness: 20, temperature: 333 });
  } else if (command == 'off') {
    await off(LightNames.Main);
    await off(LightNames.Fill);
  } else if (command == 'status') {
    await status(LightNames.Main);
    await status(LightNames.Fill);
  } else {
    console.error('UNKNOWN COMMAND:', command);
  }
}
