// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { DateTime } = require("luxon");
const MDo = require('@mdo-org/mdo-flow-live-in-the-moment/lib/strings');

// returns a range that spans the whole text of a document
// see: https://stackoverflow.com/a/50875520/10199439
function getFullRange(textDocument) {
	let invalidRange = new vscode.Range(0, 0, textDocument.lineCount /*intentionally missing the '-1' */, 0);
	return textDocument.validateRange(invalidRange);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "mdo-extension-code" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.runMDo', function () {
		// The code you place here will be executed every time your command is executed
		const showError = vscode.window.showErrorMessage;
		const editor = vscode.window.activeTextEditor;
		const now = DateTime.local();

		if (!editor) {
			showError("MDo cannot run if there is no editor open.")
			return;
		}

		const document = editor.document;
		const text = document.getText();
		return MDo(text, { time: now.toString(), timezone: now.zoneName })
			.then(newText => (
				editor.edit(editBuilder => (
					editBuilder.replace(getFullRange(document), newText)
				))
			))
			.catch((err) => {
				showError(err.message);
			});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
