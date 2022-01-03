export default {
  csv: {
    buttonMain: {
      label: "Importeren",
      tooltip: "Moet een '.csv' of '.tsv' bestand zijn",
      emptyResource:
        "De 'resource' property was leeg, zijn de {...props} meegegeven aan de ImportButton?",
    },
    parsing: {
      collidingIds: 'Conflicterende "id" velden gevonden',
      failedValidateRow: 'CSV heeft niet aan de validatievereisten voldaan',
      invalidCsv: 'Het document kon niet geparsed worden als een "csv" bestand',
    },
    dialogCommon: {
      subtitle: 'Importeren van %{count} items van %{fileName} naar "%{resource}"',
      conflictCount:
        "De resource <strong>%{resource}</strong> heeft <strong>%{conflictingCount}</strong> conflicterende ids",
      buttons: {
        cancel: "Annuleren",
      }
    },
    dialogImport: {
      alertClose: "%{fname} geïmporteerd",
      title: 'Importeren naar "%{resource}"',
      buttons: {
        replaceAllConflicts: "Vervang deze regels",
        skipAllConflicts: "Sla deze regels over",
        letmeDecide: "Laat me voor iedere regel kiezen",
      },
    },
    dialogDecide: {
      title: 'Importeren van id %{id} naar "%{resource}"',
      buttons: {
        replaceRow: "Vervang de regel met id=%{id}",
        addAsNewRow: "Toevoegen als nieuwe regel (Niet vervangen)",
        skipDontReplace: "Skip deze regel (Niet vervangen)",
      },
    },
    loading: "Laden...",
  },
};
