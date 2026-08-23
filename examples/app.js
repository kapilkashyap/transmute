console.log('[examples] Booting examples index page');

fetch('/api/examples')
    .then((response) => response.json())
    .then((examples) => {
        const list = document.getElementById('example-list');

        console.log('[examples] Loaded examples from server:', examples);

        if (!list) {
            return;
        }

        list.innerHTML = examples
            .map(
                (example) =>
                    `<li>
                <a href="${example.path}">${example.title}</a>
            </li>`
            )
            .join('');
    })
    .catch((error) => {
        const list = document.getElementById('example-list');
        console.error('[examples] Failed to load examples:', error);

        if (list) {
            list.innerHTML = `<li>Unable to load examples: ${error.message}</li>`;
        }
    });
