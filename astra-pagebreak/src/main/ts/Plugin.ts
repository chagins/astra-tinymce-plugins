import { Editor, TinyMCE, PluginManager } from 'tinymce';

declare const tinymce: TinyMCE;

type TBeforeSetContentEvent = {
  format: string;
  set: boolean;
  no_events?: boolean;
  no_selection?: boolean;
  paste?: boolean;
  load?: boolean;
  initial?: boolean;
  content: string;
  selection?: boolean;
};

const setup = (): void => {
  const defaultHtmlSeparator = '<!-- astra-pagebreak -->';
  const htmlSeparatorOptionName = 'astra_pagebreak_separator';
  const svgPlaceholderOptionName = 'astra_pagebreak_svg_data_URI';
  const astraPageBreakClass = 'mce-astra-pagebreak';
  const tagsThatCanBeSplit = ['P', 'SPAN'];
  const shouldSplitBlock = true;
  const defaultSvg =
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjUzMCIKICAgaGVpZ2h0PSIyMSIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMTQwLjIyNTM1IDUuNTU2MzE0MSIKICAgaWQ9InN2ZzI3IgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzMSIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIuODYyMTU1MiwtOC43NzcyMjExKSIKICAgICBpZD0iZzI1Ij4KICAgIDx0ZXh0CiAgICAgICB4PSItMy4wMjk4NDA1IgogICAgICAgeT0iMTIuNjMxMjYzIgogICAgICAgc3R5bGU9ImZvbnQtc2l6ZTo0LjkzODlweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OidTZWdvZSBVSSc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7ZmlsbDojMDA3OGQyO3N0cm9rZS13aWR0aDowLjI2NDU4IgogICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgIGlkPSJ0ZXh0MjMiPjx0c3BhbgogICAgICAgICB4PSItMy4wMjk4NDA1IgogICAgICAgICB5PSIxMi42MzEyNjMiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo0LjIzMzM4cHg7Zm9udC1mYW1pbHk6J1NlZ29lIFVJJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidTZWdvZSBVSSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiMwMDc4ZDI7c3Ryb2tlLXdpZHRoOjAuMjY0NTgiCiAgICAgICAgIGlkPSJ0c3BhbjIxIj4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPHRzcGFuCiAgIHN0eWxlPSJmb250LXNpemU6Mi44MjIyNXB4IgogICBpZD0idHNwYW4xMDE1NTciPiA8L3RzcGFuPtCg0LDQt9GA0YvQsiDRgdGC0YDQsNC90LjRhtGLPHRzcGFuCiAgIHN0eWxlPSJmb250LXNpemU6Mi44MjIyNXB4IgogICBpZD0idHNwYW4xMDQ1NjciPiA8L3RzcGFuPi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS08L3RzcGFuPjwvdGV4dD4KICA8L2c+Cjwvc3ZnPgo=';

  const pluginManager: PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');

  const registerOptions = (editor: Editor) => {
    editor.options.register(htmlSeparatorOptionName, {
      processor: 'string',
      default: defaultHtmlSeparator,
    });
    editor.options.register(svgPlaceholderOptionName, {
      processor: 'string',
      default: defaultSvg,
    });
  };

  const getHtmlSeparatorOption = (editor: Editor) => {
    return editor.options.get(htmlSeparatorOptionName) as string;
  };

  const getSvgPlaceholderOption = (editor: Editor) => {
    return editor.options.get(svgPlaceholderOptionName) as string;
  };

  const getHTMLPlaceholder = (editor: Editor) => {
    const svg = getSvgPlaceholderOption(editor);
    const html = `<img style="display: block;" src="${svg}" class="${astraPageBreakClass}" data-mce-resize="false" data-mce-placeholder />`;
    return shouldSplitBlock ? `<p>${html}</p>` : html;
  };

  const getNodePlaceholder = (editor: Editor) => {
    const html = getHTMLPlaceholder(editor);
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as Element;
  };

  const canSplit = (element: Element) => {
    return tagsThatCanBeSplit.includes(element.tagName);
  };

  const getTopParentElement = (element: Element) => {
    let currentElement = element;
    while (
      currentElement &&
      currentElement.parentElement &&
      currentElement.parentElement?.tagName !== 'HTML' &&
      currentElement.parentElement?.tagName !== 'BODY'
    ) {
      currentElement = currentElement.parentElement;
    }
    return currentElement;
  };

  const registerEvents = (editor: Editor) => {
    const separatorHtml = getHtmlSeparatorOption(editor);
    const separatorHTMLRegExp = new RegExp(separatorHtml, 'gi');

    editor.on('BeforeSetContent', (e: TBeforeSetContentEvent) => {
      e.content = e.content.replace(separatorHTMLRegExp, getHTMLPlaceholder(editor));
    });

    editor.on('PreInit', () => {
      editor.serializer.addNodeFilter('img', (nodes) => {
        nodes.forEach((node) => {
          const className = node.attr('class');
          if (className && className.indexOf(astraPageBreakClass) !== -1) {
            const parentNode = node.parent;
            if (parentNode && editor.schema.getBlockElements()[parentNode.name]) {
              const textNodeTypeValue = 3; // Web/API/Node/nodeType
              parentNode.type = textNodeTypeValue;
              parentNode.value = separatorHtml;
              parentNode.raw = true;
              node.remove();
              return;
            }
            node.type = 3;
            node.value = separatorHtml;
            node.raw = true;
          }
        });
      });
    });
  };

  const setupElementNameResolve = (editor: Editor) => {
    editor.on('ResolveName', (e) => {
      if (e.target.nodeName === 'IMG' && editor.dom.hasClass(e.target, astraPageBreakClass)) {
        e.name = 'astra-pagebreak';
      }
    });
  };

  const registerCommands = (editor: Editor) => {
    editor.addCommand('mceAstraPageBreak', () => {
      const selection = editor.selection;
      const selectedElement = selection.getStart();
      const topParentElement = getTopParentElement(selectedElement);

      if (canSplit(topParentElement)) {
        editor.insertContent(getHTMLPlaceholder(editor));
      } else {
        topParentElement.before(getNodePlaceholder(editor));
      }
    });
  };

  const registerButton = (editor: Editor) => {
    const onAction = () => editor.execCommand('mceAstraPageBreak');
    editor.ui.registry.addButton('astra-pagebreak', {
      icon: 'page-break',
      tooltip: 'Разрыв страницы',
      onAction,
    });
  };

  const registerPlugin = () => {
    pluginManager.add('astra-pagebreak', (editor) => {
      registerOptions(editor);
      registerCommands(editor);
      registerButton(editor);
      registerEvents(editor);
      setupElementNameResolve(editor);
    });
  };

  registerPlugin();
};

export default (): void => {
  setup();
};
