import store from './data/store.js';
import { memorySizeOf, transmute } from './dist/transmute.js';

(() => {
    const beautifyJSON = () => {
        const jsonInput = document.querySelector('.jsonInput').value;
        if (jsonInput != null && jsonInput.length > 0) {
            // eslint-disable-next-line no-useless-catch
            try {
                const parsedJson = JSON.parse(jsonInput);
                document.querySelector('.jsonInput').value = JSON.stringify(parsedJson, undefined, 4);
            } catch (e) {
                throw e;
            }
        }
    };

    window.addEventListener('load', () => {
        document.querySelector('.jsonInput').value = JSON.stringify(store, undefined, 4);
    });

    // document.querySelector('.jsonInput').addEventListener('keyup', beautifyJSON);

    document.querySelector('button#formatJSON').addEventListener('click', beautifyJSON);

    document.querySelector('button#transmuteJSON').addEventListener('click', () => {
        const jsonText = document.querySelector('.jsonInput').value;
        if (jsonText != null && jsonText.length > 0) {
            console.time('Time to transmute');
            window['obj'] = transmute(JSON.parse(jsonText));
            console.timeEnd('Time to transmute');
            console.log('Memory size: ', memorySizeOf(window['obj']));
            console.log('Created a constant named - obj');
            console.log(window['obj']);
        }
    });
})();
