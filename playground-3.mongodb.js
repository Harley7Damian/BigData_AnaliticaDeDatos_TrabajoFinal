// ======================================================================
// NOTEBOOK 2 – CATÁLOGO DE SERVICIOS FLEXIBLE
// Base: nuevosmedios_gold_layer
// Colección: Catalogo_Servicios_Flexible
// ======================================================================

// ---------------------------------------------------------------
// 1. Selección de Base de Datos
// ---------------------------------------------------------------
use('nuevosmedios_gold_layer');

// ---------------------------------------------------------------
// 2. Creación de Colección
// ---------------------------------------------------------------
db.createCollection("Catalogo_Servicios_Flexible");

print(">>> NOTEBOOK 2 INICIADO — Catalogo_Servicios_Flexible");

// ======================================================================
// I. SEED — Datos simulados
// ======================================================================

print(">>> Ejecutando SEED...");

db.Catalogo_Servicios_Flexible.insertMany([
    {
        idServicio: "SV-AUD-01",
        categoria: "Audio",
        nombre: "Sistema de Sonido Profesional",
        precioBase: 2500,
        atributosTecnicos: {
            potenciaWatts: 5000,
            requiereOperador: true,
            marca: "Yamaha",
            coberturaMaxPersonas: 300
        },
        disponibilidad: { stock: 5, tercerizado: false },
        estado: "Activo"
    },
    {
        idServicio: "SV-LUZ-01",
        categoria: "Iluminación",
        nombre: "Pack de Iluminación Escénica",
        precioBase: 3200,
        atributosTecnicos: {
            tipoLuces: ["LED", "PAR64"],
            consumoEnergiaKw: 3.2,
            requiereRigging: true
        },
        disponibilidad: { stock: 3, tercerizado: false },
        estado: "Activo"
    },
    {
        idServicio: "SV-CAT-01",
        categoria: "Catering",
        nombre: "Coffee Break Ejecutivo",
        precioBase: 1500,
        atributosTecnicos: {
            opcionesMenu: ["vegano", "clásico", "light"],
            requiereHigieneCertificada: true
        },
        disponibilidad: { stock: "Tercerizado", tercerizado: true },
        estado: "Activo"
    },
    {
        idServicio: "SV-MOV-01",
        categoria: "Movilidad",
        nombre: "Transporte Staff",
        precioBase: 900,
        atributosTecnicos: {
            tipoVehiculo: "Van",
            capacidad: 12,
            kilometrajeIncluido: 40
        },
        disponibilidad: { stock: "Tercerizado", tercerizado: true },
        estado: "Activo"
    },
    {
        idServicio: "SV-DEC-01",
        categoria: "Decoración",
        nombre: "Escenografía Corporativa Personalizada",
        precioBase: 4200,
        atributosTecnicos: {
            materiales: ["PVC", "Vinilo", "Aluminio"],
            requiereInstalacion: true,
            brandingPersonalizado: true
        },
        disponibilidad: { stock: 2, tercerizado: false },
        estado: "Activo"
    }
]);

print("✓ SEED completado correctamente.");

// Mostrar ejemplo de documento
print("\n>>> Documento ejemplo:");
printjson(db.Catalogo_Servicios_Flexible.findOne());

// ======================================================================
// II. ÍNDICES
// ======================================================================

print("\n>>> Creando índices...");

// Índice por categoría
db.Catalogo_Servicios_Flexible.createIndex({ categoria: 1 }, { name: "idx_categoria" });
print("✓ Índice por categoría creado.");

// Índice compuesto por nombre (texto) + estado
db.Catalogo_Servicios_Flexible.createIndex({ nombre: "text", estado: 1 }, { name: "idx_nombre_text_estado" });
print("✓ Índice compuesto nombre + estado creado.");

// Mostrar índices
print("\n>>> Índices actuales:");
printjson(db.Catalogo_Servicios_Flexible.getIndexes());

// ======================================================================
// III. CRUD
// ======================================================================

print("\n>>> CRUD — Operaciones básicas");

// CREATE
db.Catalogo_Servicios_Flexible.insertOne({
    idServicio: "SV-BRD-01",
    categoria: "Branding",
    nombre: "Producción de Backing Photocall",
    precioBase: 1800,
    atributosTecnicos: {
        tamañoMax: "6x3m",
        material: "Tela Tensionada",
        requiereEstructura: true
    },
    disponibilidad: { stock: "Tercerizado", tercerizado: true },
    estado: "Activo"
});
print("✓ CREATE ejecutado.");

// READ
print("\n>>> READ — Servicios de Audio:");
printjson(
    db.Catalogo_Servicios_Flexible.find({ categoria: "Audio" }).toArray()
);

// UPDATE
db.Catalogo_Servicios_Flexible.updateOne(
    { idServicio: "SV-AUD-01" },
    { $set: { precioBase: 2700 } }
);
print("✓ UPDATE ejecutado.");

// DELETE
const delServ = db.Catalogo_Servicios_Flexible.deleteOne({ idServicio: "SV-LUZ-01" });
print("✓ DELETE ejecutado. Eliminado: " + delServ.deletedCount);

// ======================================================================
// IV. CONSULTAS AVANZADAS
// ======================================================================

print("\n>>> Consultas avanzadas");

// Servicios que requieren operador o instalación
print("\n>>> Servicios que requieren operador o instalación:");
printjson(
    db.Catalogo_Servicios_Flexible.find({
        $or: [
            { "atributosTecnicos.requiereOperador": true },
            { "atributosTecnicos.requiereInstalacion": true }
        ]
    }).toArray()
);

// Catering con opciones veganas
print("\n>>> Servicios con opciones veganas:");
printjson(
    db.Catalogo_Servicios_Flexible.find({
        "atributosTecnicos.opcionesMenu": "vegano"
    }).toArray()
);

// ======================================================================
// V. AGREGACIONES — KPIs
// ======================================================================

// Precio promedio por categoría
print("\n>>> KPI — Precio promedio por categoría:");
printjson(
    db.Catalogo_Servicios_Flexible.aggregate([
        { $group: { _id: "$categoria", precioPromedio: { $avg: "$precioBase" }, cantidadServicios: { $sum: 1 } } },
        { $sort: { precioPromedio: -1 } }
    ]).toArray()
);

// Conteo por disponibilidad (tercerizado vs propio)
print("\n>>> KPI — Conteo por disponibilidad:");
printjson(
    db.Catalogo_Servicios_Flexible.aggregate([
        { $group: { _id: "$disponibilidad.tercerizado", cantidad: { $sum: 1 } } }
    ]).toArray()
);

// ===================== FIN NOTEBOOK 2 ==========================
