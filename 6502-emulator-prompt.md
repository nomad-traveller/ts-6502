# 6502 Emulator & Debugger - Complete AI Generation Prompt

## Project Overview
Create a comprehensive 6502 CPU Emulator & Debugger with a professional web interface. This is a sophisticated development tool for 6502 assembly programming that includes CPU emulation, memory management, assembler, source-level debugging, and a modern dark-themed interface.

## Core Requirements

### 1. CPU Emulation (6502 Processor)
- Implement full 6502 instruction set (151 instructions)
- Accurate cycle counting for each instruction
- Proper flag handling (N, V, B, D, I, Z, C)
- Stack pointer management ($0100-$01FF)
- All addressing modes: Immediate, Absolute, Zero Page, Zero Page X/Y, Absolute X/Y, Indirect X, Indirect Y, Accumulator, Implied, Relative
- Interrupt handling (IRQ, NMI, RESET)
- BRK instruction support

### 2. Memory System
- 64KB memory space ($0000-$FFFF)
- Memory-mapped I/O support
- Configurable memory regions (RAM, ROM, I/O)
- Memory protection and breakpoints
- Hex dump view with ASCII display
- Multiple memory windows for different address ranges
- Real-time memory updates during execution

### 3. Assembler
- Full 6502 assembly language support
- Multiple addressing modes per instruction
- Symbol table management
- Label resolution
- Directive support (.ORG, .BYTE, .WORD, .END)
- Error reporting with line numbers
- Support for binary (.bin), Intel HEX (.hex), and raw assembly (.asm) files

### 4. Debugger Interface
- **Register Display**: Real-time display of A, X, Y, SP, PC registers
- **Flag Display**: Visual representation of processor flags (N, V, B, D, I, Z, C)
- **Disassembly Window**: Source-level debugging with current instruction highlighting
- **Memory Windows**: Multiple configurable memory viewers
- **Stack Display**: Visual stack representation
- **Execution Control**: Step, Reset, Run, Breakpoint controls
- **Program Loading**: Support for multiple file formats

### 5. User Interface Design

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    6502 CPU EMULATOR & DEBUGGER            │
├─────────────┬─────────────────────────────┬─────────────────┤
│   Registers │        Main Window           │    Memory       │
│             │    (Disassembly)             │                 │
│   A: $00    │  Line  Source  Addr Bytes   │  Address Hex    │
│   X: $00    │  ─────────────────────────  │  $0000  00 01   │
│   Y: $00    │    10  LDA #$00   $A9 00    │  $0008  02 03   │
│   SP: $FF   │→  11  STA $0200  $8D 00 02  │  $0010  04 05   │
│   PC: $0000 │    12  BRK        $00       │                 │
│             │                             │                 │
│   Flags:    │                             │                 │
│  N V B D I Z C                             │                 │
│  □ □ □ □ □ □ □                             │                 │
├─────────────┼─────────────────────────────┼─────────────────┤
│   Memory 2  │                             │   Controls      │
│             │                             │                 │
│  Address Hex│                             │ [Step] [Reset]  │
│  $8000  A9 00│                             │ [Load Program]  │
│  $8002  8D 00│                             │                 │
└─────────────┴─────────────────────────────┴─────────────────┘
```

#### Design Specifications
- **Color Scheme**: Dark terminal theme (#1a1a1a background, #00ff00 primary text, #ffff00 highlights)
- **Typography**: Monospace fonts (Courier New) for all technical displays
- **Layout**: CSS Grid with responsive design
- **Window Heights**: Header 50px, Main windows 300px, Controls 40px
- **Column Widths**: Register 200px, Main 1fr, Memory 300px
- **Gap Spacing**: 6px between all elements
- **Viewport**: Full height utilization (calc(100vh - 10px))

### 6. File Structure
```
project/
├── index.html              # Main interface
├── src/
│   ├── cpu6502.ts          # CPU emulation core
│   ├── assembler.ts        # Assembly language parser
│   ├── debugger.ts         # Debugging interface
│   └── main.ts             # Application entry point
├── dist/                   # Compiled JavaScript
├── examples/               # Sample 6502 programs
└── tests/                  # Unit tests
```

### 7. Technical Implementation Details

#### CPU Core (cpu6502.ts)
```typescript
class CPU6502 {
    // Registers
    A: number = 0;      // Accumulator
    X: number = 0;      // X index register
    Y: number = 0;      // Y index register
    SP: number = 0xFF;  // Stack pointer
    PC: number = 0;     // Program counter
    
    // Flags
    N: boolean = false; // Negative
    V: boolean = false; // Overflow
    B: boolean = false; // Break
    D: boolean = false; // Decimal
    I: boolean = false; // Interrupt disable
    Z: boolean = false; // Zero
    C: boolean = false; // Carry
    
    // Memory
    memory: Uint8Array = new Uint8Array(65536);
    
