// 6502 CPU Emulator Core
import { Memory } from './memory';
import { Instruction, DisassembledInstruction } from './instruction';

export class CPU6502 {
    // Registers
    public A: number = 0;  // Accumulator
    public X: number = 0;  // X register
    public Y: number = 0;  // Y register
    public SP: number = 0xFF;  // Stack pointer
    public PC: number = 0x0000;  // Program counter
    public P: number = 0x24;  // Status register

    // Memory
    public memory: Memory;

    // Instruction set
    private instructions: Map<number, Instruction>;

    constructor() {
        this.memory = new Memory();
        this.instructions = new Map();
        this.initializeInstructions();
        this.reset();
    }

    private initializeInstructions(): void {
        // ADC
        this.instructions.set(0x69, new Instruction('ADC', 'IMM', 2, this.adcImmediate.bind(this)));
        this.instructions.set(0x65, new Instruction('ADC', 'ZP', 3, this.adcZeroPage.bind(this)));
        this.instructions.set(0x75, new Instruction('ADC', 'ZPX', 4, this.adcZeroPageX.bind(this)));
        
        // AND
        this.instructions.set(0x29, new Instruction('AND', 'IMM', 2, this.andImmediate.bind(this)));
        this.instructions.set(0x25, new Instruction('AND', 'ZP', 3, this.andZeroPage.bind(this)));
        this.instructions.set(0x35, new Instruction('AND', 'ZPX', 4, this.andZeroPageX.bind(this)));
        
        // LDA
        this.instructions.set(0xA9, new Instruction('LDA', 'IMM', 2, this.ldaImmediate.bind(this)));
        this.instructions.set(0xA5, new Instruction('LDA', 'ZP', 3, this.ldaZeroPage.bind(this)));
        this.instructions.set(0xB5, new Instruction('LDA', 'ZPX', 4, this.ldaZeroPageX.bind(this)));
        this.instructions.set(0xAD, new Instruction('LDA', 'ABS', 4, this.ldaAbsolute.bind(this)));
        this.instructions.set(0xBD, new Instruction('LDA', 'ABX', 4, this.ldaAbsoluteX.bind(this)));
        this.instructions.set(0xB9, new Instruction('LDA', 'ABY', 4, this.ldaAbsoluteY.bind(this)));
        
        // LDX
        this.instructions.set(0xA2, new Instruction('LDX', 'IMM', 2, this.ldxImmediate.bind(this)));
        this.instructions.set(0xA6, new Instruction('LDX', 'ZP', 3, this.ldxZeroPage.bind(this)));
        this.instructions.set(0xB6, new Instruction('LDX', 'ZPY', 4, this.ldxZeroPageY.bind(this)));
        this.instructions.set(0xAE, new Instruction('LDX', 'ABS', 4, this.ldxAbsolute.bind(this)));
        this.instructions.set(0xBE, new Instruction('LDX', 'ABY', 4, this.ldxAbsoluteY.bind(this)));
        
        // LDY
        this.instructions.set(0xA0, new Instruction('LDY', 'IMM', 2, this.ldyImmediate.bind(this)));
        this.instructions.set(0xA4, new Instruction('LDY', 'ZP', 3, this.ldyZeroPage.bind(this)));
        this.instructions.set(0xB4, new Instruction('LDY', 'ZPX', 4, this.ldyZeroPageX.bind(this)));
        this.instructions.set(0xAC, new Instruction('LDY', 'ABS', 4, this.ldyAbsolute.bind(this)));
        this.instructions.set(0xBC, new Instruction('LDY', 'ABX', 4, this.ldyAbsoluteX.bind(this)));
        
        // STA
        this.instructions.set(0x85, new Instruction('STA', 'ZP', 3, this.staZeroPage.bind(this)));
        this.instructions.set(0x95, new Instruction('STA', 'ZPX', 4, this.staZeroPageX.bind(this)));
        this.instructions.set(0x8D, new Instruction('STA', 'ABS', 4, this.staAbsolute.bind(this)));
        this.instructions.set(0x9D, new Instruction('STA', 'ABX', 5, this.staAbsoluteX.bind(this)));
        this.instructions.set(0x99, new Instruction('STA', 'ABY', 5, this.staAbsoluteY.bind(this)));
        
        // STX
        this.instructions.set(0x86, new Instruction('STX', 'ZP', 3, this.stxZeroPage.bind(this)));
        this.instructions.set(0x96, new Instruction('STX', 'ZPY', 4, this.stxZeroPageY.bind(this)));
        this.instructions.set(0x8E, new Instruction('STX', 'ABS', 4, this.stxAbsolute.bind(this)));
        
        // STY
        this.instructions.set(0x84, new Instruction('STY', 'ZP', 3, this.styZeroPage.bind(this)));
        this.instructions.set(0x94, new Instruction('STY', 'ZPX', 4, this.styZeroPageX.bind(this)));
        this.instructions.set(0x8C, new Instruction('STY', 'ABS', 4, this.styAbsolute.bind(this)));
        
        // TAX
        this.instructions.set(0xAA, new Instruction('TAX', 'IMP', 2, this.tax.bind(this)));
        
        // TAY
        this.instructions.set(0xA8, new Instruction('TAY', 'IMP', 2, this.tay.bind(this)));
        
        // TXA
        this.instructions.set(0x8A, new Instruction('TXA', 'IMP', 2, this.txa.bind(this)));
        
        // TYA
        this.instructions.set(0x98, new Instruction('TYA', 'IMP', 2, this.tya.bind(this)));
        
        // INX
        this.instructions.set(0xE8, new Instruction('INX', 'IMP', 2, this.inx.bind(this)));
        
        // INY
        this.instructions.set(0xC8, new Instruction('INY', 'IMP', 2, this.iny.bind(this)));
        
        // DEX
        this.instructions.set(0xCA, new Instruction('DEX', 'IMP', 2, this.dex.bind(this)));
        
        // DEY
        this.instructions.set(0x88, new Instruction('DEY', 'IMP', 2, this.dey.bind(this)));
        
        // JMP
        this.instructions.set(0x4C, new Instruction('JMP', 'ABS', 3, this.jmpAbsolute.bind(this)));
        
        // JSR
        this.instructions.set(0x20, new Instruction('JSR', 'ABS', 6, this.jsrAbsolute.bind(this)));
        
        // Stack operations
        this.instructions.set(0x48, new Instruction('PHA', 'IMP', 3, this.pha.bind(this)));
        this.instructions.set(0x68, new Instruction('PLA', 'IMP', 4, this.pla.bind(this)));
        
        // RTS
        this.instructions.set(0x60, new Instruction('RTS', 'IMP', 6, this.rts.bind(this)));
        
        // BRK
        this.instructions.set(0x00, new Instruction('BRK', 'IMP', 7, this.brk.bind(this)));
    }

