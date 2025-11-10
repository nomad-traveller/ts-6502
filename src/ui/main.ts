// Main UI Controller for 6502 Emulator
import { CPU6502 } from '../core/cpu';
import { Assembler6502 } from '../utils/assembler';
import { FileLoader } from '../utils/file-loader';
import { RegistersComponent } from './components/registers';
import { MemoryComponent } from './components/memory';
import { DisassemblyComponent } from './components/disassembly';

// Import CSS
import './styles.css';

export class MainUI {
    private cpu: CPU6502;
    private assembler: Assembler6502;
    private registersComponent: RegistersComponent;
    private memoryComponent: MemoryComponent;
    private disassemblyComponent: DisassemblyComponent;
    private isRunning: boolean = false;

    constructor() {
        this.cpu = new CPU6502();
        this.assembler = new Assembler6502();
        this.registersComponent = new RegistersComponent(this.cpu);
        this.memoryComponent = new MemoryComponent(this.cpu);
        this.disassemblyComponent = new DisassemblyComponent(this.cpu);
        
        this.initializeUI();
        this.loadSampleProgram();
    }

    private initializeUI(): void {
        this.setupEventListeners();
        this.updateDisplay();
    }

    private setupEventListeners(): void {
        const stepBtn = document.getElementById('stepBtn');
        const loadBtn = document.getElementById('loadBtn');
        const resetBtn = document.getElementById('resetBtn');

        if (stepBtn) {
            stepBtn.addEventListener('click', () => this.step());
        }
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.loadFile());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }

        // Setup tab functionality
        this.setupTabs();
    }

    private setupTabs(): void {
        const tabs = document.querySelectorAll('.memory-tab');
        const contents = document.querySelectorAll('.memory-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    private loadSampleProgram(): void {
        // Simple test program: LDA #$42, STA $0200, BRK
        const program = new Uint8Array([
            0xA9, 0x42,  // LDA #$42
            0x8D, 0x02, 0x00,  // STA $0200
            0x00  // BRK
        ]);
        this.cpu.memory.loadProgram(program, 0x0000);
        this.updateDisplay();
    }

    public step(): void {
        this.cpu.step();
        this.updateDisplay();
    }

    public reset(): void {
        this.cpu.reset();
        this.updateDisplay();
    }

    public async loadFile(): Promise<void> {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.bin,.hex,.asm';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    if (file.name.endsWith('.asm')) {
                        const content = await FileLoader.loadTextFile(file);
                        const result = this.assembler.assemble(content);
                        this.cpu.memory.loadProgram(result.bytes, result.originAddress);
                        console.log('Assembled', result.bytes.length, 'bytes from', file.name);
                    } else if (file.name.endsWith('.hex')) {
                        const content = await FileLoader.loadTextFile(file);
                        const data = FileLoader.parseHexFile(content);
                        this.cpu.memory.loadProgram(data, 0x0000);
                    } else {
                        const data = await FileLoader.loadFile(file);
                        this.cpu.memory.loadProgram(data, 0x0000);
                    }
                    
                    // Clear stack when loading new program
                    this.clearStack();
                    this.updateDisplay();
                } catch (error) {
                    console.error('Error loading file:', error);
                }
            }
        };
        input.click();
    }

    public assembleCode(): void {
        // Assembly functionality disabled for now - no code editor in UI
        console.log('Assembly functionality not available in current UI');
    }

    private clearStack(): void {
        // Clear stack memory ($0100-$01FF)
        for (let i = 0; i < 0x100; i++) {
            this.cpu.memory.writeByte(0x0100 + i, 0x00);
        }
        // Reset stack pointer
        this.cpu.SP = 0xFF;
    }

    private updateDisplay(): void {
        this.registersComponent.update();
        this.memoryComponent.update();
        this.disassemblyComponent.update();
    }
}

// Global functions for HTML event handlers
let mainUI: MainUI | null = null;

function stepCPU(): void {
    if (mainUI) mainUI.step();
}

function resetCPU(): void {
    if (mainUI) mainUI.reset();
}

function loadProgram(): void {
    if (mainUI) mainUI.loadFile();
}



// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('6502 Emulator loaded');
    mainUI = new MainUI();
    console.log('Main UI initialized');
});

// Make MainUI available globally for testing
(window as any).MainUI = MainUI;