const fs = require('fs').promises;
const kuromoji = require('kuromoji')
const subtitleFile = './nausicaa.srt'
const newFileLocation = './unique-wordlist-nausicaa.txt'

async function readFile(filePath, outputFile) {
  try {
    const data = (await fs.readFile(filePath)).toString();
    const lines = data.split('\n').map(line => line.trim())
    let numOfLines = lines.length
    const japLines = []
    const regex = /[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9faf]/;
    for (let i = 0; i < numOfLines; i++) {
        if (lines[i] && !regex.test(lines[i])) {
            japLines.push(lines[i])
        }
    }
    numOfLines = japLines.length
    kuromoji.builder({ dicPath: "./node_modules/kuromoji/dict/" }).build(function (err, tokenizer) {
        const japWordsMany = []
        const japWordsFew = []
        for (let i = 0; i < numOfLines; i++) {
            japWordsMany.push(tokenizer.tokenize(japLines[i]));
            numOfWords = japWordsMany[i].length
            for (let j = 0; j < numOfWords; j++) {
                if (japWordsMany[i][j].pos !== '記号'
                && !japWordsFew.includes(japWordsMany[i][j].surface_form)
                && japWordsMany[i][j].surface_form.length > 1) {
                    japWordsFew.push(japWordsMany[i][j].surface_form)
                }
            }
        }
        numOfWords = japWordsFew.length
        for (let i = 0; i < numOfWords; i++) {
            japWordsFew[i] = `${i + 1}: ${japWordsFew[i]} \n`
        }
        fs.writeFile(outputFile,japWordsFew, err => {
            if (err) {
                console.error(err);
            }
        })
    });
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}