    public reset(): void {
        this.A = 0;
        this.X = 0;
        this.Y = 0;
        this.SP = 0xFF;
        this.PC = 0x0000;
        this.P = 0x24; // Set I flag
        
        // Clear stack memory ($0100-$01FF)
        for (let i = 0; i < 0x100; i++) {
            this.memory.writeByte(0x0100 + i, 0x00);
        }
    }

    public step(): number {
        const opcode = this.memory.readByte(this.PC);
        const instruction = this.instructions.get(opcode);
        
        if (!instruction) {
            console.error(`Unknown opcode: $${opcode.toString(16).padStart(2, '0').toUpperCase()}`);
            return 0;
        }
        
        this.PC++;
        return instruction.execute();
    }

    // Flag helpers
    public setFlag(flag: number, value: boolean): void {
        if (value) {
            this.P |= flag;
        } else {
            this.P &= ~flag;
        }
    }

    public getFlag(flag: number): boolean {
        return (this.P & flag) !== 0;
    }

    public updateNZ(value: number): void {
        this.setFlag(0x02, value === 0); // Zero flag
        this.setFlag(0x80, (value & 0x80) !== 0); // Negative flag
    }

    // Stack operations
    public push(value: number): void {
        const stackAddress = 0x0100 + this.SP;
        this.memory.writeByte(stackAddress, value);
        this.SP = (this.SP - 1) & 0xFF;
    }

    public pop(): number {
        this.SP = (this.SP + 1) & 0xFF;
        const stackAddress = 0x0100 + this.SP;
        return this.memory.readByte(stackAddress);
    }

    // Instruction implementations
    private adcImmediate(): number {
        const value = this.memory.readByte(this.PC++);
        const result = this.A + value + (this.getFlag(0x01) ? 1 : 0);
        this.setFlag(0x01, result > 0xFF); // Carry
        this.setFlag(0x40, (result & 0x80) !== 0); // Negative
        this.updateNZ(result & 0xFF);
        this.A = result & 0xFF;
        return 2;
    }

