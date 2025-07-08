import * as monaco from 'monaco-editor'

export function registerDbmlLanguage() {
  monaco.languages.register({ id: 'dbml' });

  monaco.languages.setMonarchTokensProvider('dbml', {
    tokenizer: {
      root: [
        [/Table|Ref|Project|Enum/, 'keyword'],
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
      { token: 'attribute', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'comment', foreground: '6A9955' },
    ],
    colors: {},
  });
}