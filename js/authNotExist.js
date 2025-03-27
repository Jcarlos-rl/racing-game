const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if (!user) {
        // Si NO está autenticado, lo redirige a la página de login
        window.location.reload();
    }
});