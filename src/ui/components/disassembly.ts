// Disassembly UI Component
import { CPU6502 } from '../../core/cpu';
import { DisassembledInstruction } from '../../core/instruction';

export class DisassemblyComponent {
    private cpu: CPU6502;

    constructor(cpu: CPU6502) {
        this.cpu = cpu;
    }

    public update(): void {
        this.updateDisassemblyView();
    }

    private updateDisassemblyView(): void {
        const tbody = document.getElementById('disassemblyBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const startAddr = Math.max(0, this.cpu.PC - 0x20);
        let currentAddr = startAddr;
        let brkFound = false;
        
        for (let i = 0; i < 20; i++) {
            if (currentAddr >= 0x10000) break;
            
            const instruction = this.cpu.disassemble(currentAddr);
            
            // Stop after first BRK instruction
            if (instruction.mnemonic === 'BRK') {
                if (!brkFound) {
                    brkFound = true;
                    // Show this BRK instruction
                    const row = document.createElement('tr');
                    if (currentAddr === this.cpu.PC) {
                        row.className = 'current-instruction';
                    }
                    
                    const bytesHex = instruction.bytes.map(b => 
                        b.toString(16).padStart(2, '0').toUpperCase()
                    ).join(' ');
                    
                    row.innerHTML = `
                        <td>$${instruction.address.toString(16).padStart(4, '0').toUpperCase()}</td>
                        <td>${instruction.mnemonic}</td>
                        <td>${instruction.operand || ''}</td>
                        <td>${bytesHex}</td>
                        <td>${instruction.comment}</td>
                    `;
                    
                    tbody.appendChild(row);
                }
                break; // Stop processing after BRK
            }
            
            const row = document.createElement('tr');
            
            if (currentAddr === this.cpu.PC) {
                row.className = 'current-instruction';
            }
            
            const bytesHex = instruction.bytes.map(b => 
                b.toString(16).padStart(2, '0').toUpperCase()
            ).join(' ');
            
            // Format operand properly
            let operand = instruction.operand;
            if (!operand) {
                // Generate operand from bytes if not provided
                if (instruction.bytes.length === 2) {
                    operand = `#$${instruction.bytes[1].toString(16).padStart(2, '0').toUpperCase()}`;
                } else if (instruction.bytes.length === 3) {
                    const addr = instruction.bytes[1] | (instruction.bytes[2] << 8);
                    operand = `$${addr.toString(16).padStart(4, '0').toUpperCase()}`;
                }
            }
            
            row.innerHTML = `
                <td>$${instruction.address.toString(16).padStart(4, '0').toUpperCase()}</td>
                <td>${instruction.mnemonic}</td>
                <td>${operand}</td>
                <td>${bytesHex}</td>
                <td>${instruction.comment}</td>
            `;
            
            tbody.appendChild(row);
            currentAddr += instruction.bytes.length;
        }
    }
}