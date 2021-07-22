export default {
  csv: {
    buttonMain: {
      label: "Импорт",
      tooltip: "Должен быть '.csv' or '.tsv' file",
      emptyResource:
        "Свойство 'resource' пустое. Вы передали {...props} в ImportButton?",
    },
    parsing: {
      collidingIds: 'Обнаружен конфликт полей "id"',
      failedValidateRow: 'CSV не прошёл проверку требований',
      invalidCsv: 'Документ не может быть проанализирован как "csv" файл',
    },
    dialogCommon: {
      subtitle: 'Импорт %{count} элементов из %{fileName} в "%{resource}"',
      conflictCount:
      "Ресурс <strong>%{resource}</strong> содержит <strong>%{conflictingCount}</strong> и больше записей с конфликтующими id",
      buttons: {
        cancel: "Отмена",
      }
    },
    dialogImport: {
      alertClose: "Импортировано %{fname}",
      title: 'Импорт в "%{resource}"',
      buttons: {
        replaceAllConflicts: "Заменить строки",
        skipAllConflicts: "Пропустить эти строки",
        letmeDecide: "Решить для каждой строки отдельно",
      },
    },
    dialogDecide: {
      title: 'Импорт id %{id} в "%{resource}"',
      buttons: {
        replaceRow: "Замена строки id=%{id}",
        addAsNewRow: "Добавить как новую строку (Не заменять)",
        skipDontReplace: "Пропустить строку (Не заменять)",
      },
    },
    loading: "Загрузка...",
  },
};