    private adcZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        const value = this.memory.readByte(address);
        const result = this.A + value + (this.getFlag(0x01) ? 1 : 0);
        this.setFlag(0x01, result > 0xFF);
        this.setFlag(0x40, (result & 0x80) !== 0);
        this.updateNZ(result & 0xFF);
        this.A = result & 0xFF;
        return 3;
    }

    private adcZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        const value = this.memory.readByte(address);
        const result = this.A + value + (this.getFlag(0x01) ? 1 : 0);
        this.setFlag(0x01, result > 0xFF);
        this.setFlag(0x40, (result & 0x80) !== 0);
        this.updateNZ(result & 0xFF);
        this.A = result & 0xFF;
        return 4;
    }

    private andImmediate(): number {
        this.A &= this.memory.readByte(this.PC++);
        this.updateNZ(this.A);
        return 2;
    }

    private andZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.A &= this.memory.readByte(address);
        this.updateNZ(this.A);
        return 3;
    }

    private andZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        this.A &= this.memory.readByte(address);
        this.updateNZ(this.A);
        return 4;
    }

    private ldaImmediate(): number {
        this.A = this.memory.readByte(this.PC++);
        this.updateNZ(this.A);
        return 2;
    }

    private ldaZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.A = this.memory.readByte(address);
        this.updateNZ(this.A);
        return 3;
    }

    private ldaZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        this.A = this.memory.readByte(address);
        this.updateNZ(this.A);
        return 4;
    }

    private ldaAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.A = this.memory.readByte(address);
        this.updateNZ(this.A);
        return 4;
    }

    private ldaAbsoluteX(): number {
        const address = this.memory.readWord(this.PC) + this.X;
        this.PC += 2;
        this.A = this.memory.readByte(address);
        this.updateNZ(this.A);
        return 4;
    }

    private ldaAbsoluteY(): number {
        const address = this.memory.readWord(this.PC) + this.Y;
        this.PC += 2;
        this.A = this.memory.readByte(address);
        this.updateNZ(this.A);
        return 4;
    }

    private ldxImmediate(): number {
        this.X = this.memory.readByte(this.PC++);
        this.updateNZ(this.X);
        return 2;
    }

    private ldxZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.X = this.memory.readByte(address);
        this.updateNZ(this.X);
        return 3;
    }

    private ldxZeroPageY(): number {
        const address = (this.memory.readByte(this.PC++) + this.Y) & 0xFF;
        this.X = this.memory.readByte(address);
        this.updateNZ(this.X);
        return 4;
    }

    private ldxAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.X = this.memory.readByte(address);
        this.updateNZ(this.X);
        return 4;
    }

    private ldxAbsoluteY(): number {
        const address = this.memory.readWord(this.PC) + this.Y;
        this.PC += 2;
        this.X = this.memory.readByte(address);
        this.updateNZ(this.X);
        return 4;
    }

    private ldyImmediate(): number {
        this.Y = this.memory.readByte(this.PC++);
        this.updateNZ(this.Y);
        return 2;
    }

    private ldyZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.Y = this.memory.readByte(address);
        this.updateNZ(this.Y);
        return 3;
    }

    private ldyZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        this.Y = this.memory.readByte(address);
        this.updateNZ(this.Y);
        return 4;
    }

    private ldyAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.Y = this.memory.readByte(address);
        this.updateNZ(this.Y);
        return 4;
    }

    private ldyAbsoluteX(): number {
        const address = this.memory.readWord(this.PC) + this.X;
        this.PC += 2;
        this.Y = this.memory.readByte(address);
        this.updateNZ(this.Y);
        return 4;
    }

    private staZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.memory.writeByte(address, this.A);
        return 3;
    }

    private staZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        this.memory.writeByte(address, this.A);
        return 4;
    }

    private staAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.memory.writeByte(address, this.A);
        return 4;
    }

    private staAbsoluteX(): number {
        const address = this.memory.readWord(this.PC) + this.X;
        this.PC += 2;
        this.memory.writeByte(address, this.A);
        return 5;
    }

    private staAbsoluteY(): number {
        const address = this.memory.readWord(this.PC) + this.Y;
        this.PC += 2;
        this.memory.writeByte(address, this.A);
        return 5;
    }

    private stxZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.memory.writeByte(address, this.X);
        return 3;
    }

    private stxZeroPageY(): number {
        const address = (this.memory.readByte(this.PC++) + this.Y) & 0xFF;
        this.memory.writeByte(address, this.X);
        return 4;
    }

    private stxAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.memory.writeByte(address, this.X);
        return 4;
    }

    private styZeroPage(): number {
        const address = this.memory.readByte(this.PC++);
        this.memory.writeByte(address, this.Y);
        return 3;
    }

    private styZeroPageX(): number {
        const address = (this.memory.readByte(this.PC++) + this.X) & 0xFF;
        this.memory.writeByte(address, this.Y);
        return 4;
    }

    private styAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.memory.writeByte(address, this.Y);
        return 4;
    }

    private tax(): number {
        this.X = this.A;
        this.updateNZ(this.X);
        return 2;
    }

    private tay(): number {
        this.Y = this.A;
        this.updateNZ(this.Y);
        return 2;
    }

    private txa(): number {
        this.A = this.X;
        this.updateNZ(this.A);
        return 2;
    }

    private tya(): number {
        this.A = this.Y;
        this.updateNZ(this.A);
        return 2;
    }

    private inx(): number {
        this.X = (this.X + 1) & 0xFF;
        this.updateNZ(this.X);
        return 2;
    }

    private iny(): number {
        this.Y = (this.Y + 1) & 0xFF;
        this.updateNZ(this.Y);
        return 2;
    }

    private dex(): number {
        this.X = (this.X - 1) & 0xFF;
        this.updateNZ(this.X);
        return 2;
    }

    private dey(): number {
        this.Y = (this.Y - 1) & 0xFF;
        this.updateNZ(this.Y);
        return 2;
    }

    private jmpAbsolute(): number {
        this.PC = this.memory.readWord(this.PC);
        return 3;
    }

    private jsrAbsolute(): number {
        const address = this.memory.readWord(this.PC);
        this.PC += 2;
        this.push((this.PC - 1) >> 8);
        this.push((this.PC - 1) & 0xFF);
        this.PC = address;
        return 6;
    }

    private rts(): number {
        const low = this.pop();
        const high = this.pop();
        this.PC = (high << 8) | low;
        this.PC++;
        return 6;
    }

    private pha(): number {
        this.push(this.A);
        return 3;
    }

    private pla(): number {
        this.A = this.pop();
        this.updateNZ(this.A);
        return 4;
    }

    private brk(): number {
        this.push((this.PC + 1) >> 8);
        this.push((this.PC + 1) & 0xFF);
        this.push(this.P | 0x30);
        this.setFlag(0x04, true); // I flag
        this.PC = this.memory.readWord(0xFFFE);
        return 7;
    }

    // Disassembly
    public disassemble(address: number): DisassembledInstruction {
        const opcode = this.memory.readByte(address);
        const instruction = this.instructions.get(opcode);
        
        if (!instruction) {
            return {
                address,
                bytes: [opcode],
                mnemonic: '???',
                operand: '',
                comment: 'Unknown opcode'
            };
        }

        const bytes: number[] = [opcode];
        let operand = '';
        let comment = '';

        switch (instruction.mode) {
            case 'IMM':
                bytes.push(this.memory.readByte(address + 1));
                operand = `#$${bytes[1].toString(16).padStart(2, '0').toUpperCase()}`;
                comment = `Load immediate ${bytes[1]}`;
                break;
            case 'ZP':
                bytes.push(this.memory.readByte(address + 1));
                operand = `$${bytes[1].toString(16).padStart(2, '0').toUpperCase()}`;
                comment = `Zero page address $${bytes[1].toString(16).padStart(2, '0').toUpperCase()}`;
                break;
            case 'ZPX':
                bytes.push(this.memory.readByte(address + 1));
                operand = `$${bytes[1].toString(16).padStart(2, '0').toUpperCase()},X`;
                comment = `Zero page X indexed`;
                break;
            case 'ZPY':
                bytes.push(this.memory.readByte(address + 1));
                operand = `$${bytes[1].toString(16).padStart(2, '0').toUpperCase()},Y`;
                comment = `Zero page Y indexed`;
                break;
            case 'ABS':
                bytes.push(this.memory.readByte(address + 1), this.memory.readByte(address + 2));
                const absAddr = bytes[1] | (bytes[2] << 8);
                operand = `$${absAddr.toString(16).padStart(4, '0').toUpperCase()}`;
                comment = `Absolute address $${absAddr.toString(16).padStart(4, '0').toUpperCase()}`;
                break;
            case 'ABX':
                bytes.push(this.memory.readByte(address + 1), this.memory.readByte(address + 2));
                const abxAddr = bytes[1] | (bytes[2] << 8);
                operand = `$${abxAddr.toString(16).padStart(4, '0').toUpperCase()},X`;
                comment = `Absolute X indexed`;
                break;
            case 'ABY':
                bytes.push(this.memory.readByte(address + 1), this.memory.readByte(address + 2));
                const abyAddr = bytes[1] | (bytes[2] << 8);
                operand = `$${abyAddr.toString(16).padStart(4, '0').toUpperCase()},Y`;
                comment = `Absolute Y indexed`;
                break;
            case 'IMP':
                comment = 'Implied addressing';
                break;
        }

        return {
            address,
            bytes,
            mnemonic: instruction.mnemonic,
            operand,
            comment
        };
    }
}