const editorHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0.5" charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        * {
        outline: 0px solid transparent;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-touch-callout: none;

        }
        html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif; font-size:1em;}
        body {
            padding-top: 5px;
            padding-bottom: 50px;
            height: 100%;
            overflow: hidden;
        }
        img {max-width: 98%;margin-left:auto;margin-right:auto;display: block; height: auto !important;}
        html {
            height: 100%;
            width: 100%;
        }
        body {
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            height: 100%;
            margin: 0;
            padding: 2px;
        }
        code { 
            font-family: monospace;
            background-color: #eee;
            background: hsl(220, 80%, 90%); 
        }
        pre {
            white-space: pre-wrap;
            background: #eee;
            margin: 5px;
            padding: 5px;      
            word-wrap: break-word;
        }
        
        #editor {
           flex-grow: 1;
           height: 100%;
           padding-top: 10px;
           overflow-y: scroll;
           padding-left: 20px;
           padding-right: 20px;
        }

          #editor::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 3px;
          }
          #editor::-webkit-scrollbar-thumb {
            border-radius: 4px;
            background-color: rgba(0, 0, 0, .5);
            -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
          }
        

        /*#editor::-webkit-scrollbar {*/
        /*   display: none;*/
        /*}*/

        *[contenteditable] {
          -webkit-user-select: auto !important;
        }
        
        p {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
        }
        
        ol {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
        }
        
        ul {
            margin-top: 4px !important;
            margin-bottom: 4px !important;
        }
        
        h1 {
            font-weight: normal;
        }
        
        h2 {
            font-weight: normal;
        }
         
        h3 {
            font-weight: normal;
        } 
        
        #editor:focus {
          outline: 0px solid transparent;
        }
        
      [contenteditable][placeholder]:empty:before {
        content: attr(placeholder);
        position: absolute;
        opacity: .4;
        background-color: transparent;
      }
    </style>
    <style>
    /* PUT YOUR STYLE HERE */
    </style>
    <title>CN-Editor</title>
