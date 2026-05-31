-- ═══════════════════════════════════════
-- ALPHA-HELP: SEMILLADO DE CUESTIONARIOS
-- ═══════════════════════════════════════

-- 1. Insertar Cuestionarios
INSERT INTO questionnaires (id, title, description, is_active)
VALUES 
('a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Inicial (PRE)', 'Cuestionario inicial de recogida de datos sociodemográficos y evaluación inicial del participante.', true),
('f47ac10b-eb71-4a57-8fb2-c51121d51a66', 'Final (POST)', 'Cuestionario final de evaluación de resultados tras completar las sesiones.', true)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, is_active = EXCLUDED.is_active;

-- 2. Insertar Preguntas del Cuestionario Inicial
INSERT INTO questionnaire_questions (id, questionnaire_id, question, sort_order)
VALUES
-- SECCIÓN 1: DATOS SOCIODEMOGRÁFICOS (sort_order 1 a 15)
('b0100001-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Centro escolar', 1),
('b0100002-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Sexo', 2),
('b0100003-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Edad', 3),
('b0100004-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Estudios', 4),
('b0100005-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Situación laboral', 5),
('b0100006-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Estado civil', 6),
('b0100007-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Nivel socioeconómico', 7),
('b0100008-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tipo de centro', 8),
('b0100009-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Número de hijos', 9),
('b0100010-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Hijo 1 (Datos)', 10),
('b0100011-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Hijo 2 (Datos)', 11),
('b0100012-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Hijo 3 (Datos)', 12),
('b0100013-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Hijo 4 (Datos)', 13),
('b0100014-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Hijo 5 (Datos)', 14),
('b0100015-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tipo estructura familiar', 15),

-- SECCIÓN 2: CAPSM-IJ (sort_order 16 a 29)
('b0200016-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Si un menor tiene mucho miedo o ansiedad en determinadas situaciones, podría superarlo si realmente quisiera.', 16),
('b0200017-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Buscar ayuda psicológica profesional para un menor significa que su familia no es lo suficientemente fuerte para manejar sus propias dificultades.', 17),
('b0200018-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Evitaría que mi hijo se relacionase demasiado con otros niños con dificultades psicológicas por miedo a que no desarrolle ese mismo problema.', 18),
('b0200019-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Un menor con problemas de salud mental nunca vuelve a estar del todo bien.', 19),
('b0200020-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Los trastornos de salud mental o psicológicos pueden aparecer en cualquier menor.', 20),
('b0200021-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Si un menor tiene problemas de salud mental, pensaría que hay algo mal en sus padres.', 21),
('b0200022-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Buscar ayuda profesional para un problema psicológico o de salud mental podría perjudicar el futuro de mi hijo/a.', 22),
('b0200023-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Sé dónde buscar información fiable sobre salud mental en menores.', 23),
('b0200024-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me preocuparía que otras personas de mi entorno pudieran pensar mal si mi hijo/a tuviera un problema de salud mental.', 24),
('b0200025-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me preocuparía que otras personas de mi entorno me juzgaran si mi hijo/a tuviera un problema de salud mental.', 25),
('b0200026-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me sentiría avergonzado/a de tener un hijo/a con problemas de salud mental.', 26),
('b0200027-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Los signos de depresión en menores son muy similares a los de los adultos.', 27),
('b0200028-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Las dificultades emocionales de los menores es mejor dejarlas pasar para que se resuelvan solas con el tiempo.', 28),
('b0200029-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Los menores rara vez presentan trastornos mentales diagnosticables salvo que hayan sido hereditarios.', 29),

-- SECCIÓN 3: RECONOCIMIENTO PROBLEMAS SALUD MENTAL (sort_order 30 a 32)
('b0300030-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Un menor se siente muy asustado/a en situaciones como hablar delante de la clase o acudir a fiestas.', 30),
('b0300031-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Un menor que tiene dificultades para concentrarse, se distrae fácilmente, actúa impulsivamente y le cuesta permanecer quieto/a.', 31),
('b0300032-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Un menor que pasa mucho tiempo sintiéndose mal consigo mismo/a y ha perdido el interés por actividades que antes disfrutaba.', 32),

