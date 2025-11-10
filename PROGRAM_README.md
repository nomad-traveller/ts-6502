# Simple 6502 Assembly Program

This program demonstrates basic 6502 instructions: LDA (Load Accumulator), STA (Store Accumulator), and BRK (Break).

## Assembly Source (simple_program.asm)
```assembly
        .ORG $0000        ; Program starts at address $0000

START:  LDA #$42         ; Load immediate value $42 (66 decimal) into accumulator
        STA $0200        ; Store accumulator value to memory location $0200
        LDA #$FF         ; Load immediate value $FF (255 decimal) into accumulator  
        STA $0201        ; Store accumulator value to memory location $0201
        BRK              ; Break/Stop execution
```

## Machine Code Breakdown

| Address | Hex Code | Instruction | Description |
|---------|----------|-------------|-------------|
| $0000   | A9 42    | LDA #$42    | Load $42 into accumulator |
| $0002   | 8D 00 02 | STA $0200   | Store accumulator to $0200 |
| $0005   | A9 FF    | LDA #$FF    | Load $FF into accumulator |
| $0007   | 8D 01 02 | STA $0201   | Store accumulator to $0201 |
| $000A   | 00       | BRK         | Break/Stop execution |

## How to Load and Run

1. **Using the Web Emulator:**
   - Open http://localhost:8000
   - Click "Load Program"
   - Select either `simple_program.bin` or `simple_program.hex`
   - Click "Step" to execute each instruction

2. **Expected Execution Flow:**
   - **Step 1**: Execute `LDA #$42` → A register becomes $42
   - **Step 2**: Execute `STA $0200` → Memory $0200 becomes $42
   - **Step 3**: Execute `LDA #$FF` → A register becomes $FF
   - **Step 4**: Execute `STA $0201` → Memory $0201 becomes $FF
   - **Step 5**: Execute `BRK` → Program stops

3. **Verify Results:**
   - Check registers: A should show $FF
   - Check memory: Go to address $0200 to see $42, $0201 to see $FF

## File Formats

- **simple_program.asm**: Human-readable assembly source
- **simple_program.bin**: Raw binary machine code (11 bytes)
- **simple_program.hex**: Intel HEX format for loading

## Instruction Details

- **LDA #$nn**: Load immediate value into accumulator (2 bytes, 2 cycles)
- **STA $aaaa**: Store accumulator to absolute address (3 bytes, 4 cycles)  
- **BRK**: Force break/interrupt (1 byte, 7 cycles)

This simple program is perfect for testing the emulator's basic functionality!