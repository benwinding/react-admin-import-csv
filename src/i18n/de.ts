export default {
  csv: {
    buttonMain: {
      label: "Importieren",
      tooltip: "Muss eine '.csv'- oder '.tsv'-Datei sein.",
      emptyResource:
        "The 'resource' property was empty, did you pass in the {...props} to the ImportButton?",
    },
    parsing: {
      collidingIds: 'Es gibt Konflikte mit "id"-Feldern',
      failedValidateRow: 'Das CSV hat die Überprüfung nicht bestanden.',
      invalidCsv: 'Das Dokument konnte nicht als CSV gelesen werden.',
    },
    dialogCommon: {
      subtitle: 'Importiere %{count} elemente von %{fileName} nach "%{resource}"',
      conflictCount:
      "Die Ressource <strong>%{resource}</strong> hat <strong>%{conflictingCount}</strong> weitere Einträge mit ID-Konflikten.",
      buttons: {
        cancel: "Abbrechen",
      }
    },
    dialogImport: {
      alertClose: "%{fname} importiert",
      title: 'Importiere nach "%{resource}"',
      buttons: {
        replaceAllConflicts: "Zeilen ersetzen",
        skipAllConflicts: "Zeilen überspringen",
        letmeDecide: "Zeile für Zeile entscheiden",
      },
    },
    dialogDecide: {
      title: 'Importiere id %{id} nach "%{resource}"',
      buttons: {
        replaceRow: "Zeile id=%{id} ersetzen",
        addAsNewRow: "Als neue Zeile hinzufügen (Nicht ersetzen)",
        skipDontReplace: "Zeile überspringen (Nicht ersetzen)",
      },
    },
    loading: "Lädt...",
  },
};
