import { useEffect, useState } from "react";

const useDetectClose = (elem, initialState) => {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const onClick = (e) => {
      if (elem.current !== null && !elem.current.contains(e.target)) {
        setIsOpen(!isOpen);
      }
    };

    if (isOpen) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [isOpen, elem]);
  return [isOpen, setIsOpen];
};

export default useDetectClose;



// import React, {useEffect, useState, useRef} from 'react';

// const useDetectClose = (initialState) => {
//     const [isOpen, setIsOpen] = useState(initialState);
//     const ref = useRef(null);

//     const removeHandler = () => {
//         setIsOpen(!isOpen);
//     }

//     useEffect(() => {
//         const onClick = (e) => {
//             if(ref.current !== null && !ref.current.contains(e.target)) {
//                 setIsOpen(!isOpen)
//             }
//         };

//         if(isOpen){
//             window.addEventListener("click", onClick);
//         }

//         return () => {
//             window.removeEventListener('click', onClick);
//         };
//     },[isOpen]);

//     return [isOpen, ref, removeHandler];
// };

// export default useDetectClose;



// // const Dropdown = props => {
// //     const [visibilityAnimation, setVisibilityAnimation] = React.useState(false);
// //     const [repeat, setRepeat] = React.useState(null);

// //     React.useEffect(() => {
// //         if (props.visibility) {
// //             clearTimeout(repeat);
// //             setRepeat(null);
// //             setVisibilityAnimation(true);
// //         } else {
// //             setRepeat(setTimeout(() => {
// //                 setVisibilityAnimation(false);
// //             }, 400));
// //         }
// //     }, [props.visibility]);

// //     return (
// //         <article className={`components-dropdown ${props.visibility ? 'slide-fade-in-dropdown' : 'slide-fade-out-dropdown'}`}>
// //             { visibilityAnimation && props.children }
// //         </article>
// //     )
// // };

// // export default Dropdown;