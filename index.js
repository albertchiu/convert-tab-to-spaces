var fs = require('fs');
var path = require('path');
var readline = require('readline');

var convertPath = 'D:\\SourceCode';
var utf8 = 'UTF-8';
var filterRegExp = /(\.java|\.jsp)$/;//new RegExp('(\.java|\.jsp)$');

function iterateFiles(startPath, filter, callback) {
    if (!fs.existsSync(startPath)){
        console.log('no dir ', startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for(var i = 0; i < files.length; i++){
        var filename = path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            iterateFiles(filename, filter, callback); //recurse
        }
        else if (filter.test(filename)) {
            callback(filename);
        }
    };
}

iterateFiles(convertPath, filterRegExp, function(filename) {
        fs.readFile(filename, function(err, dataBuffer) {
            if (err) throw err;

            // 建立檔案讀取資料流
            var inputStream = fs.createReadStream(filename);
            var lines = [];

            // 將讀取資料流導入 Readline 進行處理
            var lineReader = readline.createInterface({ input: inputStream });
            lineReader.on('line', function (line) {
                // 取得一行行結果
                lines.push(line.trimRight().replace(/\t/g, '    '));
            });

            lineReader.on('close', function () {
                fs.writeFile(filename, lines.join('\r\n'), function () { console.log('Writing file succeeded!') })
            });
        });
    }
);