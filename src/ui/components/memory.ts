// Memory UI Component
import { CPU6502 } from '../../core/cpu';

export class MemoryComponent {
    private cpu: CPU6502;
    private memoryViewStart: number = 0x0000;
    private memory2ViewStart: number = 0x0000;

    constructor(cpu: CPU6502) {
        this.cpu = cpu;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const memoryAddrInput = document.getElementById('memoryAddr') as HTMLInputElement;
        const gotoMemoryBtn = document.getElementById('gotoMemoryBtn');
        const memory2AddrInput = document.getElementById('memory2Addr') as HTMLInputElement;
        const gotoMemory2Btn = document.getElementById('gotoMemory2Btn');

        if (memoryAddrInput) {
            memoryAddrInput.addEventListener('change', () => this.gotoMemoryAddress());
        }
        if (gotoMemoryBtn) {
            gotoMemoryBtn.addEventListener('click', () => this.gotoMemoryAddress());
        }
        if (memory2AddrInput) {
            memory2AddrInput.addEventListener('change', () => this.gotoMemory2Address());
        }
        if (gotoMemory2Btn) {
            gotoMemory2Btn.addEventListener('click', () => this.gotoMemory2Address());
        }
    }

    public update(): void {
        this.updateMemoryView();
        this.updateMemory2View();
    }

    private gotoMemoryAddress(): void {
        const input = document.getElementById('memoryAddr') as HTMLInputElement;
        if (input) {
            const addressStr = input.value.replace('$', '');
            const address = parseInt(addressStr, 16);
            if (!isNaN(address)) {
                this.memoryViewStart = address & 0xFFF0; // Align to 16-byte boundary
                this.updateMemoryView();
            }
        }
    }

    private gotoMemory2Address(): void {
        const input = document.getElementById('memory2Addr') as HTMLInputElement;
        if (input) {
            const addressStr = input.value.replace('$', '');
            const address = parseInt(addressStr, 16);
            if (!isNaN(address)) {
                this.memory2ViewStart = address & 0xFFF0; // Align to 16-byte boundary
                this.updateMemory2View();
            }
        }
    }

    private updateMemoryView(): void {
        const tbody = document.getElementById('memoryBody');
        const addrInput = document.getElementById('memoryAddr') as HTMLInputElement;
        
        if (!tbody) return;

        if (addrInput) {
            addrInput.value = `$${this.memoryViewStart.toString(16).padStart(4, '0').toUpperCase()}`;
        }

        tbody.innerHTML = '';
        const memoryRows = this.getMemoryDump(this.memoryViewStart, 256);
        
        for (const row of memoryRows) {
            const tr = document.createElement('tr');
            
            const bytesHex = row.bytes.map(b => 
                b.toString(16).padStart(2, '0').toUpperCase()
            ).join(' ');
            
            tr.innerHTML = `
                <td>$${row.address.toString(16).padStart(4, '0').toUpperCase()}</td>
                <td>${bytesHex}</td>
                <td>${row.ascii}</td>
            `;
            
            tbody.appendChild(tr);
        }
    }

    private updateMemory2View(): void {
        const tbody = document.getElementById('memory2Body');
        const addrInput = document.getElementById('memory2Addr') as HTMLInputElement;
        
        if (!tbody) return;

        if (addrInput) {
            addrInput.value = `$${this.memory2ViewStart.toString(16).padStart(4, '0').toUpperCase()}`;
        }

        tbody.innerHTML = '';
        const memoryRows = this.getMemoryDump(this.memory2ViewStart, 256);
        
        for (const row of memoryRows) {
            const tr = document.createElement('tr');
            
            const bytesHex = row.bytes.map(b => 
                b.toString(16).padStart(2, '0').toUpperCase()
            ).join(' ');
            
            tr.innerHTML = `
                <td>$${row.address.toString(16).padStart(4, '0').toUpperCase()}</td>
                <td>${bytesHex}</td>
                <td>${row.ascii}</td>
            `;
            
            tbody.appendChild(tr);
        }
    }

    private getMemoryDump(start: number, count: number = 256): MemoryRow[] {
        const rows: MemoryRow[] = [];
        
        for (let i = 0; i < count; i += 16) {
            const address = start + i;
            const bytes: number[] = [];
            const ascii: string[] = [];
            
            for (let j = 0; j < 16; j++) {
                const byte = this.cpu.memory.readByte(address + j);
                bytes.push(byte);
                ascii.push(byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.');
            }
            
            rows.push({
                address,
                bytes,
                ascii: ascii.join('')
            });
        }
        
        return rows;
    }
}

interface MemoryRow {
    address: number;
    bytes: number[];
    ascii: string;
}