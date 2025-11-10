// File loading utilities for 6502 Emulator
export class FileLoader {
    public static async loadFile(file: File): Promise<Uint8Array> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result instanceof ArrayBuffer) {
                    resolve(new Uint8Array(event.target.result));
                } else {
                    reject(new Error('Failed to read file'));
                }
            };
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsArrayBuffer(file);
        });
    }

    public static async loadTextFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                    resolve(event.target.result);
                } else {
                    reject(new Error('Failed to read text file'));
                }
            };
            reader.onerror = () => reject(new Error('File reading error'));
            reader.readAsText(file);
        });
    }

    public static parseHexFile(content: string): Uint8Array {
        const lines = content.trim().split('\n');
        const bytes: number[] = [];

        for (const line of lines) {
            if (line.startsWith(':')) {
                const record = line.substring(1);
                const byteCount = parseInt(record.substring(0, 2), 16);
                const address = parseInt(record.substring(2, 6), 16);
                const recordType = parseInt(record.substring(6, 8), 16);
                
                if (recordType === 0x00) { // Data record
                    for (let i = 0; i < byteCount; i++) {
                        const byteValue = parseInt(record.substring(8 + i * 2, 10 + i * 2), 16);
                        bytes.push(byteValue);
                    }
                }
            }
        }

        return new Uint8Array(bytes);
    }

    public static parseBinaryFile(content: string): Uint8Array {
        const lines = content.trim().split('\n');
        const bytes: number[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith(';')) {
                const byteValue = parseInt(trimmed, 16);
                if (!isNaN(byteValue) && byteValue >= 0 && byteValue <= 255) {
                    bytes.push(byteValue);
                }
            }
        }

        return new Uint8Array(bytes);
    }

    public static downloadFile(data: Uint8Array, filename: string): void {
        const blob = new Blob([data as any], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    public static downloadTextFile(content: string, filename: string): void {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}