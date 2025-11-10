; Test PHA and PLA instructions
; Demonstrates stack push and pull operations

        .ORG $0000        ; Program starts at address $0000

START:  LDA #$42         ; Load $42 into accumulator
        PHA              ; Push accumulator to stack
        LDA #$00         ; Clear accumulator to show it changed
        PLA              ; Pull from stack back to accumulator
        BRK              ; Break/Stop execution

; Expected results:
; After PHA: Stack pointer decrements, $42 stored at stack top
; After PLA: Accumulator contains $42 again, stack pointer increments