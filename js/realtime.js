const db = firebase.database();

async function crearPartida() {
    const partidaId = Math.random().toString(36).substring(2, 10);

    try{
        const user = firebase.auth().currentUser;
        if(!user){
            throw new Error('No hay usuario logueado');
        }

        await db.ref("partidas/" + partidaId).set({
            admin: auth.currentUser.uid,
            estado: "esperando",
            jugadores: {}
        });

        localStorage.setItem("partidaId", partidaId);
        return partidaId;
    } catch (error) {
        console.error("Error creando partida", error);
        throw error;
    }
}

async function existePartida(partidaId) {
    const partidaRef = db.ref("partidas/" + partidaId);
    const snapshot = await partidaRef.get();
    return snapshot;
}

async function unirseAPartida(partidaId) {
    try{
        const partidaRef = db.ref("partidas/" + partidaId);
        const snapshot = await partidaRef.get();

        if(!snapshot.exists()){
            throw new Error('La partida no existe');
        }

        const partida = snapshot.val();

        if(partida.estado !== "esperando"){
            throw new Error('La partida ya empezó o terminó, lo sentimos.');
        }

        const jugadores = partida.jugadores || {};
        const cantidadJugadores = Object.keys(jugadores).length;
        if(cantidadJugadores >= 4){
            throw new Error('La partida está llena y no se pueden unir más jugadores.');
        }

        const preguntas = await obtenerPreguntasAleatorias();
        const nuevoJugador = "jugador" + (cantidadJugadores + 1);
        await partidaRef.child("jugadores").child(nuevoJugador).set({
            preguntas: preguntas.length
        });

        localStorage.setItem("partidaId", partidaId);
        localStorage.setItem("numJugador", cantidadJugadores + 1);
        localStorage.setItem("preguntas", JSON.stringify(preguntas));

        return cantidadJugadores + 1;
    } catch (error) {
        console.error("Error uniendo a partida", error);
        throw error;
    }
}