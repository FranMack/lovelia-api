const planetsAndAspectsInfo = {
  generalInfo: {
    title: "PLANETAS Y ASPECTOS",
    text: "Todos los planetas dentro de la carta astral están ubicados en algún punto del zodíaco y cumplen una función en el sistema. El aspecto es la distancia que separa a un planeta del otro, contada en grados de arco y que determina un ángulo específico.Los aspectos muestran cómo se influencian mutuamente los planetas unos con otros, algunos son armónicos y otros inarmónicos. El Talismán digital, no es una representación de la carta astral, por lo que tomamos en cuenta sólo los aspectos de conjunción, oposición y cuadratura  respecto de la Luna o el Sol, y que son los que consideramos que nos traen áreas de aprendizaje, ya que nos indican los problemas externos y los conflictos internos que debemos afrontar para ayudarnos en nuestra maduración como individuos.",
  },

  planets: {
    Sun: {
      title: "Sol",
      text: [
        "El Sol habla del núcleo real de la persona, el sí mismo interior, aquello que es de importancia central. También nos muestra la vitalidad general y la habilidad para auto afirmarse, describe la tonalidad general del ser que colorea todo lo demás.",
        "El Sol se relaciona con la fuerza vital básica, con las pruebas que debemos pasar en la búsqueda de nuestra identidad, la influencia de personas importantes y el vínculo con el padre.",
        "Es el regente de Leo.",
        "Según el aspecto y la función del planeta que tiene asociado, nos va a dificultar o facilitar tomar conciencia de nosotros mismos, reconocernos, aceptarnos, expresar nuestra individualidad y definir nuestra personalidad.",
      ],
    },

    Moon: {
      title: "Luna",
      text: [
        "La Luna representa nuestros sentimientos y emociones, la receptividad, la imaginación y la tonalidad básica de los sentimientos de la persona. También tiene un efecto sobre el sentido del ritmo, el tiempo y la oportunidad, influye sobre nuestra adaptabilidad al cambio, nuestra movilidad y versatilidad.",
        "La luna se relaciona con nuestra naturaleza afectiva, con la vida familiar, con el vínculo con la madre, con cómo reaccionamos de forma automática ante los estímulos, la relación de la mujer con su propio cuerpo y también los condicionamientos de nuestra niñez.",
        "Es el regente de Cáncer.",
      ],
    },
    Mercury: {
      title: "Mercurio",
      text: [
        "Representa el pensamiento racional y el sentido común. Simboliza la palabra hablada y escrita, la manera de poner orden, sopesar y evaluar, al proceso y a las habilidades de aprendizaje.",
        "Se relaciona con la forma en que nos comunicamos, la aceptación o rechazo de nuestras opiniones, el intercambio de información, las experiencias relacionadas con los viajes y el movimiento, las relaciones con parientes, vecinos y compañeros de trabajo.",
        "Es el regente de Géminis y Virgo.",
        "Según como esté aspectado, nos va a facilitar o dificultar el aprendizaje, la comunicación, el autoconocimiento, el llegar a acuerdos, establecer conexiones y relacionarnos con los demás.",
      ],
    },
    Venus: {
      title: "Venus",
      text: [
        "Representa el sentido de la belleza, el disfrute del placer, la conciencia estética, amor por la armonía, la sociabilidad, la obtención de placer en las relaciones y el erotismo.",
        "Se relaciona con las cualidades que valoramos, los gustos o placeres, con la energía femenina, con los talentos creativos, con la sensualidad, la dulzura, la amabilidad, la armonía, la sociabilidad y las relaciones afectivas.",
        "Es el regente de Libra y Tauro.",
        "Según como esté aspectado, nos va a facilitar o dificultar relacionarnos afectivamente, sentirnos tranquilos y cómodos, cooperar con los demás, dar y recibir afecto, sentir placer y manejarnos con el dinero y las posesiones materiales.",
      ],
    },
    Mars: {
      title: "Marte",
      text: [
        "Representa la energía y el instinto de una persona, su coraje, determinación, la libertad del impulso espontáneo. También describe la prontitud a la acción, la manera en que uno emprende las cosas así como la simple agresión.",
        "Se relaciona con la competencia en todas sus formas, con la acción, la energía masculina, con la fuerza, el valor, la ambición y con los conflictos que encontramos al afirmar nuestra autonomía e individualidad.",
        "Es el regente de Aries.",
        "Según como esté aspectado, nos va a facilitar o dificultar hacernos valor, defendernos, afirmar nuestra individualidad, luchar contra las presiones del mundo externo, competir con los demás, expresar la pasión y la cólera, aceptar desafíos y desplegar la actividad física.",
      ],
    },
    Jupiter: {
      title: "Jupiter",
      text: [
        "La búsqueda de propósito y significado individual, el optimismo, la esperanza y el sentido de justicia están representados por Júpiter. También la fe, la filosofía básica de la vida, el esfuerzo por crecer espiritualmente y la expansión.",
        "Se relaciona con la generosidad, la apertura mental, los estudios superiores, los viajes largos o al extranjero, con la naturaleza de las creencias y la forma en que las expresamos. Tiene que ver con la capacidad de mirar al mundo interconectado, con el optimismo, la aventura y la confianza en la vida.",
        "Es el regente de Sagitario.",
        "Según como esté aspectado, nos va a facilitar o dificultar expandirnos, percibir la totalidad del conjunto, sentir fe y confianza en la vida, movernos libremente, expresar nuestras propias creencias, respetar las creencias de los demás, relacionarse con personas de otros ambientes y culturas y encontrar el sentido de la vida.",
      ],
    },
    Saturn: {
      title: "Saturno",
      text: [
        "Saturno muestra cómo experimentamos 'la realidad', dónde encontramos resistencia y descubrimos nuestras limitaciones. Representa la convicción consciente y moral, las leyes y las reglas que elegimos obedecer: 'el deber ser'. También habla de nuestro poder para tolerar y la habilidad para concentrarnos, da cualidades como la honestidad, la cautela y la reserva.",
        "Se relaciona con la conciencia de los límites y de las restricciones, con el realismo y sentido práctico, con el miedo, el autocontrol y las barreras defensivas.",
        "Es el regente de Capricornio.",
        "Según como esté aspectado, nos va a facilitar o dificultar la disciplina, la organización, la concentración, el trabajo y el esfuerzo sostenido en el tiempo, atenernos a los hechos y ser objetivos, la aceptación de las responsabilidades y los deberes, la aceptación de las reglas y formalidades, y también la forma de relacionarnos con la autoridad.",
      ],
    },
    Uranus: {
      title: "Urano",
      text: [
        "Simboliza la intuición, transmite la inspiración repentina y la comprensión instantánea. La apertura por todo lo nuevo, desconocido e inusual.",
        "Se relaciona con la independencia, los cambios radicales y abruptos, con comportamientos extremistas, con la capacidad de aventura, la originalidad creativa y el contacto con lo sorpresivo.",
        "Es el regente de Acuario.",
        "Según como esté aspectado, nos va a facilitar o dificultar cambiar, romper con las tradiciones, rebelarse contra lo establecido, liberarnos de ataduras, conectarnos con lo nuevo, seguir nuestro propio camino, conectarnos con nuestra intuición y con la apertura mental.",
      ],
    },
    Neptune: {
      title: "Neptuno",
      text: [
        "Este planeta otorga lo suprasensorial, abre las puertas a la experiencia mística y a lo trascendental. En este nivel es difícil discernir dónde la percepción se confunde con la decepción, la ilusión y las falsas apariencias, y por lo tanto Neptuno está asociado con todo tipo de pseudo realidades.",
        "Se relaciona con la purificación, el refinamiento, la conexión con el amor incondicional, la compasión, el idealismo y los sacrificios.",
        "Es el regente de Piscis.",
        "Según como esté aspectado, nos va a facilitar o dificultar ilusionarnos y desilusionarnos, trascender límites, captar realidades sutiles, acceder a estados elevados de conciencia, idealizar a los demás, escapar de la realidad cotidiana, entregarnos a los demás y conectar con la sensibilidad.",
      ],
    },
    Pluto: {
      title: "Pluton",
      text: [
        "Describe cómo manejamos el poder, personal y no personal, ya sea sufriendo el poder de los demás o ejerciéndolo nosotros mismos, cómo vamos al encuentro de lo demoníaco y lo mágico, nuestro poder de regeneración y nuestra capacidad de cambio radical y de renacimiento: los ciclos de muerte y transformación.",
        "Se relaciona con la profundización, la intensidad, los tabúes, secretos y cosas ocultas, el contacto con el inconsciente y con sentimientos instintivos.",
        "Es el regente de Escorpio.",
        "Según como esté aspectado, nos va a facilitar o dificultar transformarnos y regenerarnos, eliminar lo superfluo, profundizar en nuestro inconsciente, expresar sentimientos de poder, liberarnos de bloqueos, atravesar periodos de crisis y generar cambios profundos.",
      ],
    },
  },

  aspectingPlanet:{
    Sun:{
      title:"Sol"
    },
    Moon:{
      title:"Luna"
    },
  },

  aspects: {
    Conjunction: {
      title: "Conjunción - 0°",
      text: [
        "Este aspecto indica esfuerzo unido o combinación de fuerzas, ya que los planetas actúan juntos aun cuando no sean armónicos entre sí. No hay escisión entre los planetas en conjunción, hay una concentración de energía que sale junta, y esto implica que la persona resalte las cualidades combinadas de ambos planetas, sin prestar demasiada atención al impacto que esto pueda tener en los demás.",
        "La persona tiene una enorme reserva de energía y actúa con mayor decisión en contra de los obstáculos, estimulando la competencia y la capacidad de aceptar desafíos.",
      ],
    },
    Opposition: {
      title: "Oposición - 180°",
      text: [
        "Este aspecto indica tensión, duda y vacilación. Genera una sensación de incomodidad e impulsa a la persona a la acción, pero después de cierta duda.",
        "La oposición generalmente lleva a identificarnos con un extremo y proyectar el otro en otra persona que consideramos nuestro enemigo o nuestro complemento, causando dificultades interpersonales. Pero esta tensión puede ser resuelta con amor y comprensión, cuando cada planeta es usado como complemento del otro, cuando se aprende a reconciliar estas energías, permitiendo mirar un mismo asunto desde diferentes ángulos y dar un juicio equilibrado.",
        "El proyectar las características en el otro, generalmente de manera negativa, nos brinda la posibilidad de visualizarlas y poder trascenderlas, trayendo en definitiva, resultados positivos.",
      ],
    },
    Square: {
      title: "Cuadratura - 90°",
      text: [
        "Este aspecto indica una tensión abierta y genera discordia, llegando a sentir que no hay tema compartido entre ambos planetas. Las energías son inicialmente impulsivas y sin coordinación, y si el aspecto está mal manejado podría llegar a ser destructivo, ya que nos confronta con problemas que tenemos que resolver. Pero si la energía es utilizada de manera constructiva, pone a nuestra disposición el poder y la voluntad para descartar lo viejo y construir lo nuevo, abriéndonos muchas posibilidades.",
        "La dificultad yace en tratar de reconciliar dos fuerzas que tratan de moverse en direcciones completamente diferentes, en deseos y necesidades que son mutuamente excluyentes. Es común solucionar nuestras dificultades internas proyectándolas en nuestro entorno con el resultado de que estas vuelvan a nosotros en forma de tareas.",
        "Es el aspecto que más lleva a superarnos, ya que se deben aprender lecciones, pero una vez que pasamos pruebas, perfeccionamos nuestro carácter y ganamos dominio sobre nuestro inconsciente.",
      ],
    },
  },
};

module.exports = { planetsAndAspectsInfo };
