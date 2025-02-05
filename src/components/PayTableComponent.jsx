import React from 'react';
import { Container, Text, Graphics } from '@pixi/react';

function PayTableComponent(props) {

    const drawPayTableBackground = (graphics) => {
        graphics.clear();
        graphics.beginFill(0x000000, 0.8);
        graphics.drawRect(0, 0, 800, 500);
        graphics.endFill();
    };

    function closePayTable() {
        props.setOpen(false)
    }

    return (
        <>
            <Container>
                <Graphics draw={drawPayTableBackground} />
                <Text eventMode='static' cursor='pointer' onclick={closePayTable} text="Close" x={700} y={20} style={{ fill: 'white' }} />
                <Text style={{ fill: 'white' }} x={350} y={50}
                    text="Pay Values"
                />
                <Text style={{ fill: 'white' }} x={280} y={120}
                    text="3*symbol (9-k) - bet*5"
                />
                <Text style={{ fill: 'white' }} x={280} y={160}
                    text="3*symbol (H1-H6) - bet*10"
                />
                  <Text style={{ fill: 'white' }} x={280} y={200}
                    text="3*symbol (M1-M6) - bet*15"
                />
            </Container>
        </>
    );
}

export default PayTableComponent;




// <div className='w-full h-auto'>
//     <button
//         onClick={showPayTable}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//     >
//         Open Pay Table
//     </button>

//     {open && (
//         <div className="relative">
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 top-10 right-0 left-0">
//                 <div className="bg-white p-6 rounded-lg shadow-lg relative">
//                     <button
//                         onClick={closePayTable}
//                         className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
//                     >
//                         &times;
//                     </button>
//                     <h1 className="text-2xl font-bold mb-4">Pay Table</h1>
//                     <Container>
//                         <Graphics draw={drawPayTableBackground} />
//                         <Text text="Pay Table Content" x={50} y={50} style={{ fill: 'white' }} />
//                     </Container>
//                 </div>
//             </div>
//         </div>
//     )}
// </div>