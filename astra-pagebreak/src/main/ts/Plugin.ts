import { Editor, TinyMCE, PluginManager } from "tinymce";

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
  const defaultHtmlSeparator = "<!-- astra-pagebreak -->";
  const htmlSeparatorOptionName = "astra_pagebreak_separator";
  const astraPageBreakClass = "mce-astra-pagebreak";
  const shouldSplitBlock = true;
  const svg =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNTIxLjA2MjYyIgogICBoZWlnaHQ9IjE4LjM2MzMiCiAgIHZpZXdCb3g9IjAgMCAxMzcuODY0NDkgNC44NTg2MjMyIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc1IgogICBzb2RpcG9kaTpkb2NuYW1lPSJwYWdlYnJlYWsuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEuMiAoYjhlMjViZTgzMywgMjAyMi0wMi0wNSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc3IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZG9jdW1lbnQtdW5pdHM9Im1tIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxLjAzNjg2MTgiCiAgICAgaW5rc2NhcGU6Y3g9IjE4MC4zNTE5MSIKICAgICBpbmtzY2FwZTpjeT0iNDUuMzI5MDg5IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiCiAgICAgdW5pdHM9InB4IgogICAgIGZpdC1tYXJnaW4tdG9wPSIwIgogICAgIGZpdC1tYXJnaW4tbGVmdD0iMCIKICAgICBmaXQtbWFyZ2luLXJpZ2h0PSIwIgogICAgIGZpdC1tYXJnaW4tYm90dG9tPSIwIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIiAvPgogIDxnCiAgICAgaW5rc2NhcGU6bGFiZWw9ItCh0LvQvtC5IDEiCiAgICAgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIKICAgICBpZD0ibGF5ZXIxIgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjE1MDg3NDYsLTguOTE3ODk4NikiPgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NC45Mzg4OXB4O2xpbmUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6J1NlZ29lIFVJJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidTZWdvZSBVSSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiMwMDc4ZDI7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgeD0iOC44MDM2MDg5IgogICAgICAgeT0iMTIuNjMxMjY0IgogICAgICAgaWQ9InRleHQ1ODU5MSIKICAgICAgIGlua3NjYXBlOmV4cG9ydC1maWxlbmFtZT0iQzpcVXNlcnNcY2hhZ2lcWWFuZGV4RGlza1zQoNCw0LHQvtGH0LjQuSDRgdGC0L7Qu1x0ZXh0NTg1OTEucG5nIgogICAgICAgaW5rc2NhcGU6ZXhwb3J0LXhkcGk9Ijk2IgogICAgICAgaW5rc2NhcGU6ZXhwb3J0LXlkcGk9Ijk2Ij48dHNwYW4KICAgICAgICAgc29kaXBvZGk6cm9sZT0ibGluZSIKICAgICAgICAgaWQ9InRzcGFuNTg1ODkiCiAgICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo0LjkzODg5cHg7Zm9udC1mYW1pbHk6J1NlZ29lIFVJJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidTZWdvZSBVSSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiMwMDc4ZDI7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMjY0NTgzIgogICAgICAgICB4PSI4LjgwMzYwODkiCiAgICAgICAgIHk9IjEyLjYzMTI2NCI+LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLdCg0LDQt9GA0YvQsiDRgdGC0YDQsNC90LjRhtGLLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTwvdHNwYW4+PC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==";

  const pluginManager: PluginManager = tinymce.util.Tools.resolve(
    "tinymce.PluginManager"
  );

  const registerOptions = (editor: Editor) => {
    editor.options.register(htmlSeparatorOptionName, {
      processor: "string",
      default: defaultHtmlSeparator,
    });
  };

  const getHtmlSeparator = (editor: Editor) => {
    return editor.options.get(htmlSeparatorOptionName) as string;
  };

  const getPlaceholderHtml = () => {
    const html = `<img style="display: block;" src="${svg}" class="${astraPageBreakClass}" data-mce-resize="false" data-mce-placeholder />`;
    return shouldSplitBlock ? `<p>${html}</p>` : html;
  };

  const setupEvents = (editor: Editor) => {
    const separatorHtml = getHtmlSeparator(editor);
    const separatorHTMLRegExp = new RegExp(separatorHtml, "gi");

    editor.on("BeforeSetContent", (e: TBeforeSetContentEvent) => {
      e.content = e.content.replace(separatorHTMLRegExp, getPlaceholderHtml());
    });

    editor.on("PreInit", () => {
      editor.serializer.addNodeFilter("img", (nodes) => {
        nodes.forEach((node) => {
          const className = node.attr("class");
          if (className && className.indexOf(astraPageBreakClass) !== -1) {
            const parentNode = node.parent;
            if (
              parentNode &&
              editor.schema.getBlockElements()[parentNode.name]
            ) {
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
    editor.on("ResolveName", (e) => {
      if (
        e.target.nodeName === "IMG" &&
        editor.dom.hasClass(e.target, astraPageBreakClass)
      ) {
        e.name = "astra-pagebreak";
      }
    });
  };

  const registerCommands = (editor: Editor) => {
    editor.addCommand("mceAstraPageBreak", () => {
      editor.insertContent(getPlaceholderHtml());
    });
  };

  const registerButton = (editor) => {
    const onAction = () => editor.execCommand("mceAstraPageBreak");
    editor.ui.registry.addButton("astra-pagebreak", {
      icon: "page-break",
      tooltip: "Разрыв страницы",
      onAction,
    });
  };

  const registerPlugin = () => {
    pluginManager.add("astra-pagebreak", (editor) => {
      registerOptions(editor);
      registerCommands(editor);
      registerButton(editor);
      setupEvents(editor);
      setupElementNameResolve(editor);
    });
  };

  registerPlugin();
};

export default (): void => {
  setup();
};
