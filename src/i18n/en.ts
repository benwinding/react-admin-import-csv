export default {
  csv: {
    buttonMain: {
      label: "Import",
      tooltip: "Must be a '.csv' or '.tsv' file",
      emptyResource:
        "The 'resource' property was empty, did you pass in the {...props} to the ImportButton?",
    },
    parsing: {
      collidingIds: 'Found colliding "id" fields',
      failedValidateRow: 'CSV failed the validation requirements',
      invalidCsv: 'The documnent could not be parsed as a "csv" file',
    },
    dialogCommon: {
      subtitle: 'Importing %{count} items from %{fileName} to "%{resource}"',
      conflictCount:
      "The resource <strong>%{resource}</strong> has <strong>%{conflictingCount}</strong> more records with conflicting ids",
      buttons: {
        cancel: "Cancel",
      }
    },
    dialogImport: {
      alertClose: "Imported %{fname}",
      title: 'Importing to "%{resource}"',
      buttons: {
        replaceAllConflicts: "Replace the rows",
        skipAllConflicts: "Skip these rows",
        letmeDecide: "Let me decide for each row",
      },
    },
    dialogDecide: {
      title: 'Importing id %{id} to "%{resource}"',
      conflictCount:
        "The resource <strong>%{resource}</strong> has <strong>%{conflictingCount}</strong> more records with conflicting ids",
      buttons: {
        replaceRow: "Replace the row id=%{id}",
        addAsNewRow: "Add as new row (Don't replace)",
        skipDontReplace: "Skip this row (Don't replace)",
        cancel: "Cancel",
      },
    },
    loading: "Loading...",
  },
};
