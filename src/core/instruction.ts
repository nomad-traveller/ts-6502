// Instruction definitions and types for 6502 Emulator
export class Instruction {
    constructor(
        public mnemonic: string,
        public mode: string,
        public cycles: number,
        public execute: () => number
    ) {}
}

export interface DisassembledInstruction {
    address: number;
    bytes: number[];
    mnemonic: string;
    operand: string;
    comment: string;
}

export enum AddressingMode {
    IMM = 'IMM',    // Immediate
    ZP = 'ZP',      // Zero Page
    ZPX = 'ZPX',    // Zero Page X
    ZPY = 'ZPY',    // Zero Page Y
    ABS = 'ABS',    // Absolute
    ABX = 'ABX',    // Absolute X
    ABY = 'ABY',    // Absolute Y
    IMP = 'IMP',    // Implied
    IND = 'IND',    // Indirect
    INDX = 'INDX',  // Indexed Indirect
    INDY = 'INDY'   // Indirect Indexed
}

export const OPCODES: { [key: number]: { mnemonic: string; mode: AddressingMode; cycles: number } } = {
    // ADC
    0x69: { mnemonic: 'ADC', mode: AddressingMode.IMM, cycles: 2 },
    0x65: { mnemonic: 'ADC', mode: AddressingMode.ZP, cycles: 3 },
    0x75: { mnemonic: 'ADC', mode: AddressingMode.ZPX, cycles: 4 },
    
    // AND
    0x29: { mnemonic: 'AND', mode: AddressingMode.IMM, cycles: 2 },
    0x25: { mnemonic: 'AND', mode: AddressingMode.ZP, cycles: 3 },
    0x35: { mnemonic: 'AND', mode: AddressingMode.ZPX, cycles: 4 },
    
    // LDA
    0xA9: { mnemonic: 'LDA', mode: AddressingMode.IMM, cycles: 2 },
    0xA5: { mnemonic: 'LDA', mode: AddressingMode.ZP, cycles: 3 },
    0xB5: { mnemonic: 'LDA', mode: AddressingMode.ZPX, cycles: 4 },
    0xAD: { mnemonic: 'LDA', mode: AddressingMode.ABS, cycles: 4 },
    0xBD: { mnemonic: 'LDA', mode: AddressingMode.ABX, cycles: 4 },
    0xB9: { mnemonic: 'LDA', mode: AddressingMode.ABY, cycles: 4 },
    
    // LDX
    0xA2: { mnemonic: 'LDX', mode: AddressingMode.IMM, cycles: 2 },
    0xA6: { mnemonic: 'LDX', mode: AddressingMode.ZP, cycles: 3 },
    0xB6: { mnemonic: 'LDX', mode: AddressingMode.ZPY, cycles: 4 },
    0xAE: { mnemonic: 'LDX', mode: AddressingMode.ABS, cycles: 4 },
    0xBE: { mnemonic: 'LDX', mode: AddressingMode.ABY, cycles: 4 },
    
    // LDY
    0xA0: { mnemonic: 'LDY', mode: AddressingMode.IMM, cycles: 2 },
    0xA4: { mnemonic: 'LDY', mode: AddressingMode.ZP, cycles: 3 },
    0xB4: { mnemonic: 'LDY', mode: AddressingMode.ZPX, cycles: 4 },
    0xAC: { mnemonic: 'LDY', mode: AddressingMode.ABS, cycles: 4 },
    0xBC: { mnemonic: 'LDY', mode: AddressingMode.ABX, cycles: 4 },
    
    // STA
    0x85: { mnemonic: 'STA', mode: AddressingMode.ZP, cycles: 3 },
    0x95: { mnemonic: 'STA', mode: AddressingMode.ZPX, cycles: 4 },
    0x8D: { mnemonic: 'STA', mode: AddressingMode.ABS, cycles: 4 },
    0x9D: { mnemonic: 'STA', mode: AddressingMode.ABX, cycles: 5 },
    0x99: { mnemonic: 'STA', mode: AddressingMode.ABY, cycles: 5 },
    
    // STX
    0x86: { mnemonic: 'STX', mode: AddressingMode.ZP, cycles: 3 },
    0x96: { mnemonic: 'STX', mode: AddressingMode.ZPY, cycles: 4 },
    0x8E: { mnemonic: 'STX', mode: AddressingMode.ABS, cycles: 4 },
    
    // STY
    0x84: { mnemonic: 'STY', mode: AddressingMode.ZP, cycles: 3 },
    0x94: { mnemonic: 'STY', mode: AddressingMode.ZPX, cycles: 4 },
    0x8C: { mnemonic: 'STY', mode: AddressingMode.ABS, cycles: 4 },
    
    // Transfer instructions
    0xAA: { mnemonic: 'TAX', mode: AddressingMode.IMP, cycles: 2 },
    0xA8: { mnemonic: 'TAY', mode: AddressingMode.IMP, cycles: 2 },
    0x8A: { mnemonic: 'TXA', mode: AddressingMode.IMP, cycles: 2 },
    0x98: { mnemonic: 'TYA', mode: AddressingMode.IMP, cycles: 2 },
    
    // Increment/Decrement
    0xE8: { mnemonic: 'INX', mode: AddressingMode.IMP, cycles: 2 },
    0xC8: { mnemonic: 'INY', mode: AddressingMode.IMP, cycles: 2 },
    0xCA: { mnemonic: 'DEX', mode: AddressingMode.IMP, cycles: 2 },
    0x88: { mnemonic: 'DEY', mode: AddressingMode.IMP, cycles: 2 },
    
    // Jump/Call
    0x4C: { mnemonic: 'JMP', mode: AddressingMode.ABS, cycles: 3 },
    0x20: { mnemonic: 'JSR', mode: AddressingMode.ABS, cycles: 6 },
    0x60: { mnemonic: 'RTS', mode: AddressingMode.IMP, cycles: 6 },
    
    // Stack operations
    0x48: { mnemonic: 'PHA', mode: AddressingMode.IMP, cycles: 3 },
    0x68: { mnemonic: 'PLA', mode: AddressingMode.IMP, cycles: 4 },
    
    // BRK
    0x00: { mnemonic: 'BRK', mode: AddressingMode.IMP, cycles: 7 }
};