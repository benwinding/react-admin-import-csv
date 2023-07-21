export default {
  csv: {
    buttonMain: {
      label: "Importuj",
      tooltip: "Dopuszczalne formaty plików to '.csv' i '.tsv'",
      emptyResource:
        "'resource' nie został ustawiony, czy przekazałeś propa 'resource' do komponentu ImportButton?",
    },
    parsing: {
      collidingIds: 'Znaleziono kolizje w polach "id"',
      failedValidateRow: "CSV nie spełnił wymagań walidacyjnych",
      invalidCsv: 'Nieprawidłowy plik "csv"',
    },
    dialogCommon: {
      subtitle: 'Importowanie %{count} rekordów z %{fileName} do "%{resource}"',
      conflictCount:
        "Zasób <strong>%{resource}</strong> ma jeszcze <strong>%{conflictingCount}</strong> rekordów z konfliktami pól 'id'",
      buttons: {
        cancel: "Anuluj",
      },
    },
    dialogImport: {
      alertClose: "Zaimportowano %{fname}",
      title: 'Importuję do "%{resource}"',
      buttons: {
        replaceAllConflicts: "Zastąp rekordy",
        skipAllConflicts: "Pomiń rekordy",
        letmeDecide: "Pozwól mi zadecydować dla każdego rekordu",
      },
    },
    dialogDecide: {
      title: 'Importowanie id %{id} do "%{resource}"',
      buttons: {
        replaceRow: "Zastąp rekord z id=%{id}",
        addAsNewRow: "Dodaj nowy rekord (Nie zastępuj)",
        skipDontReplace: "Pomiń ten rekord (Nie zastępuj)",
      },
    },
    loading: "Ładowanie...",
  },
};
