const firestore = firebase.firestore();

async function obtenerPreguntasAleatorias() {
    const snapshot = await firestore.collection("preguntas").get();
    const preguntas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    // Mezclar y seleccionar X preguntas
    return preguntas.sort(() => 0.5 - Math.random()).slice(0, 5);
}