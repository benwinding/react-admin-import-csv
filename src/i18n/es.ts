export default {
  csv: {
    buttonMain: {
      label: "Importar",
      tooltip: "Debe ser un archivo '.csv' o '.tsv'",
      emptyResource:
        "La propiedad 'resource' estaba vacía, ¿pasó el {... props} al Importar Botón?",
    },
    parsing: {
      collidingIds: 'Se encontraron campos de "id" en conflicto',
      failedValidateRow: 'CSV no cumplió con los requisitos de validación',
      invalidCsv: 'El documento no se pudo analizar como un archivo "csv"',
    },
    dialogCommon: {
      subtitle: 'Importando %{count} elementos de %{fileName} a "%{resource}"',
      conflictCount:
      "El recurso <strong> %{resource} </strong> tiene <strong> %{conflictingCount} </strong> más registros con ID en conflicto",
      buttons: {
        cancel: "Cancelar",
      }
    },
    dialogImport: {
      alertClose: "Importado %{fname}",
      title: 'Importando a "%{resource}"',
      buttons: {
        replaceAllConflicts: "Reemplazar las filas",
        skipAllConflicts: "Salta estas filas",
        letmeDecide: "Déjame decidir por cada fila",
      },
    },
    dialogDecide: {
      title: 'Importando id %{id} a "%{resource}"',
      buttons: {
        replaceRow: "Reemplazar el id de fila = %{id}",
        addAsNewRow: "Agregar como nueva fila (no reemplazar)",
        skipDontReplace: "Omitir esta fila (no reemplazar)",
      },
    },
    loading: "Cargando...",
  },
};
