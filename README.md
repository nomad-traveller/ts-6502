# 6502 CPU Emulator & Debugger

A modern, web-based 6502 processor emulator with advanced debugging capabilities and a beautiful terminal-style interface.

## 🚀 Features

### Core Emulation
- **Full 6502 CPU** - Accurate instruction implementation
- **Stack Operations** - PHA/PLA with visual stack viewer
- **Memory Management** - 64KB memory space with hex viewer
- **Register Display** - Real-time register and flag monitoring
- **Status Register** - Dynamic hex value based on flag states

### Assembly Support
- **Built-in Assembler** - Assemble .asm files directly
- **Multiple Formats** - Load .asm, .bin, and .hex files
- **Syntax Highlighting** - Clear assembly instruction display
- **Error Reporting** - Detailed assembly error messages

### Debugging Tools
- **Step Execution** - Instruction-by-step debugging
- **Stack Viewer** - Visual stack memory display with SP marker
- **Memory Viewer** - Dual-tab hex memory browser
- **Disassembly View** - Real-time instruction disassembly
- **Clean Display** - Stops at first BRK instruction

### User Interface
- **Modern Design** - Beautiful terminal-style interface
- **Responsive Layout** - Works on all screen sizes
- **Smooth Animations** - Hover effects and transitions
- **Color Coding** - Visual feedback for different states
- **Container-based** - Organized panels for each component

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/ts-6502.git
cd ts-6502

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev
```

## 🎮 Usage

### Starting the Emulator
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:8080`

### Loading Programs
1. Click **📁 LOAD PROGRAM** button
2. Select your .asm, .bin, or .hex file
3. Program loads automatically and displays in disassembly window

### Controls
- **⚡ STEP** - Execute one instruction
- **🔄 RESET** - Reset CPU to initial state
- **📁 LOAD PROGRAM** - Load new program file

### Stack Operations
The emulator supports full stack operations:
```assembly
LDA #$42    ; Load value into accumulator
PHA          ; Push to stack
LDA #$00    ; Clear accumulator
PLA          ; Pull from stack (restores $42)
```

## 📁 Project Structure

```
ts-6502/
├── src/
│   ├── core/                 # Core emulation logic
│   │   ├── cpu.ts           # CPU implementation
│   │   ├── memory.ts        # Memory management
│   │   └── instruction.ts  # Instruction definitions
│   ├── ui/                  # User interface
│   │   ├── components/       # UI components
│   │   │   ├── registers.ts # Register display
│   │   │   ├── memory.ts    # Memory viewer
│   │   │   └── disassembly.ts # Disassembly view
│   │   ├── main.ts          # Main UI controller
│   │   └── styles.css       # All CSS styling
│   └── utils/               # Utility functions
│       ├── assembler.ts      # Assembly parser
│       └── file-loader.ts   # File handling
├── dist/                   # Built files
├── tests/                  # Unit tests
└── docs/                   # Documentation
```

## 🔧 Development

### Building
```bash
npm run build        # Production build
npm run build:dev    # Development build
```

### Testing
```bash
# Run tests (when implemented)
npm test
```

### Scripts Available
- `npm run build` - Build for production
- `npm run dev` - Start development server
- `npm run build:dev` - Development build

## 📚 Supported Instructions

### Load/Store
- **LDA** - Load Accumulator
- **LDX** - Load X Register  
- **LDY** - Load Y Register
- **STA** - Store Accumulator
- **STX** - Store X Register
- **STY** - Store Y Register

### Stack Operations
- **PHA** - Push Accumulator
- **PLA** - Pull Accumulator

### Transfer
- **TAX** - Transfer A to X
- **TAY** - Transfer A to Y
- **TXA** - Transfer X to A
- **TYA** - Transfer Y to A

### Arithmetic
- **ADC** - Add with Carry
- **AND** - Logical AND

### Control Flow
- **JMP** - Jump
- **JSR** - Jump to Subroutine
- **RTS** - Return from Subroutine
- **BRK** - Break/Stop

### Flags
- **CLC/SEC** - Clear/Set Carry
- **CLD/SED** - Clear/Set Decimal
- **CLI/SEI** - Clear/Set Interrupt
- **CLV** - Clear Overflow

## 🎯 Example Programs

### Simple Program
```assembly
        .ORG $0000

START:  LDA #$42         ; Load $42 into accumulator
        STA $0200        ; Store to memory $0200
        LDA #$FF         ; Load $FF into accumulator
        STA $0201        ; Store to memory $0201
        BRK              ; Stop execution
```

### Stack Test
```assembly
        .ORG $0000

START:  LDA #$42         ; Load $42
        PHA              ; Push to stack
        LDA #$00         ; Clear accumulator
        PLA              ; Pull from stack (A = $42 again)
        BRK              ; Stop
```

## 🐛 Troubleshooting

### Common Issues
1. **Program not loading** - Check file format (.asm, .bin, .hex)
2. **Stack not updating** - Ensure PHA/PLA instructions are used
3. **Flags not changing** - Verify instructions affect flags correctly

### Debug Tips
- Use **STEP** button to execute one instruction at a time
- Watch **Stack Viewer** for push/pull operations
- Monitor **Status Register** for flag changes
- Check **Disassembly** for instruction decoding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add comments for complex logic
- Update documentation for new features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- 6502 architecture reference documentation
- Modern web development tools
- TypeScript community
- Open source contributors

## 🔗 Links

- [6502 Documentation](http://www.6502.org/)
- [NES Dev Wiki](https://wiki.nesdev.org/)
- [Assembly Language Guide](https://www.masswerk.at/6502/assembler.html)

---

**Built with ❤️ using TypeScript and modern web technologies**