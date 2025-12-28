# Modelado y consultas NoSQL en MongoDB
Esta rama documenta la implementación de MongoDB como capa analítica complementaria (Gold Layer) del proyecto, orientada al manejo eficiente de datos semiestructurados, heterogéneos y derivados. Se incluye el diseño del modelo documental, la definición de colecciones y la ejecución de operaciones y consultas analíticas utilizando el motor de agregación de MongoDB.

MongoDB fue seleccionado por su esquema flexible y orientación a documentos BSON, lo que permitió modelar información con arrays, subdocumentos y campos opcionales, tales como feedback de clientes (Voice of the Customer), catálogos de servicios con atributos variables y métricas consolidadas por evento. Esta estrategia facilitó la obtención rápida de KPIs, evitando múltiples joins y habilitando consultas eficientes sobre estructuras complejas.

Los notebooks y scripts de esta rama muestran consultas orientadas a:
- Cálculo de rentabilidad neta por evento mediante desnormalización controlada.
- Análisis de metadatos y texto, incluyendo búsquedas e índices textuales.
- Exploración de información operacional y financiera en tiempo casi real.

Esta capa NoSQL no reemplaza al Data Warehouse implementado en Databricks, sino que lo complementa como una capa de consumo optimizada, adecuada para análisis exploratorio, prototipos analíticos y escenarios donde la velocidad y flexibilidad del modelo son críticas.
