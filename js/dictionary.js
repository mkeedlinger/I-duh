var dictionary,
    dictionaryEnglish,
    numWords;

window.addEventListener('DOMContentLoaded', function() {
    var searchInput = $('#search');

    $.getJSON('/js/dictionary.json', function(data) {
        dictionary = data;
        dictionaryEnglish = caseInsensitiveSort(Object.keys(dictionary));
        numWords = dictionaryEnglish.length

        updateDictionayList(dictionaryEnglish);
        searchInput.on('keyup', search);
    }).fail(function() {
        $('#results').text('Could not load dictionary.');
    });
});

function search(e) {
    var query = e.target.value,
        lowerQuery = query.toLowerCase(),
        found = [],
        topResults = [];

    if (query === '') {
        // Display all the words
        found = dictionaryEnglish;
    } else {
        // Do case insensitive searches
        for (var i = 0; i < numWords; i++) {
            var word = dictionaryEnglish[i],
                englishSearch = findInWord(word.toLowerCase(), lowerQuery),
                idoSearch = findInWord(dictionary[word].toLowerCase(), lowerQuery);

            // Prioritize search results
            if (englishSearch === 3 || idoSearch === 3) {
                // Found "top result"
                topResults.push(word);
            } else if (englishSearch === 2 || idoSearch === 2) {
                // Found at beginning
                found.unshift(word);
            } else if (englishSearch === 1 || idoSearch === 1) {
                // Found in middle
                found.push(word);
            }
        }
    }

    updateDictionayList(topResults.concat(found), query);
}

function updateDictionayList(englishWords, query) {
    var length = englishWords.length,
        results = document.getElementById('results'),
        list = element('ul'),
        bold,
        index;

    list.classList.add('list-unstyled');

    for (var i = 0; i < length; i++) {
        var word = englishWords[i],
            item = element('li');

        if (query) {
            index = word.toLowerCase().indexOf(query.toLowerCase());

            if (index !== -1) {
                item.appendChild(textNode(word.slice(0, index)));

                bold = element('b');
                bold.textContent = word.slice(index, index + query.length);

                item.appendChild(bold);

                item.appendChild(textNode(word.slice(index + query.length) + ': '));
            } else {
                item.appendChild(textNode(word + ': '));
            }

            word = dictionary[word];

            index = word.toLowerCase().indexOf(query.toLowerCase());

            if (index !== -1) {
                item.appendChild(textNode(word.slice(0, index)));

                bold = element('b');
                bold.textContent = word.slice(index, index + query.length);

                item.appendChild(bold);

                item.appendChild(textNode(word.slice(index + query.length)));
            } else {
                item.appendChild(textNode(word));
            }
        } else {
            item.textContent = word + ': ' + dictionary[word];
        }

        list.appendChild(item);
    }

    // Remove all child nodes
    while (results.firstChild) {
        results.removeChild(results.firstChild);
    }

    results.appendChild(list);
}

/*
Searches for `query` in word and comes to one of four conclusions
0: Query is not found
1: Query is found in the middle of the word
2: Query is at the beginning of the word
3: Query is the whole word, or the first of multiple words
*/
function findInWord(word, query) {
    var index = word.indexOf(query);

    if (index !== -1) {
        if (index === 0) {
            if (query.length === word.length || word.indexOf(query + ' ') === 0) {
                // Found top result
                return 3;
            }

            // Found at beginning
            return 2;
        }

        // Found
        return 1;
    }

    // Not found
    return 0;
}

function caseInsensitiveSort(array) {
    return array.sort(function(a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();

        return a < b ? -1 : b < a ? 1 : 0;
    });
}

function textNode(text) {
    return document.createTextNode(text);
}

function element(tag) {
    return document.createElement(tag);
}
