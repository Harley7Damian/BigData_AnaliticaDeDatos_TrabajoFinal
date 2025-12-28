/* 0. Introducción
    Este notebook implementa la colección **Rentabilidad_Eventos_Gold**, una pieza crítica del *Gold Layer* para la empresa Nuevos Medios.  
    Su objetivo es almacenar datos **financieros y operativos** de cada evento, permitiendo:

    - el cálculo inmediato de indicadores como *LiquidadTotal*, *Margen* y *TotalVenta*,  
    - análisis por ejecutivo, cliente, rubro y tipo de evento,  
    - evaluaciones de sobrecostos, rentabilidad neta y eficiencia operativa.

    Esta colección utiliza un **modelo denormalizado**, embebiendo Cliente, Ejecutivo y Órdenes de Compra para acelerar las consultas analíticas.

    El notebook incluye:

    1. Creación y seed de la colección  
    2. Operaciones CRUD  
    3. Consultas avanzadas  
    4. Índices críticos  
    5. Agregaciones analíticas  
*/

// ============================================================
// NOTEBOOK 1: Rentabilidad_Eventos_Gold
// Capa: GOLD LAYER (Finanzas + Operaciones)
// ============================================================

// Seleccionar la base de datos
use('nuevosmedios_gold_layer');

// Limpiar colección antes del seed
db.Rentabilidad_Eventos_Gold.drop();

print(">>> Iniciando SEED de la colección Rentabilidad_Eventos_Gold ...");

// ============================================================
// SEED — Datos simulados con estructura realista
// ============================================================

db.Rentabilidad_Eventos_Gold.insertMany([
    {
        IdPresupuesto: 20240101,
        FechaCierre: new Date("2024-03-15"),
        TipoEvento: "Conferencia",
        TotalVenta: 90000,
        TotalCalculado: 72000,
        LiquidadoTotal: 18000,  // KPI principal
        MontoPagadoCliente: 90000,
        EstadoProyecto: "Cerrado",
        Cliente: { IdCliente: 150, RazonSocial: "Digital Minds", Rubro: "Tecnología" },
        Ejecutivo: { IdEmpleado: "E01", Nombre: "Ana García", Antiguedad: 6 },
        OrdenesDeCompra: [
            { IdOrden: "OC01", Proveedor: "AudioPro", Monto: 25000, Pagado: true },
            { IdOrden: "OC02", Proveedor: "CateringPlus", Monto: 22000, Pagado: true }
        ]
    },
    {
        IdPresupuesto: 20240102,
        FechaCierre: new Date("2024-04-02"),
        TipoEvento: "Lanzamiento",
        TotalVenta: 110000,
        TotalCalculado: 130000,
        LiquidadoTotal: -20000, // evento con pérdida (caso crítico)
        MontoPagadoCliente: 95000,
        EstadoProyecto: "Cerrado",
        Cliente: { IdCliente: 151, RazonSocial: "GlobalFin", Rubro: "Finanzas" },
        Ejecutivo: { IdEmpleado: "E02", Nombre: "Luis Pérez", Antiguedad: 3 },
        OrdenesDeCompra: [
            { IdOrden: "OC10", Proveedor: "ProLights", Monto: 60000, Pagado: true },
            { IdOrden: "OC11", Proveedor: "EventosVIP", Monto: 40000, Pagado: false }
        ]
    },
    {
        IdPresupuesto: 20240103,
        FechaCierre: new Date("2024-05-10"),
        TipoEvento: "Taller",
        TotalVenta: 35000,
        TotalCalculado: 28000,
        LiquidadoTotal: 7000,
        MontoPagadoCliente: 35000,
        EstadoProyecto: "En Curso",
        Cliente: { IdCliente: 152, RazonSocial: "MKTNow", Rubro: "Marketing" },
        Ejecutivo: { IdEmpleado: "E03", Nombre: "Carla Soto", Antiguedad: 4 },
        OrdenesDeCompra: []
    }
]);

print(">>> SEED completado satisfactoriamente.");


// ============================================================
// II. INDICES PARA OPTIMIZACIÓN
// ============================================================

print("\n>>> Creando índices críticos...");

// Índice compuesto: Ejecutivo + FechaCierre (búsqueda por ejecutivo y orden temporal)
db.Rentabilidad_Eventos_Gold.createIndex({ "Ejecutivo.IdEmpleado": 1, FechaCierre: -1 });
print("✓ Índice compuesto creado (Ejecutivo.IdEmpleado + FechaCierre desc).");

// Índice por IdPresupuesto (unico para búsqueda y garantía de unicidad en entorno controlado)
db.Rentabilidad_Eventos_Gold.createIndex({ IdPresupuesto: 1 }, { unique: true });
print("✓ Índice único creado (IdPresupuesto).");

// Índice por TipoEvento y EstadoProyecto (filtros frecuentes)
db.Rentabilidad_Eventos_Gold.createIndex({ TipoEvento: 1, EstadoProyecto: 1 });
print("✓ Índice TipoEvento + EstadoProyecto creado.");

// ============================================================
// III. CRUD — Operaciones esenciales
// ============================================================

print("\n>>> CRUD — Operaciones esenciales");

