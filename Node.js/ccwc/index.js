#! /usr/bin/env node
//Problem: https://codingchallenges.fyi/challenges/challenge-wc
const { program } = require('commander');
const fs = require('fs');


program
	.version('1.0.0')
	.option('-c, --count-characters', 'Count characters')
	.option('-w, --count-words', 'Count words')
	.option('-l, --count-lines', 'Count lines')
	.parse(process.argv);

const options = program.opts();
let inputBuffer = '';
if (!process.stdin.isTTY) {
	process.stdin.setEncoding('ascii');
	process.stdin.on('data', (chunk) => {
		inputBuffer += chunk;
	});
	process.stdin.on('end', () => {
		processInput(inputBuffer, options, '')
	})
} else {
	// Check if there is a filename provided
	const filename = process.argv[3] || process.argv[2];
	if (filename) {
		const fileContent = readFile(filename);
		processInput(fileContent, options, filename);
	} else {
		console.error('Error: Please provide a filename or pipe input.');
		program.help();
	}
}

function giveCounts(content) {
	let wordCount = 0;
	let lineCount = 0;
	let charCount = 0;
	let is_char_in_word = false;
	for (let c of content) {
		charCount += 1;
		switch (c) {
			case '\n':
				lineCount += 1;
			//continue through, dont break
			case ' ':
			case '\t':
				is_char_in_word = false;
				break;
			default:
				if (!is_char_in_word) {
					is_char_in_word = true;
					wordCount += 1;
				}
				break;
		}
	}

	return { wordCount, lineCount, charCount };
}

function countCharacters(input, filename) {
	let count = giveCounts(input).charCount;
	console.log('     ', count, filename);
};

function countWords(input, filename) {
	let count = giveCounts(input).wordCount;
	console.log('     ', count, filename);
};

function countLines(input, filename) {
	let count = giveCounts(input).lineCount;
	console.log('      ', count, filename);
};

function countAll(input, filename) {
	let count = giveCounts(input);
	console.log(' ', count.lineCount, count.wordCount, count.charCount, filename)
}

function processInput(input, options, filename) {
	try {
		if (options.countCharacters)
			countCharacters(input, filename);
		else if (options.countWords)
			countWords(input, filename);
		else if (options.countLines)
			countLines(input, filename);
		else
			countAll(input, filename);
	} catch (error) {
		console.error('Error: ', error.message);
	}
}

function readFile(filename) {
	try {
		return fs.readFileSync(filename, 'ascii');
	} catch (error) {
		console.error(`Error reading the file: ${error.message}`);
		process.exit(1);
	}
}