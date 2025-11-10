; Simple 6502 test program
.ORG $0000

LDA #$42        ; Load immediate value 42 into accumulator
STA $0200       ; Store accumulator to memory location $0200
LDA #$21        ; Load immediate value 21 into accumulator  
STA $0201       ; Store accumulator to memory location $0201
BRK             ; Break (halt execution)