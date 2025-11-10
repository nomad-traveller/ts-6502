; Simple 6502 Assembly Program
; Demonstrates LDA, STA, and BRK instructions

        .ORG $0000        ; Program starts at address $0000

START:  LDA #$42         ; Load immediate value $42 (66 decimal) into accumulator
        STA $0200        ; Store accumulator value to memory location $0200
        LDA #$FF         ; Load immediate value $FF (255 decimal) into accumulator  
        STA $0201        ; Store accumulator value to memory location $0201
        PHA              ; Push accumulator onto stack
        LDA #$00         ; Load immediate value $00 into accumulator
        PLA              ; Pull value from stack back into accumulator
        BRK              ; Break/Stop execution

; Expected results:
; After execution:
; - Memory location $0200 will contain $42
; - Memory location $0201 will contain $FF
; - Accumulator (A register) will contain $FF
; - Program will halt at BRK instruction