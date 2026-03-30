
   document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burger-btn');
    const navWrapper = document.getElementById('nav-wrapper');

    if (burgerBtn && navWrapper) {
        burgerBtn.addEventListener('click', () => {
            // Ajoute/Enlève la classe 'open' sur le bouton et le menu
            burgerBtn.classList.toggle('open');
            navWrapper.classList.toggle('open');
            
            // Empêche le défilement de la page derrière le menu
            if (navWrapper.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }
});