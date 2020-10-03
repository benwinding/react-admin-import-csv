export default {
  csv: {
    status: {
      importToResource: 'Importing to "%{resource}"',
      importToReosurceCount: 'Importing %{count} items from %{fileName} to "%{resource}"',
      importId: 'Importing id %{id} to "%{resource}"',
      loading: "Loading...",
      importConflictingCount: 'The resource <strong>%{resource}</strong> has <strong>%{conflictingCount}</strong> more records with conflicting ids'
    },
    button: {
      replaceAllConflicts: "Replace the rows",
      skipAllConflicts: "Skip these rows",
      letmeDecide: "Let me decide for each row",
      replaceRow: "Replace the row id=%{id}",
      addAsNewRow: "Add as new row (Don't replace)",
      skipDontReplace: "Skip this row (Don't replace)",
      cancel: "Cancel"
    },
  },
};
