function downloadFile(text, filename) {
    const blob = new Blob([text], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.textContent = 'DOWNLOAD'
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);

    window.addEventListener('beforeunload', function() {
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  });
}

async function readFile(file, outputFile) {
    try {
        const lines = file.split('\n').map(line => line.trim())
        let numOfLines = lines.length
        const japLines = []
        const regex = /[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9faf]/;
        for (let i = 0; i < numOfLines; i++) {
            if (lines[i] && !regex.test(lines[i])) {
                japLines.push(lines[i])
            }
        }
        numOfLines = japLines.length
        kuromoji.builder({ dicPath: "./node_modules/kuromoji/dict/" })
        .build(function (err, tokenizer) {
            const japWords = []
            const japWordsUnique= []
            for (let i = 0; i < numOfLines; i++) {
                japWords.push(tokenizer.tokenize(japLines[i]));
                numOfWords = japWords[i].length
                for (let j = 0; j < numOfWords; j++) {
                    if (japWords[i][j].pos !== '記号'
                    && !japWordsUnique.includes(japWords[i][j].surface_form)
                    && japWords[i][j].surface_form.length > 1) {
                        japWordsUnique.push(japWords[i][j].surface_form)
                    }
                }
            }
            numOfWords = japWordsUnique.length
            let outputText = ''
            for (let i = 0; i < numOfWords; i++) {
                outputText += `${japWordsUnique[i]} \n`
            }
            downloadFile(outputText, outputFile)
        });
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

function getAsText(readFile) {
    const reader = new FileReader();
    reader.readAsText(readFile, "UTF-8");
    reader.onload = loaded;
}

function loaded(evt) {
    const fileString = evt.target.result;
    const file = document.getElementById('file').files[0];
    const outputName = file.name.split('.')[0] + '-vocab'
    readFile(fileString, outputName)
}

function startRead(evt) {
    const file = document.getElementById('file').files[0];
    if (file) {
        getAsText(file);
    }
}