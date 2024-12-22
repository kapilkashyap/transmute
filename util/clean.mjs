import { rm } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const args = process.argv.slice(2);
// command line options
const options = {
    dir: {
        type: 'string',
        short: 'd'
    }
};

const {
    values: { dir }
} = parseArgs({ args, options });

if (rm != null && typeof rm === 'function' && dir != null && dir.length > 0) {
    rm(dir, { force: true, recursive: true }).then(
        (response) => {
            console.log(`[cleanup]: ${dir} folder was successfully removed!`);
            console.log(response);
        },
        (reason) => {
            console.log(`[cleanup]: ${dir} folder could not be removed!`);
            console.log(reason);
        }
    );
}
