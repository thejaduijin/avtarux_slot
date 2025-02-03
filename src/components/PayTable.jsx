import React, { useState } from 'react';
import { Stage, Container, Text, Graphics } from '@pixi/react';

const PayTable = () => {
    const [showPaytable, setShowPaytable] = useState(false); // State to manage paytable visibility

    // Function to draw the paytable background
    const drawPaytableBackground = (graphics) => {
        graphics.clear();
        graphics.beginFill(0x000000, 0.8); // Semi-transparent black
        graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
        graphics.endFill();
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            {/* Paytable Button */}
            <Text
                text="Paytable"
                x={20}
                y={600}
                style={{
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 0xffffff,
                    fontWeight: 'bold',
                    stroke: 0x000000,
                    strokeThickness: 4,
                }}
                interactive={true}
                cursor="pointer"
                pointerdown={() => setShowPaytable(true)} // Show paytable on click
            />

            {/* Paytable Overlay */}
            {showPaytable && (
                <Container>
                    {/* Paytable Background */}
                    <Graphics draw={drawPaytableBackground} />

                    {/* Paytable Text */}
                    <Text
                        text="Paytable\n\n3 Symbols: 5x\n4 Symbols: 10x\n5 Symbols: 20x"
                        x={window.innerWidth / 2}
                        y={window.innerHeight / 2}
                        anchor={0.5} // Center the text
                        style={{
                            fontFamily: 'Arial',
                            fontSize: 36,
                            fill: 0xffffff,
                            align: 'center',
                        }}
                    />

                    {/* Close Button */}
                    <Text
                        text="Close"
                        x={window.innerWidth - 100}
                        y={20}
                        style={{
                            fontFamily: 'Arial',
                            fontSize: 24,
                            fill: 0xffffff,
                            fontWeight: 'bold',
                            stroke: 0x000000,
                            strokeThickness: 4,
                        }}
                        interactive={true}
                        cursor="pointer"
                        pointerdown={() => setShowPaytable(false)} // Hide paytable on click
                    />
                </Container>
            )}
        </Stage>
    );
};

export default PayTable;
