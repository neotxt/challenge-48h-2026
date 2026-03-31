document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function () {
            // On récupère le type actuel (password ou text)
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';

            // On change l'attribut
            password.setAttribute('type', type);

            // OPTIONNEL : On change l'icône (œil ouvert / œil barré)
            // Si tu utilises FontAwesome, on bascule entre fa-eye et fa-eye-slash
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});