// 6502 Assembler
export class Assembler6502 {
    private instructions: Map<string, InstructionInfo>;
    private labels: Map<string, number>;
    private sourceLines: SourceLine[];
    private compiledBytes: number[];
    private originAddress: number = 0x0000;

    constructor() {
        this.instructions = new Map();
        this.labels = new Map();
        this.sourceLines = [];
        this.compiledBytes = [];
        this.initializeInstructions();
    }

    private initializeInstructions(): void {
        // Load instructions
        this.instructions.set('LDA', { 
            modes: new Map([
                ['IMM', { opcode: 0xA9, bytes: 2, pattern: /#\$(\w+)/ }],
                ['ZP', { opcode: 0xA5, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPX', { opcode: 0xB5, bytes: 2, pattern: /\$(\w{2}),\s*X/ }],
                ['ABS', { opcode: 0xAD, bytes: 3, pattern: /\$(\w{4})/ }],
                ['ABX', { opcode: 0xBD, bytes: 3, pattern: /\$(\w{4}),\s*X/ }],
                ['ABY', { opcode: 0xB9, bytes: 3, pattern: /\$(\w{4}),\s*Y/ }]
            ])
        });

        this.instructions.set('LDX', {
            modes: new Map([
                ['IMM', { opcode: 0xA2, bytes: 2, pattern: /#\$(\w+)/ }],
                ['ZP', { opcode: 0xA6, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPY', { opcode: 0xB6, bytes: 2, pattern: /\$(\w{2}),\s*Y/ }],
                ['ABS', { opcode: 0xAE, bytes: 3, pattern: /\$(\w{4})/ }],
                ['ABY', { opcode: 0xBE, bytes: 3, pattern: /\$(\w{4}),\s*Y/ }]
            ])
        });

        this.instructions.set('LDY', {
            modes: new Map([
                ['IMM', { opcode: 0xA0, bytes: 2, pattern: /#\$(\w+)/ }],
                ['ZP', { opcode: 0xA4, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPX', { opcode: 0xB4, bytes: 2, pattern: /\$(\w{2}),\s*X/ }],
                ['ABS', { opcode: 0xAC, bytes: 3, pattern: /\$(\w{4})/ }],
                ['ABX', { opcode: 0xBC, bytes: 3, pattern: /\$(\w{4}),\s*X/ }]
            ])
        });

        this.instructions.set('STA', {
            modes: new Map([
                ['ABS', { opcode: 0x8D, bytes: 3, pattern: /^\$(\w{4})$/ }],
                ['ABX', { opcode: 0x9D, bytes: 3, pattern: /^\$(\w{4}),\s*X$/ }],
                ['ABY', { opcode: 0x99, bytes: 3, pattern: /^\$(\w{4}),\s*Y$/ }],
                ['ZP', { opcode: 0x85, bytes: 2, pattern: /^\$(\w{2})$/ }],
                ['ZPX', { opcode: 0x95, bytes: 2, pattern: /^\$(\w{2}),\s*X$/ }]
            ])
        });

        this.instructions.set('STX', {
            modes: new Map([
                ['ZP', { opcode: 0x86, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPY', { opcode: 0x96, bytes: 2, pattern: /\$(\w{2}),\s*Y/ }],
                ['ABS', { opcode: 0x8E, bytes: 3, pattern: /\$(\w{4})/ }]
            ])
        });

        this.instructions.set('STY', {
            modes: new Map([
                ['ZP', { opcode: 0x84, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPX', { opcode: 0x94, bytes: 2, pattern: /\$(\w{2}),\s*X/ }],
                ['ABS', { opcode: 0x8C, bytes: 3, pattern: /\$(\w{4})/ }]
            ])
        });

        // Transfer instructions
        this.instructions.set('TAX', { modes: new Map([['IMP', { opcode: 0xAA, bytes: 1 }]]) });
        this.instructions.set('TAY', { modes: new Map([['IMP', { opcode: 0xA8, bytes: 1 }]]) });
        this.instructions.set('TXA', { modes: new Map([['IMP', { opcode: 0x8A, bytes: 1 }]]) });
        this.instructions.set('TYA', { modes: new Map([['IMP', { opcode: 0x98, bytes: 1 }]]) });

        // Increment/Decrement
        this.instructions.set('INX', { modes: new Map([['IMP', { opcode: 0xE8, bytes: 1 }]]) });
        this.instructions.set('INY', { modes: new Map([['IMP', { opcode: 0xC8, bytes: 1 }]]) });
        this.instructions.set('DEX', { modes: new Map([['IMP', { opcode: 0xCA, bytes: 1 }]]) });
        this.instructions.set('DEY', { modes: new Map([['IMP', { opcode: 0x88, bytes: 1 }]]) });

        // Jump/Call
        this.instructions.set('JMP', { modes: new Map([['ABS', { opcode: 0x4C, bytes: 3, pattern: /\$(\w{4})/ }]]) });
        this.instructions.set('JSR', { modes: new Map([['ABS', { opcode: 0x20, bytes: 3, pattern: /\$(\w{4})/ }]]) });
        this.instructions.set('RTS', { modes: new Map([['IMP', { opcode: 0x60, bytes: 1 }]]) });

        // Stack operations
        this.instructions.set('PHA', { modes: new Map([['IMP', { opcode: 0x48, bytes: 1 }]]) });
        this.instructions.set('PLA', { modes: new Map([['IMP', { opcode: 0x68, bytes: 1 }]]) });

        // System
        this.instructions.set('BRK', { modes: new Map([['IMP', { opcode: 0x00, bytes: 1 }]]) });

        // Arithmetic
        this.instructions.set('ADC', {
            modes: new Map([
                ['IMM', { opcode: 0x69, bytes: 2, pattern: /#\$(\w+)/ }],
                ['ZP', { opcode: 0x65, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPX', { opcode: 0x75, bytes: 2, pattern: /\$(\w{2}),\s*X/ }]
            ])
        });

        // Logical
        this.instructions.set('AND', {
            modes: new Map([
                ['IMM', { opcode: 0x29, bytes: 2, pattern: /#\$(\w+)/ }],
                ['ZP', { opcode: 0x25, bytes: 2, pattern: /\$(\w{2})/ }],
                ['ZPX', { opcode: 0x35, bytes: 2, pattern: /\$(\w{2}),\s*X/ }]
            ])
        });
    }

    public assemble(source: string): AssemblyResult {
        this.sourceLines = [];
        this.compiledBytes = [];
        this.labels.clear();
        this.originAddress = 0x0000;

        // First pass: parse source and collect labels
        this.firstPass(source);

        // Second pass: generate machine code
        this.secondPass();

        return {
            bytes: new Uint8Array(this.compiledBytes),
            sourceLines: this.sourceLines,
            originAddress: this.originAddress
        };
    }

    private firstPass(source: string): void {
        const lines = source.split('\n');
        let address = this.originAddress;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const sourceLine: SourceLine = {
                lineNumber: i + 1,
                text: line,
                address: address,
                bytes: [],
                instruction: '',
                error: ''
            };

            if (line === '' || line.startsWith(';')) {
                this.sourceLines.push(sourceLine);
                continue;
            }

            // Check for .ORG directive
            const orgMatch = line.match(/\.ORG\s+\$(\w+)/i);
            if (orgMatch) {
                this.originAddress = parseInt(orgMatch[1], 16);
                address = this.originAddress;
                sourceLine.instruction = '.ORG';
                this.sourceLines.push(sourceLine);
                continue;
            }

            // Check for label
            const labelMatch = line.match(/^(\w+):/);
            if (labelMatch) {
                const label = labelMatch[1];
                this.labels.set(label, address);
                sourceLine.instruction = label + ':';
                
                // Check if there's an instruction on the same line
                const afterLabel = line.substring(labelMatch[0].length).trim();
                if (afterLabel) {
                    this.parseInstruction(afterLabel, sourceLine, address);
                    address += sourceLine.bytes.length;
                }
            } else {
                this.parseInstruction(line, sourceLine, address);
                address += sourceLine.bytes.length;
            }

            this.sourceLines.push(sourceLine);
        }
    }

    private secondPass(): void {
        // Resolve labels and generate final bytes
        for (const sourceLine of this.sourceLines) {
            if (sourceLine.bytes.length > 0) {
                // Check if any bytes need label resolution
                for (let i = 0; i < sourceLine.bytes.length; i++) {
                        if (typeof sourceLine.bytes[i] === 'string') {
                            const labelName = sourceLine.bytes[i] as unknown as string;
                        const labelAddress = this.labels.get(labelName);
                        if (labelAddress !== undefined) {
                            sourceLine.bytes[i] = labelAddress & 0xFF;
                            if (i + 1 < sourceLine.bytes.length) {
                                sourceLine.bytes[i + 1] = (labelAddress >> 8) & 0xFF;
                            }
                        } else {
                            sourceLine.error = `Undefined label: ${labelName}`;
                        }
                    }
                }
                
                // Add bytes to compiled output
                for (const byte of sourceLine.bytes) {
                    if (typeof byte === 'number') {
                        this.compiledBytes.push(byte);
                    }
                }
            }
        }
    }

    private parseInstruction(line: string, sourceLine: SourceLine, address: number): void {
        // Remove comments first
        const codeOnly = line.split(';')[0].trim();
        const parts = codeOnly.split(/\s+/);
        if (parts.length === 0) return;

        const mnemonic = parts[0].toUpperCase();
        const operand = parts.slice(1).join(' ').trim();

        const instruction = this.instructions.get(mnemonic);
        if (!instruction) {
            sourceLine.error = `Unknown instruction: ${mnemonic}`;
            return;
        }

        sourceLine.instruction = mnemonic;

        // Try each addressing mode
        console.log('Assembling:', mnemonic, operand);
        for (const [mode, modeInfo] of instruction.modes) {
            if (mode === 'IMP') {
                sourceLine.bytes = [modeInfo.opcode];
                return;
            }

            if (modeInfo.pattern) {
                const match = operand.match(modeInfo.pattern);
                if (match) {
                    console.log('Matched mode:', mode, 'with opcode:', modeInfo.opcode.toString(16));
                    sourceLine.bytes = [modeInfo.opcode];
                    
                    if (mode === 'IMM') {
                        const value = parseInt(match[1], 16);
                        sourceLine.bytes.push(value & 0xFF);
                    } else if (mode === 'ZP' || mode === 'ZPX' || mode === 'ZPY') {
                        const value = parseInt(match[1], 16);
                        sourceLine.bytes.push(value & 0xFF);
                    } else if (mode === 'ABS' || mode === 'ABX' || mode === 'ABY') {
                        const value = parseInt(match[1], 16);
                        sourceLine.bytes.push(value & 0xFF);
                        sourceLine.bytes.push((value >> 8) & 0xFF);
                    }
                    return;
                }
            }
        }

        // Check if operand is a label (for jumps)
        if (this.labels.has(operand)) {
            const modeInfo = instruction.modes.get('ABS');
            if (modeInfo) {
                sourceLine.bytes = [modeInfo.opcode, 'LABEL' as unknown as number, 'LABEL' as unknown as number]; // Placeholder for label
                return;
            }
        }

        sourceLine.error = `Invalid addressing mode for ${mnemonic} ${operand}`;
    }
}

export interface InstructionInfo {
    modes: Map<string, ModeInfo>;
}

export interface ModeInfo {
    opcode: number;
    bytes: number;
    pattern?: RegExp;
}

export interface SourceLine {
    lineNumber: number;
    text: string;
    address: number;
    bytes: number[];
    instruction: string;
    error: string;
}

export interface AssemblyResult {
    bytes: Uint8Array;
    sourceLines: SourceLine[];
    originAddress: number;
}