    // Methods
    reset(): void;
    step(): number; // Returns cycles used
    irq(): void;
    nmi(): void;
    read(address: number): number;
    write(address: number, value: number): void;
}
```

#### Assembler (assembler.ts)
```typescript
class Assembler {
    // Instruction patterns for all addressing modes
    private instructions: Map<string, InstructionInfo>;
    
    // Symbol table for labels
    private symbols: Map<string, number>;
    
    // Assembly methods
    parse(source: string): Program;
    resolveLabels(program: Program): void;
    generateBytes(program: Program): Uint8Array;
}
```

#### Debugger Interface (debugger.ts)
```typescript
class Debugger {
    cpu: CPU6502;
    breakpoints: Set<number>;
    
    // UI update methods
    updateRegisters(): void;
    updateFlags(): void;
    updateDisassembly(): void;
    updateMemory(startAddr: number): void;
    
    // Debugging controls
    step(): void;
    reset(): void;
    toggleBreakpoint(address: number): void;
}
```

### 8. Instruction Set Implementation

#### Required Instructions (Complete 6502 Set)
**Arithmetic**: ADC, SBC, INC, INX, INY, DEC, DEX, DEY
**Logic**: AND, ORA, EOR, BIT
**Shifts**: ASL, LSR, ROL, ROR
**Moves**: LDA, LDX, LDY, STA, STX, STY, TAX, TAY, TXA, TYA, TSX, TXS
**Stack**: PHA, PHP, PLA, PLP
**Jumps**: JMP, JSR, RTS, RTI
**Branches**: BCC, BCS, BEQ, BNE, BMI, BPL, BVC, BVS
**Status**: CLC, CLD, CLI, CLV, SEC, SED, SEI
**Other**: BRK, NOP

#### Addressing Modes per Instruction
- **LDA**: Immediate, Absolute, Zero Page, Zero Page X, Absolute X, Absolute Y, Indirect X, Indirect Y
- **STA**: Absolute, Zero Page, Zero Page X, Absolute X, Absolute Y, Indirect X, Indirect Y
- **JMP**: Absolute, Indirect
- **Branch instructions**: Relative only
- **Implied instructions**: No operands (BRK, CLC, etc.)

### 9. Advanced Features

#### Breakpoint System
- Memory breakpoints (execute, read, write)
- Conditional breakpoints
- Breakpoint management interface

#### Performance Monitoring
- Cycle counter display
- Instructions per second
- Execution time tracking

#### Code Analysis
- Cross-reference display
- Memory usage statistics
- Code coverage visualization

#### Export/Import
- Save/load debugging sessions
- Export disassembly to text
- Import symbol files

### 10. Error Handling & Validation

#### Assembler Errors
- Syntax errors with line numbers
- Undefined symbol references
- Addressing mode mismatches
- Memory overflow detection

#### Runtime Errors
- Invalid memory access
- Stack overflow/underflow
- Invalid instruction detection
- Interrupt handling errors

### 11. Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for tablets and mobile
- Touch interface support for mobile devices
- Keyboard shortcuts for power users

### 12. Performance Requirements
- Real-time emulation speed (≥ 1MHz effective)
- Smooth UI updates during execution
- Efficient memory management
- Fast disassembly rendering

### 13. Testing Requirements
- Unit tests for CPU instructions
- Integration tests for assembler
- UI component testing
- Performance benchmarks
- Cross-browser compatibility tests

### 14. Documentation
- User manual with tutorials
- API documentation for developers
- 6502 instruction reference
- Example programs with explanations

### 15. Example Programs to Include
1. **Hello World**: Simple text output to memory
2. **Memory Test**: Memory pattern generation and verification
3. **Sorting Algorithm**: Demonstrate complex logic
4. **Graphics Demo**: Simple bitmap generation
5. **Sound Generation**: Square wave output simulation

## Implementation Priority

### Phase 1: Core Functionality
1. Basic CPU emulation (essential instructions)
2. Simple memory system
3. Basic UI layout
4. Step execution

### Phase 2: Complete Instruction Set
1. All 6502 instructions
2. Proper cycle counting
3. Flag handling
4. Stack operations

### Phase 3: Assembler & Debugging
1. Complete assembler
2. Disassembly view
3. Breakpoint system
4. Register/flag display

### Phase 4: Advanced Features
1. Multiple memory windows
2. File I/O
3. Performance monitoring
4. Advanced debugging features

### Phase 5: Polish & Optimization
1. UI refinements
2. Performance optimization
3. Error handling
4. Documentation

## Success Criteria
- ✅ All 6502 instructions implemented correctly
- ✅ Accurate cycle timing
- ✅ Professional dark-themed interface
- ✅ Real-time debugging capabilities
- ✅ Multiple file format support
- ✅ Responsive design
- ✅ No scrolling required on standard displays
- ✅ Smooth performance during execution

## Technical Constraints
- Single-page web application
- No external dependencies except for build tools
- TypeScript for type safety
- Modern CSS Grid for layout
- Vanilla JavaScript (no frameworks required)

This prompt provides a comprehensive specification for creating a professional-grade 6502 Emulator & Debugger that rivals commercial development tools while maintaining the simplicity and elegance of a web-based application.