-- SECCIÓN 4: BÚSQUEDA DE AYUDA (sort_order 33 a 38)
('b0400033-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Profesionales sanitarios', 33),
('b0400034-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Profesionales salud mental', 34),
('b0400035-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Personal centro educativo', 35),
('b0400036-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Amigos, familiares y redes de apoyo', 36),
('b0400037-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Qué probabilidad hay de que busques apoyo psicológico si notas un malestar emocional persistente en tu hijo/a?', 37),
('b0400038-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Qué confianza tienes en la efectividad general de las terapias psicológicas?', 38),

-- SECCIÓN 5: PSOC (sort_order 39 a 54)
('b0500039-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Los problemas de comportamiento y desarrollo de mi hijo/a me resultan sumamente difíciles de manejar.', 39),
('b0500040-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me considero un/a progenitor/a con habilidades y recursos suficientes.', 40),
('b0500041-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Es difícil saber si estoy haciendo lo correcto en la crianza de mi hijo/a.', 41),
('b0500042-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Disfruto enormemente de las tareas y responsabilidades de ser padre/madre.', 42),
('b0500043-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'A veces siento que no tengo el control sobre lo que mi hijo/a hace o decide.', 43),
('b0500044-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tengo una idea muy clara de cómo reaccionar ante los problemas de mi hijo/a.', 44),
('b0500045-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Mi experiencia como padre/madre es muy gratificante.', 45),
('b0500046-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'A menudo dudo de mi propia eficacia como educador/a en el hogar.', 46),
('b0500047-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Logro manejar con calma las situaciones de desobediencia o conflicto.', 47),
('b0500048-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Mis valores familiares guían adecuadamente mis decisiones de crianza.', 48),
('b0500049-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me frustra cuando mi hijo/a no sigue mis pautas de comportamiento.', 49),
('b0500050-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Considero que tengo buena comunicación y cercanía con mi hijo/a.', 50),
('b0500051-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'A veces siento que las exigencias de la paternidad/maternidad me superan.', 51),
('b0500052-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tengo confianza en que puedo guiar a mi hijo/a ante retos de su desarrollo.', 52),
('b0500053-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Siento satisfacción al ver crecer y desarrollarse a mi hijo/a.', 53),
('b0500054-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Puedo equilibrar de manera sana mis responsabilidades y mis metas familiares.', 54),

-- SECCIÓN 6: ECPP-p (sort_order 55 a 71)
('b0600055-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Escucho activamente y con atención a mi hijo/a cuando comparte algo conmigo.', 55),
('b0600056-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Establezco límites claros y comprensibles en el hogar.', 56),
('b0600057-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Utilizo el diálogo y la negociación en lugar del castigo estricto.', 57),
('b0600058-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Apoyo activamente las metas de estudio o actividades de mi hijo/a.', 58),
('b0600059-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Mantengo el control de mis emociones ante momentos de rabieta o enfado de mi hijo/a.', 59),
('b0600060-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Ofrezco muestras afectivas físicas o verbales (ej. abrazos, elogios) frecuentemente.', 60),
('b0600061-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Sé cómo resolver de manera no violenta las diferencias dentro del hogar.', 61),
('b0600062-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Superviso el uso de tecnologías y redes sociales de manera constante.', 62),
('b0600063-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Dedico tiempo diario exclusivo a interactuar o jugar con mi hijo/a.', 63),
('b0600064-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Fomento la autonomía y toma de decisiones apropiadas para su edad.', 64),
('b0600065-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Felicito a mi hijo/a por sus esfuerzos, no solo por sus logros finales.', 65),
('b0600066-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tengo una red de familiares o amigos en quien apoyarme para la crianza.', 66),
('b0600067-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Explico las consecuencias reales y lógicas de los actos de mi hijo/a.', 67),
('b0600068-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Dedico tiempo a cuidar de mi propio bienestar y salud mental.', 68),
('b0600069-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Establecemos rutinas diarias consistentes (ej. horarios de sueño, comidas).', 69),
('b0600070-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Mantengo informada a la escuela o tutores ante eventos significativos en casa.', 70),
('b0600071-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Fomento hábitos saludables (ej. alimentación, ejercicio) de forma activa.', 71),

-- SECCIÓN 7: PSS (sort_order 72 a 88)
('b0700072-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tengo sentimientos de agrado y felicidad en mi papel como padre/madre.', 72),
('b0700073-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Siento que hay pocas cosas en mi vida que son más importantes que mi(s) hijo(s).', 73),
('b0700074-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Con el nacimiento de mi(s) hijo(s) he tenido que renunciar a demasiadas cosas.', 74),
('b0700075-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me siento abrumado/a por la responsabilidad de ser padre/madre.', 75),
('b0700076-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'El tiempo dedicado a mi(s) hijo(s) es una carga y una molestia para mí.', 76),
('b0700077-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Encuentro agrado en mi(s) hijo(s).', 77),
('b0700078-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Mi(s) hijo(s) es/son una fuente importante de afecto para mí.', 78),
('b0700079-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Tener hijo(s) ha limitado mi vida de una manera que me molesta.', 79),
('b0700080-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me siento seguro/a y capacitado/a en mis decisiones como padre/madre.', 80),
('b0700081-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'La mayor parte de mi tiempo la dedico a cubrir las necesidades de mi(s) hijo(s).', 81),
('b0700082-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Siento que mi(s) hijo(s) es/son una carga financiera.', 82),
('b0700083-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Es difícil compaginar el trabajo/estudios con el cuidado de mi(s) hijo(s).', 83),
('b0700084-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Me siento feliz en mi papel como padre/madre la mayor parte del tiempo.', 84),
('b0700085-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Siento que mi(s) hijo(s) es/son una fuente de estrés constante en mi vida.', 85),
('b0700086-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'A veces me preocupa si estoy haciendo un buen trabajo como padre/madre.', 86),
('b0700087-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Disfruto de la compañía de mi(s) hijo(s).', 87),
('b0700088-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', 'Siento que mi(s) hijo(s) me exige(n) más de lo que puedo dar.', 88),

-- SECCIÓN 8: KIDSCREEN-27 (sort_order 89 a 103)
('b0800089-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Tu hijo/a se ha sentido bien y con energía física?', 89),
('b0800090-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha tenido tiempo suficiente para jugar o realizar actividades al aire libre?', 90),
('b0800091-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Se ha sentido triste o deprimido/a últimamente?', 91),
('b0800092-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha mostrado irritabilidad o mal genio de forma inusual?', 92),
('b0800093-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha tenido suficiente tiempo para compartir con sus amigos/as?', 93),
('b0800094-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Se ha sentido a gusto con sus compañeros/as de clase?', 94),
('b0800095-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha mostrado interés por las actividades escolares y tareas del colegio?', 95),
('b0800096-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha dormido bien y se despierta con sensación de descanso?', 96),
('b0800097-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Se queja de dolores físicos recurrentes (como dolor de cabeza o estómago)?', 97),
('b0800098-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha tenido suficiente autonomía para elegir su ropa o sus actividades en su tiempo libre?', 98),
('b0800099-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Disfruta de la convivencia familiar en los momentos comunes?', 99),
('b0800100-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha tenido la oportunidad de hacer planes divertidos con su familia?', 100),
('b0800101-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Siente que tiene suficiente apoyo por parte de los profesores?', 101),
('b0800102-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Tiene confianza para hablar de temas delicados con nosotros en casa?', 102),
('b0800103-eb71-4a57-8fb2-c51121d51a66', 'a83856b3-eb71-4a57-8fb2-c51121d51a66', '¿Ha tenido recursos materiales suficientes para sus necesidades escolares?', 103)
ON CONFLICT (id) DO NOTHING;
