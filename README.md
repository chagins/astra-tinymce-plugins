# astra-tinymce-plugins

- [Create a plugin for TinyMCE](https://www.tiny.cloud/docs/tinymce/6/creating-a-plugin/)

- [Generator tinymce](https://github.com/tinymce/generator-tinymce)


### Installation

1. Install deps

```npm install```

2. Execute start script

```npm start```

3. Follow the instructions to create a plugin template

4. Go to the `plugin-name` folder

5. Execute start script

```npm start```

6. Run live server (vscode ext) with `plugin-name/src/demo/html/index.html`

7. Write code

8. Check `plugin-name/Gruntfile.js`:

```javascript
files: {
  'dist/plugin-name/plugin.js': [
    'src/text/license-header.js',
    scratchPluginPath // <= check this line
  ],
  'dist/plugin-name/plugin.min.js': [
    'src/text/license-header.js',
    scratchPluginMinPath
  ]
}
```

9. Execute build script

```npm run build```

10. Put `plugin-name/dist/plugin-name` folder to your tinymce distribution path `tinymce/plugins`

11. Register a custom plugin (https://www.tiny.cloud/docs/tinymce/6/creating-a-plugin/#registering-a-custom-plugin-with-tinymce)
