# 6502 Emulator with Assembler - Now Complete!

## ✅ NEW FEATURES ADDED:

### 1. **Built-in 6502 Assembler**
- Compiles assembly source code (.asm files) to machine code
- Supports all major instructions: LDA, LDX, LDY, STA, STX, STY, etc.
- Multiple addressing modes: Immediate, Zero Page, Absolute, Indexed
- Label support for jumps and branches
- Error reporting with line numbers

### 2. **Main Window with Side-by-Side Display**
- **Line**: Source code line number
- **Source**: Original assembly source code
- **Address**: Memory address where instruction is loaded
- **Bytes**: Compiled machine code in hex
- **Mnemonic**: Instruction mnemonic
- **Status**: OK/Error indicators

### 3. **Smart File Loading**
- **.asm files**: Automatically assembles and loads
- **.bin files**: Loads raw machine code
- **.hex files**: Loads Intel HEX format
- Real-time error reporting

## 🎯 HOW TO USE:

### Loading Assembly Files:
1. Click "Load Program (.asm/.bin/.hex)"
2. Select `simple_program.asm`
3. Watch it compile automatically in Main Window
4. See source code alongside machine code

### Step Through Execution:
1. Click "Step" to execute one instruction
2. Watch current line highlight in yellow
3. See registers and flags update
4. Check memory locations for stored values

### What You'll See:
```
Line | Source                | Address | Bytes    | Mnemonic | Status
-----|-----------------------|---------|----------|----------|--------
1    | .ORG $0000          |         |          | .ORG     |
2    | START:  LDA #$42    | $0000   | A9 42    | LDA      | OK
3    |         STA $0200   | $0002   | 8D 00 02 | STA     | OK
4    |         LDA #$FF    | $0005   | A9 FF    | LDA      | OK
5    |         STA $0201   | $0007   | 8D 01 02 | STA     | OK
6    |         BRK         | $000A   | 00       | BRK      | OK
```

## 🔧 TECHNICAL DETAILS:

### Supported Instructions:
- **Load**: LDA, LDX, LDY (IMM, ZP, ABS, indexed)
- **Store**: STA, STX, STY (ZP, ABS, indexed)
- **Transfer**: TAX, TAY, TXA, TYA
- **Arithmetic**: ADC (IMM, ZP, ZPX)
- **Logical**: AND (IMM, ZP, ZPX)
- **Increment/Decrement**: INX, INY, DEX, DEY
- **Jump/Call**: JMP, JSR, RTS
- **System**: BRK

### Addressing Modes:
- **IMM**: Immediate (#$42)
- **ZP**: Zero Page ($00)
- **ZPX/ZPY**: Zero Page Indexed ($00,X)
- **ABS**: Absolute ($0000)
- **ABX/ABY**: Absolute Indexed ($0000,X)

## 🧪 TEST NOW:

1. **Open**: http://localhost:8000
2. **Load**: Select `simple_program.asm`
3. **Watch**: Assembly compiles with side-by-side view
4. **Step**: Execute 5 times
5. **Verify**: Memory $0200=$42, $0201=$FF

The emulator now reads, compiles, and displays assembly source code just like a real development environment!