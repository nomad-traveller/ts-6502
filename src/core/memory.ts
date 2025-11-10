// Memory Management for 6502 Emulator
export class Memory {
    public data: Uint8Array;

    constructor() {
        this.data = new Uint8Array(0x10000); // 64KB memory
    }

    public readByte(address: number): number {
        return this.data[address & 0xFFFF];
    }

    public writeByte(address: number, value: number): void {
        this.data[address & 0xFFFF] = value & 0xFF;
    }

    public readWord(address: number): number {
        return this.readByte(address) | (this.readByte(address + 1) << 8);
    }

    public writeWord(address: number, value: number): void {
        this.writeByte(address, value & 0xFF);
        this.writeByte(address + 1, (value >> 8) & 0xFF);
    }

    public loadProgram(data: Uint8Array, startAddress: number = 0x0000): void {
        for (let i = 0; i < data.length && (startAddress + i) < 0x10000; i++) {
            this.data[startAddress + i] = data[i];
        }
    }

    public clear(): void {
        this.data.fill(0);
    }

    public dump(startAddress: number = 0x0000, length: number = 256): Uint8Array {
        const end = Math.min(startAddress + length, 0x10000);
        return this.data.slice(startAddress, end);
    }
}