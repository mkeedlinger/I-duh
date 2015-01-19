$(function () {
    markdown();
});

function markdown () {
    $('md').each(function (index, element) {
        var text;
        element = $(element);
        text = limitSpacing(element.html());

        if (element.data('escape') !== false) {
            text = _.escape(text);
        }

        element.html(marked(text));

        if (element.data('keep-id') === undefined) {
            element.children().each(function (ind, ele) {
                ele = $(ele);
                ele.removeAttr('id');
            });
        }
    });
}

function limitSpacing (text) {
    var count = text.match(/^\s*/)[0].length - 1;

    text = text.split('\n').slice(1, -1);
    text = text.map(function (currentLine) {
        return currentLine.slice(count);
    });
    return text.join('\n');
}