</head>
<body>
  <div id="editor"
  autocomplete="off" 
  autosuggest="off"
  autocapitalize="off"
  spellcheck="false"
  autocorrect="off" 
  contenteditable placeholder="" oninput="if(this.innerHTML.trim()==='<br>')this.innerHTML=''" ></div>
    <script>
        (function(doc) {
            var editor = document.getElementById('editor');
            editor.contentEditable = true;

            document.execCommand('defaultParagraphSeparator', false, 'p');

            var getSelectedStyles = function() {
                let styles = [];
                document.queryCommandState('bold') && styles.push('bold');
                document.queryCommandState('italic') && styles.push('italic');
                document.queryCommandState('underline') && styles.push('underline');
                document.queryCommandState('strikeThrough') && styles.push('lineThrough');

                var fColor = document.queryCommandValue('foreColor');
                var bgColor = document.queryCommandValue('backColor');
                var colors = {
                        color: fColor,
                        highlight: bgColor
                    };
                var stylesJson = JSON.stringify({
                    type: 'selectedStyles',
                    data: {styles, colors}});
                    sendMessage(stylesJson);
                

            };

            var sendMessage = function(message) {
              if(window.ReactNativeWebView)
                window.ReactNativeWebView.postMessage(message);
            };

            function scrollTo(element, to = 0, duration= 1000) {

              const start = element.scrollTop;
              const change = to - start;
              const increment = 20;
              let currentTime = 0;
          
              const animateScroll = (() => {
          
                currentTime += increment;
          
                const val = Math.easeInOutQuad(currentTime, start, change, duration);
          
                element.scrollTop = val;
          
                if (currentTime < duration) {
                  setTimeout(animateScroll, increment);
                }
              });
          
              animateScroll();
            }
          
            Math.easeInOutQuad = function (t, b, c, d) {
          
              t /= d/2;
              if (t < 1) return c/2*t*t + b;
              t--;
              return -c/2 * (t*(t-2) - 1) + b;
            };
            
            function placeCaretAtEnd(el) {
                el.focus();
                if (typeof window.getSelection != "undefined"
                        && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    range.collapse(false);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.collapse(false);
                    textRange.select();
                }
                setTimeout(() => {
                        // el.scrollTop = el.scrollHeight
                        scrollTo(el, el.scrollHeight)
                }, 700)
            }
            
            var getSelectedTag = function() {
                let tag = document.queryCommandValue('formatBlock');
                if(document.queryCommandState('insertUnorderedList'))
                    tag = 'ul';
                else if(document.queryCommandState('insertorderedlist'))
                    tag = 'ol';
                switch (tag) {
                    case 'h1':
                        tag = 'title';
                        break;
                        case 'h3':
                        tag = 'heading';
                        break;
                        case 'pre':
                        tag = 'codeblock';
                        break;
                        case 'p':
                        tag = 'body';
                        break;
                    default:
                        break;
                }
                var stylesJson = JSON.stringify({
                    type: 'selectedTag',
                    data: tag});
                sendMessage(stylesJson);
            };

            document.addEventListener('selectionchange', function() {
                getSelectedStyles();
                getSelectedTag();
            });

            document.getElementById("editor").addEventListener("input", function() {
                let contentChanged = JSON.stringify({
                    type: 'onChange',
                    data: document.getElementById("editor").innerHTML });
                sendMessage(contentChanged);
            }, false);

            var applyToolbar = function(toolType, value = '') {
                switch (toolType) {
                    case 'bold':
                        document.execCommand('bold', false, '');
                        break;
                        case 'italic':
                        document.execCommand('italic', false, '');
                        break;
                        case 'underline':
                        document.execCommand('underline', false, '');
                        break;
                        case 'lineThrough':
                        document.execCommand('strikeThrough', false, '');
                        break;
                        case 'body':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');
                        document.execCommand('formatBlock', false, 'p');
                        break;
                        case 'title':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');

                        document.execCommand('formatBlock', false, 'h1');
                        
                        break;
                        case 'codeblock':
                            document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                            document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');
                        // document.execCommand("insertHTML", false, "<pre><code>"+ document.getSelection()+"</code></pre>");
                        document.execCommand('formatBlock', false, 'pre');
                        break;
                        case 'heading':
                        document.queryCommandState('insertUnorderedList') && document.execCommand('insertUnorderedList');
                        document.queryCommandState('insertorderedlist') && document.execCommand('insertorderedlist');
                        document.execCommand('formatBlock', false, 'h3');
                        break;
                        case 'ol':
                        document.execCommand('formatBlock', false, 'p');
                        document.execCommand('insertorderedlist');
                        break;
                        case 'ul':
                        document.execCommand('formatBlock', false, 'p');
                        document.execCommand('insertUnorderedList');
                        break;
                        case 'color':
                        document.execCommand('foreColor', false, value);
                        break;
                        case 'highlight':
                        document.execCommand('backColor', false, value);
                        break;
                        case 'image':
                            var img = "<img src='" + value.url + "' id='" + value.id + "' width='" + Math.round(value.width) + "' height='" + Math.round(value.height) + "' alt='" + value.alt + "' />";
                            if(document.all) {
                                 var range = editor.selection.createRange();
                                 range.pasteHTML(img);
                                 range.collapse(false);
                                 range.select();
                               } else {
                                 doc.execCommand("insertHTML", false, img);
                               }
                        break;
                        case 'imageAtEnd':
                            let _img = "<img src='" + value.url + "' id='" + value.id + "' width='" + Math.round(value.width) + "' height='" + Math.round(value.height) + "' alt='" + value.alt + "' />";
                            document.getElementById("editor").innerHTML += ('<p>' + _img + '</p>');
                            sendMessage(JSON.stringify({
                                  type: 'onChange',
                                  data: document.getElementById("editor").innerHTML }));
                        break;
                       
                    default:
                        break;
                }
                getSelectedStyles();
                getSelectedTag();
            }

            var getRequest = function(event) {
                 
              var msgData = JSON.parse(event.data);
              if(msgData.type === 'toolbar') {
                applyToolbar(msgData.command, msgData.value || '');
              }
              else if (msgData.type === 'keyboardShow') {
                   var selection = window.getSelection()
                   var node = selection.focusNode.parentNode
                   node.scrollIntoView(false)
              }
              else if(msgData.type === 'editor') {
                switch (msgData.command) {
                case 'focus':
                  editor.focus();
                  break;
                case 'focusEnd':
                  placeCaretAtEnd(document.querySelector('#editor'));
                  break;
                case 'scrollToEnd':
                  const _el = document.querySelector('#editor');
                  scrollTo(_el, _el.scrollHeight);
                  break;
                case 'blur':
                  editor.blur();
                  break;
                case 'getHtml':
                  sendMessage(
                    JSON.stringify({
                    type: 'getHtml',
                    data: editor.innerHTML})
                    );
                  break;
                case 'setHtml':
                  editor.innerHTML = msgData.value;
                  break;
                  case 'style':
                    editor.style.cssText = msgData.value;
                    break;
                    case 'placeholder':
                      editor.setAttribute("placeholder", msgData.value);
                    break;
                default: break;
              }
            }
                 
                 
            };

            document.addEventListener("message", getRequest , false);
            window.addEventListener("message", getRequest , false);
            
        })(document)
    </script>

</body>
</html>
`;

export default editorHTML;
