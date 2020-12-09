export default {
  csv: {
    buttonMain: {
      label: "Importer",
      tooltip: "Fichier '.csv' ou '.tsv' uniquement",
      emptyResource:
        "La propriété 'resource' était vide, avez-vous passé les {... props} à ImportButton ?",
    },
    parsing: {
      collidingIds: 'Champs "id" en collision trouvés',
      failedValidateRow: 'CSV n'a pas satisfait aux exigences de validation',
      invalidCsv: 'Le document n'a pas pu être analysé en tant que fichier "csv"',
    },
    dialogCommon: {
      subtitle: 'Importation de %{count} élément(s) de %{fileName} vers "%{resource}"',
      conflictCount:
      "La ressource <strong>%{resource}</strong> contient <strong>%{conflictingCount}</strong> enregistrements supplémentaires avec des identifiants en conflit",
      buttons: {
        cancel: "Annuler",
      }
    },
    dialogImport: {
      alertClose: "Importé %{fname}",
      title: 'Importation dans "%{resource}"',
      buttons: {
        replaceAllConflicts: "Remplacez les lignes",
        skipAllConflicts: "Ignorer ces lignes",
        letmeDecide: "Laisse-moi décider pour chaque ligne",
      },
    },
    dialogDecide: {
      title: 'Importation de l'id %{id} vers "%{resource}"',
      buttons: {
        replaceRow: "Remplacer la ligne id=%{id}",
        addAsNewRow: "Ajouter comme nouvelle ligne (ne pas remplacer)",
        skipDontReplace: "Ignorer cette ligne (ne pas remplacer)",
      },
    },
    loading: "Chargement...",
  },
};
