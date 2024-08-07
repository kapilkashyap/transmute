import store from './data/store.js';
import { memorySizeOf, transmute } from './dist/index.mjs';

(() => {
    console.log(
        '%cTransmute %c#1.0.0\nDynamically transform a JSON into a Class with private properties and accessor methods at runtime.',
        'font-size:36px;letter-spacing:.15em;',
        ''
    );

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

    document.querySelector('button#formatJSON').addEventListener('click', beautifyJSON);

    document.querySelector('button#transmuteJSON').addEventListener('click', () => {
        const jsonText = document.querySelector('.jsonInput').value;
        if (jsonText != null && jsonText.length > 0) {
            const validateInput = document.querySelector('#validateInputId').checked;
            const cloneable = document.querySelector('#cloneableId').checked;
            console.time('Time to transmute');
            const transmutedObject = transmute(JSON.parse(jsonText), {
                validateInput,
                cloneable
            });
            console.timeEnd('Time to transmute');

            window['obj'] = transmutedObject;
            console.log('Memory size:', memorySizeOf(transmutedObject.toJson()));
            console.log('Transmuted JSON stored in variable obj > console.log(obj)');
            console.log(window['obj']);
        }
    });
})();
