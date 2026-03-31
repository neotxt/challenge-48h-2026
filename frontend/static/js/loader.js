
    // On définit la fonction de sortie
    function killLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('loader-hidden');
            // Après l'animation de fondu, on le retire complètement
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }
    }

    // Dès que le script est lu, on lance un chrono de 2 secondes
    // C'est le temps de voir l'animation, puis ça dégage quoi qu'il arrive
    setTimeout(killLoader, 6000);