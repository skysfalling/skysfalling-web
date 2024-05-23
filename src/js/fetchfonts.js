document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/fonts')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(fonts => {
            const container = document.getElementById('font-container');
            fonts.forEach(font => {
                const fontName = font.split('.')[0];
                const fontFace = new FontFace(fontName, `url(../fonts/${font})`);


                fontFace.load().then(loadedFont => {
                    document.fonts.add(loadedFont);

                    const div = document.createElement('div');
                    div.className = 'font-sample';
                    div.style.fontFamily = fontName;
                    div.textContent = `The quick brown fox jumps over the lazy dog`;

                    const fontNameDiv = document.createElement('div');
                    fontNameDiv.className = 'font-name';
                    div.style.fontFamily = fontName;
                    fontNameDiv.textContent = fontName;

                    container.appendChild(div);
                    container.appendChild(fontNameDiv);
                }).catch(error => {
                    console.error(`Failed to load font ${fontName}:`, error);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching fonts:', error);
        });
});
