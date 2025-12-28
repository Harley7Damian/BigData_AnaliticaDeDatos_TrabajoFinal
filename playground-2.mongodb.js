// ===============================================================
// NOTEBOOK 3 — Feedback_Cliente_Sentimiento
// Plataforma: MongoDB Playground
// Proyecto: Nuevos Medios (Gestión de Eventos Corporativos)
// ===============================================================

// ---------------------------------------------------------------
// 1. Selección de Base de Datos
// ---------------------------------------------------------------
use('nuevosmedios_gold_layer');

// ---------------------------------------------------------------
// 2. Creación de Colección
// ---------------------------------------------------------------
db.createCollection("Feedback_Cliente_Sentimiento");

print(">>> NOTEBOOK 2 INICIADO — Feedback_Cliente_Sentimiento");

// ======================================================================
// I. SEED — Datos simulados fusionados
// ======================================================================

print(">>> Ejecutando SEED...");

// SEED unificado (tu data + la mía, consistente y profesional)
db.Feedback_Cliente_Sentimiento.insertMany([
    // -------------------------------
    // EVENTO 101 — Telefónica
    // -------------------------------
    {
        IdFeedback: 6001,
        IdPresupuesto: 101,
        Fecha: ISODate("2024-03-21T10:30:00Z"),
        Comentario: "El evento estuvo excelente, muy buena organización y puntualidad.",
        PuntuacionNPS: 9,
        Canal: "Encuesta Online",
        Sentimiento: "Positivo",
        PalabrasClave: ["positivo", "organización", "satisfacción"],
        Cliente: { IdCliente: 201, RazonSocial: "Telefónica" },
        EjecutivoAsignado: "EJ-004"
    },
    {
        IdFeedback: 6002,
        IdPresupuesto: 101,
        Fecha: ISODate("2024-03-22T12:10:00Z"),
        Comentario: "Hubo problemas con el sonido durante la exposición principal.",
        PuntuacionNPS: 5,
        Canal: "Correo",
        Sentimiento: "Negativo",
        PalabrasClave: ["negativo", "sonido", "logística"],
        Cliente: { IdCliente: 201, RazonSocial: "Telefónica" },
        EjecutivoAsignado: "EJ-004"
    },

    // -------------------------------
    // EVENTO 103 — BBVA
    // -------------------------------
    {
        IdFeedback: 6003,
        IdPresupuesto: 103,
        Fecha: ISODate("2024-04-02T09:05:00Z"),
        Comentario: "Muy buena atención del personal. Todo llegó a tiempo.",
        PuntuacionNPS: 8,
        Canal: "Encuesta Online",
        Sentimiento: "Positivo",
        PalabrasClave: ["positivo", "atención", "puntualidad"],
        Cliente: { IdCliente: 202, RazonSocial: "BBVA" },
        EjecutivoAsignado: "EJ-002"
    },
    {
        IdFeedback: 6004,
        IdPresupuesto: 103,
        Fecha: ISODate("2024-04-02T11:00:00Z"),
        Comentario: "El catering fue insuficiente para el número de asistentes.",
        PuntuacionNPS: 4,
        Canal: "WhatsApp",
        Sentimiento: "Negativo",
        PalabrasClave: ["negativo", "catering"],
        Cliente: { IdCliente: 202, RazonSocial: "BBVA" },
        EjecutivoAsignado: "EJ-002"
    },

    // -------------------------------
    // EVENTO 110 — Alicorp
    // -------------------------------
    {
        IdFeedback: 6005,
        IdPresupuesto: 110,
        Fecha: ISODate("2024-05-10T14:15:00Z"),
        Comentario: "Excelente presentación visual y manejo del tiempo.",
        PuntuacionNPS: 10,
        Canal: "Encuesta Online",
        Sentimiento: "Positivo",
        PalabrasClave: ["positivo", "presentación", "eficiencia"],
        Cliente: { IdCliente: 203, RazonSocial: "Alicorp" },
        EjecutivoAsignado: "EJ-006"
    }
]);

print("✓ SEED completado correctamente.");

// ======================================================================
// II. ÍNDICES
// ======================================================================

print("\n>>> Creando índices...");

// Índice de texto (comentarios + palabras clave)
db.Feedback_Cliente_Sentimiento.createIndex({
    Comentario: "text",
    PalabrasClave: "text"
});
print("✓ Índice de texto creado.");

