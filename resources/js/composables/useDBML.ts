export function registerDbmlLanguage(monaco: typeof import('monaco-editor')) {
  monaco.languages.register({ id: 'dbml' });

    const KEYWORDS = [
    'Table', 'Ref', 'Project', 'Enum',
    ] as const;

    const TYPES = [
      'varchar', 'text', 'boolean', 'char', 'enum', 'set',
      'integer', 'int', 'float', 'double', 'decimal',
      'date', 'datetime', 'timestamp', 'time', 'year',
    ] as const;

  monaco.languages.setMonarchTokensProvider('dbml', {
    tokenizer: {
      root: [
        [new RegExp(`\\b(${KEYWORDS.join('|')})\\b`), 'keyword'],
        [new RegExp(`\\b(${TYPES.join('|')})\\b`), 'type'],
        [/\[[^\]]+\]/, 'attribute'],
        [/"[^"]*"/, 'string'],
        [/[a-zA-Z_][\w\-]*/, 'identifier'],
        [/\d+/, 'number'],
        [/\/\/.*/, 'comment'],
      ],
    },
  });

  monaco.editor.defineTheme('dbmlTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'FF9D00' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'identifier', foreground: 'DCDCAA' },
      { token: 'attribute', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'comment', foreground: '6A9955' },
    ],
    colors: {},
  });

  monaco.languages.setLanguageConfiguration('dbml', {
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],
    indentationRules: {
      increaseIndentPattern: /^\s*(Table|Ref|Project|Enum)\b.*{\s*$/,
      decreaseIndentPattern: /^\s*}\s*$/,
    },
    onEnterRules: [
      {
        beforeText: /^\s*[^{}]*{\s*$/,
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
      {
        beforeText: /^\s*}\s*$/,
        action: { indentAction: monaco.languages.IndentAction.Outdent },
      },
    ],
  });
}