// CREATE: insertar un evento adicional (ejemplo)
db.Rentabilidad_Eventos_Gold.insertOne({
    IdPresupuesto: 20240104,
    FechaCierre: new Date("2024-06-01"),
    TipoEvento: "Cena Corporativa",
    TotalVenta: 60000,
    TotalCalculado: 45000,
    LiquidadoTotal: 15000,
    MontoPagadoCliente: 60000,
    EstadoProyecto: "Cerrado",
    Cliente: { IdCliente: 153, RazonSocial: "HealthCorp", Rubro: "Salud" },
    Ejecutivo: { IdEmpleado: "E02", Nombre: "Luis Pérez", Antiguedad: 3 },
    OrdenesDeCompra: [{ IdOrden: "OC50", Proveedor: "CateringPlus", Monto: 20000, Pagado: true }]
});
print("✓ Evento 20240104 insertado.");

// READ: buscar eventos "Tecnología" con margen negativo
print("\n>>> READ: Eventos de Tecnología con pérdida:");
printjson(
    db.Rentabilidad_Eventos_Gold.find(
        { "Cliente.Rubro": "Tecnología", LiquidadoTotal: { $lt: 0 } },
        { IdPresupuesto: 1, LiquidadoTotal: 1, TipoEvento: 1, _id: 0 }
    ).toArray()
);

// UPDATE: agregar nueva orden de compra al evento 20240103
print("\n>>> UPDATE: Agregar OC99 al evento 20240103");
db.Rentabilidad_Eventos_Gold.updateOne(
    { IdPresupuesto: 20240103 },
    { $push: { OrdenesDeCompra: { IdOrden: "OC99", Proveedor: "LogisticaExpress", Monto: 5000, Pagado: true } } }
);
print("✓ Orden de compra agregada.");

// DELETE: eliminar eventos con pérdida severa (ejemplo de política)
print("\n>>> DELETE: Eliminando eventos con pérdida severa (LiquidadoTotal <= -30000)");
const delRes = db.Rentabilidad_Eventos_Gold.deleteMany({ LiquidadoTotal: { $lte: -30000 } });
print("Documentos eliminados: " + delRes.deletedCount);


// ============================================================
// IV. CONSULTAS AVANZADAS
// ============================================================

// 1) Últimos eventos cerrados por un ejecutivo (ej. E02)
print("\n>>> Consulta avanzada 1: Últimos eventos cerrados de Luis Pérez (E02):");
printjson(
    db.Rentabilidad_Eventos_Gold.find(
        { "Ejecutivo.IdEmpleado": "E02", EstadoProyecto: "Cerrado" }
    ).sort({ FechaCierre: -1 }).limit(5).toArray()
);

// 2) Eventos con sobrecostos (TotalCalculado > TotalVenta)
print("\n>>> Consulta avanzada 2: Eventos con sobrecosto (TotalCalculado > TotalVenta):");
printjson(
    db.Rentabilidad_Eventos_Gold.find(
        { $expr: { $gt: ["$TotalCalculado", "$TotalVenta"] } },
        { IdPresupuesto: 1, TotalVenta: 1, TotalCalculado: 1, _id: 0 }
    ).toArray()
);

// 3) Eventos sin órdenes de compra (potencial riesgo operativo)
print("\n>>> Consulta avanzada 3: Eventos sin OC registradas:");
printjson(
    db.Rentabilidad_Eventos_Gold.find(
        { OrdenesDeCompra: { $size: 0 } },
        { IdPresupuesto: 1, TipoEvento: 1, EstadoProyecto: 1, _id: 0 }
    ).toArray()
);

// ============================================================
// V. AGREGACIONES — KPIs
// ============================================================

// 1) Margen promedio por ejecutivo (solo proyectos cerrados)
print("\n>>> Agregación 1: Margen promedio por ejecutivo (proyectos cerrados):");
printjson(
    db.Rentabilidad_Eventos_Gold.aggregate([
        { $match: { EstadoProyecto: "Cerrado" } },
        { $group: {
            _id: "$Ejecutivo.Nombre",
            MargenPromedio: { $avg: "$LiquidadoTotal" },
            TotalVentaAcumulada: { $sum: "$TotalVenta" },
            EventosCerrados: { $sum: 1 }
        }},
        { $sort: { MargenPromedio: -1 } }
    ]).toArray()
);

// 2) Rentabilidad total por rubro de cliente
print("\n>>> Agregación 2: Rentabilidad total por rubro del cliente:");
printjson(
    db.Rentabilidad_Eventos_Gold.aggregate([
        { $group: {
            _id: "$Cliente.Rubro",
            RentabilidadTotal: { $sum: "$LiquidadoTotal" },
            Eventos: { $sum: 1 }
        }},
        { $sort: { RentabilidadTotal: -1 } }
    ]).toArray()
);

// 3) Ranking de tipos de eventos por margen total
print("\n>>> Agregación 3: Tipos de eventos por margen total:");
printjson(
    db.Rentabilidad_Eventos_Gold.aggregate([
        { $group: {
            _id: "$TipoEvento",
            MargenTotal: { $sum: "$LiquidadoTotal" },
            MargenPromedio: { $avg: "$LiquidadoTotal" },
            CantidadEventos: { $sum: 1 }
        }},
        { $sort: { MargenTotal: -1 } }
    ]).toArray()
);