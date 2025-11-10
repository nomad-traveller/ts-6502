// Registers UI Component
import { CPU6502 } from '../../core/cpu';

export class RegistersComponent {
    private cpu: CPU6502;

    constructor(cpu: CPU6502) {
        this.cpu = cpu;
    }

    public update(): void {
        this.updateRegisterValues();
        this.updateFlags();
        this.updateStackView();
    }

    private updateRegisterValues(): void {
        const elements = {
            'regA': this.cpu.A,
            'regX': this.cpu.X,
            'regY': this.cpu.Y,
            'regSP': this.cpu.SP,
            'regPC': this.cpu.PC
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `$${value.toString(16).padStart(2, '0').toUpperCase()}`;
                if (id === 'regPC') {
                    element.textContent = `$${value.toString(16).padStart(4, '0').toUpperCase()}`;
                }
            }
        }
    }

    private updateFlags(): void {
        const flags = {
            'flagN': 0x80, // Negative
            'flagV': 0x40, // Overflow (not implemented)
            'flagB': 0x10, // Break
            'flagD': 0x08, // Decimal (not implemented)
            'flagI': 0x04, // Interrupt
            'flagZ': 0x02, // Zero
            'flagC': 0x01  // Carry
        };

        // Calculate the actual status register value from individual flags
        let statusValue = 0;
        for (const [id, mask] of Object.entries(flags)) {
            const element = document.getElementById(id);
            if (element) {
                const isSet = this.cpu.getFlag(mask);
                element.textContent = isSet ? '1' : '0';
                element.className = isSet ? 'flag-set' : 'flag-clear';
                
                if (isSet) {
                    statusValue |= mask;
                }
            }
        }

        // Update the status register hex value display
        const flagValueElement = document.getElementById('flagValue');
        if (flagValueElement) {
            flagValueElement.textContent = statusValue.toString(16).padStart(2, '0').toUpperCase();
        }
    }

    private updateStackView(): void {
        const tbody = document.getElementById('registerStackBody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const sp = this.cpu.SP;
        const nextStackAddr = 0x0100 + sp; // Next available stack location
        
        // Add stack info header
        const infoRow = document.createElement('tr');
        infoRow.innerHTML = `
            <td colspan="9" style="text-align: center; padding: 8px; background: linear-gradient(135deg, #333, #2a2a2a); border-radius: 6px; margin-bottom: 5px;">
                <strong>Stack Pointer:</strong> $${sp.toString(16).padStart(2, '0').toUpperCase()} 
                | <strong>Next Free:</strong> $${nextStackAddr.toString(16).padStart(4, '0').toUpperCase()}
                | <strong>Used:</strong> ${255 - sp} bytes
            </td>
        `;
        tbody.appendChild(infoRow);
        
        // Display stack starting from $01FF, counting backwards and downwards
        for (let i = 0; i < 8; i++) {
            const address = 0x01FF - (i * 8); // Start from $01FF, go down by 8 each row
            const bytes: number[] = [];
            
            for (let j = 0; j < 8; j++) {
                const byte = this.cpu.memory.readByte(address - j);
                bytes.push(byte);
            }
            
            const tr = document.createElement('tr');
            
            const bytesHex = bytes.map((b, idx) => {
                const byteStr = b.toString(16).padStart(2, '0').toUpperCase();
                const currentByteAddr = address - idx;
                
                // On 6502, SP points to next free stack location
                // The actual memory address is 0x0100 + SP
                const nextFreeAddr = 0x0100 + sp;
                
                if (currentByteAddr === nextFreeAddr) {
                    return `<span style="background-color: #00ff00; color: #000; font-weight: bold; padding: 1px 3px; border-radius: 2px;">${byteStr}</span>`;
                } else {
                    return byteStr;
                }
            }).join(' ');
            
            tr.innerHTML = `
                <td>$${address.toString(16).padStart(4, '0').toUpperCase()}</td>
                <td colspan="8">${bytesHex}</td>
            `;
            
            tbody.appendChild(tr);
        }
        

    }
}