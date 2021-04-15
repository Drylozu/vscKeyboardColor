import Keyboard from './Keyboard';
import * as vscode from 'vscode';
import { keys } from './util';

const keyboard = {
	_keyboard: new Keyboard(),
	_status: (null as vscode.DiagnosticSeverity | null),
	set status(value: vscode.DiagnosticSeverity | null) {
		if (this._status === value) return;
		this._status = value;
		this.onChangeStatus();
	},
	get status() {
		return this._status;
	},
	onChangeStatus() {
		/* const keyss: (keyof typeof keys)[] = [
			'Esc', 'Tab', 'Shift_l', 'Caps_Lock', 'Ctrl_l', 'Tilde', 'Super_l',
			'F12', 'Backslash', 'Shift_r', 'Ctrl_r', 'Menu', 'Return', 'Backspace',
			'Alt_l', 'Alt_r', 'Fn', 'Space'
		]; */
		/* const keyss = Object.keys(keys).filter((_, i) => i % 2 === 0) as (keyof typeof keys)[]; */
		const keyss: (keyof typeof keys)[] = ['Esc', 'Left', 'Down', 'Right', 'Up'];
		switch (this._status) {
			case vscode.DiagnosticSeverity.Error:
				this._keyboard.setKeysColor(keyss, 0xFF, 0x10, 0x10);
				break;
			case vscode.DiagnosticSeverity.Warning:
				this._keyboard.setKeysColor(keyss, 0xEA, 0x46, 0x00);
				break;
			default:
				this._keyboard.setKeysColor(keyss, 0x10, 0x10, 0xFF);
				break;
		}
	},
	init() {
		this._keyboard.setMode('custom');
		this._keyboard.setAllKeysColor(0x10, 0x10, 0xFF);
	}
};

export function activate() {
	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBar.text = '...';
	statusBar.show();
	keyboard.init();
	statusBar.tooltip = 'Keyboard working.';
	statusBar.text = '😋';

	vscode.languages.onDidChangeDiagnostics(() => {
		const diagnostics = vscode.languages.getDiagnostics()
			.map(([, diagnostic]) => diagnostic).flat();
		if (diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error))
			return (keyboard.status = vscode.DiagnosticSeverity.Error);
		if (diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Warning))
			return (keyboard.status = vscode.DiagnosticSeverity.Warning);
		return (keyboard.status = null);
	});
}

export function deactivate() {
	keyboard._keyboard.setMode('breathingCycle');
}
