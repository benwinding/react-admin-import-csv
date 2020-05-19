export default {
  csv: {
    main: {
      import: 'Importar',
    },
    error: {
      noId: "Sobrescribir requiere el campo 'id'",
      hasId: "Crear no debe incluir el campo 'id'",
      importing: 'Error al importar',
      emptyResource:
        "La propiedad 'resource' esta vacia. ¿Fue pasada {...props} al componente `ImportButton`?",
    },
    alert: {
      imported: 'Importado ',
    },
    dialog: {
      importTo: 'Importar para',
      dataFileReq: 'Requisitos del archivo',
      extension: "Debe ser un archivo '.csv' o '.tsv'",
      idColumnCreate: "No debe contener una columna 'id' para nuevo",
      idColumnUpdate: "Debe contener una columna 'id' para sobrescribir",
      chooseFile: 'Elija Archivo',
      processed: 'Procesado',
      rowCount: 'Cuenta de filas',
      cancel: 'Cancelar',
      importNew: 'Importar nuevo',
      importOverride: 'Importar y sobrescribir ',
    },
  },
};