// Índice por evento
db.Feedback_Cliente_Sentimiento.createIndex({
    IdPresupuesto: 1,
    Fecha: -1
});
print("✓ Índice compuesto IdPresupuesto + Fecha creado.");

// Índice por sentimiento
db.Feedback_Cliente_Sentimiento.createIndex({
    Sentimiento: 1
});
print("✓ Índice de sentimiento creado.");

// ======================================================================
// III. CRUD
// ======================================================================

print("\n>>> CRUD — Operaciones básicas");

// CREATE
db.Feedback_Cliente_Sentimiento.insertOne({
    IdFeedback: 6006,
    IdPresupuesto: 110,
    Fecha: ISODate("2024-05-12T15:00:00Z"),
    Comentario: "La logística fue impecable y el equipo resolvió todo rápido.",
    PuntuacionNPS: 9,
    Canal: "Email",
    Sentimiento: "Positivo",
    PalabrasClave: ["logística", "rápido"],
    Cliente: { IdCliente: 203, RazonSocial: "Alicorp" },
    EjecutivoAsignado: "EJ-006"
});
print("✓ CREATE ejecutado.");

// READ
print("\n>>> READ: Buscar comentarios que mencionen 'sonido'");
printjson(
    db.Feedback_Cliente_Sentimiento.find(
        { $text: { $search: "sonido" } },
        { Comentario: 1, Sentimiento: 1, _id: 0 }
    ).toArray()
);

// UPDATE
db.Feedback_Cliente_Sentimiento.updateOne(
    { IdFeedback: 6004 },
    { $set: { Sentimiento: "Negativo-Crítico" } }
);
print("✓ UPDATE ejecutado.");

// DELETE
const delFeed = db.Feedback_Cliente_Sentimiento.deleteMany({
    PuntuacionNPS: { $lte: 3 }
});
print("✓ DELETE ejecutado. Eliminados: " + delFeed.deletedCount);

// ======================================================================
// IV. CONSULTAS AVANZADAS
// ======================================================================

// 1) Comentarios negativos
print("\n>>> Consulta 1 — Comentarios negativos:");
printjson(
    db.Feedback_Cliente_Sentimiento.find(
        { Sentimiento: { $regex: "Negativo" } },
        { Comentario: 1, PuntuacionNPS: 1, _id: 0 }
    ).toArray()
);

// 2) Comentarios donde se menciona 'catering'
print("\n>>> Consulta 2 — Menciones a 'catering':");
printjson(
    db.Feedback_Cliente_Sentimiento.find(
        { PalabrasClave: "catering" },
        { Comentario: 1, _id: 0 }
    ).toArray()
);

// 3) Feedback por cliente (BBVA)
print("\n>>> Consulta 3 — Feedback de BBVA:");
printjson(
    db.Feedback_Cliente_Sentimiento.find(
        { "Cliente.RazonSocial": "BBVA" }
    ).toArray()
);

// ======================================================================
// V. AGREGACIONES — KPIs
// ======================================================================

// 1) NPS promedio por cliente
print("\n>>> KPI 1 — NPS promedio por cliente:");
printjson(
    db.Feedback_Cliente_Sentimiento.aggregate([
        { $group: {
            _id: "$Cliente.RazonSocial",
            NPS_Promedio: { $avg: "$PuntuacionNPS" },
            TotalFeedback: { $sum: 1 }
        }},
        { $sort: { NPS_Promedio: -1 } }
    ]).toArray()
);

// 2) Eventos con más comentarios negativos
print("\n>>> KPI 2 — Eventos con mayor feedback negativo:");
printjson(
    db.Feedback_Cliente_Sentimiento.aggregate([
        { $match: { Sentimiento: { $regex: "Negativo" }}},
        { $group: {
            _id: "$IdPresupuesto",
            ComentariosNegativos: { $sum: 1 }
        }},
        { $sort: { ComentariosNegativos: -1 } }
    ]).toArray()
);

// 3) Palabras clave más frecuentes
print("\n>>> KPI 3 — Frecuencia de palabras clave:");
printjson(
    db.Feedback_Cliente_Sentimiento.aggregate([
        { $unwind: "$PalabrasClave" },
        { $group: {
            _id: "$PalabrasClave",
            Frecuencia: { $sum: 1 }
        }},
        { $sort: { Frecuencia: -1 } }
    ]).toArray()
);

// ===================== FIN NOTEBOOK 2 ==========================
