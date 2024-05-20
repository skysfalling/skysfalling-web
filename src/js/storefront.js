document.addEventListener('DOMContentLoaded', () => {
    const csvFilePath = "../data/products.csv"; // Path to the CSV file
    const storefront = document.getElementById('storefront');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const span = document.getElementsByClassName('close')[0];

    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: function(results) {
            const products = results.data.filter(product => product.Title); // Filter out rows without a title
            products.forEach(product => {

                console.log(product);

                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                const mainPhotoDiv = document.createElement('div');
                mainPhotoDiv.className = 'main-photo';

                // Parse the Hosted Image URLs and use only the first one
                const imageUrls = product['Hosted Image URLs'].split(' ');
                const mainImgUrl = imageUrls[0].trim();

                const mainImg = document.createElement('img');
                mainImg.src = mainImgUrl;
                mainImg.alt = product.Title;

                mainPhotoDiv.appendChild(mainImg);

                const productInfo = document.createElement('div');
                productInfo.className = 'product-info';
                productInfo.textContent = product.Title;

                productCard.appendChild(mainPhotoDiv);
                productCard.appendChild(productInfo);

                productCard.addEventListener('mousedown', () => {
                    modalBody.innerHTML = ''; // Clear previous content
                    // Create versions for the remaining images
                    for (let i = 0; i < imageUrls.length; i++) {
                        const versionImgUrl = imageUrls[i].trim();
                        const versionName = `Version ${i}`; // Generate a name for the version

                        const versionCard = document.createElement('div');
                        versionCard.className = 'modal-product-card';

                        const versionImg = document.createElement('img');
                        versionImg.src = versionImgUrl;
                        versionImg.alt = versionName;

                        const versionInfo = document.createElement('div');
                        versionInfo.className = 'modal-product-info';
                        versionInfo.textContent = versionName;

                        versionCard.appendChild(versionImg);
                        versionCard.appendChild(versionInfo);
                        modalBody.appendChild(versionCard);
                    }
                    modal.style.display = 'block';
                });

                storefront.appendChild(productCard);
            });
        }
    });

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
