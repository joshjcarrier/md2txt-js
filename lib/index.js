var $ = require('jquery');
var debounce = require('throttle-debounce/debounce');
var MarkdownIt = require('markdown-it');

jQuery = $;

global.MarkdownToText = {
    convert: function (markdown) {
        var text = new MarkdownIt({
            html: false,
        }).render(markdown);
        text = text.replace(/<h[\d]>.*<\/h[\d]>/g, (str) => {
            str = str.replace(/<h[\d]>/, "").replace(/<\/h[\d]>/, "");

            bolder = "";
            for (var c of str) {
                if (c.match(/[A-Z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDC00 + (c.charCodeAt(0) - 65)) + "\u0332";
                } else if (c.match(/[a-z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDC1A + (c.charCodeAt(0) - 97)) + "\u0332";
                } else if (c.match(/[0-9]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDFCE + (c.charCodeAt(0) - 48));
                } else {
                    bolder += c;
                }
            }

            bolder += "\n";

            return bolder;
        });

        text = text.replace(/<strong>.*<\/strong>/g, (str) => {
            str = str.replace(/<strong>/, "").replace(/<\/strong>/, "");

            bolder = "";
            for (var c of str) {
                if (c.match(/[A-Z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDC00 + (c.charCodeAt(0) - 65));
                } else if (c.match(/[a-z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDC1A + (c.charCodeAt(0) - 97));
                } else if (c.match(/[0-9]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDFCE + (c.charCodeAt(0) - 48));
                } else {
                    bolder += c;
                }
            }

            return bolder;
        });

        text = text.replace(/<em>.*<\/em>/g, (str) => {
            str = str.replace(/<em>/, "").replace(/<\/em>/, "");

            bolder = "";
            for (var c of str) {
                if (c.match(/[A-Z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDE08 + (c.charCodeAt(0) - 65));
                } else if (c.match(/[a-z]/)) {
                    bolder += "\ud835" + String.fromCodePoint(0xDE22 + (c.charCodeAt(0) - 97));
                } else {
                    bolder += c;
                }
            }

            return bolder;
        });

        text = text.replace(/<ul>/g, "");
        text = text.replace(/<\/ul>/g, "\n");
        text = text.replace(/<li>/g, "\u2022 ");
        text = text.replace(/<\/li>/g, "\n");
        text = text.replace(/<hr>/g, "--------------------\n");
        text = text.replace(/<p>/g, "");
        text = text.replace(/<\/p>/g, "\n");
        return text;
    }
}

global.MarkdownToTextDOM = {
    convertActiveElement: function () {
        if (document.activeElement != null && document.activeElement.value != null) {
            document.activeElement.value = MarkdownToText.convert(document.activeElement.value);
        }
    },

    render: function (el) {
        $el = $(el).append("<textarea id='editor-markdown'></textarea><textarea id='editor-text' readonly=true></textarea>");
        $('#editor-markdown').keyup(debounce(100, this._onkeyup));
        return $el;
    },

    _onkeyup: function () {
        var markdown = $('#editor-markdown').val();
        var text = MarkdownToText.convert(markdown);
        $('#editor-text').html(text);
    }
};
