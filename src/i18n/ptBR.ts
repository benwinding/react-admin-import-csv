export default {
  csv: {
    buttonMain: {
      label: 'Importar',
      tooltip: "Precisa ser um arquivo do tipo '.csv' ou '.tsv'",
      emptyResource:
        "A propriedade 'resource' está vazia, você passou no {...props} do ImportButton?",
    },
    parsing: {
      collidingIds: 'Foram encontrados campos de "id" conflitantes',
      failedValidateRow: 'CSV falhou na validação dos requisitos',
      invalidCsv: 'O documento não pode ser interpretado como um arquivo "csv"',
    },
    dialogCommon: {
      subtitle: 'Importando %{count} itens de %{fileName} para "%{resource}"',
      conflictCount:
        'O recurso <strong>%{resource}</strong> possui mais <strong>%{conflictingCount}</strong> registros com "ids" conflitantes',
      buttons: {
        cancel: 'Cancelar',
      }
    },
    dialogImport: {
      alertClose: 'Importou %{fname}',
      title: 'Importando para "%{resource}"',
      buttons: {
        replaceAllConflicts: 'Substituir as linhas',
        skipAllConflicts: 'Pule essas linhas',
        letmeDecide: 'Deixe-me decidir para cada linha',
      },
    },
    dialogDecide: {
      title: 'Importando id %{id} para "%{resource}"',
      buttons: {
        replaceRow: 'Substituir a linha de id=%{id}',
        addAsNewRow: 'Adicionar como nova linha (Não substitui)',
        skipDontReplace: 'Pule essa linha (Não substitui)',
      },
    },
    loading: 'Carregando...',
  },
};
  