# 6502 Emulator - File Loading Guide

## IMPORTANT: File Types

The 6502 emulator can ONLY load these file types:

### ✅ WORKING FILES:
- **simple_program.bin** - Compiled machine code (11 bytes)
- **simple_program.hex** - Intel HEX format

### ❌ DOES NOT WORK:
- **simple_program.asm** - Assembly source code (human readable)

## How to Load Programs Correctly

1. **Open the emulator**: http://localhost:8000
2. **Click "Load Program" button**
3. **Select the correct file**:
   - Choose `simple_program.bin` (recommended)
   - OR choose `simple_program.hex`
4. **DO NOT choose** `simple_program.asm` - this will show garbage

## What Each File Contains

### simple_program.bin (11 bytes of machine code):
```
A9 42 8D 00 02 A9 FF 8D 01 02 00
```

### simple_program.asm (Human readable text):
```
; Simple 6502 Assembly Program
        .ORG $0000
START:  LDA #$42
        STA $0200
        LDA #$FF  
        STA $0201
        BRK
```

## Test Instructions

1. Load `simple_program.bin`
2. Click "Step" 5 times
3. Check memory at $0200 (should show $42)
4. Check memory at $0201 (should show $FF)

## Why .asm Files Don't Work

Assembly files contain text like "LDA #$42" which the 6502 CPU cannot understand.
The CPU needs binary machine code like 0xA9 0x42.

To convert .asm to .bin, you need an assembler like:
- ca65 (part of cc65)
- ACME Cross-Assembler
- 64tass
- DASM

The provided .bin and .hex files are already compiled and ready to load!