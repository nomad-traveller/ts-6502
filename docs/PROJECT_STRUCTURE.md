# 6502 Emulator - Project Structure

This document outlines the restructured project organization for the 6502 Emulator.

## Directory Structure

```
ts-6502/
├── src/
│   ├── core/                    # Core emulator logic
│   │   ├── cpu.ts              # Pure CPU implementation
│   │   ├── memory.ts           # Memory management
│   │   └── instruction.ts     # Instruction definitions and types
│   ├── ui/                     # User interface components
│   │   ├── components/         # Reusable UI components
│   │   │   ├── registers.ts    # Register display component
│   │   │   ├── memory.ts       # Memory viewer component
│   │   │   └── disassembly.ts  # Disassembly view component
│   │   ├── main.ts             # Main UI controller
│   │   └── styles.css          # All CSS styles
│   └── utils/                  # Utility functions
│       ├── assembler.ts        # Assembly parsing and compilation
│       └── file-loader.ts      # File handling utilities
├── dist/                       # Built files (output directory)
├── tests/                      # Unit tests
├── docs/                       # Documentation
└── *.html                      # HTML entry points
```

## Module Organization

### Core Module (`src/core/`)
- **cpu.ts**: Contains the `CPU6502` class with pure CPU logic, instruction execution, and register management
- **memory.ts**: Contains the `Memory` class for 64KB memory management
- **instruction.ts**: Contains instruction definitions, addressing modes, and disassembly interfaces

### UI Module (`src/ui/`)
- **main.ts**: Main UI controller that orchestrates all components and handles global events
- **components/**: Modular UI components that handle specific display areas
- **styles.css**: Centralized styling for the entire application

### Utils Module (`src/utils/`)
- **assembler.ts**: 6502 assembly language parser and compiler
- **file-loader.ts**: File loading utilities for binary, hex, and assembly files

## Benefits of This Structure

1. **Separation of Concerns**: Core logic is separated from UI and utilities
2. **Modularity**: Each component has a single responsibility
3. **Maintainability**: Easier to locate and modify specific functionality
4. **Testability**: Core logic can be tested independently of UI
5. **Scalability**: Easy to add new features without affecting existing code

## Import Patterns

- Core modules import from other core modules only
- UI components import from core modules and may import from utils
- Utils modules are self-contained and may import from core
- Main UI controller imports from all modules as needed

## Migration Notes

The original files have been restructured as follows:
- `cpu6502.ts` → `src/core/cpu.ts` (refactored to use Memory class)
- `debugger.ts` → Split into `src/ui/main.ts` and `src/ui/components/`
- `assembler.ts` → `src/utils/assembler.ts`
- New `src/core/memory.ts` and `src/core/instruction.ts` created for better separation
- New `src/utils/file-loader.ts` for file handling utilities